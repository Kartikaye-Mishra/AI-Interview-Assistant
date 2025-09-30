// assistant/src/types/interview.ts

export const FlowStep  = {
  UploadResume : "uploadResume",
  ParsingResume : "parsingResume",
  FieldsForm : "fieldsForm",
  GettingQuestions : "gettingQuestions",
  Interview : "interview",
  Completed : "completed",
} 

export interface InterviewSession {
  fields: Record<string, string>;
  questions: string[];
  messages: { sender: "user" | "bot"; text: string }[];
  currentQuestionIndex: number;
  timeLeft: number;
  interviewCompleted: boolean;
}

export type BackendResult = {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  aiScore: number;
  aiJustification: string;
  answer?: string;
};

export type CandidateEntry = {
  id: string; // unique per candidate, can use crypto.randomUUID()
  name: string;
  email: string;
  phone?: string;
  resumeFileName?: string;
  finalScore: number; // from backend
  status: "Complete" | "In Progress";
  history: {
    question: string;
    answer: string;
    difficulty: string;
    aiScore: number;
    aiJustification: string;
  }[];
  summary: string; // finalVerdict from backend
};

