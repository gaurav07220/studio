
"use client";

import { useState, useTransition } from "react";
import Link from 'next/link';
import { Users, Loader2, Linkedin, ArrowRight, UserSearch } from "lucide-react";
import { generateNetworkingRecommendations, type NetworkingRecommendationsOutput } from "@/ai/flows/network-connector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function NetworkConnectorPage() {
  const [isPending, startTransition] = useTransition();
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [jobPreferences, setJobPreferences] = useState("");
  const [result, setResult] = useState<NetworkingRecommendationsOutput | null>(null);
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
          Network Connector
        </h1>
        <p className="mt-2 text-muted-foreground">
          Get personalized recommendations for professionals to connect with.
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
                  <UserSearch className="mr-2 h-4 w-4" />
                  Find Contacts
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
              Searching for relevant contacts...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-2">
                  <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Networking Recommendations</CardTitle>
            <CardDescription>
              Here are some professionals you should consider connecting with.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.recommendations.map((person, index) => (
                <Card key={index} className="p-4">
                    <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 border">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">
                                {person.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="font-semibold">{person.name}</h3>
                            <p className="text-sm text-muted-foreground">{person.headline}</p>
                            <p className="text-xs text-muted-foreground mt-2 italic">"{person.reason}"</p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="mr-2"/> View Profile
                            </Link>
                        </Button>
                    </div>
                </Card>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
