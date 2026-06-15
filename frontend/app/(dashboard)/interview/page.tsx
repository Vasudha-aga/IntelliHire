"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Mic,
  Video,
  Clock,
  ChevronRight,
  Eye,
  Smile,
  Volume2,
  AlertTriangle,
  Square,
  Send,
  Camera,
  Loader2
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { api } from "@/lib/api"

type InterviewMode = "text" | "voice" | "video" | null
type InterviewState = "select" | "active"

const modes = [
  {
    id: "text" as const,
    title: "Text Interview",
    description: "Type your answers comfortably",
    icon: MessageSquare,
  },
  {
    id: "voice" as const,
    title: "Voice Interview",
    description: "Speak your answers naturally",
    icon: Mic,
  },
  {
    id: "video" as const,
    title: "Video Interview",
    description: "Full interview with webcam analysis",
    icon: Video,
  },
]

function InterviewContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const resumeIdParam = searchParams.get("resumeId")

  const [mode, setMode] = useState<InterviewMode>(null)
  const [state, setState] = useState<InterviewState>("select")
  const [answer, setAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [resumeId, setResumeId] = useState<number | null>(resumeIdParam ? parseInt(resumeIdParam) : null)
  const [interviewId, setInterviewId] = useState<number | null>(null)
  const [questionData, setQuestionData] = useState<any>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [previousQA, setPreviousQA] = useState<any[]>([])

  useEffect(() => {
    // If no resumeId, try to fetch the most recent one
    if (!resumeId) {
      api.get('/api/resume/history').then(res => {
        if (res.data && res.data.length > 0) {
          setResumeId(res.data[0].id)
        }
      }).catch(err => {
        console.error("Failed to fetch recent resume", err)
      })
    }
  }, [resumeId])

  const startInterview = async (selectedMode: InterviewMode) => {
    if (!resumeId) {
      alert("Please upload and analyze a resume first.")
      router.push("/analyze")
      return
    }

    setIsLoading(true)
    try {
      const res = await api.post('/api/interview/start', {
        resume_id: resumeId,
        mode: selectedMode,
        job_role: "Software Engineer", // This could be dynamic later
        difficulty: "medium"
      })
      setInterviewId(res.data.interview_id)
      setMode(selectedMode)
      setQuestionData(res.data.question)
      setQuestionNumber(res.data.question_number)
      setPreviousQA([])
      setState("active")
    } catch (error) {
      console.error("Failed to start interview", error)
      alert("Failed to start interview. Ensure backend is running.")
    } finally {
      setIsLoading(false)
    }
  }

  const endInterview = async () => {
    if (interviewId) {
      try {
        await api.post('/api/interview/end', {
          interview_id: interviewId
        })
      } catch (error) {
        console.error("Failed to end interview", error)
      }
    }
    setMode(null)
    setState("select")
    setAnswer("")
    setInterviewId(null)
    router.push("/report")
  }

  const submitTextAnswer = async () => {
    if (!answer.trim() || !interviewId || !questionData) return

    setIsLoading(true)
    try {
      const currentQuestion = questionData.question
      
      const res = await api.post('/api/interview/answer/text', {
        interview_id: interviewId,
        question: currentQuestion,
        answer: answer,
        question_meta: questionData
      })
      
      const newQA = {
        question: currentQuestion,
        answer: answer,
        score: res.data.evaluation?.overall_score
      }
      setPreviousQA([...previousQA, newQA])
      
      if (res.data.is_complete) {
        alert("Interview completed!")
        endInterview()
      } else {
        setQuestionData(res.data.next_question)
        setQuestionNumber(res.data.question_number)
        setAnswer("")
      }
    } catch (error) {
      console.error("Failed to submit answer", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      {state === "select" ? (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Choose Your Interview Mode
            </h1>
            <p className="text-muted-foreground">
              Select how you&apos;d like to practice your interview skills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {modes.map((modeOption) => (
              <button
                key={modeOption.id}
                onClick={() => startInterview(modeOption.id)}
                disabled={isLoading}
                className="glass rounded-2xl p-8 text-center glow-hover transition-all duration-300 hover:-translate-y-2 group disabled:opacity-50"
              >
                <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <modeOption.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {modeOption.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {modeOption.description}
                </p>
                <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                  {isLoading && mode === modeOption.id ? "Starting..." : "Start Interview"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Top Bar */}
          <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Question</span>
                <span className="font-heading font-semibold text-foreground">{questionNumber} of 10</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono">--:--</span>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={endInterview}
              className="bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              End Interview
            </Button>
          </div>

          <div className={`grid gap-6 ${mode === "video" ? "lg:grid-cols-3" : mode === "voice" ? "lg:grid-cols-4" : ""}`}>
            {/* Video/Voice Panel */}
            {(mode === "video" || mode === "voice") && (
              <div className={mode === "video" ? "lg:col-span-1" : ""}>
                <div className="glass rounded-2xl p-6 space-y-4">
                  {mode === "video" && (
                    <div className="aspect-video rounded-xl bg-card border border-border flex items-center justify-center">
                      <Camera className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}

                  {/* Real-time Metrics */}
                  <div className="space-y-4">
                    <h3 className="font-heading font-semibold text-foreground text-sm">
                      Real-time Metrics
                    </h3>
                    
                    {mode === "video" && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Eye Contact
                            </span>
                            <span className="text-xs font-medium text-success">87%</span>
                          </div>
                          <Progress value={87} className="h-2 bg-secondary [&>div]:bg-success" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Smile className="w-3 h-3" /> Confidence
                            </span>
                            <span className="text-xs font-medium text-warning">72%</span>
                          </div>
                          <Progress value={72} className="h-2 bg-secondary [&>div]:bg-warning" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Speaking Pace
                      </span>
                      <span className="text-xs font-medium text-success">Normal</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Filler Words
                      </span>
                      <span className="text-xs font-medium text-warning">3 detected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className={mode === "video" ? "lg:col-span-2" : mode === "voice" ? "lg:col-span-3" : ""}>
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium capitalize">
                    {questionData?.type?.replace('_', ' ') || 'General'} Question
                  </span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground leading-relaxed">
                  {questionData?.question || 'Loading question...'}
                </h2>
              </div>

              {/* Answer Section */}
              {mode === "text" && (
                <div className="glass rounded-2xl p-6">
                  <Textarea
                    placeholder="Type your answer here..."
                    className="min-h-[200px] bg-card border-border resize-none mb-4"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {answer.split(" ").filter(Boolean).length} words
                    </span>
                    <Button className="gradient-btn border-0 text-white" onClick={submitTextAnswer} disabled={isLoading || !answer.trim()}>
                      {isLoading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Send className="mr-2 w-4 h-4" />}
                      Submit Answer
                    </Button>
                  </div>
                </div>
              )}

              {(mode === "voice" || mode === "video") && (
                <div className="glass rounded-2xl p-6">
                  {/* Waveform Animation Placeholder */}
                  <div className="h-24 rounded-xl bg-card border border-border flex items-center justify-center mb-6">
                    {isRecording ? (
                      <div className="flex items-center gap-1">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-primary rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 40 + 20}px`,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Voice features require backend audio processing. Mocking is recommended for now.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Button
                      size="lg"
                      onClick={() => setIsRecording(!isRecording)}
                      className={isRecording ? "bg-destructive hover:bg-destructive/90" : "gradient-btn border-0 text-white"}
                    >
                      {isRecording ? (
                        <>
                          <Square className="mr-2 w-5 h-5" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 w-5 h-5" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Previous Q&A */}
              {previousQA.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Previous Questions
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {previousQA.map((qa, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="glass rounded-xl border-0"
                      >
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <span className="text-left text-sm text-foreground">
                            Q{index + 1}: {qa.question} (Score: {qa.score || 'N/A'})
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="bg-card rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">{qa.answer}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InterviewPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="AI Interview" />
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <InterviewContent />
      </Suspense>
    </div>
  )
}
