"use client"

import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FileText, Flame, ArrowRight } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"

const readinessData = [
  { date: "May 1", score: 60 },
  { date: "May 5", score: 65 },
  { date: "May 8", score: 68 },
  { date: "May 10", score: 72 },
  { date: "May 12", score: 78 },
  { date: "May 15", score: 84 },
]

const sessionScores = [
  { session: "Session 1", ats: 65, interview: 60, coding: 70 },
  { session: "Session 2", ats: 72, interview: 68, coding: 75 },
  { session: "Session 3", ats: 78, interview: 75, coding: 82 },
  { session: "Session 4", ats: 82, interview: 79, coding: 88 },
  { session: "Session 5", ats: 82, interview: 79, coding: 91 },
]

const skillRadarData = [
  { skill: "Python", level: 90 },
  { skill: "ML/AI", level: 85 },
  { skill: "SQL", level: 80 },
  { skill: "System Design", level: 45 },
  { skill: "Communication", level: 78 },
  { skill: "DSA", level: 70 },
  { skill: "Cloud", level: 25 },
  { skill: "DevOps", level: 20 },
]

const weakTopics = [
  { topic: "Docker", score: 20 },
  { topic: "AWS", score: 15 },
  { topic: "System Design", score: 45 },
  { topic: "Kubernetes", score: 10 },
]

const strongTopics = [
  { topic: "Python", score: 90 },
  { topic: "Machine Learning", score: 85 },
  { topic: "SQL", score: 80 },
  { topic: "REST APIs", score: 75 },
]

const interviewHistory = [
  {
    date: "May 15, 2026",
    role: "ML Engineer at Google",
    atsScore: 82,
    interviewScore: 79,
    codingScore: 91,
  },
  {
    date: "May 12, 2026",
    role: "Data Scientist at Amazon",
    atsScore: 78,
    interviewScore: 85,
    codingScore: 88,
  },
  {
    date: "May 10, 2026",
    role: "AI Engineer at Microsoft",
    atsScore: 75,
    interviewScore: 72,
    codingScore: 85,
  },
  {
    date: "May 8, 2026",
    role: "Backend Developer at Flipkart",
    atsScore: 88,
    interviewScore: 79,
    codingScore: 82,
  },
  {
    date: "May 5, 2026",
    role: "Software Engineer at Meta",
    atsScore: 72,
    interviewScore: 68,
    codingScore: 75,
  },
]

const streakDays = [
  [0, 0, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1],
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="Analytics" />

      <div className="p-6 space-y-6">
        {/* Date Range Filter */}
        <div className="flex justify-end">
          <Select defaultValue="30days">
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Readiness Score Over Time */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
            Interview Readiness Score Over Time
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readinessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" />
                <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A2E",
                    border: "1px solid #2D2D4E",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "#F1F5F9" }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#4F46E5", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Scores & Skill Radar */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Scores Per Session
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D2D4E" />
                  <XAxis dataKey="session" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A2E",
                      border: "1px solid #2D2D4E",
                      borderRadius: "12px",
                    }}
                    labelStyle={{ color: "#F1F5F9" }}
                  />
                  <Legend />
                  <Bar dataKey="ats" name="ATS" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interview" name="Interview" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="coding" name="Coding" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Current Skill Levels
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadarData}>
                  <PolarGrid stroke="#2D2D4E" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <Radar
                    name="Level"
                    dataKey="level"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weak & Strong Topics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Weak Topics (Need Improvement)
            </h2>
            <div className="space-y-4">
              {weakTopics.map((topic) => (
                <div key={topic.topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{topic.topic}</span>
                    <span className="text-sm text-destructive font-medium">{topic.score}%</span>
                  </div>
                  <Progress
                    value={topic.score}
                    className="h-2 bg-secondary [&>div]:bg-destructive"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Strong Topics (Keep It Up!)
            </h2>
            <div className="space-y-4">
              {strongTopics.map((topic) => (
                <div key={topic.topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{topic.topic}</span>
                    <span className="text-sm text-success font-medium">{topic.score}%</span>
                  </div>
                  <Progress
                    value={topic.score}
                    className="h-2 bg-secondary [&>div]:bg-success"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interview History */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
            Interview History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ATS</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Interview</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Coding</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviewHistory.map((item, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{item.role}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${item.atsScore >= 80 ? "text-success" : "text-warning"}`}>
                        {item.atsScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${item.interviewScore >= 80 ? "text-success" : "text-warning"}`}>
                        {item.interviewScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${item.codingScore >= 85 ? "text-success" : "text-warning"}`}>
                        {item.codingScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/report">
                          <FileText className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Practice Streak */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <Flame className="w-5 h-5 text-warning" />
              5 Day Practice Streak!
            </h2>
          </div>
          <div className="flex flex-col gap-1">
            {streakDays.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-6 h-6 rounded-sm ${
                      day === 1 ? "bg-success" : "bg-secondary"
                    }`}
                    title={day === 1 ? "Active" : "Inactive"}
                  />
                ))}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Keep practicing daily to maintain your streak and improve faster!
          </p>
        </div>
      </div>
    </div>
  )
}
