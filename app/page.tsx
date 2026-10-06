const articleSections = [
  "The building itself is part of the creative process, not just a container for work. In the most productive studios, the material language, light, and even the plant life are designed to let attention settle rather than scatter.",
  "That idea feels especially relevant in a culture that mistakes busyness for usefulness. When the work environment is intentionally quieter, decisions become more deliberate, creative output is less fractured, and the resulting work usually feels more resolved.",
  "The design challenge is not ornamental elegance. It is calm usefulness: the right acoustic surfaces, softer contrasts, and enough visual rhythm to support flow without exhausting the eye.",
];

const relatedStories = [
  { title: "The Structure of Quiet", category: "Architecture" },
  { title: "In Praise of Slow Systems", category: "Culture" },
  { title: "The Desk as a Tool", category: "Design" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
      <article className="min-h-[calc(100vh-180px)] bg-transparent">
        <div className="pb-6 pt-2 sm:pt-4">
          <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            <span>Alex Haslam</span>
            <span className="text-[var(--muted)]/70">•</span>
            <span>8 min read</span>
          </div>

          <h1 className="max-w-[1100px] text-[clamp(2.9rem,6vw,7rem)] font-normal leading-[0.78] tracking-[-0.08em] text-[var(--foreground)]">
            Office Plants: A Cure for
            <span className="block">Burnout? Study Shows</span>
            <span className="block">They Boost Productivity</span>
          </h1>

          <div className="mt-6 max-w-[720px] text-[1.05rem] leading-[1.5] text-[var(--muted)]">
            A grounding break in the day can do more than relieve stress; it can
            sharpen focus, restore attention, and help the work feel more human.
          </div>

          <div className="mt-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--foreground)] text-[0.8rem] font-medium text-[var(--background)]">
              A
            </div>
            <span>By Alex Haslam</span>
            <span className="text-[var(--muted)]/70">•</span>
            <span>8 min read</span>
            <span className="text-[var(--muted)]/70">•</span>
            <span>Architecture &amp; Thought</span>
          </div>
        </div>

        <div className="pb-8">
          <div className="relative overflow-hidden rounded-[22px] border border-[#d9d1c5] bg-[linear-gradient(135deg,#f1f1ef_0%,#d7d7d4_32%,#b7b3af_60%,#e7e3df_100%)]">
            <div className="aspect-[16/9] w-full bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.8),transparent_18%),linear-gradient(90deg,rgba(19,19,19,0.27),rgba(19,19,19,0.08)_30%,rgba(255,255,255,0.2)_48%,rgba(19,19,19,0.15)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14),transparent_32%,rgba(255,255,255,0.18),transparent_68%,rgba(0,0,0,0.09))]" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_top,rgba(0,0,0,0.2),transparent)]" />
          </div>
        </div>

        <div className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1.4fr)_340px]">
          <div className="space-y-7 text-[1.06rem] leading-[1.7] text-[var(--muted-strong)]">
            <p>
              The design of a workplace often feels like a luxury afterthought —
              a nice chair, a softer lamp, a plant here and there. But the most
              successful offices treat atmosphere as a functional system, not a
              decorative layer.
            </p>

            {articleSections.map((section, index) => (
              <p key={index}>{section}</p>
            ))}

            <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5 text-[1.02rem] text-[var(--muted-strong)]">
              “The best spaces do not merely provide comfort; they quietly guide
              the nervous system back toward focus. A shift in material tone, a
              less abrasive light, and a bit of nature can change the shape of
              the entire workday.”
            </div>
          </div>

          <aside className="space-y-4 lg:pt-14">
            <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Key takeaways
              </div>
              <ul className="space-y-3 text-sm leading-6 text-[var(--muted-strong)]">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--foreground)]" />
                  Reduced visual noise can improve sustained attention.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--foreground)]" />
                  Biophilic details encourage recovery and stress relief.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--foreground)]" />
                  Calm environments often produce clearer thinking.
                </li>
              </ul>
            </div>

            <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
              <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Notes
              </div>
              <div className="space-y-3 text-sm leading-6 text-[var(--muted)]">
                <p>
                  Research consistently shows that restorative spaces reduce
                  friction in daily attention.
                </p>
                <p>
                  The strongest offices design for emotional steadiness as much
                  as for productivity.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="pb-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-[22px] border border-[#d9d1c5] bg-[linear-gradient(145deg,#d2d2cf,#84827d)]">
              <div className="aspect-[4/3] w-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.4),transparent_18%),linear-gradient(110deg,rgba(18,18,18,0.34),rgba(18,18,18,0.08)_30%,rgba(255,255,255,0.2)_50%,rgba(18,18,18,0.26)_100%)]" />
            </div>

            <div className="space-y-5 rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--muted-strong)]">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Design note
              </div>
              <h2 className="text-[clamp(2rem,3vw,3.2rem)] leading-[0.9] tracking-[-0.06em] text-[var(--foreground)]">
                The quiet office is not a retreat. It is a tool.
              </h2>
              <p className="text-base leading-7">
                In the best creative environments, friction is reduced before it
                becomes visible. The room supports the work rather than
                demanding attention from it.
              </p>
            </div>
          </div>
        </div>

        <div className="pb-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-[1.5rem] font-normal leading-none tracking-[-0.06em] text-[var(--foreground)]">
              More from Noted
            </h3>
            <button className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--muted-strong)]">
              Archive
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {relatedStories.map((story) => (
              <article
                key={story.title}
                className="overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface-muted)]"
              >
                <div className="h-40 bg-[linear-gradient(135deg,#d9d7d5,#b7b4b1,#8b8784)]" />
                <div className="space-y-3 p-4">
                  <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                    {story.category}
                  </span>
                  <h4 className="text-[1.35rem] leading-[1.1] tracking-[-0.05em] text-[var(--foreground)]">
                    {story.title}
                  </h4>
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    A closer look at how conditions, rituals, and objects shape
                    our best thinking.
                  </p>
                  <button className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--foreground)]">
                    Read story
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
