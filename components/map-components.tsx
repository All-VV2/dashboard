"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, ZoomControl } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { campusShape, golfCourseCenter } from "@/components/map-context"

// Custom rover icon based on status
const getRoverIcon = (status: string) => {
  let color = "#3B82F6" // blue for default

  switch (status) {
    case "Patrolling":
      color = "#22C55E" // green
      break
    case "Returning":
      color = "#EAB308" // yellow
      break
    case "Error":
      color = "#EF4444" // red
      break
  }

  // Create a custom div icon for the rover
  return new L.DivIcon({
    className: "custom-icon",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

// MapControls component - handles initial map setup
function MapControls() {
  const map = useMap()

  useEffect(() => {
    // Fit map to campus bounds
    map.fitBounds(campusShape as any)

    // Remove attribution control
    map.attributionControl.remove()
  }, [map])

  return null
}

export function MapComponent({ roverPositions, zones, onRoverSelect }) {
  return (
    <MapContainer center={golfCourseCenter} zoom={16} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

      {/* Campus boundary - more detailed shape */}
      <Polygon positions={campusShape as any} pathOptions={{ color: "green", fillOpacity: 0.1 }} />

      {/* Zones */}
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.polygon as any}
          pathOptions={{
            color: zone.color,
            fillOpacity: 0.3,
            weight: 0, // Changed from 1 to 0 to remove the border
          }}
        >
          <Popup>
            <div>
              <h3 className="font-medium">{zone.name}</h3>
              <p className="text-sm text-muted-foreground">{zone.type === "go" ? "Go Zone" : "No-Go Zone"}</p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* Rovers */}
      {roverPositions.map((rover) => (
        <Marker
          key={rover.id}
          position={rover.position as [number, number]}
          icon={getRoverIcon(rover.status)}
          eventHandlers={{
            click: () => onRoverSelect(rover.id),
          }}
        >
          <Popup>
            <div className="space-y-2">
              <h3 className="font-medium">Rover {rover.id}</h3>
              <div className="text-sm">
                <div>Status: {rover.status}</div>
                <div>Battery: {rover.battery}%</div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapControls />
      <ZoomControl position="bottomright" />
    </MapContainer>
  )
}
