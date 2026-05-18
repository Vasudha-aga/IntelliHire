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
} from "lucide-react"

type CodingState = "setup" | "coding"

const companies = ["Google", "Amazon", "Microsoft", "Flipkart", "Uber", "Meta", "Netflix", "Apple"]

const languages = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
]

const problemStatement = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`

const examples = [
  {
    input: "nums = [2,7,11,15], target = 9",
    output: "[0,1]",
    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
  },
  {
    input: "nums = [3,2,4], target = 6",
    output: "[1,2]",
    explanation: "nums[1] + nums[2] == 6",
  },
]

const constraints = [
  "2 <= nums.length <= 10^4",
  "-10^9 <= nums[i] <= 10^9",
  "-10^9 <= target <= 10^9",
  "Only one valid answer exists.",
]

const starterCode = `def twoSum(nums: List[int], target: int) -> List[int]:
    # Your code here
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []`

const testCases = [
  { input: "[2,7,11,15], target=9", expected: "[0, 1]", actual: "[0, 1]", passed: true },
  { input: "[3,2,4], target=6", expected: "[1, 2]", actual: "[1, 2]", passed: true },
  { input: "[3,3], target=6", expected: "[0, 1]", actual: "[0, 1]", passed: true },
  { input: "[1,5,3,7], target=8", expected: "[1, 3]", actual: "[]", passed: false },
  { input: "[0,4,3,0], target=0", expected: "[0, 3]", actual: "[0, 3]", passed: true },
]

export default function CodingPage() {
  const [state, setState] = useState<CodingState>("setup")
  const [questionSource, setQuestionSource] = useState<"jd" | "company">("jd")
  const [company, setCompany] = useState("")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionType, setQuestionType] = useState<"random" | "pyq">("random")
  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState(starterCode)
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = () => {
    setState("coding")
  }

  const handleRun = () => {
    setShowResults(true)
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
              >
                <Rocket className="mr-2 w-5 h-5" />
                Generate Question
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-180px)] flex flex-col">
            {/* Top Bar */}
            <div className="glass rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-heading font-semibold text-foreground">
                  Two Sum
                </h2>
                <span className="px-2.5 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium">
                  Medium
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">25:30</span>
                </div>
                <Select value={language} onValueChange={setLanguage}>
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
                <Button variant="outline" className="border-border" onClick={handleRun}>
                  <Play className="mr-2 w-4 h-4" />
                  Run
                </Button>
                <Button className="gradient-btn border-0 text-white">
                  <CheckCircle className="mr-2 w-4 h-4" />
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
                    <TabsTrigger value="similar" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Similar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="space-y-6">
                    <div>
                      <p className="text-foreground leading-relaxed whitespace-pre-line">
                        {problemStatement}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {examples.map((example, i) => (
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
                        {constraints.map((c, i) => (
                          <li key={i} className="text-sm text-muted-foreground font-mono">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="hints" className="space-y-4">
                    <div className="bg-card rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">Hint 1:</span> Think about using a hash map to store previously seen numbers.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">Hint 2:</span> For each number, check if target - current number exists in the hash map.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="similar" className="space-y-2">
                    <div className="bg-card rounded-xl p-4 flex items-center justify-between">
                      <span className="text-sm text-foreground">3Sum</span>
                      <span className="text-xs text-warning">Medium</span>
                    </div>
                    <div className="bg-card rounded-xl p-4 flex items-center justify-between">
                      <span className="text-sm text-foreground">4Sum</span>
                      <span className="text-xs text-warning">Medium</span>
                    </div>
                    <div className="bg-card rounded-xl p-4 flex items-center justify-between">
                      <span className="text-sm text-foreground">Two Sum II</span>
                      <span className="text-xs text-warning">Medium</span>
                    </div>
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
                    <Tabs defaultValue="testcases">
                      <TabsList className="bg-card border border-border mb-4">
                        <TabsTrigger value="testcases" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                          Test Cases
                        </TabsTrigger>
                        <TabsTrigger value="output" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                          Output
                        </TabsTrigger>
                        <TabsTrigger value="results" className="data-[state=active]:gradient-btn data-[state=active]:text-white">
                          Results
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="testcases">
                        <div className="space-y-2">
                          {testCases.map((tc, i) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                tc.passed ? "bg-success/10" : "bg-destructive/10"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {tc.passed ? (
                                  <CheckCircle2 className="w-4 h-4 text-success" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-destructive" />
                                )}
                                <span className="font-mono text-xs text-muted-foreground">
                                  {tc.input}
                                </span>
                              </div>
                              <span className={`font-mono text-xs ${tc.passed ? "text-success" : "text-destructive"}`}>
                                {tc.actual}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="output">
                        <div className="bg-card rounded-xl p-4 font-mono text-sm">
                          <p className="text-muted-foreground">Runtime: 45ms</p>
                          <p className="text-muted-foreground">Memory: 16.2 MB</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="results">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <span className="text-success font-medium">4/5 Test Cases Passed</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-card rounded-xl p-4">
                              <p className="text-xs text-muted-foreground mb-1">Runtime</p>
                              <p className="text-foreground font-medium">45ms (beats 78%)</p>
                            </div>
                            <div className="bg-card rounded-xl p-4">
                              <p className="text-xs text-muted-foreground mb-1">Complexity</p>
                              <p className="text-foreground font-medium">O(n)</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
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
