"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  greeting?: string
}

export function DashboardHeader({ greeting = "Good Morning" }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border glass">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          {greeting}, Priya 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {"Let's prepare for your next interview!"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64 bg-card border-border"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-white font-medium text-sm">PS</span>
        </div>
      </div>
    </header>
  )
}
