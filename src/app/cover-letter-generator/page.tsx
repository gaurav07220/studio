
"use client";

import { useState, useTransition } from "react";
import { PenSquare, Loader2, Clipboard } from "lucide-react";
import { generateCoverLetter } from "@/ai/flows/cover-letter-generator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function CoverLetterGeneratorPage() {
  const [isPending, startTransition] = useTransition();
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!resumeText || !jobDescriptionText) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both your resume and the job description.",
      });
      return;
    }

    startTransition(async () => {
      setResult(null);
      try {
        const res = await generateCoverLetter({
          resumeText,
          jobDescriptionText,
        });
        setResult(res.coverLetter);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description:
            error instanceof Error ? error.message : "An unknown error occurred.",
        });
      }
    });
  };
  
  const handleCopyToClipboard = () => {
    if (result) {
        navigator.clipboard.writeText(result);
        toast({ title: "Copied to clipboard!" });
    }
  }

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          AI Cover Letter Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Create a personalized cover letter in seconds based on your resume and a job description.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Paste the full text of your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your resume here..."
              className="h-64"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Paste the job description you're applying for.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here..."
              className="h-64"
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <PenSquare className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </>
          )}
        </Button>
      </div>

      {isPending && (
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Drafting your cover letter...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 bg-muted rounded-md w-full animate-pulse"></div>
            <div className="h-40 bg-muted rounded-md w-full animate-pulse"></div>
            <div className="h-20 bg-muted rounded-md w-full animate-pulse"></div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Cover Letter</CardTitle>
            <CardDescription>Review, edit, and copy your new cover letter.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              className="h-96 whitespace-pre-wrap"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleCopyToClipboard}>
                <Clipboard className="mr-2" />
                Copy to Clipboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
