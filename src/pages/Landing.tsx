"use client";

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card,  CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Sparkles, MessageCircle, Users, Zap, Shield, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
    const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">AI Interview Assistant</h1>
                <p className="text-xs text-muted-foreground">Crisp</p>
              </div>
            </div>
            <Button onClick={()=>navigate("/auth")} className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant="secondary" className="mb-6">
              Powered by AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Master Your
              <span className="text-primary"> Interview Skills</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Practice with AI-powered interviews, get real-time feedback, and boost your confidence 
              for technical and behavioral interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={()=>navigate("/auth")}  size="lg" className="gap-2 text-base px-8">
                Start Practicing
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive interview preparation 
              for both candidates and interviewers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="h-full border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Interactive Chat</CardTitle>
                <CardDescription>
                  Practice with AI in real-time conversations that adapt to your responses
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="h-full border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Get detailed insights and feedback on your interview performance
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="h-full border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Dual Interface</CardTitle>
                <CardDescription>
                  Switch between interviewee and interviewer modes seamlessly
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="h-full border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Instant Feedback</CardTitle>
                <CardDescription>
                  Receive immediate suggestions and improvements during practice
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="h-full border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your practice sessions and data are completely secure and private
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="h-full border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
                <CardDescription>
                  Advanced AI technology that learns and adapts to your needs
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have improved their interview skills 
              with our AI-powered platform.
            </p>
            <Button size="lg" className="gap-2 text-base px-8">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold">AI Interview Assistant</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
