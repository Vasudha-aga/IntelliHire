"use client"

import { useState } from "react"
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
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

const previousQA = [
  {
    question: "Tell me about yourself and your experience in machine learning.",
    answer: "I am a machine learning engineer with 3 years of experience. I have worked on various projects including recommendation systems, NLP applications, and computer vision models. My expertise lies in TensorFlow and PyTorch...",
  },
  {
    question: "What is your biggest professional achievement?",
    answer: "My biggest achievement was leading the development of a real-time fraud detection system that reduced fraudulent transactions by 40% while maintaining sub-100ms latency. This project involved building a complex ML pipeline...",
  },
]

export default function InterviewPage() {
  const [mode, setMode] = useState<InterviewMode>(null)
  const [state, setState] = useState<InterviewState>("select")
  const [answer, setAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const startInterview = (selectedMode: InterviewMode) => {
    setMode(selectedMode)
    setState("active")
  }

  const endInterview = () => {
    setMode(null)
    setState("select")
    setAnswer("")
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="AI Interview" />

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
                  className="glass rounded-2xl p-8 text-center glow-hover transition-all duration-300 hover:-translate-y-2 group"
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
                    Start Interview
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
                  <span className="font-heading font-semibold text-foreground">3 of 10</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">12:45</span>
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
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      Resume-Based Question
                    </span>
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground leading-relaxed">
                    Explain the architecture of your HealthFusion AI project and the challenges you faced during deployment.
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
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {answer.split(" ").filter(Boolean).length} words
                      </span>
                      <Button className="gradient-btn border-0 text-white">
                        <Send className="mr-2 w-4 h-4" />
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
                          Click record to start speaking
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

                    {/* Live Transcription */}
                    <div className="rounded-xl bg-card border border-border p-4 min-h-[100px]">
                      <p className="text-xs text-muted-foreground mb-2">Live Transcription</p>
                      {isRecording ? (
                        <p className="text-foreground">
                          The HealthFusion AI project was built using a microservices architecture with TensorFlow serving as the core ML framework...
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Your speech will appear here in real-time
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Previous Q&A */}
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
                            Q{index + 1}: {qa.question}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
