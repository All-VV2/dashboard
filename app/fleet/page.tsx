import { NotificationBell } from "@/components/notification-bell"
import { FleetList } from "@/components/fleet/fleet-list"
import { DeploymentMap } from "@/components/fleet/deployment-map"
import { DeploymentScheduler } from "@/components/fleet/deployment-scheduler"
import { FleetFilters } from "@/components/fleet/fleet-filters"

export default function FleetPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
        <NotificationBell />
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <div className="lg:col-span-2 space-y-4">
            <FleetFilters />
            <FleetList />
          </div>
          <div className="space-y-4">
            <DeploymentMap />
            <DeploymentScheduler />
          </div>
        </div>
      </div>
    </div>
  )
}
