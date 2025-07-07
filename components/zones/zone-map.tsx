"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/components/notification-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMapContext } from "@/components/map-context"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import Leaflet components with SSR disabled
const ZoneMapContent = dynamic(() => import("./zone-map-content").then((mod) => mod.ZoneMapContent), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-12rem)] flex items-center justify-center bg-muted/20">
      <Skeleton className="h-full w-full" />
    </div>
  ),
})


// Main ZoneMap component
export function ZoneMap() {
  // Get zones and related functions from context
  const { zones, setZones, goZoneColor, noGoZoneColor } = useMapContext()

  // State for zone selection and editing
  const [selectedZone, setSelectedZone] = useState<number | null>(null)

  // Drawing state
  const [drawMode, setDrawMode] = useState<"rectangle" | "polygon" | null>(null)
  const [zoneType, setZoneType] = useState<"go" | "nogo">("go")
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [newZoneName, setNewZoneName] = useState("")
  const [tempZone, setTempZone] = useState<any>(null)
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null)
  const [canConfirm, setCanConfirm] = useState(false)
  const [isRectangleComplete, setIsRectangleComplete] = useState(false)

  // Dragging state for rectangles
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPoint, setDragStartPoint] = useState<[number, number] | null>(null)
  const [lastMousePos, setLastMousePos] = useState<[number, number] | null>(null)

  // Move mode state
  const [moveMode, setMoveMode] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [moveStartPoint, setMoveStartPoint] = useState<[number, number] | null>(null)

  // Resize mode state
  const [resizeMode, setResizeMode] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeCornerIndex, setResizeCornerIndex] = useState<number | null>(null)
  const [originalPolygon, setOriginalPolygon] = useState<[number, number][] | null>(null)


  // Notifications and map reference
  const { addNotification } = useNotifications()
  const mapRef = useRef<any>(null)

  // Handle clicking on a zone to select it
  const handleZoneClick = (zoneId: number) => {
    if (!isDrawing && !isMoving && !isResizing) {

      setSelectedZone(zoneId === selectedZone ? null : zoneId)
    }
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

  // Handle changing drawing mode
  const handleDrawModeChange = (mode: "rectangle" | "polygon" | null, type: "go" | "nogo") => {
    setDrawMode(mode)
    setZoneType(type)
    setIsDrawing(!!mode)
    setDrawingPoints([])
    setStartPoint(null)
    setCanConfirm(false)
    setIsRectangleComplete(false)
    setIsDragging(false)
    setDragStartPoint(null)
    setLastMousePos(null)

    // Disable other modes
    setMoveMode(false)
    setIsMoving(false)
    setMoveStartPoint(null)
    setResizeMode(false)
    setIsResizing(false)
    setResizeCornerIndex(null)
    setOriginalPolygon(null)


    if (mode) {
      addNotification({
        type: "info",
        title: "Drawing Mode Activated",
        message: `Click on the map to create a ${type === "go" ? "blue" : "dark"} ${mode}.`,
      })
    }
  }

  // Handle move mode toggle
  const handleMoveMode = () => {
    const newMoveMode = !moveMode
    setMoveMode(newMoveMode)

    // Disable other modes
    setDrawMode(null)
    setIsDrawing(false)
    setResizeMode(false)
    setIsResizing(false)
    setResizeCornerIndex(null)
    setOriginalPolygon(null)

    if (newMoveMode) {
      addNotification({
        type: "info",
        title: "Move Mode Activated",
        message: "Click on a zone to select it, then drag to move it.",
      })
    }
  }

  // Handle resize mode toggle
  const handleResizeMode = () => {
    const newResizeMode = !resizeMode
    setResizeMode(newResizeMode)

    // Disable other modes
    setDrawMode(null)
    setIsDrawing(false)
    setMoveMode(false)
    setIsMoving(false)
    setMoveStartPoint(null)

    if (newResizeMode) {
      addNotification({
        type: "info",
        title: "Resize Mode Activated",
        message: "Click on a rectangle zone to select it, then drag the corners to resize.",
      })
    }
  }

  // Handle canceling drawing
  const handleCancelDraw = () => {
    setDrawMode(null)
    setIsDrawing(false)

    setDrawingPoints([])
    setStartPoint(null)
    setCanConfirm(false)
    setIsRectangleComplete(false)
    setIsDragging(false)
    setDragStartPoint(null)
    setLastMousePos(null)

    addNotification({
      type: "info",
      title: "Drawing Cancelled",
      message: "Drawing mode has been cancelled.",
    })

  }

  // Handle saving a new zone after naming it
  const handleSaveNewZone = () => {
    if (newZoneName.trim() === "") {
      addNotification({
        type: "error",
        title: "Error",
        message: "Please enter a name for the zone.",
      })
      return
    }

    // Create new zone object
    const newZone = {
      id: Date.now(), // In a real app, this would come from the backend
      name: newZoneName,
      type: tempZone.type,
      polygon: tempZone.polygon,
      color: tempZone.color,
    }


    // INTEGRATION POINT: Save new zone to backend
    // async function saveZoneToBackend(zone) {
    //   try {
    //     const response = await fetch('/api/zones', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(zone)
    //     });
    //     const data = await response.json();
    //     return data;
    //   } catch (error) {
    //     console.error("Failed to save zone:", error);
    //     return null;
    //   }
    // }
    //
    // saveZoneToBackend(newZone).then(savedZone => {
    //   if (savedZone) {
    //     setZones([...zones, savedZone]);
    //     setShowNameDialog(false);
    //     setNewZoneName("");
    //     setTempZone(null);
    //
    //     addNotification({
    //       type: "success",
    //       title: "Zone Created",
    //       message: `${savedZone.name} has been created successfully.`,
    //     });
    //   } else {
    //     addNotification({
    //       type: "error",
    //       title: "Error",
    //       message: "Failed to create zone. Please try again.",
    //     });
    //   }
    // });


    // For now, just update the local state
    setZones([...zones, newZone])
    setShowNameDialog(false)
    setNewZoneName("")
    setTempZone(null)

    addNotification({
      type: "success",
      title: "Zone Created",
      message: `${newZoneName} has been created successfully.`,
    })
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="h-[calc(100vh-12rem)] relative">
          {/* Map with drawing tools */}
          <ZoneMapContent
            zones={zones}
            selectedZone={selectedZone}
            handleZoneClick={handleZoneClick}
            handleDeleteZone={handleDeleteZone}
            drawMode={drawMode}
            zoneType={zoneType}
            drawingPoints={drawingPoints}
            setDrawingPoints={setDrawingPoints}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            startPoint={startPoint}
            setStartPoint={setStartPoint}
            canConfirm={canConfirm}
            setCanConfirm={setCanConfirm}
            isRectangleComplete={isRectangleComplete}
            setIsRectangleComplete={setIsRectangleComplete}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            dragStartPoint={dragStartPoint}
            setDragStartPoint={setDragStartPoint}
            lastMousePos={lastMousePos}
            setLastMousePos={setLastMousePos}
            moveMode={moveMode}
            isMoving={isMoving}
            setIsMoving={setIsMoving}
            moveStartPoint={moveStartPoint}
            setMoveStartPoint={setMoveStartPoint}
            resizeMode={resizeMode}
            isResizing={isResizing}
            setIsResizing={setIsResizing}
            resizeCornerIndex={resizeCornerIndex}
            setResizeCornerIndex={setResizeCornerIndex}
            originalPolygon={originalPolygon}
            setOriginalPolygon={setOriginalPolygon}
            handleDrawModeChange={handleDrawModeChange}
            handleMoveMode={handleMoveMode}
            handleResizeMode={handleResizeMode}
            handleCancelDraw={handleCancelDraw}
            setTempZone={setTempZone}
            setShowNameDialog={setShowNameDialog}
            goZoneColor={goZoneColor}
            noGoZoneColor={noGoZoneColor}
            setZones={setZones}
            addNotification={addNotification}
          />

        </div>

        {/* New Zone Name Dialog - with z-index to ensure it's above the map */}
        <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
          <DialogContent className="z-[2000]">
            <DialogHeader>
              <DialogTitle>Name Your Zone</DialogTitle>
              <DialogDescription>Enter a name for the new {zoneType === "go" ? "Go" : "No-Go"} zone.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="zoneName">Zone Name</Label>
              <Input
                id="zoneName"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="e.g., West Campus, Chapel Area, Construction Zone"
                className="mt-1"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNameDialog(false)
                  setTempZone(null)
                  setNewZoneName("")
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNewZone}>Save Zone</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
