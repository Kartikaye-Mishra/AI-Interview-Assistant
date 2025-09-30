// hooks/useInterviewChat.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { parseResumeAPI, fetchInterviewQuestions, submitInterviewEvaluation } from "../apis/api";
import type { Message } from "../components/IntervieweeChat/InterviewChatArea";
import { saveCandidate } from "../utils/candidateStorage";
import type { BackendResult, CandidateEntry } from "../types/interview";
import { toast } from "react-hot-toast";
// ---------------- Types ----------------
export type Fields = { name: string; email: string; phone: string; resumeVerdict: string };

export type Question = { id: number; question: string; difficulty: string };


export type InterviewSession = {
  fields: Fields;
  questions: Question[];
  currentQuestionIndex: number;
  messages: Message[];
  timeLeft: number;
  interviewCompleted?: boolean;
};

// ---------------- Flow Steps ----------------
export const FlowStep = {
  UploadResume: "uploadResume",
  ParsingResume: "parsingResume",
  FieldsForm: "fieldsForm",
  GettingQuestions: "gettingQuestions",
  Interview: "interview",
  Completed: "completed",
} as const;

export type FlowStep = (typeof FlowStep)[keyof typeof FlowStep];

// ---------------- Hook ----------------
export function useInterviewChat(timeAlloted = 60) {
  // States
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [parsedFields, setParsedFields] = useState<Fields>({ name: "", email: "", phone: "", resumeVerdict: "" });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeAlloted);
  const [step, setStep] = useState<FlowStep>(FlowStep.UploadResume);
  const [parsing, setParsing] = useState(false);
  const [gettingQuestions, setGettingQuestions] = useState(false);
  const [showFieldsForm, setShowFieldsForm] = useState(false);
  const [welcomeBackOpen, setWelcomeBackOpen] = useState(false);

  // Refs
  const interviewCompletedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------- Persistence ----------------
  const persistSession = useCallback((extra: Partial<InterviewSession> = {}) => {
    const session: InterviewSession = {
      fields: parsedFields,
      questions,
      messages,
      currentQuestionIndex,
      timeLeft,
      interviewCompleted: interviewCompletedRef.current,
      ...extra,
    };
    localStorage.setItem("parsedResume", JSON.stringify(session));
  }, [parsedFields, questions, messages, currentQuestionIndex, timeLeft]);

  const loadSession = useCallback((): InterviewSession | null => {
    const raw = localStorage.getItem("parsedResume");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as InterviewSession;
    } catch {
      return null;
    }
  }, []);

  // ---------------- Handlers ----------------
  const handleStartNew = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    interviewCompletedRef.current = false;

    localStorage.removeItem("parsedResume");
    setResumeFile(null);
    setParsedFields({ name: "", email: "", phone: "", resumeVerdict: "" });
    setShowFieldsForm(false);
    setParsing(false);
    setWelcomeBackOpen(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setMessages([]);
    setAnswer("");
    setTimeLeft(timeAlloted);
    setStep(FlowStep.UploadResume);
  }, [timeAlloted]);

  const handleResumeSession = useCallback(() => {
    const session = loadSession();
    if (!session) {
      setWelcomeBackOpen(false);
      return;
    }

    // Do not resume if already completed
    if (session.interviewCompleted) {
      setWelcomeBackOpen(false);
      return;
    }

    setParsedFields(session.fields);
    setQuestions(session.questions);
    setMessages(session.messages);
    setCurrentQuestionIndex(session.currentQuestionIndex);
    setTimeLeft(session.timeLeft > 0 ? session.timeLeft : timeAlloted);
    setShowFieldsForm(!session.questions?.length);
    setWelcomeBackOpen(false);
  }, [loadSession, timeAlloted]);

  const parseResume = async (file: File) => {
    setParsing(true);
    try {
      const res = await parseResumeAPI(file);
      const data = res.data;
      const fields: Fields = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        resumeVerdict: data.resumeVerdict || "",
      };
      toast.success("Resume Parsed Successfully");
      setParsedFields(fields);
      persistSession({ fields, timeLeft: timeAlloted });
      setShowFieldsForm(true);
    }
    catch{ (err:unknown) => {
      if(err instanceof Error){
        console.log("AI Api is not Working");

      } 
       setShowFieldsForm(true);
      toast.error("AI Api is not Working")
    }

    }
     finally {
      setParsing(false);
    }
  };

const handleConfirmFields = async (fields: Fields) => {
  setParsedFields(fields);
  persistSession({ fields });
  setGettingQuestions(true);

  try {
    const res = await fetchInterviewQuestions();
    const qs: Question[] = res.data.questions || [];
    setQuestions(qs);

    if (qs.length > 0) {
      setCurrentQuestionIndex(0);
      const initMessages: Message[] = [
        { id: crypto.randomUUID(), role: "ai", text: qs[0].question },
      ];
      setMessages(initMessages);
      setTimeLeft(timeAlloted);

      persistSession({
        fields,
        questions: qs,
        messages: initMessages,
        currentQuestionIndex: 0,
        timeLeft: timeAlloted,
      });
    }
  } finally {
    setGettingQuestions(false);
  }
};

// const finalizeInterviewSession = async () => {
//   try {
//     const payload = {
//       resumeVerdict: parsedFields.resumeVerdict,
//       answers: questions.map((q, idx) => ({
//         questionId: q.id,
//         question: q.question,                        // ✅ include question text
//         answer: messages[idx * 2 + 1]?.text || "Unanswered", // user answer
//         difficulty: q.difficulty,
//       })),
//     };

  
//     const res = await submitInterviewEvaluation(payload);

