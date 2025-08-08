import {
  FileText,
  Briefcase,
  Users,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  BarChart,
} from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

const features = [
  {
    icon: FileText,
    title: "Resume Analyzer",
    description: "Get AI-powered feedback to optimize your resume for ATS and keyword relevance.",
    href: "/resume-analyzer",
    color: "text-blue-500",
  },
  {
    icon: Briefcase,
    title: "Job Matcher",
    description: "Compare your resume against job descriptions to identify skill gaps and alignment.",
    href: "/job-matcher",
    color: "text-green-500",
  },
  {
    icon: Users,
    title: "Network Connector",
    description: "Receive personalized networking recommendations on platforms like LinkedIn.",
    href: "/network-connector",
    color: "text-purple-500",
  },
  {
    icon: Lightbulb,
    title: "Upskilling Recommender",
    description: "Discover courses and certifications to bridge skill gaps and advance your career.",
    href: "/upskilling-recommender",
    color: "text-yellow-500",
  },
  {
    icon: MessageSquare,
    title: "AI Career Coach",
    description: "Chat with our AI coach 24/7 for resume tips, job search strategies, and more.",
    href: "/career-coach",
    color: "text-red-500",
  },
  {
    icon: TrendingUp,
    title: "Job Market Insights",
    description: "Explore real-time data on in-demand skills, average salaries, and market trends.",
    href: "/job-market",
    color: "text-indigo-500",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Welcome to CareerAI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your personal AI-powered career enhancement platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.href}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            href={feature.href}
          />
        ))}
      </div>
    </div>
  );
}
