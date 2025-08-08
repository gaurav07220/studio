"use client";

import { useState, useTransition } from "react";
import { FileText, Loader2, FileUp, AlertTriangle } from "lucide-react";

import { resumeAnalysisFeedback } from "@/ai/flows/resume-analyzer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function ResumeAnalyzerPage() {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setResult(null);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF or DOCX file.",
        });
        event.target.value = "";
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload your resume to analyze.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (e) => {
          const dataUri = e.target?.result as string;
          if (dataUri) {
            const res = await resumeAnalysisFeedback({ resumeDataUri: dataUri });
            setResult(res.feedback);
          } else {
             throw new Error("Could not read file.");
          }
        };
        reader.onerror = () => {
          throw new Error("Error reading file.");
        };
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description:
            error instanceof Error ? error.message : "An unknown error occurred.",
        });
        setResult(null);
      }
    });
  };

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          AI Resume Analyzer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Upload your resume to get AI-powered feedback for improvement.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            We'll analyze your resume for ATS compatibility and keyword
            optimization. (PDF or DOCX)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="resume-file">Resume File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="resume-file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="cursor-pointer"
              />
              <Button onClick={handleSubmit} disabled={isPending || !file}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            {fileName && <p className="text-sm text-muted-foreground mt-2">Selected: {fileName}</p>}
          </div>
        </CardContent>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Analyzing your resume...
            </CardTitle>
            <CardDescription>
              Our AI is hard at work. This should only take a moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 bg-muted rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-5/6 animate-pulse"></div>
            <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse"></div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Here's our AI's feedback on your resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md bg-muted p-4">
                {result}
            </div>
          </CardContent>
        </Card>
      )}

      {!isPending && !result && (
         <Card className="border-dashed">
          <CardContent className="p-6 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium">
              Your analysis results will appear here.
            </h3>
            <p className="mt-1 text-sm">
              Upload your resume and click 'Analyze' to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
