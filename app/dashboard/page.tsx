import {
  BookOpen,
  Calendar,
  Edit3,
  Eye,
  Heart,
  Mail,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getBackendBaseUrl } from "@/lib/backend";
import { fetchBackendWithAuth } from "@/lib/server-backend";
import { StoryActions } from "@/components/dashboard/story-actions";
import { getAuthenticatedAuthor } from "@/lib/server-auth";
import { redirect } from "next/navigation";

type Newsletter = {
  id: string;
  author_id: string;
  title: string;
  content?: string;
  published?: boolean;
  created_at?: string;
};

type Subscriber = {
  id: string;
  email: string;
  name?: string;
  subscribed_at?: string;
  status?: string;
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const author = await getAuthenticatedAuthor();
  if (!author) redirect("/login?next=%2Fdashboard");
  const { status = "all" } = await searchParams;
  const [nRes, sRes] = await Promise.all([
    fetch(`${getBackendBaseUrl()}/newsletters`, { cache: "no-store" }).catch(() => null),
    fetchBackendWithAuth("/subscribers").catch(() => null),
  ]);

  const allNewsletters = (nRes?.ok ? await nRes.json() : []) as Newsletter[];
  const newsletters = allNewsletters.filter((story) => story.author_id === author.id);
  const subscribers = (sRes?.ok ? await sRes.json() : []) as Subscriber[];
  const apiErrors = [
    nRes?.ok ? null : "Newsletters could not be loaded from the backend.",
    sRes?.ok ? null : "Subscribers could not be loaded from the backend.",
  ].filter(Boolean);

  const totalPublished = newsletters.filter((n) => n.published).length;
  const activeSubscribers = subscribers.filter((s) => s.status === "confirmed").length;

  const drafts = newsletters.filter((n) => !n.published);
  const visibleNewsletters = status === "published"
    ? newsletters.filter((story) => story.published)
    : status === "drafts"
      ? drafts
      : status === "scheduled"
        ? []
        : newsletters;

  const recentActivity = subscribers
    .slice()
    .sort((a, b) => (b.subscribed_at || "").localeCompare(a.subscribed_at || ""))
    .slice(0, 4)
    .map((s) => ({
      name: s.name || s.email.split("@")[0] || "User",
      action: s.status === "confirmed" ? "Confirmed subscription" : "Pending confirmation",
      time: s.subscribed_at ? new Date(s.subscribed_at).toLocaleString() : "Date unavailable",
    }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {apiErrors.length > 0 ? <p role="alert" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{apiErrors.join(" ")} The displayed figures may be incomplete.</p> : null}
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Author Workspace • Editorial Desk
            </p>
            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)]">
              Your Stories &amp; Publications
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
              Manage your stories and subscribers, {author.name}.
            </p>
          </div>
          <details className="relative shrink-0">
            <summary aria-label={`Profile for ${author.name}`} title={author.name} className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--foreground)] shadow-sm marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]">
              {author.name.trim().split(/\s+/).slice(0, 2).map((part: string) => part[0]?.toUpperCase()).join("") || "A"}
            </summary>
            <section className="absolute right-0 z-30 mt-3 w-72 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
              <p className="font-semibold text-[var(--foreground)]">{author.name}</p>
              <p className="mt-1 break-all text-sm text-[var(--muted)]">{author.email}</p>
              {author.bio ? <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm leading-relaxed text-[var(--muted)]">{author.bio}</p> : null}
            </section>
          </details>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Published */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Total Published</p>
              <BookOpen className="h-5 w-5 text-[var(--muted)]" />
            </div>
            <p className="mb-1 text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-[var(--foreground)]">{totalPublished}</p>
              <p className="text-sm text-[var(--muted)]">Stories in the newsletter API</p>
          </div>

          {/* Total Reads */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Total Reads</p>
              <Eye className="h-5 w-5 text-[var(--muted)]" />
            </div>
            <p className="mb-1 text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-[var(--foreground)]">
              —
            </p>
            <p className="text-sm text-[var(--muted)]">
              Read statistics are not provided by the API
            </p>
          </div>

          {/* Active Subscribers */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Active Subscribers</p>
              <Mail className="h-5 w-5 text-[var(--muted)]" />
            </div>
            <p className="mb-1 text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-[var(--foreground)]">
              {activeSubscribers.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--muted)]">Verified direct newsletter readers</p>
          </div>

          {/* Monthly Gain */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Monthly Subscriber Gain</p>
              <TrendingUp className="h-5 w-5 text-[var(--muted)]" />
            </div>
            <p className="mb-1 text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-[var(--foreground)]">
              —
            </p>
            <p className="text-sm text-[var(--muted)]">
              Subscriber growth history is not provided by the API
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Story Catalog */}
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Link href="/dashboard?status=published" className="rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                Published ({totalPublished})
              </Link>
              <Link href="/dashboard?status=drafts" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] hover:border-[var(--border-strong)]">
                Drafts ({drafts.length})
              </Link>
              <Link href="/dashboard?status=scheduled" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] hover:border-[var(--border-strong)]">
                Scheduled (unsupported)
              </Link>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/write"
                  className="flex items-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-[var(--foreground)]"
                >
                  + Post New Story
                </Link>
              </div>
            </div>

            {/* Story List */}
            <div className="space-y-4">
              <div className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Story Catalog &amp; Distribution Pipeline
                <span className="ml-4 text-[var(--muted)]">Showing 4 of {totalPublished} records</span>
              </div>

              {visibleNewsletters.slice(0, 4).map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-medium text-[var(--muted)]">
                      <span className="rounded-full bg-[var(--success)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                        {newsletter.published ? "Published" : "Draft"}
                      </span>
                      <span>
                        {newsletter.created_at
                          ? new Date(newsletter.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recent"}
                      </span>
                      <span className="text-[var(--muted)]">•</span>
                      <span className="text-[var(--foreground)]">Essays &amp; Culture</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-100 transition-opacity">
                      {newsletter.published ? (
                        <>
                          <Link href={`/publish?id=${encodeURIComponent(newsletter.id)}`} aria-label={`Edit ${newsletter.title}`} title="Edit story" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-muted)]">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>
                          <StoryActions id={newsletter.id} title={newsletter.title} published={Boolean(newsletter.published)} />
                        </>
                      ) : (
                        <><Link
                          href={`/publish?id=${encodeURIComponent(newsletter.id)}`}
                          className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white"
                        >
                          Resume Editing
                        </Link><StoryActions id={newsletter.id} title={newsletter.title} published={false} /></>
                      )}
                    </div>
                  </div>

                  <h3 className="mb-3 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--foreground)]">
                    {newsletter.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      — views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4" />
                      — claps
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {Math.max(1, Math.ceil((newsletter.content?.trim().split(/\s+/).filter(Boolean).length ?? 0) / 200))} min read
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Reader Growth */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]">Reader Growth</h3>
                <Users className="h-5 w-5 text-[var(--muted)]" />
              </div>

              <div className="mb-5 rounded-lg bg-[var(--background)] p-4">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Audience Retention
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[var(--foreground)]" />
                      <span className="text-sm text-[var(--muted)]">New Subscribers</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--foreground)]">+340</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#A1A1AA]" />
                      <span className="text-sm text-[var(--muted)]">Unsubscribes</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--muted)]">-12</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Retention Rate
                  </span>
                  <span className="text-sm font-bold text-[var(--foreground)]">97.2%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                  <div className="h-2 rounded-full bg-[var(--foreground)]" style={{ width: "97.2%" }} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]">
                  Recent Activity Stream
                </h3>
                <a
                  className="text-xs font-medium text-[var(--muted)] underline"
                  download="noted-subscribers.csv"
                  href={`data:text/csv;charset=utf-8,${encodeURIComponent([
                    "name,email,status,subscribed_at",
                    ...subscribers.map((subscriber) => [subscriber.name ?? "", subscriber.email, subscriber.status ?? "", subscriber.subscribed_at ?? ""].map((value) => `"${value.replaceAll('"', '""')}"`).join(",")),
                  ].join("\n"))}`}
                >Export CSV</a>
              </div>

              <div className="space-y-3">
                {recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-l-2 border-[var(--border)] pl-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[10px] font-semibold text-[var(--foreground)]">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[var(--foreground)]">{item.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">{item.action}</p>
                      <p className="mt-1 text-[10px] text-[var(--muted)]">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Tip */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--foreground)]">
                  <span className="text-xs text-white">💡</span>
                </div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]">
                  Editorial Integrity Tip
                </h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-[var(--muted)]">
                Stories paired with clear paragraph headers and primary data citations average 3.2× longer dwell times
                across our subscriber network.
              </p>
              <button className="text-xs font-semibold text-[var(--foreground)] underline">
                Read Style Guide → <span className="ml-1 text-[var(--muted)]">v2.4 Edition</span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
