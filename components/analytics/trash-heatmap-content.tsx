"use client"


import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap, ZoomControl, Polygon } from "react-leaflet"
import L from "leaflet"
import "leaflet.heat"
import { campusShape, golfCourseBounds, golfCourseCenter } from "@/components/map-context"

// MapControls component - handles initial map setup
function MapControls({ trashData }) {
  const map = useMap()
  const heatLayerRef = useRef(null)

  useEffect(() => {
    // Fit map to campus bounds
    if (map) {
      map.fitBounds(golfCourseBounds)
      // Remove attribution control
      map.attributionControl.remove()
    }

    // Create heat layer
    if (trashData && trashData.length > 0) {
      // Convert trash data to format expected by Leaflet.heat
      const heatData = trashData.map((point) => [point.lat, point.lng, point.intensity / 10])

      // Create and add heat layer
      if (!heatLayerRef.current) {
        heatLayerRef.current = L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
        }).addTo(map)
      } else {
        // Update existing heat layer
        heatLayerRef.current.setLatLngs(heatData)
      }
    }

    return () => {
      // Clean up heat layer on unmount
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null

      }
    }
  }, [map, trashData])

  return null
}

interface TrashHeatmapContentProps {
  trashData: Array<{
    lat: number
    lng: number
    intensity: number
  }>
}

export default function TrashHeatmapContent({ trashData }: TrashHeatmapContentProps) {
  return (
    <MapContainer
      center={golfCourseCenter}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      className="z-0"
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

      {/* Campus boundary */}
      <Polygon
        positions={campusShape as any}
        pathOptions={{
          color: "green",
          fillOpacity: 0.1,
          weight: 1,
        }}
      />


      <MapControls trashData={trashData} />
      <ZoomControl position="bottomright" />
    </MapContainer>
  )
}
