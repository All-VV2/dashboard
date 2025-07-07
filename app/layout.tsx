import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { SidebarProvider } from "@/components/sidebar-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { NotificationProvider } from "@/components/notification-provider"
import { MapProvider } from "@/components/map-context"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Autonomous Rover Management",
  description: "Management dashboard for autonomous trash collection rovers",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          <NotificationProvider>
            <MapProvider>
              <SidebarProvider>
                <div className="flex h-screen">
                  <AppSidebar />
                  <main className="flex-1 overflow-hidden">{children}</main>
                </div>
              </SidebarProvider>
            </MapProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
