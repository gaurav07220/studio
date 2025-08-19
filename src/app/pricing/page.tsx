
"use client";

import { Check, Lock, Star } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createOrder, verifyPayment } from "@/ai/flows/payment";
import { useEffect, useState } from "react";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    priceAmount: 0,
    description: "Essential tools to get you started.",
    features: [
      "Resume Analysis & Feedback",
      "Job Description Matcher",
      "Upskilling Recommendations",
      "Job Market Insights",
      "1 Free AI Interview Question",
    ],
    cta: "You are on this plan",
    planId: 'free',
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    priceAmount: 499,
    description: "Unlock your full potential with advanced AI tools.",
    features: [
      "All features in the Free plan",
      "Unlimited AI Mock Interviews",
      "Cover Letter Generator",
      "Priority Support",
    ],
    cta: "Upgrade to Pro",
    planId: 'pro',
    popular: true,
  },
];

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingPage() {
    const { profile, updateProfile, user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleUpgrade = async (tier: typeof tiers[0]) => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }

        if (tier.planId !== 'pro') return;
        setLoading(true);

        try {
            const order = await createOrder({ amount: tier.priceAmount, currency: 'INR' });
            
            if (!order || !order.id) {
                throw new Error("Order creation failed.");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "CareerAI Pro",
                description: "Pro Plan Subscription",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verificationResult = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verificationResult.signatureIsValid) {
                            await updateProfile({ plan: 'pro' });
                             toast({
                                title: "Upgrade Successful!",
                                description: "Welcome to the Pro plan. You now have access to all features.",
                            });
                        } else {
                            throw new Error("Payment verification failed.");
                        }
                    } catch (verifyError) {
                        toast({
                            variant: 'destructive',
                            title: "Payment Failed",
                            description: "Your payment could not be verified. Please contact support.",
                        });
                    }
                },
                prefill: {
                    name: profile?.name || user.email,
                    email: user.email,
                },
                theme: {
                    color: "#6D28D9"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
             toast({
                variant: 'destructive',
                title: "Upgrade Failed",
                description: error instanceof Error ? error.message : "We couldn't process your upgrade. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

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
              <p className="text-sm text-muted-foreground">{tier.price.startsWith('₹') && tier.name !== 'Free' ? '/ month' : ' '}</p>
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
               {profile?.plan === tier.planId ? (
                 <Button className="w-full" disabled>
                    Your Current Plan
                </Button>
               ) : (
                <Button className="w-full" variant={tier.popular ? "default" : "outline"} onClick={() => handleUpgrade(tier)} disabled={loading || tier.planId === 'free'}>
                    {loading && tier.planId === 'pro' ? 'Processing...' : tier.cta}
                </Button>
               )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

    