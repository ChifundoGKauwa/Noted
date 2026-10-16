"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteShell } from "@/components/site-shell";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Only the publish page gets no wrapper (it's a full editor interface)
  if (pathname.startsWith("/publish")) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
        {children}
      </div>
    );
  }

  return <SiteShell>{children}</SiteShell>;
}
