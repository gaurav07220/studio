
"use client";

import { Award, ArrowRight, Code, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const assessments = [
    {
        title: "React.js Fundamentals",
        type: "MCQ",
        icon: ListChecks,
        description: "Test your knowledge of core React concepts like components, state, props, and hooks.",
        tags: ["Frontend", "JavaScript", "React"]
    },
    {
        title: "Python Data Structures Challenge",
        type: "Coding",
        icon: Code,
        description: "Solve a series of challenges involving lists, dictionaries, sets, and tuples in Python.",
        tags: ["Backend", "Python", "Data Structures"]
    },
    {
        title: "SQL Query Master",
        type: "MCQ",
        icon: ListChecks,
        description: "Assess your ability to write complex SQL queries, including joins, subqueries, and window functions.",
        tags: ["Data", "SQL", "Database"]
    },
     {
        title: "JavaScript Algorithm Practice",
        type: "Coding",
        icon: Code,
        description: "A timed coding challenge to test your problem-solving skills with common algorithms.",
        tags: ["Frontend", "JavaScript", "Algorithms"]
    },
    {
        title: "AWS Certified Cloud Practitioner (Practice)",
        type: "MCQ",
        icon: ListChecks,
        description: "A practice exam to prepare you for the AWS Certified Cloud Practitioner certification.",
        tags: ["Cloud", "AWS", "DevOps"]
    },
     {
        title: "CSS Layout Challenge",
        type: "Coding",
        icon: Code,
        description: "Fix broken CSS layouts and demonstrate your mastery of Flexbox and Grid.",
        tags: ["Frontend", "CSS", "UI"]
    }
]

export default function AssessmentsPage() {
  const { toast } = useToast();

  const handleStartTest = (title: string) => {
    toast({
        title: "Feature Not Implemented",
        description: `The "${title}" assessment is for demonstration purposes only.`
    })
  }

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Skill Assessments
        </h1>
        <p className="mt-2 text-muted-foreground">
          Prove your skills and earn badges to stand out to employers.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
            <Card key={assessment.title} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                        <assessment.icon className="w-6 h-6 text-primary"/>
                    </div>
                    <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2">
                        {assessment.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => handleStartTest(assessment.title)}>
                        Start {assessment.type} Test
                        <ArrowRight className="ml-2"/>
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
