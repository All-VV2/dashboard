"use client"


import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import Leaflet components with SSR disabled
const SectionalMapContent = dynamic(() => import("./sectional-map-content").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted/20">
      <Skeleton className="h-full w-full" />

    </div>
  ),
})

export default function SectionalMap({ sectionData, selectedSection, setSelectedSection }) {
  return (
    <SectionalMapContent
      sectionData={sectionData}
      selectedSection={selectedSection}
      setSelectedSection={setSelectedSection}
    />

  )
}
