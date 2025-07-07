import { NotificationBell } from "@/components/notification-bell"
import { SettingsTabs } from "@/components/settings/settings-tabs"

export default function SettingsPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  // Validate the tab parameter
  const validTabs = ["general", "notifications", "account", "map", "documentation"]
  const defaultTab = validTabs.includes(searchParams.tab || "") ? searchParams.tab : "general"

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Settings</h1>
        <NotificationBell />
      </header>
      <div className="flex-1 overflow-auto p-4">
        <SettingsTabs defaultTab={defaultTab} />
      </div>
    </div>
  )
}
