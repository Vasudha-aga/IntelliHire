// app/auth/callback/page.tsx
// Add this new page to your frontend for Google OAuth redirect handling

"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { saveAuth } from "@/hooks/useAuth"
import { authAPI } from "@/lib/api"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      router.push("/auth?error=no_token")
      return
    }

    // Save token first
    localStorage.setItem("intellihire_token", token)

    // Fetch user info
    authAPI.getMe()
      .then(({ data }) => {
        saveAuth(token, data)
        router.push("/dashboard")
      })
      .catch(() => {
        localStorage.removeItem("intellihire_token")
        router.push("/auth?error=google_failed")
      })
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Signing you in with Google...</p>
      </div>
    </div>
  )
}
