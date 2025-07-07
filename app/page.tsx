import { MapView } from "@/components/map-view"
import { NotificationBell } from "@/components/notification-bell"

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Rover Management Dashboard</h1>
        <NotificationBell />
      </header>
      <main className="flex-1 overflow-hidden">
        <MapView />
      </main>
    </div>
  )
}
