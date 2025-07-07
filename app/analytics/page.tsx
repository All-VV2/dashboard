import { NotificationBell } from "@/components/notification-bell"
import { AnalyticsPanel } from "@/components/analytics/analytics-panel"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { SectionalBreakdown } from "@/components/analytics/sectional-breakdown"
import { TrashHeatmap } from "@/components/analytics/trash-heatmap"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <NotificationBell />
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <AnalyticsFilters />
            <AnalyticsPanel />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <SectionalBreakdown />
            <TrashHeatmap />
          </div>
        </div>
      </div>
    </div>
  )
}
