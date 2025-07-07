"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useMapContext } from "@/components/map-context"

// Sample trash data for visualization
const trashData = [
  { name: "Plastic", value: 45, color: "#0088FE" },
  { name: "Paper", value: 25, color: "#00C49F" },
  { name: "Glass", value: 15, color: "#FFBB28" },
  { name: "Metal", value: 10, color: "#FF8042" },
  { name: "Other", value: 5, color: "#8884D8" },
]

const COLORS = trashData.map((item) => item.color)

export function AnalyticsPanel() {
  const { zones } = useMapContext()
  const [activeTab, setActiveTab] = useState("overview")

  // Generate section data based on zones
  const sectionData = useMemo(() => {
    return zones.map((zone) => ({
      name: zone.name,
      trashCollected: Math.floor(Math.random() * 80) + 20, // Random value between 20 and 100
      timeActive: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}m`, // Random time
    }))
  }, [zones])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Analytics Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="zones">Zones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Trash Type Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trashData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {trashData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Total Collection</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Items Collected</div>
                  <div className="text-2xl font-bold">
                    {sectionData.reduce((sum, section) => sum + section.trashCollected, 0)}
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Weight (kg)</div>
                  <div className="text-2xl font-bold">
                    {(sectionData.reduce((sum, section) => sum + section.trashCollected, 0) * 0.2).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="zones" className="pt-4">
            {sectionData.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No zones available. Create zones in the Zone Management page to see analytics.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="trashCollected" name="Trash Collected" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {sectionData.map((section, index) => (
                    <div key={index} className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{section.name}</div>
                        <div className="text-sm text-muted-foreground">{section.timeActive}</div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm">Items: {section.trashCollected}</div>
                        <div className="text-sm">Rovers: {Math.floor(Math.random() * 3) + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
