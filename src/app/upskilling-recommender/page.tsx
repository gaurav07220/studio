
"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, Loader2 } from "lucide-react";
import { upskillingRecommender, type UpskillingRecommenderOutput } from "@/ai/flows/upskilling-recommender";
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
import { Input } from "@/components/ui/input";

export default function UpskillingRecommenderPage() {
  const [isPending, startTransition] = useTransition();
  const [skillGaps, setSkillGaps] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [preferredPlatforms, setPreferredPlatforms] = useState("");
  const [result, setResult] = useState<UpskillingRecommenderOutput | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const gaps = searchParams.get("skillGaps");
    if (gaps) {
      setSkillGaps(gaps);
    }
  }, [searchParams]);

  const handleSubmit = () => {
    if (!skillGaps || !careerGoals) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out Skill Gaps and Career Goals.",
      });
      return;
    }

    startTransition(async () => {
      setResult(null);
      try {
        const res = await upskillingRecommender({
          skillGaps,
          careerGoals,
          preferredPlatforms,
        });
        setResult(res);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Generation Failed",
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
          Upskilling Recommender
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find courses and certifications to bridge your skill gaps and achieve your career goals.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your Learning Needs</CardTitle>
          <CardDescription>
            Tell us what you want to learn and where you want to go in your career.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-gaps">Skill Gaps</Label>
            <Textarea
              id="skill-gaps"
              placeholder="e.g., Advanced JavaScript, Cloud computing (AWS), Data visualization"
              value={skillGaps}
              onChange={(e) => setSkillGaps(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="career-goals">Career Goals</Label>
            <Textarea
              id="career-goals"
              placeholder="e.g., Become a Senior Full-Stack Developer within 2 years, transition to a Machine Learning Engineer role."
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platforms">Preferred Learning Platforms (Optional)</Label>
            <Input
              id="platforms"
              placeholder="e.g., Coursera, Udemy, edX"
              value={preferredPlatforms}
              onChange={(e) => setPreferredPlatforms(e.target.value)}
            />
          </div>
           <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Resources...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle><div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div></CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle><div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div></CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                </CardContent>
            </Card>
        </div>
      )}
      
      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {result.courseRecommendations}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Certification Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {result.certificationRecommendations}
              </div>
            </CardContent>
          </Card>
          {result.additionalResources && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                    {result.additionalResources}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

    </div>
  );
}
