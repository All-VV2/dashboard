"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { DateRangePicker } from "@/components/date-range-picker"

export function AnalyticsFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <DateRangePicker />
        </div>

        <div className="space-y-2">
          <Label>Trash Type</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select trash type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="plastic">Plastic</SelectItem>
              <SelectItem value="paper">Paper</SelectItem>
              <SelectItem value="glass">Glass</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Section</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value="sectionA">Section A</SelectItem>
              <SelectItem value="sectionB">Section B</SelectItem>
              <SelectItem value="sectionC">Section C</SelectItem>
              <SelectItem value="sectionD">Section D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Minimum Collection Threshold</Label>
          <Slider defaultValue={[0]} max={100} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 items</span>
            <span>100 items</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-inactive">Show Inactive Sections</Label>
          <Switch id="show-inactive" />
        </div>
      </CardContent>
    </Card>
  )
}
