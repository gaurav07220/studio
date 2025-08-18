
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, User, BrainCircuit, X } from "lucide-react";
import { careerCoachChatbot } from "@/ai/flows/career-coach-chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ✅ Import markdown & sanitizer
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function CareerCoachWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        'div[data-radix-scroll-area-viewport]'
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    startTransition(async () => {
      try {
        const res = await careerCoachChatbot({ query: currentInput });

        // ✅ Make AI output human-readable
        const responseText = await res.response;
        const cleanHTML = DOMPurify.sanitize(
          marked((await responseText) || "", { breaks: true })
        );

        const assistantMessage: Message = {
          role: "assistant",
          content: cleanHTML,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Message Failed",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        });
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
          aria-label="Toggle Career Coach"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl rounded-lg">
            <CardHeader className="flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <BrainCircuit />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">AI Career Coach</CardTitle>
                  <CardDescription>Ready to help</CardDescription>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <CardContent className="space-y-4 p-4 h-full">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground pt-16">
                    <BrainCircuit className="mx-auto h-12 w-12" />
                    <p className="mt-4 text-sm">
                      Start the conversation! Ask me anything about your career.
                    </p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3",
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <BrainCircuit className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-xs rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-card border rounded-bl-none prose prose-sm"
                      )}
                    >
                      {/* ✅ Render markdown as HTML */}
                      {message.role === "assistant" ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isPending && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <BrainCircuit className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs rounded-lg p-3 bg-card border flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
            <CardFooter className="p-2 border-t">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 w-full"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isPending}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  disabled={isPending || !input.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
