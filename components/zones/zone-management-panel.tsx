"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, Edit, Trash2 } from "lucide-react"
import { useMapContext } from "@/components/map-context"
import { useNotifications } from "@/components/notification-provider"

export function ZoneManagementPanel() {
  // Get zones and related functions from context
  const { zones, setZones } = useMapContext()

  // State for zone selection and filtering
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Notifications
  const { addNotification } = useNotifications()

  // Handle clicking on a zone to select it
  const handleZoneClick = (zoneId: number) => {
    setSelectedZone(zoneId === selectedZone ? null : zoneId)
  }

  // Handle deleting a zone
  const handleDeleteZone = (zoneId: number) => {
    // INTEGRATION POINT: Delete zone from backend
    // async function deleteZoneFromBackend(id) {
    //   try {
    //     await fetch(`/api/zones/${id}`, { method: 'DELETE' });
    //     return true;
    //   } catch (error) {
    //     console.error("Failed to delete zone:", error);
    //     return false;
    //   }
    // }
    //
    // deleteZoneFromBackend(zoneId).then(success => {
    //   if (success) {
    //     setZones(zones.filter((zone) => zone.id !== zoneId));
    //     setSelectedZone(null);
    //     addNotification({
    //       type: "info",
    //       title: "Zone Deleted",
    //       message: `${zones.find((z) => z.id === zoneId)?.name} has been deleted.`,
    //     });
    //   } else {
    //     addNotification({
    //       type: "error",
    //       title: "Error",
    //       message: "Failed to delete zone. Please try again.",
    //     });
    //   }
    // });

    // For now, just update the local state
    setZones(zones.filter((zone) => zone.id !== zoneId))
    setSelectedZone(null)
    addNotification({
      type: "info",
      title: "Zone Deleted",
      message: `${zones.find((z) => z.id === zoneId)?.name} has been deleted.`,
    })
  }

  // Filter zones based on search term
  const filteredZones = zones.filter((zone) => zone.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // INTEGRATION POINT: Fetch zone edit history
  // In a real application, you would fetch the last edited time from your backend
  // async function fetchZoneHistory(zoneId) {
  //   try {
  //     const response = await fetch(`/api/zones/${zoneId}/history`);
  //     const data = await response.json();
  //     return data.lastEdited; // e.g., "2 hours ago"
  //   } catch (error) {
  //     console.error("Failed to fetch zone history:", error);
  //     return "Unknown";
  //   }
  // }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Zone Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Input placeholder="Search zones..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {/* Zone list */}
          <div className="space-y-2">
            {filteredZones.map((zone) => (
              <div
                key={zone.id}
                className={`flex items-center justify-between p-3 bg-muted rounded-md cursor-pointer ${
                  selectedZone === zone.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleZoneClick(zone.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    {/* Zone color indicator */}
                    <div className={`h-2 w-2 rounded-full`} style={{ backgroundColor: zone.color }} />
                    <span className="font-medium">{zone.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {zone.type === "go" ? "Go" : "No-Go"}
                    </Badge>
                  </div>
                  {/* Last edited time - would be dynamic in a real app */}
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Last edited 2 hours ago
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoneClick(zone.id)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteZone(zone.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {filteredZones.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No zones found. Create a zone on the map.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
