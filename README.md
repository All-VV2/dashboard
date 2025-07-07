To run the ws connection to the fullstack app, you must run through this order directly.

First cd to /rover-managementv22
Download the correct dependencies

==First change the IP to connect to in the main.py, backend, and frontend==

Go to main.py in rover and change the IP 

In fullstack app change:
components/fleet/rover-video-feed.tsx line 17 and change the IP there
WebRTC.py
Fleet-list.tsx


1. Websocket: node ws-server.js
2. Rover: python main.py
3. Dashboard: npm run dev
4. Annotations: python frame_ws_server.py
