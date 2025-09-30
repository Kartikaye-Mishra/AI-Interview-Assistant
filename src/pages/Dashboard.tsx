import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { MessageCircle, Users } from "lucide-react";

import { MainHeader } from "../components/MainHeader/MainHeader";
import IntervieweeChat  from "../components/IntervieweeChat/IntervieweeChat";
import { InterviewerDashboard } from "../components/InterviewerDashboard/InterviewerDashboard";

export default function Dashboard() {
  // Mocking the user for the header, since authentication is removed
  const user = { name: "Guest User" }; // Keep a mock user for display

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Header (Standalone Component) */}
      <MainHeader user={user} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
          <Tabs defaultValue="interviewee" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 m-6 mb-0">
              <TabsTrigger
                value="interviewee"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Interviewee</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="interviewer"
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Interviewer</span>
                <span className="sm:hidden">Dashboard</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6 pt-4">
              <TabsContent value="interviewee" className="mt-0">
                <IntervieweeChat />
              </TabsContent>

              <TabsContent value="interviewer" className="mt-0">
                <InterviewerDashboard />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </motion.div>
  );
}