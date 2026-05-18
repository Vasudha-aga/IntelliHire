"use client"

import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  RefreshCw,
  LineChart,
  FileText,
  Mic,
  Code,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const radarData = [
  { subject: "Technical Knowledge", score: 85, fullMark: 100 },
  { subject: "Communication", score: 78, fullMark: 100 },
  { subject: "Confidence", score: 72, fullMark: 100 },
  { subject: "Clarity", score: 88, fullMark: 100 },
  { subject: "Depth of Answers", score: 75, fullMark: 100 },
  { subject: "Relevance", score: 82, fullMark: 100 },
]

const questionScores = [
  { q: "Q1", score: 92, feedback: "Excellent technical explanation" },
  { q: "Q2", score: 85, feedback: "Good, but could be more concise" },
  { q: "Q3", score: 78, feedback: "Add more specific examples" },
  { q: "Q4", score: 91, feedback: "Outstanding project showcase" },
  { q: "Q5", score: 70, feedback: "Needs more depth on challenges" },
  { q: "Q6", score: 88, feedback: "Great problem-solving approach" },
  { q: "Q7", score: 75, feedback: "Improve on behavioral aspects" },
  { q: "Q8", score: 82, feedback: "Good leadership examples" },
  { q: "Q9", score: 90, feedback: "Excellent technical depth" },
  { q: "Q10", score: 79, feedback: "Consider more metrics" },
]

const strongSkills = ["Python", "Machine Learning", "Flask", "REST APIs", "SQL", "TensorFlow"]
const missingSkills = ["Docker", "AWS", "Kubernetes"]

const recommendations = [
  {
    title: "Add Docker experience to resume",
    description: "Many ML Engineer roles require containerization skills. Consider adding Docker projects.",
  },
  {
    title: "Practice STAR method for behavioral questions",
    description: "Your behavioral answers could be more structured. Use Situation-Task-Action-Result format.",
  },
  {
    title: "Improve edge case handling in coding",
    description: "Focus on handling edge cases better - 1 out of 5 test cases failed due to this.",
  },
]

export default function ReportPage() {
  const overallScore = 84
  const resumeScore = 82
  const interviewScore = 79
  const codingScore = 91

  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="Interview Report" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
              Interview Readiness Report
            </h1>
            <p className="text-muted-foreground">
              ML Engineer at Google • May 15, 2026
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border">
              <Download className="mr-2 w-4 h-4" />
              Download PDF
            </Button>
            <Button asChild className="gradient-btn border-0 text-white">
              <Link href="/interview">
                <RefreshCw className="mr-2 w-4 h-4" />
                New Interview
              </Link>
            </Button>
          </div>
        </div>

        {/* Overall Score */}
        <div className="glass rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="overallGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={[
                      { name: "Score", value: overallScore },
                      { name: "Remaining", value: 100 - overallScore },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill="url(#overallGradient)" />
                    <Cell fill="#2D2D4E" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-5xl font-bold gradient-text">{overallScore}%</span>
                <span className="text-sm text-muted-foreground">Overall Score</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Interview Ready! 🎉
              </h2>
              <p className="text-muted-foreground mb-6">
                You&apos;re well-prepared for this role. Focus on the recommendations below to improve further.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-heading font-semibold text-foreground">{resumeScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Resume ATS Score</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Mic className="w-5 h-5 text-accent" />
                    <span className="font-heading font-semibold text-foreground">{interviewScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Interview Score</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Code className="w-5 h-5 text-success" />
                    <span className="font-heading font-semibold text-foreground">{codingScore}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Coding Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="interview" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="resume" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
              Resume Analysis
            </TabsTrigger>
            <TabsTrigger value="interview" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
              Interview Performance
            </TabsTrigger>
            <TabsTrigger value="coding" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
              Coding Performance
            </TabsTrigger>
          </TabsList>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Strong Skills Matched
                </h3>
                <div className="flex flex-wrap gap-2">
                  {strongSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  Skills to Add
                </h3>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Interview Tab */}
          <TabsContent value="interview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">
                  Performance Radar
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#2D2D4E" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#94A3B8", fontSize: 10 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: "#94A3B8", fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#4F46E5"
                        fill="#4F46E5"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">
                  Speech Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Speaking Speed</span>
                    <span className="font-medium text-success">Normal (145 WPM)</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Hesitation Count</span>
                    <span className="font-medium text-warning">8 instances</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Filler Words</span>
                    <span className="font-medium text-warning">12 detected</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Eye Contact</span>
                    <span className="font-medium text-success">87%</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-muted-foreground">Engagement Score</span>
                    <span className="font-medium text-success">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Scores */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Question-wise Scores
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Question</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionScores.map((qs) => (
                      <tr key={qs.q} className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{qs.q}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-medium ${qs.score >= 85 ? "text-success" : qs.score >= 75 ? "text-warning" : "text-destructive"}`}>
                            {qs.score}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{qs.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Coding Tab */}
          <TabsContent value="coding" className="space-y-6">
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-heading font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Problems Attempted</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-heading font-bold text-success">3</p>
                <p className="text-xs text-muted-foreground">Solved</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-heading font-bold text-foreground">45m</p>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-heading font-bold text-primary">Python</p>
                <p className="text-xs text-muted-foreground">Language Used</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Code Quality Breakdown
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Avg Complexity</p>
                  <p className="font-heading font-semibold text-foreground">O(n log n)</p>
                </div>
                <div className="bg-card rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Optimization</p>
                  <p className="font-heading font-semibold text-success">Excellent</p>
                </div>
                <div className="bg-card rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Code Quality</p>
                  <p className="font-heading font-semibold text-foreground">4.2/5</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            AI Recommendations
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border-l-4 border-primary">
                <h4 className="font-medium text-foreground mb-2">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="border-border">
            <Download className="mr-2 w-4 h-4" />
            Download PDF Report
          </Button>
          <Button asChild className="gradient-btn border-0 text-white">
            <Link href="/analytics">
              <LineChart className="mr-2 w-4 h-4" />
              View Analytics
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
