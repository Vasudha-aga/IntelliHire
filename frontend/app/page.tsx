import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IntelliHireLogo } from "@/components/intellihire-logo"
import {
  Target,
  Bot,
  Mic2,
  Eye,
  Code,
  BarChart3,
  Play,
  ArrowRight,
  Star,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react"

const features = [
  {
    icon: Target,
    title: "ATS Resume Matching",
    description: "Analyze your resume against job descriptions to maximize your ATS score",
  },
  {
    icon: Bot,
    title: "AI Mock Interviews",
    description: "Practice with AI-powered interviews tailored to your target role",
  },
  {
    icon: Mic2,
    title: "Speech & Confidence Analysis",
    description: "Get real-time feedback on your speaking pace, clarity, and confidence",
  },
  {
    icon: Eye,
    title: "Webcam Eye Contact Tracking",
    description: "Improve your body language with AI-powered eye contact analysis",
  },
  {
    icon: Code,
    title: "Coding Interview Evaluator",
    description: "Practice coding challenges with instant feedback and optimization tips",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress over time with detailed analytics and insights",
  },
]

const steps = [
  { step: 1, title: "Upload Resume", description: "Upload your resume and paste the job description" },
  { step: 2, title: "Get ATS Score", description: "Receive detailed analysis and improvement suggestions" },
  { step: 3, title: "Practice Interview", description: "Take AI-powered mock interviews based on your profile" },
  { step: 4, title: "Solve Coding Problems", description: "Practice company-specific coding challenges" },
  { step: 5, title: "Review & Improve", description: "Get comprehensive reports and track your progress" },
]

const testimonials = [
  {
    name: "Rahul Verma",
    role: "Software Engineer at Google",
    review: "IntelliHire helped me land my dream job at Google. The AI mock interviews were incredibly realistic and the feedback was spot-on.",
    rating: 5,
  },
  {
    name: "Ananya Singh",
    role: "Data Scientist at Amazon",
    review: "The resume analysis feature improved my ATS score from 65% to 92%. I started getting way more interview calls!",
    rating: 5,
  },
  {
    name: "Vikram Mehta",
    role: "Product Manager at Microsoft",
    review: "The coding practice section with company-specific questions gave me the edge I needed. Highly recommend!",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar with enhanced glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <IntelliHireLogo size="sm" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" asChild className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10">
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild className="gradient-btn border-0 text-white shadow-lg shadow-primary/25">
                <Link href="/auth">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with enhanced effects */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background with Grid */}
        <div className="absolute inset-0 animated-gradient opacity-30" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
        
        {/* Moving Geometric Particles */}
        {/* Large floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-3xl particle-1" />
        <div className="absolute top-40 right-[15%] w-64 h-64 bg-accent/20 rounded-full blur-3xl particle-2" />
        <div className="absolute bottom-32 left-[20%] w-56 h-56 bg-primary/15 rounded-full blur-3xl particle-3" />
        
        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="orbit-particle absolute w-4 h-4 bg-primary/60 rounded-full blur-sm" />
          <div className="orbit-particle absolute w-3 h-3 bg-accent/60 rounded-full blur-sm" style={{ animationDelay: '-10s' }} />
          <div className="orbit-particle absolute w-2 h-2 bg-primary/40 rounded-full blur-sm" style={{ animationDelay: '-20s' }} />
        </div>
        
        {/* Pulsing glow elements */}
        <div className="absolute top-[15%] right-[25%] w-32 h-32 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl pulse-glow" />
        <div className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-2xl pulse-glow" style={{ animationDelay: '-2s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-[30%] left-[5%] w-16 h-16 border border-primary/20 rounded-xl rotate-45 particle-1" />
        <div className="absolute top-[60%] right-[8%] w-12 h-12 border border-accent/20 rounded-lg rotate-12 particle-2" />
        <div className="absolute bottom-[40%] left-[15%] w-8 h-8 bg-primary/10 rounded-full particle-3" />
        <div className="absolute top-[20%] right-[30%] w-6 h-6 bg-accent/10 rounded-md rotate-45 particle-1" style={{ animationDelay: '-5s' }} />
        
        {/* Gradient lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Land Your Dream Job with{" "}
                <span className="gradient-text">AI-Powered Interview Intelligence</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
                Maximize your ATS score, ace mock interviews, and practice coding challenges with personalized AI feedback.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="gradient-btn border-0 text-white px-8 shadow-xl shadow-primary/30">
                  <Link href="/analyze">
                    Start Free Analysis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Dashboard Mockup with enhanced glassmorphism */}
            <div className="relative floating">
              {/* Outer glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-2xl opacity-60" />
              
              <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl shadow-black/20 border border-white/10">
                {/* Inner glass reflection */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                      <span className="text-sm text-muted-foreground">ATS Score</span>
                      <span className="font-heading font-bold text-2xl gradient-text">82%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <span className="text-xs text-muted-foreground">Interview Score</span>
                        <p className="font-heading font-bold text-xl text-foreground mt-1">91%</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <span className="text-xs text-muted-foreground">Coding Score</span>
                        <p className="font-heading font-bold text-xl text-foreground mt-1">88%</p>
                      </div>
                    </div>
                    <div className="h-24 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <BarChart3 className="w-12 h-12 text-primary/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar with glassmorphism */}
      <section className="py-8 relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border-y border-white/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <p className="font-heading text-3xl font-bold gradient-text">10,000+</p>
              <p className="text-muted-foreground mt-1">Resumes Analyzed</p>
            </div>
            <div className="p-4 md:border-x border-white/10">
              <p className="font-heading text-3xl font-bold gradient-text">95%</p>
              <p className="text-muted-foreground mt-1">ATS Improvement Rate</p>
            </div>
            <div className="p-4">
              <p className="font-heading text-3xl font-bold gradient-text">500+</p>
              <p className="text-muted-foreground mt-1">Companies Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with enhanced cards */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-balance">
              Everything You Need to <span className="gradient-text">Ace Your Interview</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to help you prepare, practice, and succeed in your job search.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Card background glow on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                
                {/* Glass card */}
                <div className="relative h-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-colors">
                  {/* Inner highlight */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl gradient-btn flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with glass cards */}
      <section id="how-it-works" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              How <span className="gradient-text">IntelliHire</span> Works
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Get interview-ready in five simple steps
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {steps.map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className="group relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-accent/40 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 w-48 text-center border border-white/10 group-hover:border-white/20 transition-all group-hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
                      <span className="text-white font-bold">{item.step}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-primary/50 mx-2 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with glass cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="group relative"
              >
                {/* Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity" />
                
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-6">
                    &quot;{testimonial.review}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="text-white font-medium text-sm">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto relative">
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 rounded-[2rem] blur-2xl opacity-50" />
          
          <div className="relative gradient-btn rounded-3xl p-12 text-center overflow-hidden">
            {/* Glass overlay pattern */}
            <div className="absolute inset-0 bg-white/5" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
            
            <div className="relative">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Ace Your Next Interview?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of job seekers who have improved their interview skills with IntelliHire.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-xl"
              >
                <Link href="/auth">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border-t border-white/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="inline-block mb-4">
                <IntelliHireLogo size="sm" />
              </Link>
              <p className="text-sm text-muted-foreground">
                AI-powered interview preparation platform to help you land your dream job.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/analyze" className="hover:text-foreground transition-colors">Resume Analysis</Link></li>
                <li><Link href="/interview" className="hover:text-foreground transition-colors">AI Interview</Link></li>
                <li><Link href="/coding" className="hover:text-foreground transition-colors">Coding Practice</Link></li>
                <li><Link href="/analytics" className="hover:text-foreground transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} IntelliHire. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
