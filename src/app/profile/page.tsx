
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Upload, Star, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CertificateDisplay = ({ achievementName, userName }: { achievementName: string, userName: string }) => {
    return (
        <div className="p-8 border-2 border-primary bg-background rounded-lg max-w-2xl mx-auto font-serif">
            <div className="text-center space-y-2">
                <ShieldCheck className="w-20 h-20 mx-auto text-primary" />
                <h2 className="text-3xl font-bold font-headline">Certificate of Achievement</h2>
                <p className="text-muted-foreground">This certificate is proudly presented to</p>
            </div>

            <div className="text-center my-8">
                <p className="text-4xl font-bold text-primary tracking-wide">{userName}</p>
            </div>
            
            <div className="text-center space-y-2">
                <p className="text-muted-foreground">for successfully completing the</p>
                <h3 className="text-2xl font-semibold font-headline">{achievementName}</h3>
                <p className="text-sm text-muted-foreground pt-4">Issued on: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const { user } = useAuth();
    if (!user) return null; // or a loading spinner

  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Your Profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Keep your professional information up-to-date.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic details about you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.email.split('@')[0]} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                    <CardDescription>Your professional headline, summary, and online presence.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="headline">Professional Headline</Label>
                        <Input id="headline" placeholder="e.g., Senior Software Engineer at TechCorp" defaultValue="Aspiring Full-Stack Developer"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea id="summary" placeholder="A brief summary of your skills and experience." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio/Website</Label>
                        <Input id="portfolio" placeholder="https://yourportfolio.com" />
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                     <Button variant="outline">
                        <Upload className="mr-2" />
                        Upload Photo
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Your earned points, certificates and badges.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Star className="w-8 h-8 text-primary" />
                            <div>
                                <h4 className="font-semibold">Total Points</h4>
                                <p className="text-sm font-bold text-primary">{user.points.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    {user.achievements.map((achievement) => (
                        <Dialog key={achievement.id}>
                            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Award className="w-8 h-8 text-yellow-500" />
                                    <div>
                                        <h4 className="font-semibold">{achievement.name}</h4>
                                        <Badge variant="secondary">{achievement.type}</Badge>
                                    </div>
                                </div>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View</Button>
                                </DialogTrigger>
                            </div>
                            <DialogContent className="sm:max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>Certificate of Achievement</DialogTitle>
                                </DialogHeader>
                                <CertificateDisplay achievementName={achievement.name} userName={user.email.split('@')[0]}/>
                            </DialogContent>
                        </Dialog>
                    ))}
                    {user.achievements.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center p-4">No achievements yet. Complete an assessment to earn one!</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

