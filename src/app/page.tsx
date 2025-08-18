
"use client";

import {
  ArrowRight,
  Briefcase,
  Check,
  FileCheck,
  FileText,
  LayoutGrid,
  Lightbulb,
  MessageSquare,
  PenSquare,
  Send,
  TrendingUp,
  UploadCloud,
  Users,
  Wallet,
  Zap,
  Award,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FeatureCard } from "@/components/feature-card";
import { Button } from "@/components/ui/button";

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
    icon: PenSquare,
    title: "Cover Letter Generator",
    description:
        "Generate a personalized cover letter in seconds based on your resume and a job description.",
    href: "/cover-letter-generator",
  },
  {
    icon: MessageSquare,
    title: "AI Interviewer",
    description:
        "Practice your interviewing skills with an AI that asks questions based on a job description and provides feedback.",
    href: "/ai-interviewer",
  },
  {
    icon: Award,
    title: "Skill Assessments",
    description:
        "Prove your skills by taking coding challenges and MCQ tests to earn badges for your profile.",
    href: "/assessments",
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
    icon: ShieldCheck,
    title: "Community Hub",
    description:
      "Engage with peers, climb the leaderboard, and get job referrals to stay ahead.",
    href: "/community",
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
    <div className="flex flex-col gap-12 md:gap-20 pb-12">
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
          <div className="hidden md:block">
          <svg
              viewBox="0 0 600 400"
              className="w-full h-auto"
              aria-label="An animated illustration of gears turning, representing the CareerAI platform at work."
            >
              <defs>
                <style>
                  {`
                    @keyframes rotate {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-reverse {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(-360deg); }
                    }
                    @keyframes float {
                      0%, 100% { transform: translateY(0); }
                      50% { transform: translateY(-10px); }
                    }
                    .gear {
                      animation: rotate 20s linear infinite;
                      transform-origin: center;
                    }
                    .gear-reverse {
                      animation: rotate-reverse 20s linear infinite;
                      transform-origin: center;
                    }
                    .icon-float {
                      animation: float 4s ease-in-out infinite;
                    }
                  `}
                </style>
              </defs>
              
              <g id="gears" opacity="0.1" fill="hsl(var(--primary))">
                <path className="gear" d="M256,218.8c-2.4-3-5.5-5.3-9-6.9c-4.2-2-8.8-3-13.5-2.8c-4.7,0.2-9.3,1.5-13.4,3.8c-4.1,2.3-7.5,5.5-10.1,9.3l-2.4,3.6c-1.3,2-2.9,3.8-4.8,5.3c-3.7,3-8.2,4.8-12.8,4.8c-4.7,0-9.1-1.8-12.8-4.8c-1.9-1.5-3.5-3.3-4.8-5.3l-2.4-3.6c-2.6-3.8-6-7-10.1-9.3c-4.1-2.3-8.7-3.6-13.4-3.8c-4.7-0.2-9.3,0.8-13.5,2.8c-3.5,1.6-6.6,3.9-9,6.9l-2.4,3.6c-1.3,2-2.9,3.8-4.8,5.3c-3.7,3-8.2,4.8-12.8,4.8c-4.7,0-9.1-1.8-12.8-4.8c-1.9-1.5-3.5-3.3-4.8-5.3l-2.4-3.6c-2.6-3.8-6-7-10.1-9.3c-4.1-2.3-8.7-3.6-13.4-3.8c-4.7-0.2-9.3,0.8-13.5,2.8c-3.5,1.6-6.6,3.9-9,6.9" />
                <path className="gear-reverse" transform="translate(100, 250) scale(0.8)" d="M512.6,90.4c2.4,3,5.5,5.3,9,6.9c4.2,2,8.8,3,13.5,2.8c4.7-0.2,9.3-1.5,13.4-3.8c4.1-2.3,7.5-5.5,10.1-9.3l2.4-3.6c1.3-2,2.9-3.8,4.8-5.3c3.7-3,8.2-4.8,12.8-4.8c4.7,0,9.1,1.8,12.8,4.8c1.9,1.5,3.5,3.3,4.8,5.3l2.4,3.6c2.6,3.8,6,7,10.1,9.3c4.1,2.3,8.7,3.6,13.4,3.8c4.7,0.2,9.3-0.8,13.5-2.8c3.5-1.6,6.6,3.9,9-6.9l2.4-3.6c1.3-2,2.9-3.8,4.8-5.3c3.7-3,8.2-4.8,12.8-4.8c4.7,0,9.1,1.8,12.8,4.8c1.9,1.5,3.5,3.3,4.8,5.3l2.4,3.6c2.6,3.8,6,7,10.1,9.3c4.1,2.3,8.7,3.6,13.4,3.8c4.7,0.2,9.3-0.8,13.5-2.8c3.5-1.6,6.6,3.9,9-6.9" />
              </g>
              <g id="center-piece" transform="translate(300, 200)">
                 <circle cx="0" cy="0" r="80" fill="hsl(var(--primary) / 0.1)" />
                 <circle cx="0" cy="0" r="70" fill="hsl(var(--background))" />
                 <path d="M-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0" fill="hsl(var(--primary))" />
                 <path d="M-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" fill="hsl(var(--background))" />
                 <path d="M-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0" fill="hsl(var(--primary))" />
              </g>

              <g className="icon-float" style={{ animationDelay: '0s' }} transform="translate(120, 100)">
                <circle cx="0" cy="0" r="30" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="2" />
                <path d="M -10 -5 L 0 -15 L 10 -5 M 0 -15 V 15 M -10 15 H 10" stroke="hsl(var(--accent))" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </g>

              <g className="icon-float" style={{ animationDelay: '-2s' }} transform="translate(480, 280)">
                <circle cx="0" cy="0" r="30" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="2" />
                <path d="M -12 0 L 12 0 M 0 -12 V 12 M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="hsl(var(--accent))" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </g>

               <g className="icon-float" style={{ animationDelay: '-1s' }} transform="translate(450, 80)">
                <circle cx="0" cy="0" r="30" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="2" />
                <path d="M -10 -10 H 10 V 10 H -10 Z M -10 0 H 10 M 0 -10 V 10" stroke="hsl(var(--accent))" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </g>

              <g className="icon-float" style={{ animationDelay: '-3s' }} transform="translate(150, 290)">
                <circle cx="0" cy="0" r="30" fill="hsl(var(--background))" stroke="hsl(var(--accent))" strokeWidth="2" />
                 <path d="M -5 -10 L 15 0 L -5 10 Z" stroke="hsl(var(--accent))" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
              </g>

            </svg>
          </div>
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
