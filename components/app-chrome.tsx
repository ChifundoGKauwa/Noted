"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteShell } from "@/components/site-shell";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <SiteShell homePage={pathname === "/"}>{children}</SiteShell>;
}
