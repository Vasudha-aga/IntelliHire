"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
  Loader2,
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
import { api } from "@/lib/api"

function ReportContent() {
  const searchParams = useSearchParams()
  const reportIdParam = searchParams.get("reportId")
  const interviewIdParam = searchParams.get("interviewId")

  const [isLoading, setIsLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true)
      try {
        if (reportIdParam) {
          const res = await api.get(`/api/report/${reportIdParam}`)
          setReportData(res.data)
        } else if (interviewIdParam) {
          const res = await api.post('/api/report/generate', {
            interview_id: parseInt(interviewIdParam)
          })
          setReportData(res.data)
        } else {
          // Fetch most recent report
          const res = await api.get('/api/report/')
          if (res.data && res.data.length > 0) {
            const recentId = res.data[0].id
            const recentRes = await api.get(`/api/report/${recentId}`)
            setReportData(recentRes.data)
          } else {
            setError("No reports found. Please complete an interview first.")
          }
        }
      } catch (err) {
        console.error("Failed to load report", err)
        setError("Failed to load report. Ensure backend is running.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [reportIdParam, interviewIdParam])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Generating your personalized AI report...</p>
        </div>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 glass p-8 rounded-2xl">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-foreground font-medium">{error || "Report not found"}</p>
          <Button asChild className="mt-4 gradient-btn border-0 text-white">
            <Link href="/interview">Take an Interview</Link>
          </Button>
        </div>
      </div>
    )
  }

  const fullReport = reportData.full_report || {}
  const atsDetails = reportData.ats_details || {}
  const interviewDetails = reportData.interview_details || {}
  const codingScores = reportData.coding_scores || []

  const overallScore = Math.round(reportData.overall_readiness || 0)
  const resumeScore = Math.round(reportData.score_breakdown?.ats_score || 0)
  const interviewScore = Math.round(reportData.score_breakdown?.interview_score || 0)
  const codingScore = Math.round(reportData.score_breakdown?.coding_score || 0)
  const nervousnessScore = Math.round(fullReport?.score_breakdown?.nervousness_score || interviewDetails?.speech_metrics?.nervousness_score || 0)

  const strongSkills = atsDetails.matched_skills || []
  const missingSkills = atsDetails.missing_skills || []
  
  const recommendations = fullReport.personalized_recommendations || []

  // Dynamic Radar Data based on full_report scores if available
  const radarData = [
    { subject: "Technical", score: fullReport.score_breakdown?.coding_score || codingScore, fullMark: 100 },
    { subject: "Communication", score: fullReport.score_breakdown?.communication_score || interviewScore, fullMark: 100 },
    { subject: "Resume Fit", score: resumeScore, fullMark: 100 },
    { subject: "Interview", score: interviewScore, fullMark: 100 },
  ]

  const qaList = interviewDetails.questions_answers || []

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
            Interview Readiness Report
          </h1>
          <p className="text-muted-foreground">
            {reportData.job_role || "Software Engineer"} • {new Date(reportData.created_at || Date.now()).toLocaleDateString()}
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
              {reportData.readiness_label || (overallScore >= 80 ? "Interview Ready! 🎉" : "Needs Practice")}
            </h2>
            <p className="text-muted-foreground mb-6">
              {fullReport.executive_summary || "You've completed the interview process. Check the detailed breakdown below."}
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
                {strongSkills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {strongSkills.length === 0 && <span className="text-sm text-muted-foreground">None available</span>}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Skills to Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {missingSkills.length === 0 && <span className="text-sm text-muted-foreground">None available</span>}
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
                Speech & Video Metrics
              </h3>
              <div className="space-y-4">
                {interviewDetails.speech_metrics && Object.keys(interviewDetails.speech_metrics).length > 0 ? (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Speaking Pace</span>
                      <span className="font-medium text-foreground">{interviewDetails.speech_metrics.speaking_pace || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Filler Words</span>
                      <span className="font-medium text-warning">{interviewDetails.speech_metrics.filler_words || 0} detected</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Nervousness Score</span>
                      <span className={`font-medium ${nervousnessScore > 60 ? 'text-destructive' : nervousnessScore > 30 ? 'text-warning' : 'text-success'}`}>{nervousnessScore}%</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No speech metrics available for this session.</p>
                )}
                
                {interviewDetails.vision_metrics && Object.keys(interviewDetails.vision_metrics).length > 0 ? (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Avg Eye Contact</span>
                      <span className="font-medium text-success">{interviewDetails.vision_metrics.avg_eye_contact || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-muted-foreground">Engagement</span>
                      <span className="font-medium text-success">{interviewDetails.vision_metrics.engagement_score || 'N/A'}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No video metrics available for this session.</p>
                )}
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
                  {qaList.map((qs: any, idx: number) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-3 px-4 text-sm font-medium text-foreground line-clamp-2">{qs.question}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${qs.score >= 8 ? "text-success" : qs.score >= 5 ? "text-warning" : "text-destructive"}`}>
                          {(qs.score * 10) || 0}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{qs.evaluation?.strengths?.[0] || 'Good attempt'}</td>
                    </tr>
                  ))}
                  {qaList.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-muted-foreground">No questions answered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Coding Tab */}
        <TabsContent value="coding" className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-heading font-bold text-foreground">{codingScores.length}</p>
              <p className="text-xs text-muted-foreground">Problems Attempted</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-heading font-bold text-success">{codingScores.filter((c: any) => c.score >= 80).length}</p>
              <p className="text-xs text-muted-foreground">Solved</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-heading font-bold text-primary">{Math.round(codingScore)}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Coding Problems
            </h3>
            <div className="space-y-4">
              {codingScores.map((c: any, i: number) => (
                <div key={i} className="bg-card rounded-xl p-4 flex justify-between items-center border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{c.problem_title}</p>
                    <p className="text-sm text-muted-foreground">{c.test_cases_passed}/{c.test_cases_total} test cases passed</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${c.score >= 80 ? 'text-success' : c.score >= 50 ? 'text-warning' : 'text-destructive'}`}>
                      {c.score}%
                    </p>
                  </div>
                </div>
              ))}
              {codingScores.length === 0 && (
                <p className="text-muted-foreground">No coding problems attempted.</p>
              )}
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
          {recommendations.map((rec: any, i: number) => (
            <div key={i} className="bg-card rounded-xl p-4 border-l-4 border-primary">
              <h4 className="font-medium text-foreground mb-2">{rec.action || rec.title}</h4>
              <p className="text-sm text-muted-foreground">{rec.resource || rec.description}</p>
              {rec.timeline && <span className="text-xs text-primary mt-2 block">Priority: {rec.priority} • {rec.timeline}</span>}
            </div>
          ))}
          {recommendations.length === 0 && (
            <p className="text-muted-foreground">No specific recommendations available at this time.</p>
          )}
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
  )
}

export default function ReportPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="Interview Report" />
      <Suspense fallback={<div className="p-6 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary"/></div>}>
        <ReportContent />
      </Suspense>
    </div>
  )
}
