"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Polygon, Popup, useMap, ZoomControl, useMapEvents, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Edit, Trash2, Square, Pencil, X, Check, Move, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { campusShape, golfCourseCenter, isPolygonWithinBounds } from "@/components/map-context"

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

// DrawingTools component - provides UI for drawing zones
function DrawingTools({
  onDrawModeChange,
  drawMode,
  onCancelDraw,
  zoneType,
  onConfirmDraw,
  canConfirm,
  onMoveMode,
  moveMode,
  onResizeMode,
  resizeMode,
}) {
  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-md shadow-md">
      <div className="mb-3">
        <h3 className="font-medium mb-2">Drawing Tools</h3>
        {/* Zone type selection */}
        <RadioGroup defaultValue={zoneType} className="flex flex-col space-y-1 mb-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="go" id="go-zone" onClick={() => onDrawModeChange(drawMode, "go")} />
            <Label htmlFor="go-zone" className="text-[#18abdc] font-medium">
              Go Zone
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nogo" id="nogo-zone" onClick={() => onDrawModeChange(drawMode, "nogo")} />
            <Label htmlFor="nogo-zone" className="text-[#020d06] font-medium">
              No-Go Zone
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Drawing mode buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant={drawMode === "rectangle" ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 justify-start"
          onClick={() => onDrawModeChange("rectangle", zoneType)}
        >
          <Square className="h-4 w-4" />
          <span>Rectangle</span>
        </Button>
        <Button
          variant={drawMode === "polygon" ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 justify-start"
          onClick={() => onDrawModeChange("polygon", zoneType)}
        >
          <Pencil className="h-4 w-4" />
          <span>Polygon</span>
        </Button>

        {/* Move mode button */}
        <Button
          variant={moveMode ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 justify-start"
          onClick={onMoveMode}
        >
          <Move className="h-4 w-4" />
          <span>Move Zone</span>
        </Button>

        {/* Resize mode button */}
        <Button
          variant={resizeMode ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 justify-start"
          onClick={onResizeMode}
        >
          <Maximize className="h-4 w-4" />
          <span>Resize Zone</span>
        </Button>

        {drawMode && (
          <>
            {/* Only show confirm button when a valid shape is drawn */}
            {canConfirm && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 justify-start"
                onClick={onConfirmDraw}
              >
                <Check className="h-4 w-4" />
                <span>Confirm</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 justify-start"
              onClick={onCancelDraw}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          </>
        )}
      </div>

      {/* Instructions based on current mode */}
      <div className="mt-3 text-xs text-muted-foreground">
        {drawMode === "rectangle"
          ? "Click and drag to create a rectangle. You can move it by dragging."
          : drawMode === "polygon"
            ? "Click to add points. Click near the first point to close the shape."
            : moveMode
              ? "Click on a zone to select it, then drag to move it."
              : resizeMode
                ? "Click on a rectangle zone to select it, then drag the corners to resize."
                : "Select a drawing or editing mode to begin."}
      </div>
    </div>
  )
}

// MapEventHandler component - handles map events for drawing
function MapEventHandler({ isDrawing, onMapClick, onMouseMove, onMouseDown, onMouseUp, moveMode, resizeMode }) {
  const map = useMapEvents({
    click: (e) => {
      if (isDrawing) {
        onMapClick(e)
      }
    },
    mousemove: (e) => {
      if (isDrawing || moveMode || resizeMode) {
        onMouseMove(e)
      }
    },
    mousedown: (e) => {
      if (isDrawing || moveMode || resizeMode) {
        onMouseDown(e)
      }
    },
    mouseup: (e) => {
      if (isDrawing || moveMode || resizeMode) {
        onMouseUp(e)
      }
    },
  })

  // Disable map dragging when in drawing/editing mode to prevent conflicts
  useEffect(() => {
    if (isDrawing || moveMode || resizeMode) {
      map.dragging.disable()
    } else {
      map.dragging.enable()
    }
    return () => {
      map.dragging.enable()
    }
  }, [isDrawing, moveMode, resizeMode, map])

  return null
}

// Main ZoneMapContent component
export function ZoneMapContent({
  zones,
  selectedZone,
  handleZoneClick,
  handleDeleteZone,
  drawMode,
  zoneType,
  drawingPoints,
  setDrawingPoints,
  isDrawing,
  setIsDrawing,
  startPoint,
  setStartPoint,
  canConfirm,
  setCanConfirm,
  isRectangleComplete,
  setIsRectangleComplete,
  isDragging,
  setIsDragging,
  dragStartPoint,
  setDragStartPoint,
  lastMousePos,
  setLastMousePos,
  moveMode,
  isMoving,
  setIsMoving,
  moveStartPoint,
  setMoveStartPoint,
  resizeMode,
  isResizing,
  setIsResizing,
  resizeCornerIndex,
  setResizeCornerIndex,
  originalPolygon,
  setOriginalPolygon,
  handleDrawModeChange,
  handleMoveMode,
  handleResizeMode,
  handleCancelDraw,
  setTempZone,
  setShowNameDialog,
  goZoneColor,
  noGoZoneColor,
  setZones,
  addNotification,
  setDrawMode, // Added setDrawMode here
}) {
  // Handle confirming a drawn shape
  const handleConfirmDraw = () => {
    if (drawingPoints.length < 3) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Please create a valid shape with at least 3 points.",
      })
      return
    }

    // Close the polygon if it's not already closed
    let polygon = [...drawingPoints]
    if (polygon[0][0] !== polygon[polygon.length - 1][0] || polygon[0][1] !== polygon[polygon.length - 1][1]) {
      polygon = [...polygon, polygon[0]]
    }

    // Check if polygon is within bounds - using the more accurate algorithm
    if (!isPolygonWithinBounds(polygon, campusShape)) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Zone must be completely within the campus boundaries.",
      })
      return
    }

    handleZoneCreated(polygon)
  }

  // Handle map click for drawing
  const handleMapClick = (e) => {
    if (!isDrawing || !drawMode) return

    const { lat, lng } = e.latlng

    if (drawMode === "rectangle") {
      if (!startPoint) {
        // First click - set start point
        setStartPoint([lat, lng])
        setDrawingPoints([[lat, lng]])
        setIsRectangleComplete(false)
        setCanConfirm(false)
      } else if (!isRectangleComplete) {
        // Second click - complete rectangle
        const rectangle = [
          startPoint,
          [startPoint[0], lng],
          [lat, lng],
          [lat, startPoint[1]],
          startPoint, // Close the rectangle
        ]
        setDrawingPoints(rectangle)
        setIsRectangleComplete(true)
        setCanConfirm(true)
      }
    } else if (drawMode === "polygon") {
      // For polygon, add points one by one
      const newPoints = [...drawingPoints, [lat, lng]]
      setDrawingPoints(newPoints)

      // If we have at least 3 points, check if we're closing the polygon
      if (drawingPoints.length >= 2) {
        const firstPoint = drawingPoints[0]
        const distance = Math.sqrt(Math.pow(lat - firstPoint[0], 2) + Math.pow(lng - firstPoint[1], 2))

        // If we're close to the first point and have at least 3 points, we can close the polygon
        if (distance < 0.0003 && drawingPoints.length >= 2) {
          // Close the polygon
          const closedPolygon = [...drawingPoints, drawingPoints[0]]
          setDrawingPoints(closedPolygon)
          setCanConfirm(true)
        } else {
          // Not closing yet, but we can confirm if we have at least 3 points
          setCanConfirm(drawingPoints.length >= 2)
        }
      }
    }
  }

  // Handle mouse down for rectangle dragging, zone moving, or corner resizing
  const handleMouseDown = (e) => {
    if (isDrawing && drawMode === "rectangle" && isRectangleComplete) {
      // Rectangle dragging during creation
      setIsDragging(true)
      setDragStartPoint([e.latlng.lat, e.latlng.lng])
      setLastMousePos([e.latlng.lat, e.latlng.lng])
    } else if (moveMode && selectedZone !== null) {
      // Zone moving
      setIsMoving(true)
      setMoveStartPoint([e.latlng.lat, e.latlng.lng])
      setLastMousePos([e.latlng.lat, e.latlng.lng])
    } else if (resizeMode && selectedZone !== null) {
      // Find the closest corner for resizing (only for rectangles)
      const zone = zones.find((z) => z.id === selectedZone)
      if (zone && zone.polygon.length === 5) {
        // Rectangle has 5 points (including the closing point)
        const { lat, lng } = e.latlng
        let minDistance = Number.MAX_VALUE
        let closestCornerIndex = -1

        // Check the first 4 points (corners) of the rectangle
        for (let i = 0; i < 4; i++) {
          const cornerLat = zone.polygon[i][0]
          const cornerLng = zone.polygon[i][1]
          const distance = Math.sqrt(Math.pow(lat - cornerLat, 2) + Math.pow(lng - cornerLng, 2))

          if (distance < minDistance) {
            minDistance = distance
            closestCornerIndex = i
          }
        }

        // If we're close enough to a corner, start resizing
        if (minDistance < 0.0005) {
          // Threshold for corner selection
          setIsResizing(true)
          setResizeCornerIndex(closestCornerIndex)
          setOriginalPolygon([...zone.polygon])
          setLastMousePos([lat, lng])
        }
      }
    }
  }

  // Handle mouse up for rectangle dragging, zone moving, or corner resizing
  const handleMouseUp = (e) => {
    if (isDrawing && drawMode === "rectangle" && isDragging) {
      // End rectangle dragging
      setIsDragging(false)
      setDragStartPoint(null)
    } else if (moveMode && isMoving) {
      // End zone moving
      setIsMoving(false)
      setMoveStartPoint(null)

      // Update the zone in the context
      if (selectedZone !== null) {
        addNotification({
          type: "success",
          title: "Zone Moved",
          message: `${zones.find((z) => z.id === selectedZone)?.name} has been moved.`,
        })
      }
    } else if (resizeMode && isResizing) {
      // End corner resizing
      setIsResizing(false)
      setResizeCornerIndex(null)
      setOriginalPolygon(null)

      // Update the zone in the context
      if (selectedZone !== null) {
        addNotification({
          type: "success",
          title: "Zone Resized",
          message: `${zones.find((z) => z.id === selectedZone)?.name} has been resized.`,
        })
      }
    }
  }

  // Handle mouse move for rectangle dragging, zone moving, or corner resizing
  const handleMouseMove = (e) => {
    if (isDrawing && drawMode === "rectangle" && isDragging && lastMousePos) {
      // Move all points of the rectangle during creation
      const { lat, lng } = e.latlng
      const deltaLat = lat - lastMousePos[0]
      const deltaLng = lng - lastMousePos[1]

      const movedPoints = drawingPoints.map((point) => [point[0] + deltaLat, point[1] + deltaLng]) as [number, number][]

      setDrawingPoints(movedPoints)
      setLastMousePos([lat, lng])
    } else if (moveMode && isMoving && lastMousePos && selectedZone !== null) {
      // Move the selected zone
      const { lat, lng } = e.latlng
      const deltaLat = lat - lastMousePos[0]
      const deltaLng = lng - lastMousePos[1]

      const updatedZones = zones.map((zone) => {
        if (zone.id === selectedZone) {
          // Move all points of the polygon
          const movedPolygon = zone.polygon.map((point) => [point[0] + deltaLat, point[1] + deltaLng]) as [
            number,
            number,
          ][]
          return { ...zone, polygon: movedPolygon }
        }
        return zone
      })

      setZones(updatedZones)
      setLastMousePos([lat, lng])
    } else if (
      resizeMode &&
      isResizing &&
      lastMousePos &&
      selectedZone !== null &&
      resizeCornerIndex !== null &&
      originalPolygon
    ) {
      // Resize the selected rectangle by moving a corner
      const { lat, lng } = e.latlng
      const zone = zones.find((z) => z.id === selectedZone)

      if (zone && zone.polygon.length === 5) {
        // Rectangle has 5 points (including the closing point)
        const updatedPolygon = [...originalPolygon]

        // Update the selected corner
        updatedPolygon[resizeCornerIndex] = [lat, lng]

        // Update the adjacent corners to maintain the rectangle shape
        const oppositeCornerIndex = (resizeCornerIndex + 2) % 4
        const prevCornerIndex = (resizeCornerIndex + 3) % 4
        const nextCornerIndex = (resizeCornerIndex + 1) % 4

        // Update adjacent corners
        updatedPolygon[prevCornerIndex] = [lat, updatedPolygon[prevCornerIndex][1]]
        updatedPolygon[nextCornerIndex] = [updatedPolygon[nextCornerIndex][0], lng]

        // Update the closing point to match the first point
        updatedPolygon[4] = updatedPolygon[0]

        // Update the zone
        const updatedZones = zones.map((z) => {
          if (z.id === selectedZone) {
            return { ...z, polygon: updatedPolygon }
          }
          return z
        })

        setZones(updatedZones)
        setLastMousePos([lat, lng])
      }
    }
  }

  // Check if a new polygon overlaps with existing zones
  const checkForOverlap = (newPolygon, existingZones) => {
    // Simple bounding box check for overlap
    // In a real app, you'd want a more sophisticated polygon intersection check
    const newBounds = getBoundingBox(newPolygon)

    for (const zone of existingZones) {
      const zoneBounds = getBoundingBox(zone.polygon)

      if (
        newBounds.minLat <= zoneBounds.maxLat &&
        newBounds.maxLat >= zoneBounds.minLat &&
        newBounds.minLng <= zoneBounds.maxLng &&
        newBounds.maxLng >= zoneBounds.minLng
      ) {
        return true // Potential overlap
      }
    }

    return false
  }

  // Get bounding box for a polygon
  const getBoundingBox = (polygon) => {
    let minLat = Number.POSITIVE_INFINITY,
      maxLat = Number.NEGATIVE_INFINITY,
      minLng = Number.POSITIVE_INFINITY,
      maxLng = Number.NEGATIVE_INFINITY

    for (const [lat, lng] of polygon) {
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
    }

    return { minLat, maxLat, minLng, maxLng }
  }

  // Handle zone creation after drawing is complete
  const handleZoneCreated = (polygon) => {
    // Check for overlapping zones
    if (checkForOverlap(polygon, zones)) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Zones cannot overlap. Please try again in a different area.",
      })
      return
    }

    setTempZone({
      polygon,
      type: zoneType,
      color: zoneType === "go" ? goZoneColor : noGoZoneColor,
    })
    setShowNameDialog(true)
    setIsDrawing(false)
    setDrawMode(null)
    setDrawingPoints([])
    setStartPoint(null)
    setCanConfirm(false)
    setIsRectangleComplete(false)
    setIsDragging(false)
    setDragStartPoint(null)
    setLastMousePos(null)
  }

  return (
    <div className="h-full relative">
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
              fillOpacity: selectedZone === zone.id ? 0.6 : 0.3,
              weight: 0, // Changed from 1 to 0 to remove the border
            }}
            eventHandlers={{
              click: () => {
                if (!isDrawing) {
                  handleZoneClick(zone.id)
                }
              },
            }}
          >
            <Popup>
              <div className="space-y-2">
                <h3 className="font-medium">{zone.name}</h3>
                <div className="text-sm text-muted-foreground">{zone.type === "go" ? "Go Zone" : "No-Go Zone"}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleZoneClick(zone.id)}>
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleDeleteZone(zone.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Display corner markers for the selected rectangle in resize mode */}
        {resizeMode &&
          selectedZone !== null &&
          (() => {
            const zone = zones.find((z) => z.id === selectedZone)
            if (zone && zone.polygon.length === 5) {
              // Rectangle has 5 points (including the closing point)
              return zone.polygon.slice(0, 4).map((point, index) => (
                <CircleMarker
                  key={`corner-${index}`}
                  center={point as any}
                  radius={5}
                  pathOptions={{
                    color: "blue",
                    fillColor: "white",
                    fillOpacity: 1,
                  }}
                />
              ))
            }
            return null
          })()}

        {/* Current drawing */}
        {isDrawing && drawingPoints.length > 0 && (
          <Polygon
            positions={drawingPoints as any}
            pathOptions={{
              color: zoneType === "go" ? goZoneColor : noGoZoneColor,
              fillOpacity: 0.3,
              dashArray: "5, 5",
            }}
          />
        )}

        <MapControls />
        <MapEventHandler
          isDrawing={isDrawing}
          onMapClick={handleMapClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          moveMode={moveMode}
          resizeMode={resizeMode}
        />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Drawing Tools */}
      <DrawingTools
        onDrawModeChange={handleDrawModeChange}
        drawMode={drawMode}
        onCancelDraw={handleCancelDraw}
        onConfirmDraw={handleConfirmDraw}
        zoneType={zoneType}
        canConfirm={canConfirm}
        onMoveMode={handleMoveMode}
        moveMode={moveMode}
        onResizeMode={handleResizeMode}
        resizeMode={resizeMode}
      />
    </div>
  )
}
