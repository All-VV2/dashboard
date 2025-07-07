"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Polygon, Popup, useMap, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import { campusShape, golfCourseBounds, golfCourseCenter } from "@/components/map-context"


// MapControls component
function MapControls() {
  const map = useMap()

  // Fit map to campus bounds
  useEffect(() => {
    if (map) {
      map.fitBounds(golfCourseBounds)
      // Remove attribution control
      map.attributionControl.remove()
    }
  }, [map])

  return null
}

interface SectionData {
  id: number
  name: string
  polygon: [number, number][]
  color: string
  trashData: { name: string; value: number }[]
  completion: number
}

interface SectionalMapContentProps {
  sectionData: SectionData[]
  selectedSection: number | null
  setSelectedSection: (id: number | null) => void
}

export default function SectionalMapContent({
  sectionData,
  selectedSection,
  setSelectedSection,
}: SectionalMapContentProps) {
  const handleSectionClick = (sectionId: number) => {
    setSelectedSection(sectionId === selectedSection ? null : sectionId)
  }

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


      {/* Zones */}
      {sectionData.map((section) => (
        <Polygon
          key={section.id}
          positions={section.polygon as any}
          pathOptions={{
            color: section.color,
            fillOpacity: selectedSection === section.id ? 0.6 : 0.3,
            weight: selectedSection === section.id ? 3 : 1,
          }}
          eventHandlers={{
            click: () => handleSectionClick(section.id),
          }}
        >
          <Popup className="z-[1000]">
            <div className="space-y-2">
              <h3 className="font-medium">{section.name}</h3>
              <div className="text-sm">
                <div>Completion: {section.completion}%</div>
                <div>Total Items: {section.trashData.reduce((sum, item) => sum + item.value, 0)}</div>
              </div>
              <button
                className="w-full px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md"
                onClick={() => setSelectedSection(section.id)}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Polygon>
      ))}

      <MapControls />
      <ZoomControl position="bottomright" />
    </MapContainer>
  )
}
