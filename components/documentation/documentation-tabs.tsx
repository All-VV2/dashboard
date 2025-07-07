"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Calendar, FileText, Layers } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// INTEGRATION POINT: Replace with real audit logs from your backend
// In a real application, you would fetch this data from your backend API
// Example API call:
// async function fetchAuditLogs() {
//   const response = await fetch('/api/audit-logs');
//   const data = await response.json();
//   return data;
// }
const auditLogs = [
  {
    id: 1,
    action: "Zone Created",
    user: "Admin",
    details: "Created Zone E (Go Zone)",
    timestamp: "2025-05-05 14:32:45",
    category: "Zone Management",
  },
  {
    id: 2,
    action: "Rover Deployed",
    user: "Operator",
    details: "Deployed Rover 3 to Zone B",
    timestamp: "2025-05-05 13:15:22",
    category: "Fleet Management",
  },
  // ... other audit logs
]

// INTEGRATION POINT: Replace with real user guides from your backend
// In a real application, you would fetch this data from your backend API
// Example API call:
// async function fetchUserGuides() {
//   const response = await fetch('/api/user-guides');
//   const data = await response.json();
//   return data;
// }
const userGuides = [
  {
    id: 1,
    title: "Getting Started",
    description: "Learn the basics of the Rover Management Dashboard and how to navigate the interface.",
    icon: FileText,
    category: "General",
    lastUpdated: "2025-04-15",
  },
  {
    id: 2,
    title: "Zone Management",
    description: "How to create, edit, and manage zones for your autonomous rovers.",
    icon: Layers,
    category: "Features",
    lastUpdated: "2025-05-01",
  },
  // ... other user guides
]

export function DocumentationTabs() {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter logs based on search term and category
  const filteredLogs = auditLogs.filter(
    (log) =>
      (log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === "all" || log.category === categoryFilter),
  )

  // Filter guides based on search term
  const filteredGuides = userGuides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get unique categories for filtering
  const categories = ["all", ...new Set(auditLogs.map((log) => log.category))]

  // INTEGRATION POINT: Implement export functionality
  // In a real application, you would generate and download a file
  // Example function:
  // async function exportAuditLogs() {
  //   try {
  //     const response = await fetch('/api/audit-logs/export', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ filter: categoryFilter, search: searchTerm })
  //     });
  //
  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'audit_logs.csv';
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     }
  //   } catch (error) {
  //     console.error("Failed to export audit logs:", error);
  //   }
  // }

  return (
    <Tabs defaultValue="audit-logs" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
        <TabsTrigger value="user-guides">User Guides & Maintenance</TabsTrigger>
      </TabsList>

      <TabsContent value="audit-logs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>A complete history of all actions and events in the system.</CardDescription>
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="user-guides" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Guides & Maintenance</CardTitle>
            <CardDescription>
              Comprehensive guides to help you use the Rover Management Dashboard effectively and maintain your rovers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guides..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <guide.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription className="mt-1">{guide.description}</CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{guide.category}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Updated {guide.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Maintenance Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Maintenance Procedures</h3>

              {/* INTEGRATION POINT: Replace with real maintenance data from your backend */}
              {/* In a real application, you would fetch this data from your backend API */}
              {/* Example API call: */}
              {/* async function fetchMaintenanceProcedures() { */}
              {/*   const response = await fetch('/api/maintenance/procedures'); */}
              {/*   const data = await response.json(); */}
              {/*   return data; */}
              {/* } */}

              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Routine Maintenance Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Component</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Procedure</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Battery</TableCell>
                          <TableCell>Monthly</TableCell>
                          <TableCell>Check connections, clean terminals, test capacity</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Motors</TableCell>
                          <TableCell>Quarterly</TableCell>
                          <TableCell>Lubricate bearings, check for wear, test performance</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sensors</TableCell>
                          <TableCell>Bi-weekly</TableCell>
                          <TableCell>Clean lenses, calibrate, verify readings</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Software</TableCell>
                          <TableCell>As released</TableCell>
                          <TableCell>Update firmware, backup settings, test functionality</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Troubleshooting Common Issues</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Battery Draining Too Quickly</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Check for software issues, sensor malfunctions, or physical obstructions that might be causing
                          excessive power consumption.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Navigation Errors</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Verify sensor calibration, check for environmental interference, and ensure map data is
                          up-to-date.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Communication Loss</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Check network connectivity, antenna integrity, and verify the rover is within range of access
                          points.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
