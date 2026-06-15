"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { auth } from "@/lib/auth"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      // Temporarily store token so the API interceptor can use it
      auth.login(token)
      
      // Fetch user profile from the backend
      api.get("/api/auth/me")
        .then((res) => {
          auth.setUser(res.data)
          router.push("/dashboard")
        })
        .catch((err) => {
          console.error("Failed to fetch user profile", err)
          router.push("/auth")
        })
    } else {
      router.push("/auth")
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground font-medium">Authenticating your account...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <CallbackContent />
    </Suspense>
  )
}
