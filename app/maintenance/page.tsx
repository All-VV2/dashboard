import { NotificationBell } from "@/components/notification-bell"
import { MaintenanceTabs } from "@/components/maintenance/maintenance-tabs"

export default function MaintenancePage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <NotificationBell />
      </header>
      <div className="flex-1 overflow-auto p-4">
        <MaintenanceTabs />
      </div>
    </div>
  )
}
