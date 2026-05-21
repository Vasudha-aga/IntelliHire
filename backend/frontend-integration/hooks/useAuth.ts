// hooks/useAuth.ts
// Drop this into your frontend /hooks/ folder

"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"

interface User {
  id: number
  full_name: string
  email: string
  avatar_url?: string
  auth_provider?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (fullName: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => void
  logout: () => void
}

// ── Save/load token ─────────────────────────────────────────────
export function saveAuth(token: string, user: User) {
  localStorage.setItem("intellihire_token", token)
  localStorage.setItem("intellihire_user", JSON.stringify(user))
}

export function loadAuth(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") return { token: null, user: null }
  const token = localStorage.getItem("intellihire_token")
  const userStr = localStorage.getItem("intellihire_user")
  const user = userStr ? JSON.parse(userStr) : null
  return { token, user }
}

export function clearAuth() {
  localStorage.removeItem("intellihire_token")
  localStorage.removeItem("intellihire_user")
}


// ── Hook ────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const { token: savedToken, user: savedUser } = loadAuth()
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(savedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password })
    saveAuth(data.access_token, data.user)
    setToken(data.access_token)
    setUser(data.user)
    router.push("/dashboard")
  }

  const signup = async (fullName: string, email: string, password: string) => {
    const { data } = await authAPI.signup({ full_name: fullName, email, password })
    saveAuth(data.access_token, data.user)
    setToken(data.access_token)
    setUser(data.user)
    router.push("/dashboard")
  }

  const loginWithGoogle = () => {
    authAPI.googleLogin()
  }

  const logout = () => {
    authAPI.logout()
    setToken(null)
    setUser(null)
    router.push("/auth")
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    loginWithGoogle,
    logout,
  }
}