//         // Construct candidate entry
//    const candidateEntry: CandidateEntry = {
//   id: crypto.randomUUID(),
//   name: parsedFields.name || "Candidate",
//   email: parsedFields.email,
//   phone: parsedFields.phone || "",
//   finalScore: res.data.totalScore,
//   status: "Complete",
//   history: res.data.results.map((r: BackendResult) => ({
//     question: r.question,
//     answer: r.answer || "Unanswered",
//     aiScore: r.aiScore,
//     aiJustification: r.aiJustification,
//     difficulty: r.difficulty,
//   })),
//   summary: res.data.finalVerdict,
// };

//     // Save to localStorage
//     saveCandidate(candidateEntry);

//     // Store final result locally
//     localStorage.setItem(
//       "interviewResult",
//       JSON.stringify({
//         id: crypto.randomUUID(),
//         name: parsedFields.name || "Candidate",
//         email: parsedFields.email,
//         finalScore: res.data.totalScore,
//         details: res.data,
//       })
//     );

//     // Mark interview as completed
//     interviewCompletedRef.current = true;
//     persistSession({ interviewCompleted: true });
//   } catch (err) {
//     console.error("Failed to finalize interview session:", err);
//   }
// };
const finalizeInterviewSession = async () => {
  const payload = {
    resumeVerdict: parsedFields.resumeVerdict,
    answers: questions.map((q, idx) => ({
      questionId: q.id,
      question: q.question,
      answer: messages[idx * 2 + 1]?.text || "Unanswered",
      difficulty: q.difficulty,
    })),
  };

  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await submitInterviewEvaluation(payload);

      // Construct candidate entry
      const candidateEntry: CandidateEntry = {
        id: crypto.randomUUID(),
        name: parsedFields.name || "Candidate",
        email: parsedFields.email,
        phone: parsedFields.phone || "",
        finalScore: res.data.totalScore,
        status: "Complete",
        history: res.data.results.map((r: BackendResult) => ({
          question: r.question,
          answer: r.answer || "Unanswered",
          aiScore: r.aiScore,
          aiJustification: r.aiJustification,
          difficulty: r.difficulty,
        })),
        summary: res.data.finalVerdict,
      };

      saveCandidate(candidateEntry);

      localStorage.setItem(
        "interviewResult",
        JSON.stringify({
          id: crypto.randomUUID(),
          name: parsedFields.name || "Candidate",
          email: parsedFields.email,
          finalScore: res.data.totalScore,
          details: res.data,
        })
      );

      interviewCompletedRef.current = true;
      persistSession({ interviewCompleted: true });

      console.log("Interview finalized successfully");
      return; // ✅ exit loop on success
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // wait before retry
      } else {
        console.error("All retry attempts failed. Interview not finalized.");
        toast.error("Failed to finalize interview. Please try again.");
      }
    }
  }
};


const handleSend = useCallback(() => {
  const userAnswer = answer.trim() || "Unanswered";

  const nextQuestionIndex = currentQuestionIndex + 1;
  const nextQ = questions[nextQuestionIndex];

  const newMessages: Message[] = [
    ...messages,
    { id: crypto.randomUUID(), role: "user", text: userAnswer },
  ];

  if (nextQ) {
    // Add next AI question
    newMessages.push({
      id: crypto.randomUUID(),
      role: "ai",
      text: nextQ.question,
    });

    setCurrentQuestionIndex(nextQuestionIndex);
    setTimeLeft(timeAlloted); // ✅ Reset timer for next question
  } else {
    interviewCompletedRef.current = true;
    setStep(FlowStep.Completed);
    setTimeLeft(0); // Ensure timer shows 0
    finalizeInterviewSession(); // API call
    localStorage.removeItem("parsedResume");
  }

  setMessages(newMessages);
  setAnswer("");

  persistSession({
    messages: newMessages,
    currentQuestionIndex: nextQuestionIndex,
    timeLeft: nextQ ? timeAlloted : 0,
    interviewCompleted: interviewCompletedRef.current,
  });
}, [answer, messages, currentQuestionIndex, questions, timeAlloted, persistSession]);


  // ---------------- Timer ----------------
useEffect(() => {
  if (!questions.length || interviewCompletedRef.current) return;

  if (intervalRef.current) clearInterval(intervalRef.current);

  intervalRef.current = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 0) {
        if (!interviewCompletedRef.current) handleSend();
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, [currentQuestionIndex, questions, handleSend]);



  // ---------------- Step Updates ----------------
  useEffect(() => {
    if (parsing) setStep(FlowStep.ParsingResume);
    else if (showFieldsForm && !questions.length && !gettingQuestions) setStep(FlowStep.FieldsForm);
    else if (gettingQuestions) setStep(FlowStep.GettingQuestions);
    else if (questions.length && !interviewCompletedRef.current) setStep(FlowStep.Interview);
    else if (!showFieldsForm && !parsing) setStep(FlowStep.UploadResume);
    else if (interviewCompletedRef.current) setStep(FlowStep.Completed);
  }, [parsing, showFieldsForm, gettingQuestions, questions, step]);

  // ---------------- Resume Prompt ----------------
  useEffect(() => {
    const session = loadSession();
    if (session && !session.interviewCompleted) {
      setWelcomeBackOpen(true);
    }
  }, [loadSession]);

  return {
    // states
    step,
    resumeFile,
    setResumeFile,
    parsedFields,
    questions,
    currentQuestionIndex,
    messages,
    answer,
    setAnswer,
    timeLeft,
    welcomeBackOpen,
    setWelcomeBackOpen,
    // handlers
    parseResume,
    handleConfirmFields,
    handleSend,
    handleStartNew,
    handleResumeSession,
  };
}
