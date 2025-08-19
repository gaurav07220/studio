
"use client";

import * as React from "react";
import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Loader2,
  FileUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ClipboardCheck,
  Download,
  Eye,
  ArrowRight,
  GraduationCap,
  Briefcase,
} from "lucide-react";

import {
  resumeAnalysisFeedback,
  type ResumeAnalysisOutput,
} from "@/ai/flows/resume-analyzer";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassicTemplate, ModernTemplate, CreativeTemplate, type TemplateData } from "@/components/resume-template";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "@/hooks/use-auth";


export default function ResumeAnalyzerPage() {
  const [isPending, startTransition] = useTransition();
  const [fileContent, setFileContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<ResumeAnalysisOutput | null>(null);
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const { toast } = useToast();
  const modernRef = useRef<HTMLDivElement>(null);
  const classicRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("modern");
  const { updateLastActivity } = useAuth();

  useEffect(() => {
    updateLastActivity('/resume-analyzer');
  }, [updateLastActivity]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFileName(selectedFile.name);
        setResult(null);
        setTemplateData(null);
        
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = (e) => {
          const dataUri = e.target?.result as string;
          setFileContent(dataUri);
        };
        reader.onerror = () => {
           toast({
              variant: "destructive",
              title: "File Read Error",
              description: "Could not read the selected file.",
            });
            setFileContent("");
        }

      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF or DOCX file.",
        });
        event.target.value = "";
        setFileContent("");
        setFileName("");
      }
    }
  };

  const handleSubmit = async () => {
    if (!fileContent) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload your resume to analyze.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const res = await resumeAnalysisFeedback({
          resumeDataUri: fileContent,
        });
        setResult(res);

        // Map extracted data to template data format
        const extracted = res.extractedData;
        setTemplateData({
            name: extracted.name || "Your Name",
            email: extracted.email || "your.email@example.com",
            phone: extracted.phone || "123-456-7890",
            linkedin: extracted.linkedin || "linkedin.com/in/yourprofile",
            summary: extracted.summary || "A brief professional summary.",
            experience: extracted.experience || [],
            education: extracted.education || [],
            skills: extracted.skills || [],
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        });
        setResult(null);
        setTemplateData(null);
      }
    });
  };

  const handleDownload = async () => {
    const refs = {
        modern: modernRef,
        classic: classicRef,
        creative: creativeRef,
    };
    const elementToCapture = refs[activeTab as keyof typeof refs].current;

    if (elementToCapture) {
      toast({ title: "Generating PDF...", description: "Please wait a moment." });
      try {
        const canvas = await html2canvas(elementToCapture, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`${templateData?.name || 'resume'}-${activeTab}.pdf`);
      } catch (error) {
         toast({ variant: "destructive", title: "Download Failed", description: error instanceof Error ? error.message : "Could not generate PDF." });
      }
    }
  };
  
  const renderTemplateWithRef = (TemplateComponent: React.ComponentType<{ data: TemplateData }>, ref: React.Ref<HTMLDivElement>) => {
    if (!templateData) return <div>Loading template data...</div>;
    const componentElement = <TemplateComponent data={templateData} />;
    return React.cloneElement(componentElement, { ref });
  };
  

  const renderPreviewTemplate = () => {
    if(!templateData) return <div/>;
    switch(activeTab) {
        case 'classic': return <ClassicTemplate data={templateData} />;
        case 'creative': return <CreativeTemplate data={templateData} />;
        case 'modern':
        default: return <ModernTemplate data={templateData} />;
    }
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
              <Button onClick={handleSubmit} disabled={isPending || !fileContent}>
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
            {fileName && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {fileName}
              </p>
            )}
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
        <div className="space-y-8">
          <Card>
            <CardHeader>
                <CardTitle>Take the Next Step</CardTitle>
                <CardDescription>Use your analysis results to find jobs and identify areas for growth.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Button asChild variant="outline" size="lg">
                    <Link href={`/upskilling-recommender?skillGaps=${encodeURIComponent(result.areasForImprovement.join(", "))}`}>
                        <GraduationCap className="mr-2"/>
                        Improve Your Skills
                        <ArrowRight className="ml-auto"/>
                    </Link>
                </Button>
                 <Button asChild variant="outline" size="lg">
                    <Link href={`/job-matcher?resume=${encodeURIComponent(fileContent)}`}>
                        <Briefcase className="mr-2"/>
                        Find Matching Jobs
                        <ArrowRight className="ml-auto"/>
                    </Link>
                </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analysis Report</CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>ATS Compatibility Score</Label>
                <div className="flex items-center gap-4">
                  <Progress value={result.atsCompatibilityScore} className="w-full" />
                  <span className="font-bold text-lg text-primary">
                    {result.atsCompatibilityScore}/100
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle /> Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                  {result.areasForImprovement.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles /> Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Extracted Keywords & Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {result.keywordAnalysis.extractedKeywords.map(keyword => <Badge variant="secondary" key={keyword}>{keyword}</Badge>)}
                </div>
              </div>
               <div>
                <h3 className="font-semibold mb-2">Suggestions</h3>
                <p className="text-sm text-muted-foreground">{result.keywordAnalysis.suggestions}</p>
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb /> Formatting & Readability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-muted-foreground">{result.formattingAndReadability.feedback}</p>
                <div>
                    <h3 className="font-semibold mb-2">Suggestions</h3>
                    <ul className="list-disc space-y-2 pl-5">
                        {result.formattingAndReadability.suggestions.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ClipboardCheck /> ATS-Friendly Templates</CardTitle>
              <CardDescription>
                Your resume scored {result.atsCompatibilityScore}/100 for ATS compatibility. Consider using one of these standard, parser-friendly templates to improve your score. Your extracted information has been pre-filled.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {templateData ? (
                <>
                <Tabs defaultValue="modern" onValueChange={setActiveTab} value={activeTab}>
                    <div className="flex justify-between items-center mb-4">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="modern">Modern</TabsTrigger>
                            <TabsTrigger value="classic">Classic</TabsTrigger>
                            <TabsTrigger value="creative">Creative</TabsTrigger>
                        </TabsList>
                        <div className="flex gap-2">
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Preview</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Resume Preview: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-auto">
                                        {renderPreviewTemplate()}
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download as PDF</Button>
                        </div>
                    </div>
                    <div className="h-0 overflow-hidden">
                        {/* Render templates off-screen for html2canvas */}
                        {renderTemplateWithRef(ModernTemplate, modernRef)}
                        {renderTemplateWithRef(ClassicTemplate, creativeRef)}
                        {renderTemplateWithRef(ClassicTemplate, classicRef)}
                    </div>

                    <TabsContent value="modern">
                        <ModernTemplate data={templateData} />
                    </TabsContent>
                    <TabsContent value="classic">
                        <ClassicTemplate data={templateData} />
                    </TabsContent>
                    <TabsContent value="creative">
                        <CreativeTemplate data={templateData} />
                    </TabsContent>
                </Tabs>
                </>
                ) : (
                    <div className="text-center text-muted-foreground">Loading extracted data...</div>
                )}
            </CardContent>
          </Card>

        </div>
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
