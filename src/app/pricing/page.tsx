
"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const tiers = [
  {
    name: "Free",
    price: "Free",
    description: "Essential tools to get you started on your career path.",
    features: [
      "Resume Analysis & Feedback",
      "Job Description Matcher",
      "AI Interview Practice (1 Question)",
      "Upskilling Recommendations",
      "Job Market Insights",
    ],
    cta: "Your Current Plan",
    ctaDisabled: true,
    popular: false,
  },
  {
    name: "Pro",
    price: "$10 / mo",
    description: "Unlock your full potential with advanced AI tools and unlimited access.",
    features: [
      "All features in the Free plan",
      "Full AI Interview with Feedback",
      "AI Cover Letter Generation",
      "Advanced Resume Analytics",
      "Priority Support",
    ],
    cta: "Coming Soon",
    ctaDisabled: true,
    popular: true,
  },
];

export default function PricingPage() {
    const { profile } = useAuth();
    const isPro = profile?.plan === 'pro';

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Find the Plan That's Right for You
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Start for free, and upgrade to Pro when you're ready to accelerate your job search. Payment integration is coming soon!
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              "flex flex-col h-full",
              tier.popular ? "border-primary border-2 shadow-xl relative" : ""
            )}
          >
             {tier.popular && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4" /> Most Popular
                    </div>
                </div>
             )}
            <CardHeader className="pt-8">
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="text-4xl font-bold pt-4">{tier.price}</div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
               <Button className="w-full" disabled={tier.ctaDisabled || (tier.name === 'Free' && !isPro) || (tier.name === 'Pro' && isPro)}>
                    {isPro && tier.name === 'Pro' ? 'Your Current Plan' : tier.cta}
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
