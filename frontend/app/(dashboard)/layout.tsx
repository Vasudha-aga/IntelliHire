"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!auth.isAuthenticated()) {
      router.push("/auth")
    }
  }, [router])

  if (!mounted) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="pl-64 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
