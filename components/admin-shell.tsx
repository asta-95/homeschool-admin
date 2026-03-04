"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  ClipboardPenLine,
  Trophy,
  LogOut,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/admin/score", label: "Scores", icon: ClipboardPenLine },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden md:flex w-64 flex-col border-r bg-card/40">
          <div className="p-5">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <div className="text-lg font-semibold tracking-tight">Homeschool Admin</div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Students • Scores • Certificates
            </div>
          </div>

          <Separator />

          <nav className="p-3 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-3">
            <Separator className="mb-3" />
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              <div className="text-sm font-medium">
                {nav.find((n) => n.href === pathname)?.label ?? "Admin"}
              </div>
              <div className="text-xs text-muted-foreground">Local Admin</div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}