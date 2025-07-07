"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// --- ADD ICONS FOR ARROWS/SQUARE IF YOU WANT ---
// import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square } from "lucide-react";

interface RoverVideoFeedProps {
  roverId: number;
  onClose: () => void;
}

export function RoverVideoFeed({ roverId, onClose }: RoverVideoFeedProps) {
  const SIGNALING_IP = "localhost";
  const SIGNALING_PORT = 8088; // rover signaling (for original video)
  const ANNOTATION_SIGNALING_PORT = 8765; // backend annotation signaling port
  const roverWsUrl = `ws://${SIGNALING_IP}:${SIGNALING_PORT}`;
  const annotationWsUrl = `ws://${SIGNALING_IP}:${ANNOTATION_SIGNALING_PORT}/ws`;

  const roverSocketRef = useRef<WebSocket | null>(null);
  const roverPeerRef = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [incomingStream, setIncomingStream] = useState<MediaStream | null>(null);

  // === Annotated Stream ===
  const [frameSendActive, setFrameSendActive] = useState(false);
  const annotationSocketRef = useRef<WebSocket | null>(null);
  const annotationPeerRef = useRef<RTCPeerConnection | null>(null);
  const annotatedRef = useRef<HTMLVideoElement | null>(null);

  // === ADDED: Track connection state for button disables ===
  const [isRoverSocketOpen, setIsRoverSocketOpen] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string | null>(null);

  // --- Setup: Rover Video WebRTC (main feed) ---
  useEffect(() => {
    const ws = new WebSocket(roverWsUrl);
    roverSocketRef.current = ws;
    let negotiationDone = false;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "register", role: "frontend" }));
      setIsRoverSocketOpen(true); // ADDED
    };

    ws.onclose = () => {
      setIsRoverSocketOpen(false); // ADDED
    };

    ws.onmessage = async (event) => {
      let dataRaw = event.data;
      if (dataRaw instanceof Blob) {
        dataRaw = await dataRaw.text();
      }
      const data = JSON.parse(dataRaw);
      if (data.type === "signal" && data.data?.type === "offer") {
        if (negotiationDone) return;
        let pc = roverPeerRef.current;
        if (!pc) {
          pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          });
          roverPeerRef.current = pc;
          pc.onicecandidate = (evt) => {
            if (evt.candidate) {
              ws.send(JSON.stringify({
                type: "signal",
                data: {
                  candidate: evt.candidate.candidate,
                  sdpMid: evt.candidate.sdpMid,
                  sdpMLineIndex: evt.candidate.sdpMLineIndex,
                },
              }));
            }
          };
          pc.ontrack = (event) => {
            const stream = event.streams && event.streams[0]
              ? event.streams[0]
              : new MediaStream([event.track]);
            setIncomingStream(stream);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          };
        }
        await pc.setRemoteDescription({
          type: "offer",
          sdp: data.data.sdp,
        });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({
          type: "signal",
          data: {
            type: answer.type,
            sdp: answer.sdp,
          },
        }));
        negotiationDone = true;
      }
      if (data.type === "signal" && data.data?.candidate) {
        await roverPeerRef.current?.addIceCandidate({
          candidate: data.data.candidate,
          sdpMid: data.data.sdpMid,
          sdpMLineIndex: data.data.sdpMLineIndex,
        });
      }
    };

    ws.onerror = (error) => {};
    // ws.onclose moved above for state

    return () => {
      ws.close();
      roverPeerRef.current?.close();
    };
  }, []);

  // --- Annotated Stream: Start/Stop WebRTC with backend for annotation ---
  useEffect(() => {
    let ws: WebSocket | null = null;
    let pc: RTCPeerConnection | null = null;

    if (frameSendActive) {
      ws = new WebSocket(annotationWsUrl);
      annotationSocketRef.current = ws;

      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      annotationPeerRef.current = pc;

      // Show annotated video
      pc.ontrack = (event) => {
        if (annotatedRef.current) {
          annotatedRef.current.srcObject = event.streams[0];
          annotatedRef.current.play();
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          ws?.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
        }
      };

      ws.onopen = async () => {
        // Get the rover video stream as the input
        const inputStream = videoRef.current?.srcObject as MediaStream | null;
        if (!inputStream) {
          alert("No rover video stream available for annotation.");
          return;
        }
        inputStream.getTracks().forEach((track) => pc!.addTrack(track, inputStream));

        // WebRTC offer/answer
        const offer = await pc!.createOffer();
        await pc!.setLocalDescription(offer);
        ws!.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "answer") {
          await pc!.setRemoteDescription(new RTCSessionDescription(data));
        }
      };
    }

    return () => {
      if (annotationPeerRef.current) {
        annotationPeerRef.current.close();
        annotationPeerRef.current = null;
      }
      if (annotationSocketRef.current) {
        annotationSocketRef.current.close();
        annotationSocketRef.current = null;
      }
      if (annotatedRef.current) {
        annotatedRef.current.srcObject = null;
      }
    };
    // Only run when annotation toggled
  }, [frameSendActive]);

  const handleToggleFrameSend = () => {
    setFrameSendActive((prev) => !prev);
  };

  // === ADDED: Command handler and UI for movement/pick/retrieve ===
  const handleCommand = (command: string) => {
    setCurrentCommand(command);

    const payload = {
      rover_id: `r${roverId}`,
      command: command,
      distance: command === "pick" ? 0 : 1,
      timestamp: new Date().toISOString(),
    };

    // Send via websocket if open
    if (
      roverSocketRef.current &&
      roverSocketRef.current.readyState === WebSocket.OPEN
    ) {
      roverSocketRef.current.send(JSON.stringify(payload));
    }

    setTimeout(() => setCurrentCommand(null), 0);
  };

  // === ADDED: Keyboard shortcut support for movement/pick/retrieve ===
  useEffect(() => {
  let intervalId: NodeJS.Timeout | null = null;
  let activeKey: string | null = null;

  const continuousKeys = ["w", "a", "s", "d"];

  const keyDownHandler = (e: KeyboardEvent) => {
    if (!isRoverSocketOpen || currentCommand !== null) return;
    const key = e.key.toLowerCase();

    // Handle single-fire keys
    if (key === "p") {
      handleCommand("stop");
      return;
    }
    if (key === "t") {
      handleCommand("retrieve");
      return;
    }
    if (key === " ") {
      e.preventDefault();
      handleCommand("pick");
      return;
    }

    // Handle continuous keys
    if (!continuousKeys.includes(key)) return;

    // Prevent starting multiple intervals for the same key
    if (activeKey === key) return;

    const handleKey = () => {
      switch (key) {
        case "w":
          handleCommand("forward");
          break;
        case "a":
          handleCommand("left");
          break;
        case "s":
          handleCommand("backward");
          break;
        case "d":
          handleCommand("right");
          break;
        default:
          break;
      }
    };

    handleKey(); // fire immediately

    intervalId = setInterval(() => {
      handleKey();
    }, 100);

    activeKey = key;
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      activeKey = null;
    }
  };

  window.addEventListener("keydown", keyDownHandler);
  window.addEventListener("keyup", keyUpHandler);
  return () => {
    window.removeEventListener("keydown", keyDownHandler);
    window.removeEventListener("keyup", keyUpHandler);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}, [isRoverSocketOpen, currentCommand]);

  // === ADDED: Movement/Action Buttons UI ===
  // Uses a grid with 4 columns for neat layout

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Rover {roverId} Live Feed</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-md aspect-video overflow-hidden">
          {/* Rover stream */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{
              zIndex: 1,
              display: frameSendActive ? "none" : "block",
            }}
          />
          {/* Annotated stream */}
          <video
            ref={annotatedRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{
              zIndex: 2,
              display: frameSendActive ? "block" : "none",
            }}
          />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <Button
              variant={frameSendActive ? "default" : "outline"}
              size="sm"
              onClick={handleToggleFrameSend}
              disabled={!incomingStream}
            >
              {frameSendActive ? "Stop detection" : "Detection Mode"}
            </Button>
          </div>
        </div>

        {/* === ADDED: Control Buttons === */}
        <div className="pt-4">
          <div className="grid grid-cols-4 gap-2 max-w-[380px] mx-auto">
            <div>
              <Button
              variant={currentCommand === "stop" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("stop")}
              disabled={!isRoverSocketOpen}
            >
              STOP
            </Button>
            </div>
            <Button
              variant={currentCommand === "forward" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("forward")}
              disabled={!isRoverSocketOpen}
            >
              ↑
            </Button>
            <Button
              variant={currentCommand === "retrieve" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("retrieve")}
              disabled={!isRoverSocketOpen}
            >
              Retrieve
            </Button>
            <div />
            <Button
              variant={currentCommand === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("left")}
              disabled={!isRoverSocketOpen}
            >
              ←
            </Button>
            <Button
              variant={currentCommand === "pick" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("pick")}
              disabled={!isRoverSocketOpen}
            >
              pick
            </Button>
            
            <Button
              variant={currentCommand === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("right")}
              disabled={!isRoverSocketOpen}
            >
              →
            </Button>
            <div></div>
            <div />
            <Button
              variant={currentCommand === "backward" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("backward")}
              disabled={!isRoverSocketOpen}
            >
               ↓
            </Button>
            <div />
            <div />
          </div>
        </div>
        {/* === END ADDED === */}
      </CardContent>
    </Card>
  );
}
