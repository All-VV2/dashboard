"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Calendar, Clock, PenToolIcon as Tool, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useNotifications } from "@/components/notification-provider"

// Example maintenance logs
const maintenanceLogs = [
  {
    id: 1,
    roverId: "Rover 3",
    type: "Scheduled",
    status: "Completed",
    description: "Regular maintenance check - replaced battery and cleaned sensors",
    technician: "John Smith",
    date: "2025-05-04",
    duration: "45 minutes",
  },
  {
    id: 2,
    roverId: "Rover 5",
    type: "Repair",
    status: "Completed",
    description: "Fixed navigation system malfunction",
    technician: "Sarah Johnson",
    date: "2025-05-03",
    duration: "2 hours",
  },
  {
    id: 3,
    roverId: "Rover 2",
    type: "Scheduled",
    status: "Scheduled",
    description: "Quarterly maintenance check",
    technician: "John Smith",
    date: "2025-05-07",
    duration: "1 hour",
  },
  {
    id: 4,
    roverId: "Rover 1",
    type: "Emergency",
    status: "Completed",
    description: "Motor failure - replaced right motor assembly",
    technician: "Mike Chen",
    date: "2025-05-01",
    duration: "3 hours",
  },
  {
    id: 5,
    roverId: "Rover 7",
    type: "Scheduled",
    status: "Scheduled",
    description: "Software update and system calibration",
    technician: "Sarah Johnson",
    date: "2025-05-08",
    duration: "30 minutes",
  },
  {
    id: 6,
    roverId: "Rover 4",
    type: "Inspection",
    status: "Completed",
    description: "Post-deployment inspection - all systems normal",
    technician: "John Smith",
    date: "2025-05-02",
    duration: "20 minutes",
  },
  {
    id: 7,
    roverId: "Rover 6",
    type: "Repair",
    status: "In Progress",
    description: "Sensor array replacement",
    technician: "Mike Chen",
    date: "2025-05-05",
    duration: "1.5 hours",
  },
  {
    id: 8,
    roverId: "Rover 8",
    type: "Emergency",
    status: "Scheduled",
    description: "Battery failure - needs replacement",
    technician: "Sarah Johnson",
    date: "2025-05-06",
    duration: "1 hour",
  },
]

// Example rover health data
const roverHealth = [
  {
    id: 1,
    roverId: "Rover 1",
    batteryHealth: 92,
    motorHealth: 88,
    sensorHealth: 95,
    softwareStatus: "Up to date",
    lastMaintenance: "2025-05-01",
    nextMaintenance: "2025-06-01",
    status: "Operational",
  },
  {
    id: 2,
    roverId: "Rover 2",
    batteryHealth: 85,
    motorHealth: 90,
    sensorHealth: 87,
    softwareStatus: "Up to date",
    lastMaintenance: "2025-04-15",
    nextMaintenance: "2025-05-15",
    status: "Scheduled Maintenance",
  },
  {
    id: 3,
    roverId: "Rover 3",
    batteryHealth: 95,
    motorHealth: 92,
    sensorHealth: 94,
    softwareStatus: "Up to date",
    lastMaintenance: "2025-05-04",
    nextMaintenance: "2025-06-04",
    status: "Operational",
  },
  {
    id: 4,
    roverId: "Rover 4",
    batteryHealth: 78,
    motorHealth: 85,
    sensorHealth: 90,
    softwareStatus: "Update required",
    lastMaintenance: "2025-04-10",
    nextMaintenance: "2025-05-10",
    status: "Operational",
  },
  {
    id: 5,
    roverId: "Rover 5",
    batteryHealth: 88,
    motorHealth: 75,
    sensorHealth: 92,
    softwareStatus: "Up to date",
    lastMaintenance: "2025-05-03",
    nextMaintenance: "2025-06-03",
    status: "Operational",
  },
  {
    id: 6,
    roverId: "Rover 6",
    batteryHealth: 65,
    motorHealth: 70,
    sensorHealth: 80,
    softwareStatus: "Up to date",
    lastMaintenance: "2025-04-20",
    nextMaintenance: "2025-05-20",
    status: "In Maintenance",
  },
  {
    id: 7,
    roverId: "Rover 7",
    batteryHealth: 90,
    motorHealth: 88,
    sensorHealth: 85,
    softwareStatus: "Up to date",
    lastMaintenance: "2025-04-25",
    nextMaintenance: "2025-05-25",
    status: "Operational",
  },
  {
    id: 8,
    roverId: "Rover 8",
    batteryHealth: 55,
    motorHealth: 82,
    sensorHealth: 78,
    softwareStatus: "Update required",
    lastMaintenance: "2025-04-05",
    nextMaintenance: "2025-05-06",
    status: "Needs Attention",
  },
]

