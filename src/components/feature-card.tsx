import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
}: FeatureCardProps) {
  return (
    <Link href={href} className="flex h-full">
      <Card className="flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1 w-full bg-card">
        <CardHeader className="flex flex-row items-start gap-4 pb-4">
          <div className="bg-accent/10 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle className="font-headline text-lg">{title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-3">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-auto pt-0">
           <div className="text-sm font-semibold text-primary group-hover:text-accent flex items-center gap-1">
              Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}
