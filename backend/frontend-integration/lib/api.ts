// lib/api.ts
// Drop this file into your frontend /lib/ folder

import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("intellihire_token") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("intellihire_token")
      localStorage.removeItem("intellihire_user")
      window.location.href = "/auth"
    }
    return Promise.reject(error)
  }
)

export default api


// ─── Auth APIs ───────────────────────────────────────────────────
export const authAPI = {
  signup: (data: { full_name: string; email: string; password: string }) =>
    api.post("/api/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),

  getMe: () => api.get("/api/auth/me"),

  logout: () => {
    localStorage.removeItem("intellihire_token")
    localStorage.removeItem("intellihire_user")
    api.post("/api/auth/logout")
  },

  googleLogin: () => {
    window.location.href = `${BASE_URL}/api/auth/google`
  },
}


// ─── Resume APIs ─────────────────────────────────────────────────
export const resumeAPI = {
  uploadAndAnalyze: (resumeFile: File, jdText: string) => {
    const formData = new FormData()
    formData.append("resume", resumeFile)
    formData.append("jd_text", jdText)
    return api.post("/api/resume/upload-and-analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  getHistory: () => api.get("/api/resume/history"),

  getDetails: (resumeId: number) => api.get(`/api/resume/${resumeId}`),
}


// ─── Interview APIs ───────────────────────────────────────────────
export const interviewAPI = {
  start: (data: { resume_id: number; mode: string; job_role: string; difficulty?: string }) =>
    api.post("/api/interview/start", data),

  submitTextAnswer: (data: {
    interview_id: number
    question: string
    answer: string
    question_meta: object
  }) => api.post("/api/interview/answer/text", data),

  submitVoiceAnswer: (
    interviewId: number,
    question: string,
    questionMeta: object,
    audioBlob: Blob,
    fileExtension: string = "wav"
  ) => {
    const formData = new FormData()
    formData.append("interview_id", String(interviewId))
    formData.append("question", question)
    formData.append("question_meta", JSON.stringify(questionMeta))
    formData.append("audio", audioBlob, `recording.${fileExtension}`)
    return api.post("/api/interview/answer/voice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  analyzeFrame: (frameBlob: Blob) => {
    const formData = new FormData()
    formData.append("frame", frameBlob, "frame.jpg")
    return api.post("/api/interview/analyze-frame", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  endInterview: (interviewId: number, frameResults: object[] = []) =>
    api.post("/api/interview/end", { interview_id: interviewId, frame_results: frameResults }),

  getHistory: () => api.get("/api/interview/history"),
}


// ─── Coding APIs ──────────────────────────────────────────────────
export const codingAPI = {
  generateQuestion: (data: {
    source: string
    jd_text?: string
    company?: string
    difficulty: string
    language: string
    question_type: string
    interview_id?: number
  }) => api.post("/api/coding/generate-question", data),

  runCode: (data: { language: string; source_code: string; stdin?: string }) =>
    api.post("/api/coding/run", data),

  submitCode: (data: {
    interview_id?: number
    problem_title: string
    difficulty: string
    language: string
    source_code: string
    test_cases: Array<{ input: string; expected_output: string }>
  }) => api.post("/api/coding/submit", data),

  getHistory: () => api.get("/api/coding/history"),
}


// ─── Report APIs ──────────────────────────────────────────────────
export const reportAPI = {
  generate: (data: { interview_id: number; resume_id?: number }) =>
    api.post("/api/report/generate", data),

  get: (reportId: number) => api.get(`/api/report/${reportId}`),

  list: () => api.get("/api/report/"),
}


// ─── Analytics APIs ───────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => api.get("/api/analytics/dashboard"),

  getPerformance: () => api.get("/api/analytics/performance"),
}
