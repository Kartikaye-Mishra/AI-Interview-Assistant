import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";


// import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Mail, UserX } from "lucide-react";
import {  useState } from "react";
import { useNavigate } from "react-router";




export default function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"signIn" | "otp">("signIn");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Centered Auth UI */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="min-w-[350px] pb-0 border shadow-md">
          {step === "signIn" ? (
            <>
              <CardHeader className="text-center">
                <div className="flex justify-center">
                  <img
                    src="./logo.svg"
                    alt="Logo"
                    width={64}
                    height={64}
                    className="rounded-lg mb-4 mt-4 cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                </div>
                <CardTitle className="text-xl">Get Started</CardTitle>
                <CardDescription>
                  Enter your email to log in or sign up
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      className="pl-9"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setStep("otp")}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate("/dashboard")}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Continue as Guest
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center mt-4">
                <CardTitle>Check your email</CardTitle>
                <CardDescription>
                  We've sent a code to <b>name@example.com</b>
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Input
                      key={index}
                      type="text"
                      className="w-10 text-center"
                      maxLength={1}
                    />
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-2">
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Verify code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("signIn")}
                  className="w-full"
                >
                  Use different email
                </Button>
              </CardFooter>
            </>
          )}

          <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
            Secured by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              vly.ai
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}