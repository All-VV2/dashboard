"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RoverVideoFeedProps {
  roverId: number;
  onClose: () => void;
}

export function RoverVideoFeed({ roverId, onClose }: RoverVideoFeedProps) {
  // Use environment variables
  const roverWsUrl = process.env.NEXT_PUBLIC_ROVER_WS_URL!;
  const annotationWsUrl = process.env.NEXT_PUBLIC_ANNOTATION_WS_URL!;

  const roverSocketRef = useRef<WebSocket | null>(null);
  const roverPeerRef = useRef<RTCPeerConnection | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [incomingStream, setIncomingStream] = useState<MediaStream | null>(null);

  const [frameSendActive, setFrameSendActive] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const annotationSocketRef = useRef<WebSocket | null>(null);
  const annotationPeerRef = useRef<RTCPeerConnection | null>(null);
  const annotatedRef = useRef<HTMLVideoElement | null>(null);

  const [isRoverSocketOpen, setIsRoverSocketOpen] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string | null>(null);

  // Rover Video WebRTC
  useEffect(() => {
    const ws = new WebSocket(roverWsUrl);
    roverSocketRef.current = ws;
    let negotiationDone = false;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "register", role: "frontend" }));
      setIsRoverSocketOpen(true);
    };

    ws.onclose = () => {
      setIsRoverSocketOpen(false);
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
            const stream = event.streams[0] || new MediaStream([event.track]);
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

    ws.onerror = (error) => {
      console.error("[Rover WS] Error:", error);
    };

    return () => {
      ws.close();
      roverPeerRef.current?.close();
      setVideoOn(false);
    };
  }, [roverWsUrl]);

  // Annotated Stream
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

      pc.ontrack = (event) => {
        if (annotatedRef.current) {
          annotatedRef.current.srcObject = event.streams[0];
          annotatedRef.current.play();
          setVideoOn(true);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          ws?.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
        }
      };

      ws.onopen = async () => {
        const inputStream = videoRef.current?.srcObject as MediaStream | null;
        if (!inputStream) {
          alert("No rover video stream available for annotation.");
          return;
        }
        inputStream.getTracks().forEach((track) => pc!.addTrack(track, inputStream));

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
      annotationPeerRef.current?.close();
      annotationSocketRef.current?.close();
      if (annotatedRef.current) {
        annotatedRef.current.srcObject = null;
      }
    };
  }, [frameSendActive, annotationWsUrl]);
  
  const handleToggleFrameSend = () => {
    setFrameSendActive((prev) => !prev);
  };

  const handleCommand = (command: string) => {
    setCurrentCommand(command);

    const payload = {
      rover_id: `r${roverId}`,
      command: command,
      distance: (command === "dispose" || command === "retrieve") ? 0 : 1,
      timestamp: new Date().toISOString(),
    };

    if (
      roverSocketRef.current &&
      roverSocketRef.current.readyState === WebSocket.OPEN
    ) {
      roverSocketRef.current.send(JSON.stringify(payload));
    }

    setTimeout(() => setCurrentCommand(null), 0);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let activeKey: string | null = null;

    const continuousKeys = ["w", "a", "s", "d"];

    const keyDownHandler = (e: KeyboardEvent) => {
      if (!isRoverSocketOpen || currentCommand !== null) return;
      const key = e.key.toLowerCase();

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
        handleCommand("dispose");
        return;
      }

      if (!continuousKeys.includes(key)) return;
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
        }
      };

      handleKey();
      intervalId = setInterval(() => handleKey(), 100);
      activeKey = key;
    };

    const keyUpHandler = () => {
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
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRoverSocketOpen, currentCommand]);

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
      <div className="flex items-center gap-2 px-4 pb-2">
        <div
          className={`w-4 h-4 rounded-full border border-green-500 ${
            frameSendActive ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-800'
          }`}
        ></div>
        <span className="text-sm text-muted-foreground">
          {frameSendActive ? 'Online' : 'Offline'}
        </span>
      </div>
      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-md aspect-video overflow-hidden">
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
              variant={currentCommand === "dispose" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("dispose")}
              disabled={!isRoverSocketOpen}
            >
              dispose
            </Button>
            <Button
              variant={currentCommand === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCommand("right")}
              disabled={!isRoverSocketOpen}
            >
              →
            </Button>
            <div />
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
      </CardContent>
    </Card>
  );
}
