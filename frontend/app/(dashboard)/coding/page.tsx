"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  CheckCircle,
  Clock,
  FileText,
  Lightbulb,
  BookOpen,
  Rocket,
  Terminal,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react"
import { api } from "@/lib/api"

type CodingState = "setup" | "coding"

const companies = ["Google", "Amazon", "Microsoft", "Flipkart", "Uber", "Meta", "Netflix", "Apple"]

const languages = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
]

export default function CodingPage() {
  const [state, setState] = useState<CodingState>("setup")
  const [questionSource, setQuestionSource] = useState<"jd" | "company">("jd")
  const [company, setCompany] = useState("")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionType, setQuestionType] = useState<"random" | "pyq">("random")
  const [language, setLanguage] = useState("python")
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [questionData, setQuestionData] = useState<any>(null)
  const [code, setCode] = useState("")
  
  const [showResults, setShowResults] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [runResult, setRunResult] = useState<any>(null)
  const [submitResult, setSubmitResult] = useState<any>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const payload = {
        source: questionSource,
        jd_text: questionSource === "jd" ? "General JD" : "",
        company: questionSource === "company" ? company : "",
        difficulty,
        language,
        question_type: questionType
      }
      const res = await api.post('/api/coding/generate-question', payload)
      setQuestionData(res.data)
      setCode(res.data.starter_code?.[language] || "")
      setState("coding")
      setShowResults(false)
      setRunResult(null)
      setSubmitResult(null)
    } catch (error) {
      console.error("Failed to generate question", error)
      alert("Failed to generate question. Check backend connection.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRun = async () => {
    setIsRunning(true)
    setShowResults(true)
    setSubmitResult(null)
    try {
      // Just run against the first example for quick run
      const firstExample = questionData?.examples?.[0]?.input || ""
      const wrapper_code = questionData?.wrappers?.[language] || ""
      const res = await api.post('/api/coding/run', {
        language,
        source_code: code,
        stdin: firstExample,
        wrapper_code
      })
      setRunResult(res.data)
    } catch (error) {
      console.error("Run failed", error)
      setRunResult({ error: "Execution failed" })
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setShowResults(true)
    setRunResult(null)
    try {
      const wrapper_code = questionData?.wrappers?.[language] || ""
      const res = await api.post('/api/coding/submit', {
        problem_title: questionData?.title || "Coding Problem",
        difficulty,
        language,
        source_code: code,
        test_cases: questionData?.test_cases || [],
        wrapper_code
      })
      setSubmitResult(res.data)
    } catch (error) {
      console.error("Submit failed", error)
      setSubmitResult({ error: "Submission failed" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader greeting="Coding Round" />

      <div className="p-6">
        {state === "setup" ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                Coding Practice Setup
              </h1>
              <p className="text-muted-foreground">
                Configure your coding practice session
              </p>
            </div>

            <div className="glass rounded-2xl p-8 space-y-6">
              {/* Question Source */}
              <div className="space-y-3">
                <Label>Question Source</Label>
                <div className="flex gap-3">
                  <Button
                    variant={questionSource === "jd" ? "default" : "outline"}
                    onClick={() => setQuestionSource("jd")}
                    className={questionSource === "jd" ? "gradient-btn border-0 text-white" : "border-border"}
                  >
                    Based on JD
                  </Button>
                  <Button
                    variant={questionSource === "company" ? "default" : "outline"}
                    onClick={() => setQuestionSource("company")}
                    className={questionSource === "company" ? "gradient-btn border-0 text-white" : "border-border"}
                  >
                    Company-Specific
                  </Button>
                </div>
              </div>

              {/* Company Selection */}
              {questionSource === "company" && (
                <div className="space-y-3">
                  <Label>Select Company</Label>
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger className="bg-card border-border">
                      <SelectValue placeholder="Choose a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c} value={c.toLowerCase()}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Difficulty */}
              <div className="space-y-3">
                <Label>Difficulty</Label>
                <div className="flex gap-3">
                  {(["easy", "medium", "hard"] as const).map((d) => (
                    <Button
                      key={d}
                      variant={difficulty === d ? "default" : "outline"}
                      onClick={() => setDifficulty(d)}
                      className={
                        difficulty === d
                          ? d === "easy"
                            ? "bg-success hover:bg-success/90 text-white"
                            : d === "medium"
                            ? "bg-warning hover:bg-warning/90 text-black"
                            : "bg-destructive hover:bg-destructive/90 text-white"
                          : "border-border"
                      }
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Question Type */}
              <div className="space-y-3">
                <Label>Question Type</Label>
                <div className="flex gap-3">
                  <Button
                    variant={questionType === "random" ? "default" : "outline"}
                    onClick={() => setQuestionType("random")}
                    className={questionType === "random" ? "gradient-btn border-0 text-white" : "border-border"}
                  >
                    Random
                  </Button>
                  <Button
                    variant={questionType === "pyq" ? "default" : "outline"}
                    onClick={() => setQuestionType("pyq")}
                    className={questionType === "pyq" ? "gradient-btn border-0 text-white" : "border-border"}
                  >
                    Previous Year Questions (PYQ)
                  </Button>
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <Label>Programming Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="lg"
                className="w-full gradient-btn border-0 text-white"
                onClick={handleGenerate}
                disabled={isGenerating || (questionSource === "company" && !company)}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 w-5 h-5" />
                    Generate Question
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-180px)] flex flex-col">
            {/* Top Bar */}
            <div className="glass rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-heading font-semibold text-foreground">
                  {questionData?.title || "Coding Problem"}
                </h2>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  questionData?.difficulty === 'easy' ? 'bg-success/20 text-success' :
                  questionData?.difficulty === 'hard' ? 'bg-destructive/20 text-destructive' :
                  'bg-warning/20 text-warning'
                }`}>
                  {questionData?.difficulty || difficulty}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">--:--</span>
                </div>
                <Select value={language} onValueChange={(v) => {
                  setLanguage(v);
                  setCode(questionData?.starter_code?.[v] || "");
                }}>
                  <SelectTrigger className="w-32 bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-border" onClick={handleRun} disabled={isRunning || isSubmitting}>
                  {isRunning ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <Play className="mr-2 w-4 h-4" />}
                  Run
                </Button>
                <Button className="gradient-btn border-0 text-white" onClick={handleSubmit} disabled={isRunning || isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <CheckCircle className="mr-2 w-4 h-4" />}
                  Submit
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid lg:grid-cols-5 gap-4 min-h-0">
              {/* Problem Panel */}
              <div className="lg:col-span-2 glass rounded-2xl p-6 overflow-y-auto">
                <Tabs defaultValue="description">
                  <TabsList className="bg-card border border-border mb-4">
                    <TabsTrigger value="description" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                      <FileText className="w-4 h-4 mr-2" />
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="hints" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Hints
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-6">
                    <div>
                      <p className="text-foreground leading-relaxed whitespace-pre-line">
                        {questionData?.problem_statement}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {questionData?.examples?.map((example: any, i: number) => (
                        <div key={i} className="bg-card rounded-xl p-4">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Example {i + 1}:
                          </p>
                          <div className="space-y-1 font-mono text-sm">
                            <p className="text-muted-foreground">
                              <span className="text-primary">Input:</span> {example.input}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="text-primary">Output:</span> {example.output}
                            </p>
                            {example.explanation && (
                              <p className="text-muted-foreground">
                                <span className="text-primary">Explanation:</span> {example.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Constraints:
                      </p>
                      <ul className="space-y-1">
                        {questionData?.constraints?.map((c: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground font-mono">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="hints" className="space-y-4">
                    {questionData?.hints?.map((hint: string, i: number) => (
                      <div key={i} className="bg-card rounded-xl p-4">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-primary font-medium">Hint {i + 1}:</span> {hint}
                        </p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Code Editor Panel */}
              <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
                <div className="flex-1 glass rounded-2xl p-4 overflow-hidden flex flex-col min-h-0">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                    <Terminal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Code Editor</span>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 bg-card rounded-xl p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border overflow-auto"
                    spellCheck={false}
                  />
                </div>

                {/* Results Panel */}
                {showResults && (
                  <div className="glass rounded-2xl p-4 max-h-64 overflow-y-auto">
                    <Tabs defaultValue={submitResult ? "results" : "output"}>
                      <TabsList className="bg-card border border-border mb-4">
                        <TabsTrigger value="output" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                          Run Output
                        </TabsTrigger>
                        {submitResult && (
                          <TabsTrigger value="results" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                            Submit Results
                          </TabsTrigger>
                        )}
                      </TabsList>

                      <TabsContent value="output">
                        {isRunning ? (
                          <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary"/></div>
                        ) : runResult ? (
                          <div className="bg-card rounded-xl p-4 font-mono text-sm space-y-2">
                            {runResult.error && <p className="text-destructive">{runResult.error}</p>}
                            {runResult.compile_output && <p className="text-destructive whitespace-pre-wrap">{runResult.compile_output}</p>}
                            {runResult.stderr && <p className="text-destructive whitespace-pre-wrap">{runResult.stderr}</p>}
                            {runResult.stdout && <p className="text-foreground whitespace-pre-wrap">{runResult.stdout}</p>}
                            {runResult.runtime_ms !== undefined && <p className="text-muted-foreground mt-4">Runtime: {runResult.runtime_ms}ms</p>}
                          </div>
                        ) : null}
                      </TabsContent>

                      {submitResult && (
                        <TabsContent value="results">
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className={`${submitResult.score >= 80 ? 'text-success' : submitResult.score >= 50 ? 'text-warning' : 'text-destructive'} font-medium`}>
                                Score: {submitResult.score}% ({submitResult.test_results?.test_cases_passed}/{submitResult.test_results?.test_cases_total} passed)
                              </span>
                            </div>
                            <div className="bg-card rounded-xl p-4 space-y-2">
                              <p className="text-xs text-muted-foreground mb-1">Feedback</p>
                              <p className="text-foreground text-sm">{submitResult.quality_assessment?.feedback}</p>
                            </div>
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
