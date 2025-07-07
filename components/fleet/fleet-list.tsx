"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pause, Play, Home, MoreHorizontal, Camera } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoverVideoFeed } from "./rover-video-feed"

const SIGNALING_IP = "10.0.0.187"
const SIGNALING_PORT = 8088
const WS_URL = `ws://${SIGNALING_IP}:${SIGNALING_PORT}`

// Helper function to get state color
const getStateColor = (state: string) => {
  switch (state) {
    case "Patrolling": return "bg-green-500"
    case "Idle": return "bg-blue-500"
    case "Returning": return "bg-yellow-500"
    case "Charging": return "bg-purple-500"
    case "Error": return "bg-red-500"
    default: return "bg-gray-500"
  }
}
const getBatteryColor = (battery: number) => {
  if (battery < 20) return "bg-red-500"
  if (battery < 50) return "bg-yellow-500"
  return "bg-green-500"
}

const initialRovers = [
  {
    id: 1,
    name: "Rover 1",
    battery: 85,
    state: "Patrolling",
    location: "Zone A",
    task: "Routine patrol",
  },
  // ... (other rovers, unchanged)
  {
    id: 2, name: "Rover 2", battery: 72, state: "Idle", location: "Base Station", task: "Awaiting deployment"
  },
  {
    id: 3, name: "Rover 3", battery: 15, state: "Returning", location: "Zone B", task: "Returning to base"
  },
  {
    id: 4, name: "Rover 4", battery: 92, state: "Patrolling", location: "Zone C", task: "Targeted cleanup"
  },
  {
    id: 5, name: "Rover 5", battery: 45, state: "Charging", location: "Base Station", task: "Charging"
  },
  {
    id: 6, name: "Rover 6", battery: 100, state: "Idle", location: "Base Station", task: "Awaiting deployment"
  },
  {
    id: 7, name: "Rover 7", battery: 68, state: "Patrolling", location: "Zone D", task: "Routine patrol"
  },
  {
    id: 8, name: "Rover 8", battery: 54, state: "Patrolling", location: "Zone A", task: "Targeted cleanup"
  },
  {
    id: 9, name: "Rover 9", battery: 78, state: "Idle", location: "Base Station", task: "Maintenance"
  },
  {
    id: 10, name: "Rover 10", battery: 32, state: "Error", location: "Zone B", task: "Error - Needs attention"
  },
  {
    id: 11, name: "Rover 11", battery: 89, state: "Patrolling", location: "Zone C", task: "Routine patrol"
  },
  {
    id: 12, name: "Rover 12", battery: 65, state: "Patrolling", location: "Zone D", task: "Targeted cleanup"
  },
  {
    id: 13, name: "Rover Z3000", battery: 95, state: "Patrolling", location: "Zone A", task: "Advanced patrol"
  }
]

export function FleetList() {
  const [rovers, setRovers] = useState(initialRovers)
  const [selectedRover, setSelectedRover] = useState<number | null>(null)
  const [videoRover, setVideoRover] = useState<number | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // WebSocket: Setup once on mount
  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "register", role: "fleet_control" }))
      // console.log("[FleetList] Registered as fleet_control")
    }

    ws.onmessage = (event) => {
      let dataRaw = event.data
      try {
        if (dataRaw instanceof Blob) {
          dataRaw.text().then(txt => handleMsg(JSON.parse(txt)))
        } else {
          handleMsg(JSON.parse(dataRaw))
        }
      } catch (e) {
        // console.warn("[FleetList] Error parsing WebSocket message", e)
      }
    }

    function handleMsg(msg: any) {
      // Expecting: { type: "battery", value: 78 }
      if (msg.type === "battery" && typeof msg.value === "number") {
        setRovers((prev) => prev.map(r =>
          r.id === 1 ? { ...r, battery: msg.value } : r
        ))
      }
    }

    ws.onerror = (err) => {
      // Optionally handle error
      // console.error("[FleetList] WebSocket error", err)
    }

    ws.onclose = () => {
      // Optionally handle close, maybe reconnect
    }

    return () => {
      ws.close()
    }
  }, [])

  const handleRoverClick = (roverId: number) => setSelectedRover(roverId === selectedRover ? null : roverId)
  const handleOpenVideo = (roverId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setVideoRover(roverId)
  }
  const handleCloseVideo = () => setVideoRover(null)

  return (
    <div className="space-y-4">
      {videoRover && (
        <div className="mb-4">
          <RoverVideoFeed roverId={videoRover} onClose={handleCloseVideo} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rovers.map((rover) => (
          <Card
            key={rover.id}
            className={`cursor-pointer transition-all h-full ${selectedRover === rover.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleRoverClick(rover.id)}
          >
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStateColor(rover.state)}`} />
                    <h3 className="font-medium">{rover.name}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{rover.task}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => handleOpenVideo(rover.id, e)}>View Camera Feed</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Task</DropdownMenuItem>
                    <DropdownMenuItem>Maintenance</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Battery</span>
                  <span className="text-sm font-medium">{rover.battery}%</span>
                </div>
                <Progress value={rover.battery} className={`h-2 ${getBatteryColor(rover.battery)}`} />
              </div>

              <div className="mt-3 flex justify-between items-center">
                <Badge variant="outline">{rover.location}</Badge>
                <Badge variant="secondary">{rover.state}</Badge>
              </div>

              <div className="mt-auto pt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 min-w-[80px]"
                  onClick={(e) => handleOpenVideo(rover.id, e)}
                >
                  <Camera className="h-4 w-4 mr-1" /> View
                </Button>

                {rover.state === "Patrolling" ? (
                  <Button size="sm" variant="outline" className="flex-1 h-8 min-w-[80px]">
                    <Pause className="h-4 w-4 mr-1" /> Pause
                  </Button>
                ) : rover.state === "Idle" ? (
                  <Button size="sm" variant="outline" className="flex-1 h-8 min-w-[80px]">
                    <Play className="h-4 w-4 mr-1" /> Deploy
                  </Button>
                ) : null}
                <Button size="sm" variant="outline" className="flex-1 h-8 min-w-[80px]">
                  <Home className="h-4 w-4 mr-1" /> Return
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
