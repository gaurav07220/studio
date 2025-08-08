"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  Briefcase,
  FileText,
  Home,
  Lightbulb,
  TrendingUp,
  Users,
  BrainCircuit,
  Settings,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CareerCoachWidget } from "@/components/career-coach-widget";

const mainNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/resume-analyzer", label: "Resume Analyzer", icon: FileText },
  { href: "/job-matcher", label: "Job Matcher", icon: Briefcase },
  { href: "/network-connector", label: "Network Connector", icon: Users },
  {
    href: "/upskilling-recommender",
    label: "Upskilling",
    icon: Lightbulb,
  },
  { href: "/job-market", label: "Job Market", icon: TrendingUp },
];

const secondaryNavItems = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help & Support", icon: HelpCircle },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold font-headline"
          >
            <BrainCircuit className="w-8 h-8 text-accent" />
            <span className="group-data-[collapsible=icon]:hidden">CareerAI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === "/"
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 mt-auto">
            <SidebarSeparator className="mb-2"/>
             <SidebarMenu>
                {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                        >
                        <Link href="#">
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <SidebarSeparator className="my-2"/>
            <div className="p-2 flex items-center gap-2">
                <Avatar className="h-10 w-10 border">
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm text-sidebar-foreground">User</span>
                    <span className="text-xs text-sidebar-foreground/70">user@email.com</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            {/* Can add breadcrumbs or page title here */}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
        <CareerCoachWidget />
      </SidebarInset>
    </SidebarProvider>
  );
}
