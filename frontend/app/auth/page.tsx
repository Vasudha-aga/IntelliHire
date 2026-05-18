"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react"
import { IntelliHireLogo } from "@/components/intellihire-logo"

const features = [
  "AI-powered resume analysis",
  "Realistic mock interviews",
  "Company-specific coding practice",
  "Detailed performance analytics",
]

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80" />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <IntelliHireLogo size="lg" />
            <span className="font-heading font-bold text-3xl text-white">IntelliHire</span>
          </Link>

          <h1 className="font-heading text-4xl font-bold text-white mb-6 text-balance">
            Your AI-Powered Interview Coach
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of professionals who have landed their dream jobs with IntelliHire.
          </p>

          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white/90">
                <CheckCircle className="w-5 h-5 text-white" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
            <p className="text-white/90 italic mb-4">
              &quot;IntelliHire helped me increase my ATS score by 40% and land interviews at top tech companies.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-medium text-sm">RS</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Rohit Sharma</p>
                <p className="text-white/60 text-xs">Software Engineer at Meta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <IntelliHireLogo size="sm" />
            <span className="font-heading font-bold text-xl gradient-text">IntelliHire</span>
          </Link>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-border">
              <TabsTrigger
                value="login"
                className="data-[state=active]:gradient-btn data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:gradient-btn data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold text-foreground">Welcome back</h2>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="priya@example.com"
                      className="pl-10 bg-card border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-card border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-btn border-0 text-white" asChild>
                  <Link href="/dashboard">
                    Login
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full border-border hover:bg-secondary">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold text-foreground">Create an account</h2>
                <p className="text-muted-foreground">Start your journey to interview success</p>
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Priya Sharma"
                      className="pl-10 bg-card border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="priya@example.com"
                      className="pl-10 bg-card border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10 bg-card border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 bg-card border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-btn border-0 text-white" asChild>
                  <Link href="/dashboard">
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
