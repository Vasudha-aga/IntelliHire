"use client"

import { useEffect, useState } from "react"
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
import { FileText, Flame, ArrowRight, Loader2 } from "lucide-react"
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
  Legend,
} from "recharts"
import { api } from "@/lib/api"

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/api/analytics/performance')
        setData(response.data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const scoreTrend = data?.score_trend || []
  const weakTopics = data?.weak_skills || []
  const strongTopics = data?.strong_skills || []
  const interviewHistory = data?.interview_history || []
  const codingStats = data?.coding_stats || { total_problems: 0, average_score: 0 }

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
            Score Trend Over Time
          </h2>
          <div className="h-72">
            {scoreTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="interview_score"
                    name="Interview Score"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#4F46E5", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ats_score"
                    name="ATS Score"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Not enough data to show trend
              </div>
            )}
          </div>
        </div>

        {/* Weak & Strong Topics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Weak Topics (Need Improvement)
            </h2>
            <div className="space-y-4">
              {weakTopics.length > 0 ? weakTopics.map((topic: any) => (
                <div key={topic.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{topic.skill}</span>
                  </div>
                  <Progress
                    value={Math.min(topic.frequency * 20, 100)} // Normalize frequency for UI
                    className="h-2 bg-secondary [&>div]:bg-destructive"
                  />
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No weak topics identified yet.</p>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Strong Topics (Keep It Up!)
            </h2>
            <div className="space-y-4">
              {strongTopics.length > 0 ? strongTopics.map((topic: any) => (
                <div key={topic.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{topic.skill}</span>
                    <span className="text-sm text-success font-medium">{topic.score}%</span>
                  </div>
                  <Progress
                    value={topic.score}
                    className="h-2 bg-secondary [&>div]:bg-success"
                  />
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No strong topics identified yet.</p>
              )}
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mode</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ATS</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Interview</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {interviewHistory.length > 0 ? interviewHistory.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 text-sm text-muted-foreground">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{item.job_role}</td>
                    <td className="py-3 px-4 text-sm text-foreground capitalize">{item.mode}</td>
                    <td className="py-3 px-4">
                      {item.ats_score ? (
                        <span className={`text-sm font-medium ${item.ats_score >= 80 ? "text-success" : "text-warning"}`}>
                          {item.ats_score}%
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.interview_score !== null ? (
                        <span className={`text-sm font-medium ${item.interview_score >= 80 ? "text-success" : "text-warning"}`}>
                          {item.interview_score}%
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground capitalize">
                      {item.status}
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'completed' && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/report?id=${item.id}`}>
                            <FileText className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-muted-foreground text-sm">
                      No interview history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
