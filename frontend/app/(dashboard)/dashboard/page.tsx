"use client"

import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import {
  ClipboardCheck,
  TrendingUp,
  Trophy,
  Zap,
  Plus,
  Mic,
  Code,
  FileText,
  ArrowRight,
  Lightbulb,
} from "lucide-react"

const stats = [
  {
    label: "Interviews Completed",
    value: "12",
    icon: ClipboardCheck,
    change: "+3 this week",
    color: "text-primary",
  },
  {
    label: "Average ATS Score",
    value: "78%",
    icon: TrendingUp,
    change: "+12% improvement",
    color: "text-accent",
  },
  {
    label: "Best Interview Score",
    value: "91%",
    icon: Trophy,
    change: "ML Engineer role",
    color: "text-success",
  },
  {
    label: "Skills Improved",
    value: "8",
    icon: Zap,
    change: "Python, ML, SQL...",
    color: "text-warning",
  },
]

const recentActivity = [
  {
    date: "May 15, 2026",
    role: "ML Engineer at Google",
    atsScore: 82,
    interviewScore: 91,
    status: "Completed",
  },
  {
    date: "May 12, 2026",
    role: "Data Scientist at Amazon",
    atsScore: 78,
    interviewScore: 85,
    status: "Completed",
  },
  {
    date: "May 10, 2026",
    role: "AI Engineer at Microsoft",
    atsScore: 75,
    interviewScore: null,
    status: "Pending",
  },
  {
    date: "May 8, 2026",
    role: "Backend Developer at Flipkart",
    atsScore: 88,
    interviewScore: 79,
    status: "Completed",
  },
  {
    date: "May 5, 2026",
    role: "Software Engineer at Meta",
    atsScore: 72,
    interviewScore: 83,
    status: "Completed",
  },
]

const quickActions = [
  {
    title: "New Resume Analysis",
    description: "Upload your resume and get ATS score",
    icon: Plus,
    href: "/analyze",
    color: "from-primary to-primary/80",
  },
  {
    title: "Start AI Interview",
    description: "Practice with realistic mock interviews",
    icon: Mic,
    href: "/interview",
    color: "from-accent to-accent/80",
  },
  {
    title: "Practice Coding",
    description: "Solve company-specific challenges",
    icon: Code,
    href: "/coding",
    color: "from-success to-success/80",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 glow-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`font-heading text-3xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color === "text-primary" ? "from-primary/20 to-primary/10" : stat.color === "text-accent" ? "from-accent/20 to-accent/10" : stat.color === "text-success" ? "from-success/20 to-success/10" : "from-warning/20 to-warning/10"}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/analytics">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ATS Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Interview Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 text-sm text-muted-foreground">{activity.date}</td>
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{activity.role}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${activity.atsScore >= 80 ? "text-success" : activity.atsScore >= 70 ? "text-warning" : "text-destructive"}`}>
                          {activity.atsScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {activity.interviewScore ? (
                          <span className={`text-sm font-medium ${activity.interviewScore >= 85 ? "text-success" : activity.interviewScore >= 75 ? "text-warning" : "text-destructive"}`}>
                            {activity.interviewScore}%
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === "Completed" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Tip of the Day */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border-l-4 border-primary">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    AI Tip of the Day
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When answering behavioral questions, use the STAR method (Situation, Task, Action, Result) to structure your responses. This helps you provide clear, concise, and impactful answers.
                  </p>
                </div>
              </div>
            </div>

            {/* Latest Report Preview */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Latest Report
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-secondary"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeDasharray={`${0.84 * 175.9} 175.9`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-foreground">
                    84%
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">ML Engineer at Google</p>
                  <p className="text-sm text-muted-foreground">May 15, 2026</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full border-border">
                <Link href="/report">
                  <FileText className="mr-2 w-4 h-4" />
                  View Full Report
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="glass rounded-2xl p-6 glow-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
