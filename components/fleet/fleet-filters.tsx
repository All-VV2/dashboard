"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function FleetFilters() {
  return (
    <div className="flex items-center justify-between gap-4 bg-muted/50 p-3 rounded-md">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search rovers..." className="pl-8" />
      </div>

      <div className="flex items-center gap-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="patrolling">Patrolling</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="charging">Charging</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Rovers</SheetTitle>
              <SheetDescription>Apply filters to narrow down your rover list.</SheetDescription>
            </SheetHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Battery Level</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Battery Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical (&lt; 20%)</SelectItem>
                    <SelectItem value="low">Low (20% - 50%)</SelectItem>
                    <SelectItem value="medium">Medium (50% - 80%)</SelectItem>
                    <SelectItem value="high">High (&gt; 80%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="base">Base Station</SelectItem>
                    <SelectItem value="zoneA">Zone A</SelectItem>
                    <SelectItem value="zoneB">Zone B</SelectItem>
                    <SelectItem value="zoneC">Zone C</SelectItem>
                    <SelectItem value="zoneD">Zone D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select defaultValue="name">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="battery">Battery Level</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline">Reset</Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
