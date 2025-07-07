"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useMapContext } from "@/components/map-context"


// Example rover positions at Duke
const roverPositions = [
  { id: 1, position: [36.0035, -78.938], status: "Patrolling" },
  { id: 2, position: [36.0025, -78.925], status: "Idle" },
  { id: 3, position: [36.0015, -78.932], status: "Returning" },
  { id: 4, position: [36.0045, -78.935], status: "Patrolling" },
  { id: 7, position: [36.001, -78.93], status: "Patrolling" },
  { id: 8, position: [36.002, -78.928], status: "Patrolling" },
  { id: 10, position: [36.003, -78.922], status: "Error" },
  { id: 11, position: [36.004, -78.92], status: "Patrolling" },
  { id: 12, position: [36.005, -78.923], status: "Patrolling" },
  { id: 13, position: [36.006, -78.926], status: "Patrolling" },
]

// Dynamically import Leaflet components with SSR disabled
const DeploymentMapContent = dynamic(() => import("./deployment-map-content").then((mod) => mod.DeploymentMapContent), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center bg-muted/20">
      <Skeleton className="h-full w-full" />
    </div>
  ),
})


export function DeploymentMap() {
  const { zones } = useMapContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Deployment Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <DeploymentMapContent roverPositions={roverPositions} zones={zones} />

        </div>
      </CardContent>
    </Card>
  )
}
