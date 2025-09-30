// src/components/interview/ResumeUpload.tsx
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ResumeUploadProps {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  onParse: () => void;
  parsing?: boolean;
}

export function ResumeUpload({ resumeFile, setResumeFile, onParse, parsing }: ResumeUploadProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && /pdf|doc|docx/i.test(file.type) || /\.(pdf|docx?)$/i.test(file.name)) {
      setResumeFile(file);
    }
  };

  return (
    <motion.div className="space-y-6">
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Your Resume (PDF/DOCX)</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We will extract Name, Email, and Phone to begin the 6-question interview.
        </p>
      </div>

      <Card className="border-0">
        <CardContent className="p-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 bg-muted/30 text-center"
          >
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Drag & drop your resume here, or choose a file
            </p>
            <label className="inline-flex items-center gap-3">
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file) setResumeFile(file);
                }}
              />
            </label>
            {resumeFile && (
              <p className="mt-3 text-sm">
                Selected: <span className="font-medium">{resumeFile.name}</span>
              </p>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <Button onClick={onParse} disabled={!resumeFile}>
              {parsing ? "Parsing Resume..." : "Parse Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
