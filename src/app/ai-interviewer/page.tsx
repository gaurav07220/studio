
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { ClipboardList, Loader2, Send, User, BrainCircuit, Mic, Square, FileText, Lock, Star } from "lucide-react";
import { conductInterview } from "@/ai/flows/ai-interviewer";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { InterviewReport } from "@/components/interview-report";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";


interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

const INTERVIEW_COMPLETE_SIGNAL = "INTERVIEW_COMPLETE";

export default function AiInterviewerPage() {
  const [isPending, startTransition] = useTransition();
  const [jobDescription, setJobDescription] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [report, setReport] = useState("");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { updateLastActivity, profile } = useAuth();
  const isProUser = profile?.plan === 'pro';

  useEffect(() => {
    updateLastActivity('/ai-interviewer');
  }, [updateLastActivity]);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, report]);
  
  const handleStartRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Your browser does not support voice recognition.',
      });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (input.trim()) {
        handleSubmitMessage();
      }
    };
    
    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
         setInput(prev => prev + finalTranscript + ' ');
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      toast({
        variant: 'destructive',
        title: 'Voice Recognition Error',
        description: event.error,
      });
      setIsRecording(false);
    };

    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.audioUrl) {
      playAudio(lastMessage.audioUrl);
    }
  }, [messages]);

  const handleStartInterview = () => {
    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Job Description is required",
        description: "Please paste the job description to start the interview.",
      });
      return;
    }
    setInterviewStarted(true);
    setMessages([]);
    setReport("");
    setInterviewFinished(false);
    setShowUpgradePrompt(false);
    
    startTransition(async () => {
        try {
            const res = await conductInterview({
                jobDescription,
                history: []
            });
            const audioRes = await textToSpeech(res.response);
            const assistantMessage: Message = { role: "assistant", content: res.response, audioUrl: audioRes.media };
            setMessages([assistantMessage]);
        } catch(e) {
            toast({
                variant: "destructive",
                title: "Error starting interview",
                description: e instanceof Error ? e.message : "An unknown error occurred",
            });
            setInterviewStarted(false);
        }
    });
  };

  const handleSubmitMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    // Free user trial limit check
    const userAnswersCount = newMessages.filter(m => m.role === 'user').length;
    if (!isProUser && userAnswersCount >= 1) {
        setShowUpgradePrompt(true);
        return;
    }

    startTransition(async () => {
      try {
        const res = await conductInterview({
          jobDescription,
          history: newMessages.map(m => `${m.role}: ${m.content}`),
        });

        if (res.response.startsWith(INTERVIEW_COMPLETE_SIGNAL)) {
          const feedback = res.response.replace(INTERVIEW_COMPLETE_SIGNAL, "").trim();
          setReport(feedback);
          setInterviewFinished(true);
          const finalAssistantText = "Thank you for completing the interview. Here is your feedback report.";
          const audioRes = await textToSpeech(finalAssistantText);
          setMessages(prev => [...prev, {role: 'assistant', content: finalAssistantText, audioUrl: audioRes.media}]);
        } else {
          const audioRes = await textToSpeech(res.response);
          const assistantMessage: Message = { role: "assistant", content: res.response, audioUrl: audioRes.media };
          setMessages((prev) => [...prev, assistantMessage]);
        }

      } catch (error) => {
        toast({
          variant: "destructive",
          title: "Message Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
        setMessages(newMessages.slice(0, -1)); // remove user message on error
      }
    });
  };
  
  const handleEndInterview = () => {
    if (!isProUser) {
        setShowUpgradePrompt(true);
        return;
    }

    startTransition(async () => {
        try {
            const endMessage: Message = { role: "user", content: "Please end the interview and provide the report." };
            const newMessages = [...messages, endMessage];
            setMessages(newMessages);

            const res = await conductInterview({
              jobDescription,
              history: newMessages.map(m => `${m.role}: ${m.content}`),
            });
            const feedback = res.response.replace(INTERVIEW_COMPLETE_SIGNAL, "").trim();
            setReport(feedback);
            setInterviewFinished(true);
        } catch (error) {
            toast({
              variant: "destructive",
              title: "Failed to generate report.",
              description: error instanceof Error ? error.message : "An unknown error occurred.",
            });
        }
    });
  }

  const UpgradePrompt = () => (
     <div className="p-4 border-t bg-amber-50 border-amber-200">
        <Card className="shadow-none border-amber-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800"><Star className="text-amber-500" /> Unlock Your Full Potential</CardTitle>
                <CardDescription>You've completed your free question. Upgrade to Pro to continue the interview and get a full performance report.</CardDescription>
            </CardHeader>
            <CardFooter className="gap-4">
                <Button asChild>
                    <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
                 <Button variant="ghost" onClick={() => setInterviewStarted(false)}>
                    Start New Interview
                </Button>
            </CardFooter>
        </Card>
     </div>
  );

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">AI Mock Interviewer</h1>
        <p className="mt-2 text-muted-foreground">
          Practice your interview skills against an AI tailored to a specific job. Get one free question, or upgrade to Pro for unlimited practice.
        </p>
      </header>

      {!interviewStarted ? (
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Paste the job description you want to interview for.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste job description here..."
              className="h-64"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartInterview} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 animate-spin" /> : <ClipboardList className="mr-2" />}
              Start Interview
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="flex flex-col h-[70vh]">
          <CardHeader>
            <CardTitle>Interview in Progress</CardTitle>
            <CardDescription>Role: Based on the provided job description.</CardDescription>
          </CardHeader>

          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <CardContent className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 border-2 border-primary"><AvatarFallback className="bg-primary text-primary-foreground"><BrainCircuit className="h-5 w-5"/></AvatarFallback></Avatar>
                  )}
                  <div className={cn("max-w-md rounded-lg px-4 py-2 text-sm", message.role === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none")}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8"><AvatarFallback><User className="h-5 w-5" /></AvatarFallback></Avatar>
                  )}
                </div>
              ))}
              {isPending && messages[messages.length-1]?.role === 'user' && !showUpgradePrompt && (
                  <div className="flex items-start gap-3 justify-start">
                      <Avatar className="h-8 w-8 border-2 border-primary"><AvatarFallback className="bg-primary text-primary-foreground"><BrainCircuit className="h-5 w-5"/></AvatarFallback></Avatar>
                      <div className="max-w-xs rounded-lg p-3 bg-muted flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>
                      </div>
                  </div>
              )}
            </CardContent>
          </ScrollArea>
          
          {showUpgradePrompt ? (
            <UpgradePrompt />
          ) : !interviewFinished ? (
            <CardFooter className="p-4 border-t">
              <form onSubmit={handleSubmitMessage} className="flex items-center gap-2 w-full">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRecording ? "Listening..." : "Your answer..."}
                  disabled={isPending}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button type="submit" disabled={isPending || !input.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
                {!isRecording ? (
                  <Button type="button" onClick={handleStartRecording} disabled={isPending} size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleStopRecording} disabled={isPending} size="icon" variant="destructive">
                    <Square className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="destructive" onClick={handleEndInterview} disabled={isPending} type="button">
                    {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Square className="mr-2" />}
                    End Interview
                </Button>
              </form>
            </CardFooter>
          ) : (
            <CardFooter className="p-4 border-t">
                 <Button onClick={() => setInterviewStarted(false)}>
                    Start New Interview
                </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {interviewFinished && report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Interview Report</CardTitle>
            <CardDescription>Your performance feedback and suggestions for improvement.</CardDescription>
          </CardHeader>
          <CardContent>
            <InterviewReport markdown={report} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    