export function MaintenanceTabs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showNewLogDialog, setShowNewLogDialog] = useState(false)
  const [newLog, setNewLog] = useState({
    roverId: "",
    type: "Scheduled",
    description: "",
    technician: "",
    date: new Date().toISOString().split("T")[0],
    duration: "",
  })
  const { addNotification } = useNotifications()

  const filteredLogs = maintenanceLogs.filter(
    (log) =>
      (log.roverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.technician.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || log.status === statusFilter) &&
      (typeFilter === "all" || log.type === typeFilter),
  )

  const handleAddMaintenanceLog = () => {
    // In a real app, this would add to the database
    addNotification({
      type: "success",
      title: "Maintenance Log Added",
      message: `New maintenance log for ${newLog.roverId} has been created.`,
    })
    setShowNewLogDialog(false)
    // Reset form
    setNewLog({
      roverId: "",
      type: "Scheduled",
      description: "",
      technician: "",
      date: new Date().toISOString().split("T")[0],
      duration: "",
    })
  }

  const getHealthStatus = (value) => {
    if (value >= 90) return "bg-green-500"
    if (value >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Tabs defaultValue="logs" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="logs">Maintenance Logs</TabsTrigger>
        <TabsTrigger value="health">Rover Health</TabsTrigger>
      </TabsList>

      <TabsContent value="logs" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Maintenance Logs</CardTitle>
              <CardDescription>View and manage maintenance records for all rovers.</CardDescription>
            </div>
            <Dialog open={showNewLogDialog} onOpenChange={setShowNewLogDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Log
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Maintenance Log</DialogTitle>
                  <DialogDescription>Create a new maintenance log entry for a rover.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="rover-id" className="text-right">
                      Rover
                    </label>
                    <Select value={newLog.roverId} onValueChange={(value) => setNewLog({ ...newLog, roverId: value })}>
                      <SelectTrigger id="rover-id" className="col-span-3">
                        <SelectValue placeholder="Select rover" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => (
                          <SelectItem key={i} value={`Rover ${i + 1}`}>
                            Rover {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right">
                      Type
                    </label>
                    <Select value={newLog.type} onValueChange={(value) => setNewLog({ ...newLog, type: value })}>
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="date" className="text-right">
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={newLog.date}
                      onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="technician" className="text-right">
                      Technician
                    </label>
                    <Input
                      id="technician"
                      value={newLog.technician}
                      onChange={(e) => setNewLog({ ...newLog, technician: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="duration" className="text-right">
                      Duration
                    </label>
                    <Input
                      id="duration"
                      placeholder="e.g., 1 hour"
                      value={newLog.duration}
                      onChange={(e) => setNewLog({ ...newLog, duration: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="description" className="text-right">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={newLog.description}
                      onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewLogDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMaintenanceLog}>Add Log</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rover</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Technician</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.roverId}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.type === "Emergency"
                                ? "border-red-500 text-red-500"
                                : log.type === "Repair"
                                  ? "border-yellow-500 text-yellow-500"
                                  : "border-blue-500 text-blue-500"
                            }
                          >
                            {log.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>{log.technician}</TableCell>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>{log.duration}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              log.status === "Completed"
                                ? "border-green-500 text-green-500"
                                : log.status === "In Progress"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-yellow-500 text-yellow-500"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="health" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Rover Health Status</CardTitle>
            <CardDescription>Monitor the health and maintenance status of all rovers in the fleet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roverHealth.map((rover) => (
                <Card key={rover.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{rover.roverId}</CardTitle>
                      <Badge
                        variant={
                          rover.status === "Operational"
                            ? "default"
                            : rover.status === "Needs Attention"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {rover.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Battery Health</span>
                          <span className="font-medium">{rover.batteryHealth}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${getHealthStatus(rover.batteryHealth)}`}
                            style={{ width: `${rover.batteryHealth}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Motor Health</span>
                          <span className="font-medium">{rover.motorHealth}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${getHealthStatus(rover.motorHealth)}`}
                            style={{ width: `${rover.motorHealth}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Sensor Health</span>
                          <span className="font-medium">{rover.sensorHealth}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${getHealthStatus(rover.sensorHealth)}`}
                            style={{ width: `${rover.sensorHealth}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Last Maintenance</span>
                          </div>
                          <span>{rover.lastMaintenance}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Next Maintenance</span>
                          </div>
                          <span>{rover.nextMaintenance}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            {rover.softwareStatus === "Up to date" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-muted-foreground">Software</span>
                          </div>
                          <span>{rover.softwareStatus}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <Tool className="h-4 w-4 mr-2" /> Schedule Maintenance
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
