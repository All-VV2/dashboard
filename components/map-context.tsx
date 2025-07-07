"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define zone types
export interface Zone {
  id: number
  name: string
  type: "go" | "nogo"
  polygon: [number, number][]
  color: string
}

// Define context type
interface MapContextType {
  zones: Zone[]
  setZones: (zones: Zone[]) => void
  goZoneColor: string
  setGoZoneColor: (color: string) => void
  noGoZoneColor: string
  setNoGoZoneColor: (color: string) => void

}

// Create context with default values
const MapContext = createContext<MapContextType>({
  zones: [],
  setZones: () => {},
  goZoneColor: "#18abdc", // Default blue
  setGoZoneColor: () => {},
  noGoZoneColor: "#020d06", // Default dark
  setNoGoZoneColor: () => {},
})

// Duke University campus coordinates - restored to original shape

export const campusShape = [
  [36.008, -78.946], // Start at top left
  [36.0085, -78.935],
  [36.009, -78.925],
  [36.0085, -78.917],
  [36.006, -78.915],
  [36.003, -78.914],
  [36.0, -78.915],
  [35.998, -78.917],
  [35.9975, -78.925],
  [35.998, -78.935],
  [35.999, -78.942],
  [36.002, -78.946],
  [36.008, -78.946], // Close the shape
]

// Duke University campus center
export const golfCourseCenter = [36.003, -78.9315] as [number, number]

// Define the bounds of the campus area

export const golfCourseBounds: [[number, number], [number, number]] = [
  [35.997, -78.946],
  [36.009, -78.914],
]

// Initial zones

const initialZones = [
  {
    id: 1,
    name: "Zone A",
    type: "go" as const,
    polygon: [
      [36.006, -78.942],
      [36.006, -78.935],
      [36.002, -78.935],
      [36.002, -78.942],
    ] as [number, number][],
    color: "#18abdc", // blue

  },
  {
    id: 2,
    name: "Zone B",
    type: "go" as const,
    polygon: [
      [36.005, -78.925],
      [36.005, -78.918],
      [36.001, -78.918],
      [36.001, -78.925],
    ] as [number, number][],
    color: "#18abdc", // blue

  },
  {
    id: 3,
    name: "Zone C",
    type: "go" as const,
    polygon: [
      [36.003, -78.938],
      [36.003, -78.932],
      [36.0, -78.932],
      [36.0, -78.938],
    ] as [number, number][],
    color: "#18abdc", // blue

  },
  {
    id: 4,
    name: "Zone D",
    type: "go" as const,
    polygon: [
      [36.004, -78.932],
      [36.004, -78.928],
      [36.002, -78.928],
      [36.002, -78.932],
    ] as [number, number][],
    color: "#18abdc", // blue

  },
  {
    id: 5,
    name: "Duke Chapel",
    type: "nogo" as const,
    polygon: [
      [36.0035, -78.94],
      [36.0035, -78.939],
      [36.0025, -78.939],
      [36.0025, -78.94],
    ] as [number, number][],
    color: "#020d06", // dark

  },
  {
    id: 6,
    name: "Construction Zone",
    type: "nogo" as const,
    polygon: [
      [36.0015, -78.928],
      [36.0015, -78.926],
      [36.0, -78.926],
      [36.0, -78.928],
    ] as [number, number][],
    color: "#020d06", // dark
  },
]

// Provider component
export function MapProvider({ children }: { children: React.ReactNode }) {
  // State for zones and colors
  const [zones, setZones] = useState<Zone[]>(initialZones)
  const [goZoneColor, setGoZoneColor] = useState<string>("#18abdc") // Default blue
  const [noGoZoneColor, setNoGoZoneColor] = useState<string>("#020d06") // Default dark


  // Update zone colors when color settings change
  useEffect(() => {
    setZones((currentZones) =>
      currentZones.map((zone) => ({
        ...zone,
        color: zone.type === "go" ? goZoneColor : noGoZoneColor,
      })),
    )
  }, [goZoneColor, noGoZoneColor])


  return (
    <MapContext.Provider
      value={{
        zones,
        setZones,
        goZoneColor,
        setGoZoneColor,
        noGoZoneColor,
        setNoGoZoneColor,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

// Custom hook to use the map context
export function useMapContext() {
  const context = useContext(MapContext)
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider")
  }
  return context
}

// Function to check if a point is within bounds

export function isPointWithinBounds(point: [number, number], bounds: [number, number][]) {
  const x = point[0],
    y = point[1]

  let inside = false
  for (let i = 0, j = bounds.length - 1; i < bounds.length; j = i++) {
    const xi = bounds[i][0],
      yi = bounds[i][1]
    const xj = bounds[j][0],
      yj = bounds[j][1]

    // Check if ray from point crosses this edge
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }

  return inside
}

// Function to check if all points of a polygon are within bounds
export function isPolygonWithinBounds(polygon: [number, number][], bounds: [number, number][]) {

  return polygon.every((point) => isPointWithinBounds(point, bounds))
}
