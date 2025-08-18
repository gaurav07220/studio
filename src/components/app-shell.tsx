
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  BrainCircuit,
  Settings,
  HelpCircle,
  Menu,
  User,
  DollarSign,
  LogOut,
  LogIn,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CareerCoachWidget } from "@/components/career-coach-widget";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const mainNavItems = [
  { href: "/resume-analyzer", label: "Resume Analyzer" },
  { href: "/job-matcher", label: "Job Matcher" },
  { href: "/cover-letter-generator", label: "Cover Letter" },
  { href: "/ai-interviewer", label: "AI Interviewer" },
  { href: "/network-connector", label: "Network Connector" },
  { href: "/upskilling-recommender", label: "Upskilling" },
  { href: "/job-market", label: "Job Market" },
];

const userMenuItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
];

const helpMenuItems = [
     { href: "#", label: "Help & Support", icon: HelpCircle },
]

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "transition-colors text-foreground/60 hover:text-foreground/80",
                isActive && "text-primary font-medium"
            )}
        >
            {children}
        </Link>
    );
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [openMobileMenu, setOpenMobileMenu] = React.useState(false);
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <main className="flex-1">{children}</main>
  }

  const handleSignOut = () => {
      signOut();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <span>CareerAI</span>
                  </Link>
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setOpenMobileMenu(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                   {userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setOpenMobileMenu(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
            >
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="hidden sm:inline-block">CareerAI</span>
            </Link>
        </div>

        <nav className="hidden flex-1 justify-center md:flex">
            <div className="flex items-center gap-5 text-sm lg:gap-6">
                {mainNavItems.map((item) => (
                    <NavLink key={item.href} href={item.href}>
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
        
        <div className="flex items-center gap-4">
            {loading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} data-ai-hint="user avatar" />
                       <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Signed In</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {userMenuItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4"/>
                                {item.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button asChild>
                    <Link href="/login">
                        Login <LogIn className="ml-2"/>
                    </Link>
                </Button>
            )}
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <CareerCoachWidget />
    </div>
  );
}
