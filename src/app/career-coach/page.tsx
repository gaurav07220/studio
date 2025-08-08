"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, User, BrainCircuit } from "lucide-react";
import { careerCoachChatbot } from "@/ai/flows/career-coach-chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CareerCoachPage() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
      try {
        const res = await careerCoachChatbot({ query: input });
        const assistantMessage: Message = {
          role: "assistant",
          content: res.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Message Failed",
          description:
            error instanceof Error ? error.message : "An unknown error occurred.",
        });
        setMessages(prev => prev.slice(0, -1)); // remove user message on error
      }
    });
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
       <header className="p-4 border-b">
        <h1 className="font-headline text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare />
          AI Career Coach
        </h1>
        <p className="text-sm text-muted-foreground">
          Ask for resume tips, job search strategies, or interview advice.
        </p>
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
                <BrainCircuit className="mx-auto h-12 w-12"/>
                <p className="mt-4">Start the conversation! Ask me anything about your career.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <BrainCircuit />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-md rounded-lg p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
               {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
             <div className="flex items-start gap-4 justify-start">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <BrainCircuit />
                    </AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-card border flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your career question..."
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
