import React from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export type Message = { id: string; role: "ai" | "user"; text: string };

interface InterviewChatAreaProps {
  currentQuestion: number;
  totalQuestions: number;
  messages: Message[];
  answer: string;
  timeLeft: number;
  difficulty: string;
  setAnswer: (value: string) => void;
  onSend: (answer: string) => void;
}

export const InterviewChatArea: React.FC<InterviewChatAreaProps> = ({
  currentQuestion,
  totalQuestions,
  messages,
  answer,
  timeLeft,
  difficulty,
  setAnswer,
  onSend,
}) => {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
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

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "ai" ? "justify-start" : "justify-end"}`}
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

      {/* Sticky Input Area */}
      <div className="sticky bottom-0 bg-card/90 backdrop-blur-sm border-t px-4 py-3">
        <div className="flex gap-2">
          <Input
            placeholder={timeLeft > 0 ? "Type your answer..." : "Time is up for this question."}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={timeLeft <= 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(answer);
              }
            }}
          />
          <Button onClick={() => onSend(answer)} disabled={!answer.trim() || timeLeft <= 0}>
            Send
          </Button>
        </div>
        {timeLeft <= 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Time's up. Your next question will begin after submitting your last answer.
          </p>
        )}
      </div>
    </Card>
  );
};
