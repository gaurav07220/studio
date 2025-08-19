
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
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
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function ProfilePage() {
    const { user, loading, profile, updateProfile } = useAuth();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        summary: '',
        linkedin: '',
        portfolio: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                headline: profile.headline || '',
                summary: profile.summary || '',
                linkedin: profile.linkedin || '',
                portfolio: profile.portfolio || '',
            });
        }
    }, [profile]);
    
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await updateProfile(formData);
            toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
        } finally {
            setIsSaving(false);
        }
    };


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
                        <Input id="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={user.email} disabled />
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
                        <Input id="headline" placeholder="e.g., Senior Software Engineer at TechCorp" value={formData.headline} onChange={handleInputChange}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea id="summary" placeholder="A brief summary of your skills and experience." value={formData.summary} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedin} onChange={handleInputChange}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio/Website</Label>
                        <Input id="portfolio" placeholder="https://yourportfolio.com" value={formData.portfolio} onChange={handleInputChange}/>
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
                        <AvatarFallback>{formData.name.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                     <Button variant="outline" disabled>
                        <Upload className="mr-2" />
                        Upload Photo
                    </Button>
                </CardContent>
            </Card>

        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 animate-spin" />}
            Save Changes
        </Button>
      </div>
    </div>
  );
}
