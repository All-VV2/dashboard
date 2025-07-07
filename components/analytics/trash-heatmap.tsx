"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import Leaflet components with SSR disabled
const HeatmapWithNoSSR = dynamic(() => import("./trash-heatmap-content"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-muted/20">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  ),
})

// Generate random trash collection data points
function generateTrashData() {
  // Duke University campus center coordinates
  const centerLat = 36.003
  const centerLng = -78.9315


  // Generate 10-20 random points within the campus area
  const numPoints = Math.floor(Math.random() * 10) + 10

  const points = []

  for (let i = 0; i < numPoints; i++) {
    // Random offset from center (within ~500m)
    const latOffset = (Math.random() - 0.5) * 0.01
    const lngOffset = (Math.random() - 0.5) * 0.01

    // Random intensity (amount of trash collected)

    const intensity = Math.floor(Math.random() * 80) + 20


    points.push({
      lat: centerLat + latOffset,
      lng: centerLng + lngOffset,
      intensity: intensity,
    })
  }

  return points
}

export function TrashHeatmap() {
  const [trashData, setTrashData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setTrashData(generateTrashData())
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader>

        <CardTitle>Trash Collection Map</CardTitle>

      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] rounded-md overflow-hidden">
          {isLoading ? <Skeleton className="h-full w-full" /> : <HeatmapWithNoSSR trashData={trashData} />}
        </div>
      </CardContent>
    </Card>
  )
}
