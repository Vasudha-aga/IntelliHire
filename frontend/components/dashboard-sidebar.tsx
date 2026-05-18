"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  Mic,
  Code,
  BarChart3,
  LineChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IntelliHireLogo } from "@/components/intellihire-logo"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Resume & JD Analysis", href: "/analyze", icon: FileText },
  { name: "AI Interview", href: "/interview", icon: Mic },
  { name: "Coding Round", href: "/coding", icon: Code },
  { name: "Reports", href: "/report", icon: BarChart3 },
  { name: "Analytics", href: "/analytics", icon: LineChart },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col glass border-r border-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <IntelliHireLogo size="sm" showText={true} />
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <IntelliHireLogo size="sm" showText={false} />
          </Link>
        )}
      </div>

      {/* User Profile */}
      <div className={cn("p-4 border-b border-border", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Priya Sharma</p>
              <p className="text-xs text-muted-foreground">priya@example.com</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "gradient-btn text-white"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-white")} />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-card hover:bg-secondary"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>
    </aside>
  )
}
