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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const mainNavItems = [
  { href: "/resume-analyzer", label: "Resume Analyzer" },
  { href: "/job-matcher", label: "Job Matcher" },
  { href: "/network-connector", label: "Network Connector" },
  { href: "/upskilling-recommender", label: "Upskilling" },
  { href: "/job-market", label: "Job Market" },
];

const userMenuItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4"
        >
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="sr-only">CareerAI</span>
        </Link>

        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            {mainNavItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                    {item.label}
                </NavLink>
            ))}
        </nav>
        
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userMenuItems.map(item => (
                    <DropdownMenuItem key={item.label} asChild>
                       <Link href={item.href} className="flex items-center gap-2">
                            <item.icon className="w-4 h-4"/>
                            <span>{item.label}</span>
                       </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href="#" className="flex items-center gap-2">
                        <LogOut className="w-4 h-4"/>
                        <span>Logout</span>
                    </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <span>CareerAI</span>
                  </Link>
                  {[...mainNavItems, ...userMenuItems].map((item) => (
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

        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <CareerCoachWidget />
    </div>
  );
}
