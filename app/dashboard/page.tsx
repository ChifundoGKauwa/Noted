import {
  ArrowUpRight,
  Circle,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Total published",
    value: "24",
    detail: "Stories live across 4 collections",
  },
  { label: "Total reads", value: "148.5k", detail: "+14.2% from last 30 days" },
  {
    label: "Active subscribers",
    value: "4,280",
    detail: "Verified newsletter readers",
  },
  {
    label: "Monthly subscriber gain",
    value: "+328",
    detail: "+340 new / 12 unsubscribed",
  },
];

const stories = [
  {
    status: "Published",
    date: "Oct 14, 2026",
    category: "Essays & Culture",
    title:
      "Office Plants: A Cure for Burnout? Study Shows They Boost Productivity",
    metrics: "42.1k views • 1.4k claps • 6 min read",
    accent: false,
  },
  {
    status: "Published",
    date: "Oct 12, 2026",
    category: "Design Routine",
    title: "The Slow Pour Movement: Rediscovering Intentional Mornings",
    metrics: "18.4k views • 690 claps • 4 min read",
    accent: false,
  },
  {
    status: "Draft",
    date: "Last edited 2 hours ago",
    category: "Architecture",
    title:
      "The Architecture of Solitude: Designing Workspaces for Deep Thought",
    metrics: "2,410 words • Estimated read: 9 min",
    accent: true,
  },
  {
    status: "Scheduled",
    date: "Releasing Oct 20, 2026 at 09:00 AM EST",
    category: "Technology Ethics",
    title: "Human-Centered Algorithms: Beyond the Metric Squeeze",
    metrics:
      "Auto-distribution to all 4,280 active newsletter subscribers configured",
    accent: false,
  },
];

const recentActivity = [
  { name: "Jane Doe", action: "Subscribed to weekly digest", time: "10m ago" },
  {
    name: "Julian Vance",
    action: "Subscribed to Architecture dispatch",
    time: "42m ago",
  },
  {
    name: "Mark K.",
    action: "Unsubscribed from daily dispatches",
    time: "2h ago",
  },
  {
    name: "Clara Sheng",
    action: 'Paid Member upgrade via "Office Plants"',
    time: "5h ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Author workspace • editorial desk
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.08em] text-[var(--foreground)] sm:text-5xl">
              Your Stories &amp; Publications
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
              Manage your essays, monitor real-time readership metrics, edit
              live drafts, and orchestrate future dispatches.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-semibold text-[var(--foreground)]">
              ER
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-[var(--foreground)]">
                Elena Rostova
              </p>
              <p className="text-xs text-[var(--muted)]">
                Contributing Senior Essayist
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.07em] text-[var(--foreground)]">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted)]">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">{stat.detail}</p>
            </Card>
          ))}
        </section>

        <section className="mt-10 grid gap-8 xl:grid-cols-[1.75fr_0.9fr]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--foreground)]" />
                Published (18)
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)]">
                Drafts (4)
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)]">
                Scheduled (2)
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]">
                  All Topics
                </button>
                <Button variant="default" size="sm" className="px-3">
                  Post new story
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {stories.map((story) => (
                <div
                  key={story.title}
                  className={`rounded-2xl border p-4 ${
                    story.accent
                      ? "border-[var(--border-strong)] bg-[var(--surface-muted)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)]"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      <span>{story.status}</span>
                      <span className="text-[var(--muted)]/70">•</span>
                      <span>{story.date}</span>
                    </div>
                    {story.status === "Published" ? (
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-2 text-[var(--muted)]">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                        <button className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-2 text-[var(--muted)]">
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : story.status === "Draft" ? (
                      <div className="flex items-center gap-2 rounded-full bg-[#171717] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                        Resume editing
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                        {story.category}
                      </p>
                      <h3 className="text-[1.55rem] font-semibold leading-[1.05] tracking-[-0.06em] text-[var(--foreground)]">
                        {story.title}
                      </h3>
                    </div>
                    {story.status === "Scheduled" ? (
                      <button className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-xs font-medium text-[var(--foreground)]">
                        Reschedule
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Circle className="h-3.5 w-3.5" /> 42.1k views
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> 1.4k claps
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> 6 min read
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  Reader growth
                </h3>
                <div className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2 py-1 text-xs text-[var(--muted)]">
                  Live
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>New subscribers</span>
                  <span className="font-medium text-[var(--foreground)]">
                    +340
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Unsubscribed</span>
                  <span className="font-medium text-[var(--foreground)]">
                    -12
                  </span>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Retention rate</span>
                    <span className="font-medium text-[var(--foreground)]">
                      97.2%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                    <div className="h-2 w-[97%] rounded-full bg-[var(--foreground)]" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  Recent activity
                </h3>
                <button className="text-xs font-medium text-[var(--muted)]">
                  Export CSV
                </button>
              </div>

              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={item.name}
                    className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[10px] font-semibold text-[var(--foreground)]">
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--foreground)]">
                        {item.action}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}
