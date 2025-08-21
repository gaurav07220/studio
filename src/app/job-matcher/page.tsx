
"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Briefcase, Loader2, AlertTriangle, Lightbulb } from "lucide-react";
import { jobDescriptionMatcher, type JobDescriptionMatcherOutput } from "@/ai/flows/job-description-matcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

function JobMatcherPage() {
  const [isPending, startTransition] = useTransition();
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [result, setResult] = useState<JobDescriptionMatcherOutput | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { updateLastActivity } = useAuth();

  useEffect(() => {
    updateLastActivity('/job-matcher');
  }, [updateLastActivity]);


  useEffect(() => {
    const resumeDataUri = searchParams.get('resume');
    if (resumeDataUri) {
      // The data URI is expected to be in the format 'data:<mimetype>;base64,<encoded_data>'
      try {
        const base64Data = resumeDataUri.split(',')[1];
        const decodedText = atob(base64Data);
        // This might not be perfect for all file types (like docx), but for text/pdf it can extract readable text.
        // For a robust solution, a server-side text extraction library would be needed.
        // For this implementation, we will assume the extracted text is sufficient for the LLM.
        setResumeText(decodedText);
      } catch (error) {
        console.error("Failed to decode resume from data URI", error);
        toast({
            variant: "destructive",
            title: "Failed to load resume",
            description: "Could not automatically load the resume content."
        });
      }
    }
  }, [searchParams, toast]);

  const handleSubmit = () => {
    if (!resumeText || !jobDescriptionText) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please paste both your resume and the job description.",
      });
      return;
    }

    startTransition(async () => {
      setResult(null);
      try {
        const res = await jobDescriptionMatcher({
          resumeText,
          jobDescriptionText,
        });
        setResult(res);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Matching Failed",
          description:
            error instanceof Error ? error.message : "An unknown error occurred.",
        });
        setResult(null);
      }
    });
  };
  
  const SkillBadge = ({ skill, variant }: { skill: string; variant: "default" | "destructive" }) => (
    <Badge variant={variant} className="text-sm py-1 px-3">{skill}</Badge>
  );

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Job Description Matcher
        </h1>
        <p className="mt-2 text-muted-foreground">
          Paste your resume and a job description to see how well you match.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Paste the full text of your resume below.</CardDescription>
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
            <CardDescription>Paste the full text of the job description.</CardDescription>
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
              Matching...
            </>
          ) : (
            <>
              <Briefcase className="mr-2 h-4 w-4" />
              Match Resume to Job
            </>
          )}
        </Button>
      </div>

      {isPending && (
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Generating Match Report...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 bg-muted rounded-md w-full animate-pulse"></div>
            <div className="h-10 bg-muted rounded-md w-5/6 animate-pulse"></div>
            <div className="h-20 bg-muted rounded-md w-full animate-pulse"></div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>Comparison of skills from your resume and the job description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                    <h3 className="font-semibold mb-3 text-green-600">Matched Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.matchedSkills.length > 0 ? (
                            result.matchedSkills.map((skill) => <SkillBadge key={skill} skill={skill} variant="default" />)
                        ) : (
                            <p className="text-sm text-muted-foreground">No direct skill matches found.</p>
                        )}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold mb-3 text-red-600">Missing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.missingSkills.length > 0 ? (
                             result.missingSkills.map((skill) => <SkillBadge key={skill} skill={skill} variant="destructive" />)
                        ) : (
                           <p className="text-sm text-muted-foreground">Great news! No missing skills were identified.</p>
                        )}
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-500"/> Resume Alignment Suggestions</CardTitle>
                 <CardDescription>How to better tailor your resume for this specific role.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {result.resumeAlignmentSuggestions}
                </div>
              </CardContent>
            </Card>
        </div>
      )}

    </div>
  );
}

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobMatcherPage />
    </Suspense>
  );
}
