"use client";

import { useState, useTransition } from "react";
import { Users, Loader2 } from "lucide-react";
import { generateNetworkingRecommendations } from "@/ai/flows/network-connector";
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

export default function NetworkConnectorPage() {
  const [isPending, startTransition] = useTransition();
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [jobPreferences, setJobPreferences] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!skills || !experience || !jobPreferences) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out all fields to get recommendations.",
      });
      return;
    }

    startTransition(async () => {
      setResult(null);
      try {
        const res = await generateNetworkingRecommendations({
          skills,
          experience,
          jobPreferences,
        });
        setResult(res.recommendations);
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
          Network Connector
        </h1>
        <p className="mt-2 text-muted-foreground">
          Get personalized recommendations for LinkedIn connections and groups.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Tell us about your professional background and goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Your Skills</Label>
            <Input
              id="skills"
              placeholder="e.g., React, Node.js, Product Management"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Your Experience</Label>
            <Textarea
              id="experience"
              placeholder="Briefly describe your work experience. e.g., 5 years as a software engineer at a SaaS company."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-preferences">Job Preferences</Label>
            <Input
              id="job-preferences"
              placeholder="e.g., Senior Frontend Developer roles in the fintech industry"
              value={jobPreferences}
              onChange={(e) => setJobPreferences(e.target.value)}
            />
          </div>
           <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Generating recommendations...
            </CardTitle>
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
            <CardTitle>Networking Recommendations</CardTitle>
            <CardDescription>
              Here are some personalized suggestions to grow your network.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md bg-muted p-4">
                {result}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
