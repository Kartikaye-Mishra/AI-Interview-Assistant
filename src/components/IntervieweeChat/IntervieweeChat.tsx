
import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import { ResumeUpload } from "./ResumeUpload";
import { ResumeParsingLoader } from "./ResumeParsingLoader";
import { ResumeFieldsForm } from "./ResumeFieldsForm";

// Local types
type Message = { id: string; role: "ai" | "user"; text: string };
type Fields = { name: string; email: string; phone: string };

export function IntervieweeChat() {
  // --- STATE ---
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([
    {
      id: "welcome",
      role: "ai",
      text:
        "Welcome! Upload your resume to begin. You'll get 6 timed questions with real-time guidance.",
    },
  ]);

  const [welcomeBackOpen, setWelcomeBackOpen] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [showFieldsForm, setShowFieldsForm] = useState(false);
  const [parsedFields, setParsedFields] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
  });

  const totalQuestions = 6;

  // --- SESSION PERSISTENCE (Welcome Back check) ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem("interviewSession");
      if (!raw) return;
      const session = JSON.parse(raw) as {
        isActive: boolean;
        currentQuestion: number;
        timeLeft: number;
        messages: Array<Message>;
      } | null;

      if (session && session.isActive) {
        setWelcomeBackOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleResumeSession = useCallback(() => {
    try {
      const raw = localStorage.getItem("interviewSession");
      if (!raw) {
        setWelcomeBackOpen(false);
        return;
      }
      const session = JSON.parse(raw);
      setIsActive(!!session.isActive);
      setCurrentQuestion(session.currentQuestion || 1);
      setTimeLeft(
        typeof session.timeLeft === "number" && session.timeLeft > 0
          ? session.timeLeft
          : 60
      );
      setMessages(
        Array.isArray(session.messages) && session.messages.length > 0
          ? session.messages
          : [
              {
                id: "resumed",
                role: "ai",
                text: "Resuming your interview. Continue where you left off.",
              },
            ]
      );
    } finally {
      setWelcomeBackOpen(false);
    }
  }, []);

  const handleStartNew = useCallback(() => {
    localStorage.removeItem("interviewSession");
    setIsActive(false);
    setCurrentQuestion(1);
    setTimeLeft(60);
    setMessages([
      {
        id: "welcome",
        role: "ai",
        text:
          "Welcome! Upload your resume to begin. You'll get 6 timed questions with real-time guidance.",
      },
    ]);
    setWelcomeBackOpen(false);
    // reset pre-interview states too
    setResumeFile(null);
    setParsedFields({ name: "", email: "", phone: "" });
    setShowFieldsForm(false);
    setParsing(false);
  }, []);

  // Persist session when active
  useEffect(() => {
    if (!isActive) return;
    const data = { isActive, currentQuestion, timeLeft, messages };
    try {
      localStorage.setItem("interviewSession", JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [isActive, currentQuestion, timeLeft, messages]);

  // --- TIMER ---
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isActive, timeLeft]);

  const difficulty = useMemo(() => {
    if (currentQuestion <= 2) return "Easy";
    if (currentQuestion <= 4) return "Medium";
    return "Hard";
  }, [currentQuestion]);

  // --- RESUME PARSING (calls your backend endpoint or proxy) ---
  const parseResume = async (file: File) => {
    setParsing(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      // IMPORTANT: this should point to your backend endpoint (not directly to an API key)
      const res = await fetch(import.meta.env.VITE_APP_GEMINI_API!, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Parse API error:", res.status, text);
        throw new Error(`Parse API returned ${res.status}`);
      }

      // be defensive about JSON parsing
      const text = await res.text();
      if (!text) {
        throw new Error("Empty response from parse API");
      }
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON from parse API:", text);
        throw err;
      }

      setParsedFields({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    } catch (err) {
      console.error("Resume parsing failed:", err);
      // keep parsedFields empty so user can manually fill
      setParsedFields({ name: "", email: "", phone: "" });
    } finally {
      setParsing(false);
    }
  };

  // Called when user confirms fields -> start interview
  const handleConfirmFields = (fields: Fields) => {
    setParsedFields(fields);
    setIsActive(true);
    setTimeLeft(60);
    setMessages([
      {
        id: "q1",
        role: "ai",
        text:
          "Question 1: Briefly introduce yourself and highlight one project from your resume you're most proud of.",
      },
    ]);
  };

  // --- INTERVIEW SEND / PROGRESSION ---
  const handleSend = () => {
    if (!answer.trim() || timeLeft <= 0) return;
   const nextMessages: Message[] = [
  ...messages,
  { id: crypto.randomUUID(), role: "user" as const, text: answer.trim() },
];
setMessages(nextMessages);
    setAnswer("");

    if (currentQuestion < totalQuestions) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setTimeLeft(60);
      setMessages([
        ...nextMessages,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text:
            nextQ === 2
              ? "Question 2: Describe a challenging bug you fixed. What was the root cause and resolution?"
              : nextQ === 3
              ? "Question 3: Explain the time and space complexity of your favorite sorting algorithm."
              : nextQ === 4
              ? "Question 4: How would you design a rate limiter for a web API?"
              : nextQ === 5
              ? "Question 5: Tell me about a time you received critical feedback. How did you respond?"
              : "Question 6: Design a simple URL shortener—what components and data models would you use?",
        },
      ]);
    } else {
      setIsActive(false);
      setMessages([
        ...nextMessages,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text:
            "Great job! Your interview session is complete. You'll receive feedback and next steps shortly.",
        },
      ]);
      localStorage.removeItem("interviewSession");
    }
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <>
      {/* Welcome Back Modal */}
      <Dialog open={welcomeBackOpen} onOpenChange={setWelcomeBackOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome Back!</DialogTitle>
            <DialogDescription>
              It looks like you have an unfinished interview session from your
              last visit. Would you like to resume where you left off or start a
              new interview?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={handleStartNew}>
              Start New Interview
            </Button>
            <Button onClick={handleResumeSession}>Resume Session</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Render Sections */}
      {!isActive && !showFieldsForm ? (
        parsing ? (
          // show loader while parsing
          <ResumeParsingLoader message="Parsing your resume..." />
        ) : (
          <ResumeUpload
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            parsing={parsing}
            onParse={() => {
              if (!resumeFile) return;
              // parseResume flips parsing state internally
              parseResume(resumeFile).then(() => {
                setShowFieldsForm(true);
              });
            }}
          />
        )
      ) : !isActive && showFieldsForm ? (
        <ResumeFieldsForm
          parsedFields={parsedFields}
          onConfirm={(fields) => {
            handleConfirmFields(fields);
          }}
        />
      ) : (
        // Active Interview
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <Card className="border-0 h-[70vh] md:h-[65vh] flex flex-col overflow-hidden">
            {/* Sticky Top Bar */}
            <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestion}/{totalQuestions} — {difficulty}
                </div>
                <div className="text-sm font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                  {minutes}m:{seconds}s
                </div>
              </div>
            </div>

            {/* Scrollable Chat */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "ai" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "ai"
                        ? "bg-muted text-foreground rounded-tl-md"
                        : "bg-primary text-primary-foreground rounded-tr-md"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Input */}
            <div className="sticky bottom-0 bg-card/90 backdrop-blur-sm border-t px-4 py-3">
              <div className="flex gap-2">
                <Input
                  placeholder={
                    timeLeft > 0 ? "Type your answer..." : "Time is up for this question."
                  }
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={timeLeft <= 0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button onClick={handleSend} disabled={!answer.trim() || timeLeft <= 0}>
                  Send
                </Button>
              </div>
              {timeLeft <= 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Time's up. Your next question will begin after submitting your
                  last answer.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </>
  );
}
