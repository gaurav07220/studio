"use client";

import { Check } from "lucide-react";
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

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals getting started.",
    features: [
      "Basic Resume Analysis",
      "10 Job Matches per month",
      "Limited AI Coach access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$15",
    description: "For professionals serious about their career.",
    features: [
      "Advanced Resume Analysis & ATS Score",
      "Unlimited Job Matches",
      "Unlimited AI Coach access",
      "Upskilling Recommendations",
      "Network Connector",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    description: "For teams and organizations.",
    features: [
      "All Pro features",
      "Team management",
      "Custom branding",
      "Dedicated support",
      "Usage analytics",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Find the Plan That's Right for You
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Unlock your full career potential with CareerAI. Choose a plan that fits your needs and goals.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(
              "flex flex-col h-full",
              tier.popular ? "border-primary border-2 shadow-xl" : ""
            )}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="text-4xl font-bold pt-4">{tier.price}</div>
              <p className="text-sm text-muted-foreground">{tier.price.startsWith('$') && tier.name !== 'Free' ? '/ month' : ' '}</p>
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
              <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
