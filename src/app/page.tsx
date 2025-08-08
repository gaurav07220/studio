
"use client";
import { FeatureCard } from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  FileCheck,
  FileText,
  LayoutGrid,
  Lightbulb,
  MessageSquare,
  Send,
  TrendingUp,
  UploadCloud,
  Users,
  Wallet,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        icon: UploadCloud,
        title: "Upload Your Resume",
        description: "Start by uploading your current resume. Our AI performs a deep analysis in seconds."
    },
    {
        icon: FileCheck,
        title: "Get Instant Feedback",
        description: "Receive a detailed report on ATS compatibility, skills, and formatting."
    },
    {
        icon: Send,
        title: "Enhance and Apply",
        description: "Use our tools to tailor your resume, find matching jobs, and get ready for interviews."
    }
]

const whyPoints = [
    {
        icon: Zap,
        title: "AI-Powered Insights",
        description: "Leverage cutting-edge AI to get a data-driven advantage in your job search."
    },
    {
        icon: LayoutGrid,
        title: "All-in-One Toolkit",
        description: "From resume optimization to interview prep, all the tools you need are in one place."
    },
    {
        icon: Wallet,
        title: "Completely Free",
        description: "Get access to premium career tools without any cost. Your journey to a better job starts here."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-12" style={{alignItems:'center'}}>
      {/* Hero Section */}
      <section className="pt-8 md:pt-16">
        <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Land Your Dream Job Faster with{" "}
              <span className="text-primary">CareerAI</span>
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
<<<<<<< HEAD
          {/* <div className="hidden md:block">
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="career development job search"
              alt="An illustration showing a person climbing a ladder of success with AI assistance"
              width={600}
              height={400}
              className="rounded-xl shadow-xl"
            />
          </div> */}
=======
          <div className="hidden md:block">
            <svg
                viewBox="0 0 600 400"
                className="rounded-xl shadow-xl w-full h-auto"
                aria-label="An illustration showing a person climbing a ladder of success with AI assistance"
                >
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.1}} />
                    <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 0.1}} />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <rect width="600" height="400" rx="12" fill="url(#grad1)" />
                
                {/* Background grid */}
                <path d="M0 100 H600 M0 200 H600 M0 300 H600 M100 0 V400 M200 0 V400 M300 0 V400 M400 0 V400 M500 0 V400" stroke="hsl(var(--border))" strokeWidth="0.5" strokeOpacity="0.5" />

                {/* Bar chart representing growth */}
                <g transform="translate(50, 350)">
                    <rect x="20" y="-100" width="40" height="100" fill="hsl(var(--primary) / 0.3)" rx="4"/>
                    <rect x="80" y="-150" width="40" height="150" fill="hsl(var(--primary) / 0.5)" rx="4"/>
                    <rect x="140" y="-220" width="40" height="220" fill="hsl(var(--primary) / 0.7)" rx="4"/>
                    <rect x="200" y="-280" width="40" height="280" fill="hsl(var(--primary))" rx="4"/>
                </g>

                {/* AI/Tech elements */}
                <g stroke="hsl(var(--accent))" strokeWidth="2" fill="none" >
                    <path d="M400 50 Q 450 100 400 150" />
                    <path d="M420 70 Q 480 130 420 190" />
                    <circle cx="400" cy="50" r="4" fill="hsl(var(--accent))" filter="url(#glow)"/>
                    <circle cx="400" cy="150" r="4" fill="hsl(var(--accent))" filter="url(#glow)"/>
                    <circle cx="420" cy="70" r="4" fill="hsl(var(--accent))" filter="url(#glow)"/>
                    <circle cx="420" cy="190" r="4" fill="hsl(var(--accent))" filter="url(#glow)"/>
                    <circle cx="480" cy="130" r="4" fill="hsl(var(--accent))" filter="url(#glow)"/>
                </g>

                {/* Person climbing */}
                <g transform="translate(220, 70)" fill="hsl(var(--foreground))">
                    {/* Head */}
                    <circle cx="0" cy="-5" r="8" />
                    {/* Body */}
                    <path d="M-10 5 L 0 20 L 10 5 L 0 30 Z" />
                    {/* Limbs reaching up */}
                    <path d="M -8 -2 L -20 -30 M 8 -2 L 20 -30" stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinecap="round" />
                </g>
                
                {/* Floating UI elements */}
                <g transform="translate(450, 250)">
                    <rect width="120" height="80" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                    <rect x="10" y="10" width="100" height="8" rx="4" fill="hsl(var(--primary))" />
                    <rect x="10" y="25" width="80" height="6" rx="3" fill="hsl(var(--muted))" />
                    <rect x="10" y="40" width="90" height="6" rx="3" fill="hsl(var(--muted))" />
                    <rect x="10" y="55" width="70" height="6" rx="3" fill="hsl(var(--muted))" />
                </g>

                <circle cx="80" cy="80" r="20" fill="hsl(var(--accent) / 0.2)" />
                <path d="M75 80 L 80 85 L 90 75" stroke="hsl(var(--accent))" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
>>>>>>> baa46bc (you added 600 * 400 instead of svg related to our platform)
        </div>
      </section>

      {/* Why Section */}
       <section className="container px-4 md:px-6">
         <div className="grid md:grid-cols-3 gap-8">
            {whyPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                        <point.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-headline text-lg font-semibold">{point.title}</h3>
                        <p className="text-muted-foreground text-sm">{point.description}</p>
                    </div>
                </div>
            ))}
         </div>
       </section>

       {/* How It Works Section */}
      <section className="py-8 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Get Job-Ready in 3 Simple Steps</h2>
                <p className="mt-2 text-muted-foreground">
                    From resume to ready-to-apply, our process is designed to be simple and effective.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {howItWorks.map((step, index) => (
                    <div key={index} className="flex flex-col items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                            <step.icon className="w-8 h-8"/>
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
            <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center shadow-lg">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold">
                    Ready to Land Your Dream Job?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-primary-foreground/80">
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
