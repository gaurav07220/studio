
"use client";

import { TrendingUp, DollarSign, BrainCircuit, BarChart2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const inDemandSkills = [
  "Python", "React", "Machine Learning", "AWS", "Go",
  "Project Management", "Data Analysis", "SQL", "Cybersecurity", "Terraform"
];

const salaryData = [
  { role: "Data Scientist", salary: 125000 },
  { role: "Software Engineer", salary: 115000 },
  { role: "Product Manager", salary: 130000 },
  { role: "UX/UI Designer", salary: 95000 },
  { role: "DevOps Engineer", salary: 120000 },
  { role: "Cybersecurity Analyst", salary: 105000 },
];

const marketTrends = [
  "The demand for AI and Machine Learning specialists has grown by 35% in the last year.",
  "Remote work opportunities continue to be prevalent, especially in the tech sector.",
  "Cybersecurity roles are increasingly in demand due to rising security concerns.",
  "Soft skills like communication, collaboration, and adaptability are highly valued by employers."
];

export default function JobMarketPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Job Market Insights
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore current trends, in-demand skills, and salary benchmarks.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary" /> In-Demand Skills</CardTitle>
            <CardDescription>
              These are some of the most sought-after skills in the current job market.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {inDemandSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-base px-3 py-1">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="text-green-500" /> Average Salary Benchmarks</CardTitle>
            <CardDescription>
              Estimated average annual salaries for popular tech roles in the US.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                <YAxis dataKey="salary" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                  formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value))}
                />
                <Bar dataKey="salary" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="text-indigo-500" /> Job Market Trends</CardTitle>
            <CardDescription>
              Key trends shaping the future of work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 list-disc list-inside">
              {marketTrends.map((trend, index) => (
                <li key={index} className="text-sm">{trend}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Disclaimer: Data shown is for demonstration purposes only and may not reflect real-time market conditions.
      </p>
    </div>
  );
}
