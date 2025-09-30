import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // http://localhost:5000
interface EvaluatePayload {
  role?: string;
  resumeVerdict: string;
  answers: { questionId: number; answer: string; difficulty: string }[];
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Resume parsing API call
export const parseResumeAPI = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post("/api/resume/parse", formData); 
};

// Fetch interview questions API call
export const fetchInterviewQuestions = () => {
  // Send parsedFields to backend if required
  return axiosInstance.get("/api/interview/questions");
};


export const submitInterviewEvaluation = (payload: EvaluatePayload) => {
  return axiosInstance.post("/api/evaluate", payload, {
    headers: { "Content-Type": "application/json" },
  });
};