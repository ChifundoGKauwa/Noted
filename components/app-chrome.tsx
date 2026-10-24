"use client";

import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";

export function AppChrome({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
