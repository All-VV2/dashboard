const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Set these to your InfluxDB Cloud settings
const INFLUX_URL = 'https://us-east-1-1.aws.cloud2.influxdata.com/';
const INFLUX_TOKEN = '2ZVB_gERnz5ANAW40TRXiBT0dF6Y7DsjZ5wAPBsZrRJshNIkRW4svxXZVys7-v22kHBbcjMJSqsF7L6YvhiNOw==';
const INFLUX_ORG = 'Elytra';
const INFLUX_BUCKET = 'Rover_Info';

const influxDB = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET, 'ns');


const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8088 });

const clients = new Set();

function logToInflux(source, payload) {
  try {
    const point = new Point('ws_message')
      .tag('source', source)
      .stringField('payload', JSON.stringify(payload));
    writeApi.writePoint(point);
    // (writeApi.flush() is async, but not strictly needed every write)
  } catch (err) {
    console.error('[InfluxDB] Write error:', err);
  }
}

wss.on('connection', (ws) => {
  ws.role = null;
  ws.isAlive = true;
  clients.add(ws);

  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: 'Not valid JSON' }));
      return;
    }

    // Registration message
    if (!ws.role && data.type === 'register' && data.role) {
      ws.role = data.role;
      ws.send(JSON.stringify({ type: 'server', status: 'registered', role: ws.role }));
      console.log(`[SERVER] Registered ${ws.role}`);

      if (data.role === 'frontend') {
        // Notify all rovers
        for (const client of clients) {
          if (client.role === 'rover' && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'Registered frontend' }));
          }
        }
        console.log('[SERVER] Notified all rovers: frontend registered');
      }
      return;
    }
    logToInflux(ws.role || 'unknown', data);
    // Relay logic
    if (ws.role === 'frontend') {
      // Relay only to rover(s)
      for (const client of clients) {
        if (client.role === 'rover' && client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      }
      console.log(`[SERVER] Relayed message from FRONTEND to ROVER(s):`, data);
    } else if (ws.role === 'rover') {
      // Relay only to frontend(s)
      if(data.type === 'battery'){
        for (const client of clients) {
          if (client.role === 'fleet_control' && client.readyState === WebSocket.OPEN) {
            client.send(msg);
          }
        }
        console.log(`[SERVER] Relayed message from ROVER to fleet_control:`, data);
      }else{
        for (const client of clients) {
          if (client.role === 'frontend' && client.readyState === WebSocket.OPEN) {
            client.send(msg);
          }
        }
        console.log(`[SERVER] Relayed message from ROVER to FRONTEND(s):`, data);
      }
      
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[SERVER] Connection closed (${ws.role || "unknown"})`);
    if (ws.role === "frontend") {
    // Find the rover client
      for (const client of clients) {
        if (client.role === "rover" && client.readyState === 1) {
          client.send(JSON.stringify({ type: "Connection closed (frontend)" }));
          console.log("[SERVER] Notified rover of frontend disconnect");
        }
      }
    }
  });
});

// Optional: Heartbeat (keep connections alive)
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

console.log('[SERVER] WebSocket relay server running at ws://localhost:8088');



// Time series DB: https://us-east-1-1.aws.cloud2.influxdata.com/
// Both files from the front end and the rover will be logged to the database
// With a source column stating where they are from