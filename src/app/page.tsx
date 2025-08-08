import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Users,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Check,
} from "lucide-react";
import { FeatureCard } from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Resume Analyzer",
    description:
      "Get instant, AI-powered feedback. Optimize your resume for ATS scanners and highlight your key strengths.",
    href: "/resume-analyzer",
  },
  {
    icon: Briefcase,
    title: "Job Matcher",
    description:
      "See how your skills stack up against any job description and get suggestions to tailor your application.",
    href: "/job-matcher",
  },
  {
    icon: Lightbulb,
    title: "Upskilling Recommender",
    description:
      "Identify skill gaps and discover personalized courses and certifications to advance your career.",
    href: "/upskilling-recommender",
  },
  {
    icon: Users,
    title: "Network Connector",
    description:
      "Receive tailored recommendations for professionals and groups to expand your network on LinkedIn.",
    href: "/network-connector",
  },
  {
    icon: MessageSquare,
    title: "AI Career Coach",
    description:
      "Chat 24/7 with an AI coach for resume tips, job search strategies, and interview preparation.",
    href: "/career-coach",
  },
  {
    icon: TrendingUp,
    title: "Job Market Insights",
    description:
      "Explore real-time data on in-demand skills, salary benchmarks, and the latest industry trends.",
    href: "/job-market",
  },
];

const howItWorks = [
    {
        title: "Upload Your Resume",
        description: "Start by uploading your current resume. Our AI performs a deep analysis in seconds."
    },
    {
        title: "Get Instant Feedback",
        description: "Receive a detailed report on ATS compatibility, skills, and formatting."
    },
    {
        title: "Enhance and Apply",
        description: "Use our tools to tailor your resume, find matching jobs, and get ready for interviews."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-20">
      {/* Hero Section */}
      <section className="pt-8 md:pt-16">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Build Your Future with{" "}
              <span className="text-accent">AI-Powered</span> Career Tools
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Stop guessing and start getting ahead. CareerAI provides the
              tools you need to optimize your resume, match with the right jobs,
              and accelerate your career path.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg">
                <Link href="/resume-analyzer">
                  Analyze Your Resume
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="career development job search"
              alt="An illustration showing a person climbing a ladder of success with AI assistance"
              width={600}
              height={400}
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

       {/* How It Works Section */}
      <section className="py-8 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">How It Works</h2>
                <p className="mt-2 text-muted-foreground">
                    Get from resume to ready-to-apply in three simple steps.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {howItWorks.map((step, index) => (
                    <div key={index} className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                            <span className="font-bold text-2xl">{index + 1}</span>
                        </div>
                        <h3 className="font-headline text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-8 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              A Full Suite of Career Tools
            </h2>
            <p className="mt-2 text-muted-foreground">
              From resume analysis to interview prep, we've got you covered at
              every step of your job search.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </section>
      
       {/* Final CTA Section */}
       <section className="py-8 md:py-16">
        <div className="container px-4 md:px-6">
            <div className="bg-accent text-accent-foreground rounded-xl p-8 md:p-12 text-center shadow-lg">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold">
                    Ready to Land Your Dream Job?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto">
                    Take the first step towards a better career today. Get your free resume analysis and see where you stand.
                </p>
                 <div className="mt-6">
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/resume-analyzer">
                        Get Started for Free <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
