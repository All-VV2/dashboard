import { NotificationBell } from "@/components/notification-bell"
import { ZoneMap } from "@/components/zones/zone-map"
import { ZoneManagementPanel } from "@/components/zones/zone-management-panel"

export default function ZonesPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Zone Management</h1>
        <NotificationBell />
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          <div className="lg:col-span-3">
            <ZoneMap />
          </div>
          <div className="lg:col-span-1">
            <ZoneManagementPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
