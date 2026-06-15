"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import { api } from "@/lib/api"
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
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")
    try {
      const res = await api.post("/api/auth/login", { email, password })
      auth.login(res.data.access_token, res.data.user)
      router.push("/dashboard")
    } catch (err: any) {
      setLoginError(err.response?.data?.detail || "Login failed")
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSignupError("")
    try {
      await api.post("/api/auth/signup", { email, password, full_name: name })
      setActiveTab("login")
      setPassword("")
      setSuccessMsg("Account created successfully! Please log in.")
      setIsLoading(false)
    } catch (err: any) {
      setSignupError(err.response?.data?.detail || "Signup failed")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/google`
  }

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/github`
  }

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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                {successMsg && <p className="text-sm font-medium text-success">{successMsg}</p>}
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="pl-10 bg-card border-border"
                      required
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-card border-border"
                      required
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

                {loginError && <p className="text-sm text-destructive">{loginError}</p>}

                <Button type="submit" className="w-full gradient-btn border-0 text-white" disabled={isLoading}>
                  {isLoading ? "Logging in..." : (
                    <>
                      Login
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
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

              <div className="flex flex-col gap-3">
                <Button variant="outline" type="button" onClick={handleGoogleLogin} className="w-full border-border hover:bg-secondary">
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
                <Button variant="outline" type="button" onClick={handleGithubLogin} className="w-full border-border hover:bg-secondary">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  Continue with GitHub
                </Button>
              </div>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold text-foreground">Create an account</h2>
                <p className="text-muted-foreground">Start your journey to interview success</p>
              </div>

              <form className="space-y-4" onSubmit={handleSignup}>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Priya Sharma"
                      className="pl-10 bg-card border-border"
                      required
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="pl-10 bg-card border-border"
                      required
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="pl-10 pr-10 bg-card border-border"
                      required
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
                      required
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

                {signupError && <p className="text-sm text-destructive">{signupError}</p>}

                <Button type="submit" className="w-full gradient-btn border-0 text-white" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
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
