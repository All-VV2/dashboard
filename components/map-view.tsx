"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNotifications } from "@/components/notification-provider"
import { useMapContext } from "@/components/map-context"

// Dynamically import Leaflet components with SSR disabled
const MapWithNoSSR = dynamic(() => import("./map-components").then((mod) => mod.MapComponent), {
  ssr: false,
  loading: () => <div className="h-full bg-muted/20 flex items-center justify-center">Loading map...</div>,
})

// INTEGRATION POINT: Replace with real-time rover data from your backend
// In a real application, you would fetch this data from your backend API

const roverPositions = [
  { id: 1, position: [36.0035, -78.938], status: "Patrolling", battery: 85 },
  { id: 2, position: [36.0025, -78.925], status: "Idle", battery: 72 },
  { id: 3, position: [36.0015, -78.932], status: "Returning", battery: 15 },
]


// Main MapView component
export function MapView() {
  const { addNotification } = useNotifications()
  const { zones } = useMapContext()
  const [selectedRover, setSelectedRover] = useState<number | null>(null)
  const [shouldSimulate, setShouldSimulate] = useState(true)
  const mapRef = useRef(null)


  // INTEGRATION POINT: Set up real-time rover position updates
  // In a real application, you would use WebSockets or polling to get real-time updates
  // Example WebSocket setup:
  // useEffect(() => {
  //   const socket = new WebSocket('wss://your-api.com/rovers/ws');
  //
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'rover_update') {
  //       setRoverPositions(data.rovers);
  //     }
  //     if (data.type === 'notification') {
  //       addNotification({
  //         type: data.notificationType,
  //         title: data.title,
  //         message: data.message,
  //       });
  //     }
  //   };
  //
  //   return () => {
  //     socket.close();
  //   };
  // }, [addNotification]);


  // Simulate rover movement and notifications (for demo purposes)
  useEffect(() => {
    if (shouldSimulate) {
      const interval = setInterval(() => {
        const randomRover = Math.floor(Math.random() * 3) + 1

        if (Math.random() > 0.7) {
          const notificationTypes = ["info", "success", "warning"] as const
          const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
          const messages = [
            {
              type: "info",
              title: `Rover ${randomRover} update`,
              message: `Rover ${randomRover} is now patrolling West Campus.`,
            },
            {
              type: "success",
              title: `Zone completed`,
              message: `Rover ${randomRover} has completed cleaning East Campus.`,
            },
            {
              type: "warning",
              title: `Battery alert`,
              message: `Rover ${randomRover} battery at 20%. Returning to base.`,
            },
          ]

          const notification = messages.find((m) => m.type === type)
          if (notification) {
            addNotification(notification)
          }
        }
      }, 15000) // Every 15 seconds

      return () => clearInterval(interval)
    }
  }, [addNotification, shouldSimulate])

  return (
    <div className="h-full relative">
      <MapWithNoSSR roverPositions={roverPositions} zones={zones} onRoverSelect={setSelectedRover} />

  

  

      {/* Rover details panel - shown when a rover is selected */}
      {selectedRover && (
        <Card className="absolute bottom-4 right-4 w-64 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Rover {selectedRover}</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedRover(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium">{roverPositions.find((r) => r.id === selectedRover)?.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Battery:</span>
                <span className="font-medium">{roverPositions.find((r) => r.id === selectedRover)?.battery}%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Zone:</span>
                <span className="font-medium">West Campus</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 h-8">
                Control
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8">
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
