// src/components/interview/ResumeParsingLoader.tsx
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // optional spinner icon
import { Card, CardContent } from "../../components/ui/card";

interface ResumeParsingLoaderProps {
  message?: string;
}

export function ResumeParsingLoader({ message = "Parsing your resume..." }: ResumeParsingLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="flex justify-center items-center h-[60vh]"
    >
      <Card className="border-0">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-center text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
