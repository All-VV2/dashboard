"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BarChart, Map, Truck, Layers, Settings, Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar-provider"

export function AppSidebar() {
  const pathname = usePathname()
  const { open, toggleSidebar } = useSidebar()

  const routes = [
    {
      name: "Map View",
      href: "/",
      icon: Map,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart,
    },
    {
      name: "My Fleet",
      href: "/fleet",
      icon: Truck,
    },
    {
      name: "Zone Management",
      href: "/zones",
      icon: Layers,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <div className={cn("h-full bg-background border-r transition-all duration-300 relative", open ? "w-64" : "w-16")}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn("flex items-center gap-2", !open && "justify-center")}>
          <div className="h-8 w-8 relative">
            <Image src="/images/logo.png" alt="Elytra Robotics Logo" width={32} height={32} />
          </div>
          {open && <span className="font-bold">Elytra Robotics</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn(!open && "hidden")}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <nav className="p-2 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              pathname === route.href
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              !open && "justify-center",
            )}
          >
            <route.icon className="h-5 w-5" />
            {open && <span>{route.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse/Expand button - positioned to be fully visible */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-4 top-20 h-6 w-6 rounded-full border bg-background shadow-md z-50"
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  )
}
