"use client";

import { useEffect, useState } from "react";
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
import { Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    linkedin: user?.linkedin || "",
    jobRole: user?.jobRole || "",
    headline: "",
    summary: "",
    portfolio: "",
    avatar: "",
    // Add more fields as needed
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.email) return;
      // Try to get user by UID if available, fallback to email
      const userDoc = doc(db, "users", user?.uid || user?.email);
      const snap = await getDoc(userDoc);
      if (snap.exists()) {
        const data = snap.data();
        setProfile((prev) => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          linkedin: data.linkedin || prev.linkedin,
          jobRole: data.jobRole || prev.jobRole,
          headline: data.headline || prev.headline,
          summary: data.summary || prev.summary,
          portfolio: data.portfolio || prev.portfolio,
          avatar: data.avatar || prev.avatar,
        }));
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userDoc = doc(db, "users", user?.uid || user?.email);
      await setDoc(userDoc, profile, { merge: true });
      setLoading(false);
      // Optionally show a toast here
    } catch (err) {
      setLoading(false);
      // Optionally show error toast
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
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={profile.fullName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={profile.email} onChange={handleChange} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={profile.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobRole">Job Role</Label>
                <Input id="jobRole" value={profile.jobRole} onChange={handleChange} />
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
                <Input id="headline" value={profile.headline} onChange={handleChange} placeholder="e.g., Senior Software Engineer at TechCorp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea id="summary" value={profile.summary} onChange={handleChange} placeholder="A brief summary of your skills and experience." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input id="linkedin" value={profile.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input id="portfolio" value={profile.portfolio} onChange={handleChange} placeholder="https://yourportfolio.com" />
              </div>
              {/* Add more fields here as needed */}
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
                <AvatarImage src={profile.avatar || "https://placehold.co/128x128.png"} data-ai-hint="user avatar" />
                <AvatarFallback>{profile.fullName ? profile.fullName[0] : "U"}</AvatarFallback>
              </Avatar>
              <Button variant="outline">
                <Upload className="mr-2" />
                Upload Photo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
      </div>
    </div>
  );
}
