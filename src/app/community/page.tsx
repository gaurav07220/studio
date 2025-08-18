
"use client";

import { Crown, MessageSquare, User, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const leaderboardUsers = [
  { rank: 1, name: "Elena Volkova", points: 2450, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { rank: 2, name: "Marcus Chen", points: 2300, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
  { rank: 3, name: "Aisha Khan", points: 2280, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
  { rank: 4, name: "Leo Kim", points: 2150, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g" },
  { rank: 5, name: "Sofia Rossi", points: 2010, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h" },
];

export default function CommunityPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Community Hub
        </h1>
        <p className="mt-2 text-muted-foreground">
          Engage with peers, climb the leaderboard, and grow together.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Weekly Leaderboard</CardTitle>
                    <CardDescription>See who's at the top of their game. Points are earned by completing assessments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {leaderboardUsers.map((user) => (
                            <li key={user.rank} className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-muted/50">
                                <span className="font-bold text-lg w-6 text-center">{user.rank}</span>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{user.name}</p>
                                </div>
                                <Badge variant={user.rank === 1 ? "default" : "secondary"} className="font-bold text-base">
                                    {user.rank === 1 && <Crown className="w-4 h-4 mr-2 text-yellow-400" />}
                                    {user.points.toLocaleString()} pts
                                </Badge>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare /> Community Discussions</CardTitle>
                    <CardDescription>Ask questions, share advice, and help others.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground space-y-4">
                    <MessageSquare className="w-16 h-16 mx-auto opacity-20"/>
                    <p>Discussion forums are coming soon!</p>
                    <Button variant="outline" disabled>Start a Discussion</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Job Referrals</CardTitle>
                    <CardDescription>Connect with others to find referral opportunities.</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground space-y-4">
                    <User className="w-16 h-16 mx-auto opacity-20"/>
                    <p>A dedicated space for referrals is on the way.</p>
                     <Button variant="outline" disabled>Post an Opening</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
