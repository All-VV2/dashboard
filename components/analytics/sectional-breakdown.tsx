"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMapContext } from "@/components/map-context"
import SectionalMap from "./sectional-map"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Generate random data for a section
function generateSectionData(id: number, name: string, polygon: [number, number][], color: string) {
  const trashTypes = [
    { name: "Plastic", color: "#0088FE" },
    { name: "Paper", color: "#00C49F" },
    { name: "Glass", color: "#FFBB28" },
    { name: "Metal", color: "#FF8042" },
    { name: "Other", color: "#8884D8" },
  ]

  const trashData = trashTypes.map((type) => ({
    name: type.name,
    value: Math.floor(Math.random() * 100) + 10,
    color: type.color,
  }))

  return {
    id,
    name,
    polygon,
    color,
    trashData,
    completion: Math.floor(Math.random() * 60) + 40, // Between 40-100%
  }
}

export function SectionalBreakdown() {
  const { zones } = useMapContext()
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [sectionData, setSectionData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("sections") // Changed default to sections

  // Generate section data based on zones
  useEffect(() => {
    if (zones.length > 0) {
      const data = zones.map((zone) => generateSectionData(zone.id, zone.name, zone.polygon, zone.color))
      setSectionData(data)
    }
  }, [zones])

  // COLORS for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Determine grid columns based on number of sections
  const getGridCols = () => {

    return "grid-cols-3" // Always show 3 columns for a 3x2 grid
  }

  // Determine card height based on whether a section is selected
  const getCardHeight = () => {
    return "auto" // Let the card height adjust based on content
  }

  return (
    <Card className={getCardHeight()}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle>Zone Analytics</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "sections" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("sections")}
          >
            Chart View
          </Button>
          <Button variant={activeTab === "map" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("map")}>
            Map View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {sectionData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No zones available. Create zones in the Zone Management page to see analytics.
          </div>
        ) : activeTab === "map" ? (
          <div className="h-[300px] border rounded-md overflow-hidden">
            <SectionalMap
              sectionData={sectionData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`grid ${getGridCols()} gap-3`}>
              {sectionData.slice(0, 6).map((section) => (
                <Card
                  key={section.id}
                  className={`overflow-hidden cursor-pointer transition-all h-[150px] ${

                    selectedSection === section.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedSection(section.id === selectedSection ? null : section.id)}
                >
                  <div className="h-2" style={{ backgroundColor: section.color }} />
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm">{section.name}</h3>
                      <span className="text-xs font-medium">{section.completion}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {section.trashData.reduce((sum: number, item: any) => sum + item.value, 0)} items collected
                    </div>

                    <div className="h-[90px] mt-1">

                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={section.trashData}
                            cx="50%"
                            cy="50%"

                            innerRadius={20}
                            outerRadius={35}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {section.trashData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedSection && (
              <Card>

                <CardHeader className="py-3">

                  <CardTitle>{sectionData.find((s) => s.id === selectedSection)?.name} Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted p-4 rounded-md">
                      <div className="text-sm text-muted-foreground">Completion</div>
                      <div className="text-2xl font-bold">
                        {sectionData.find((s) => s.id === selectedSection)?.completion}%
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <div className="text-sm text-muted-foreground">Total Items</div>
                      <div className="text-2xl font-bold">
                        {sectionData
                          .find((s) => s.id === selectedSection)
                          ?.trashData.reduce((sum: number, item: any) => sum + item.value, 0)}
                      </div>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectionData.find((s) => s.id === selectedSection)?.trashData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {sectionData
                            .find((s) => s.id === selectedSection)
                            ?.trashData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
