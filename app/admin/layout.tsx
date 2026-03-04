"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "@/components/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return router.replace("/login");

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        return router.replace("/login");
      }

      if (mounted) setOk(true);
    }

    check();
    return () => {
      mounted = false;
    };
  }, [router, pathname]);

  if (!ok) return <div className="p-6 text-muted-foreground">Checking admin access…</div>;

  return <AdminShell>{children}</AdminShell>;
}