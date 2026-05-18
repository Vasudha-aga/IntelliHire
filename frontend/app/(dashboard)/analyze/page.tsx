"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  FileText,
  X,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Mic,
  ArrowRight,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

const strongSkills = ["Python", "Machine Learning", "Flask", "REST APIs", "SQL", "TensorFlow"]
const missingSkills = ["Docker", "AWS", "Kubernetes", "CI/CD", "GraphQL"]

const suggestions = [
  {
    before: "Worked on machine learning projects",
    after: "Developed and deployed 5+ production ML models achieving 95% accuracy using TensorFlow and PyTorch",
  },
  {
    before: "Built APIs for the team",
    after: "Architected and implemented RESTful APIs serving 10K+ daily requests with 99.9% uptime",
  },
  {
    before: "Did data analysis work",
    after: "Conducted comprehensive data analysis using Python and SQL, reducing operational costs by 30%",
  },
  {
    before: "Led a small team",
    after: "Led a cross-functional team of 5 engineers, delivering projects 2 weeks ahead of schedule",
  },
  {
    before: "Improved system performance",
    after: "Optimized database queries and caching strategies, reducing API response time by 60%",
  },
]

const missingKeywords = [
  "Microservices",
  "Agile",
  "Scrum",
  "Cloud Computing",
  "DevOps",
  "Data Pipeline",
  "ETL",
  "Model Deployment",
]

export default function AnalyzePage() {
  const [step, setStep] = useState<"upload" | "results">("upload")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleAnalyze = () => {
    if (resumeFile && jobDescription) {
      setStep("results")
    }
  }

  const scoreData = [
    { name: "Score", value: 82 },
    { name: "Remaining", value: 18 },
  ]

  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="Resume Analysis" />

      <div className="p-6">
        {step === "upload" ? (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                Resume & Job Description Analysis
              </h1>
              <p className="text-muted-foreground">
                Upload your resume and paste the job description to get detailed ATS analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Resume Upload */}
              <div className="glass rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Upload Resume
                </h2>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{resumeFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => setResumeFile(null)}
                        className="p-1 hover:bg-secondary rounded-full"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-foreground mb-2">Drag & drop your resume PDF</p>
                      <p className="text-sm text-muted-foreground mb-4">or</p>
                      <label>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <span className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary text-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
                          Browse File
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="glass rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Job Description
                </h2>
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-[200px] bg-card border-border resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    {jobDescription.length} characters
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="gradient-btn border-0 text-white px-12"
                onClick={handleAnalyze}
                disabled={!resumeFile || !jobDescription}
              >
                <Search className="mr-2 w-5 h-5" />
                Analyze Now
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* ATS Score */}
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={scoreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill="url(#scoreGradient)" />
                        <Cell fill="#2D2D4E" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading text-4xl font-bold gradient-text">82%</span>
                    <span className="text-sm text-muted-foreground">ATS Score</span>
                  </div>
                </div>

                <div className="flex-1 grid sm:grid-cols-3 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-success" />
                      <span className="font-heading font-semibold text-foreground">High</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Shortlisting Chance</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="font-heading font-semibold text-foreground">14/18</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Skills Matched</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-accent" />
                      <span className="font-heading font-semibold text-foreground">23/30</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Keywords Found</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Strong Areas
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
                  Missing Skills
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

            {/* Improvement Suggestions */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-6">
                Resume Improvement Suggestions
              </h3>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="glass rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-white font-medium text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{suggestion.before}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                          <p className="text-sm text-foreground">{suggestion.after}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Gap */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Missing Important Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1.5 rounded-lg bg-warning/20 text-warning text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button size="lg" asChild className="gradient-btn border-0 text-white px-8">
                <Link href="/interview">
                  <Mic className="mr-2 w-5 h-5" />
                  Start AI Interview Based on This Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
