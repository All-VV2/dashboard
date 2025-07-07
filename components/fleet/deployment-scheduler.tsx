"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarClock, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Example scheduled deployments
const scheduledDeployments = [
  {
    id: 1,
    rover: "Rover 1",
    zone: "Zone A",
    startTime: "08:00 AM",
    endTime: "10:00 AM",
    date: "Today",
  },
  {
    id: 2,
    rover: "Rover 3",
    zone: "Zone B",
    startTime: "10:30 AM",
    endTime: "12:30 PM",
    date: "Today",
  },
  {
    id: 3,
    rover: "Rover 7",
    zone: "Zone C",
    startTime: "01:00 PM",
    endTime: "03:00 PM",
    date: "Today",
  },
  {
    id: 4,
    rover: "Rover 2",
    zone: "Zone D",
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    date: "Tomorrow",
  },
  {
    id: 5,
    rover: "Rover 4",
    zone: "Zone A",
    startTime: "11:30 AM",
    endTime: "01:30 PM",
    date: "Tomorrow",
  },
]

export function DeploymentScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showDialog, setShowDialog] = useState(false)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Deployment Scheduler</CardTitle>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Deployment</DialogTitle>
              <DialogDescription>Create a new deployment schedule for a rover.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rover" className="text-right">
                  Rover
                </Label>
                <Select>
                  <SelectTrigger id="rover" className="col-span-3">
                    <SelectValue placeholder="Select rover" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rover1">Rover 1</SelectItem>
                    <SelectItem value="rover2">Rover 2</SelectItem>
                    <SelectItem value="rover3">Rover 3</SelectItem>
                    <SelectItem value="rover4">Rover 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zone" className="text-right">
                  Zone
                </Label>
                <Select>
                  <SelectTrigger id="zone" className="col-span-3">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoneA">Zone A</SelectItem>
                    <SelectItem value="zoneB">Zone B</SelectItem>
                    <SelectItem value="zoneC">Zone C</SelectItem>
                    <SelectItem value="zoneD">Zone D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />

                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time
                </Label>
                <Input id="startTime" type="time" className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  End Time
                </Label>
                <Input id="endTime" type="time" className="col-span-3" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowDialog(false)}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-2 mt-2">
            {scheduledDeployments
              .filter((deployment) => deployment.date === "Today")
              .map((deployment) => (
                <div key={deployment.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <div className="font-medium">{deployment.rover}</div>
                    <div className="text-sm text-muted-foreground">{deployment.zone}</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {deployment.startTime} - {deployment.endTime}
                    </span>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="tomorrow" className="space-y-2 mt-2">
            {scheduledDeployments
              .filter((deployment) => deployment.date === "Tomorrow")
              .map((deployment) => (
                <div key={deployment.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <div className="font-medium">{deployment.rover}</div>
                    <div className="text-sm text-muted-foreground">{deployment.zone}</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {deployment.startTime} - {deployment.endTime}
                    </span>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-2">
            <div className="flex items-center justify-center h-24 text-muted-foreground">
              No upcoming deployments scheduled
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
