
import { FlowStep } from "../../types/interview";
import { useInterviewChat } from "../../hooks/useInterviewChat";

import { ResumeUpload } from "./ResumeUpload";
import { ResumeParsingLoader } from "./ResumeParsingLoader";
import { ResumeFieldsForm } from "./ResumeFieldsForm";
import { InterviewChatArea } from "./InterviewChatArea";
import { InterviewComplete } from "./InterviewComplete";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

export default function IntervieweeChat() {
  const {
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
    parseResume,
    handleConfirmFields,
    handleSend,
    handleStartNew,
    handleResumeSession,
  } = useInterviewChat();

  return (
    <div className="flex flex-col w-full h-full">
      {step === FlowStep.UploadResume && (
        <ResumeUpload
          onParse={() => {
            if (resumeFile) parseResume(resumeFile);
          }}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
        />
      )}

      {step === FlowStep.ParsingResume && <ResumeParsingLoader />}

      {step === FlowStep.FieldsForm && (
        <ResumeFieldsForm
          parsedFields={parsedFields}
          onConfirm={handleConfirmFields}
        />
      )}

      {step === FlowStep.GettingQuestions && (
        <div className="flex flex-1 items-center justify-center text-lg">
          Generating interview questions…
        </div>
      )}

      {step === FlowStep.Interview && (
        <InterviewChatArea
          messages={messages}
          answer={answer}
          setAnswer={setAnswer}
          onSend={handleSend} // ✅ match prop name in InterviewChatArea
          timeLeft={timeLeft}
          currentQuestion={currentQuestionIndex + 1} // required
          totalQuestions={questions.length} // required
          difficulty={questions[currentQuestionIndex]?.difficulty || "medium"} // required
        />
      )}

      {step === FlowStep.Completed && <InterviewComplete />}

      {/* Welcome Back Dialog */}
      <Dialog open={welcomeBackOpen} onOpenChange={setWelcomeBackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume previous interview?</DialogTitle>
          </DialogHeader>
          <p>
            We found an unfinished interview. Would you like to continue where
            you left off?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={handleStartNew}>
              Start New
            </Button>
            <Button onClick={handleResumeSession}>Resume</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
