/** Renders a markdown-lite body string into React nodes for the preview pane. */
export function DocPreview({ body }: { body: string }) {
  const blocks = body.split("\n\n").filter((b) => b.trim());

  return (
    <div className="mt-6 space-y-1">
      {blocks.map((block, i) => {
        const t = block.trim();

        if (t === "---") return <hr key={i} className="my-6 border-[#d4c9b8]" />;

        if (t.startsWith("> ")) {
          const lines = t.split("\n").map((l) => l.replace(/^>\s?/, ""));
          return (
            <blockquote key={i} className="my-5 border-l-[3px] border-[#1c1b1a] pl-5">
              {lines.map((line, li) =>
                line.startsWith("—") ? (
                  <p key={li} className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6560]">
                    {line}
                  </p>
                ) : (
                  <p key={li} className="text-[1.2rem] italic leading-snug text-[#1c1b1a]" style={{ fontFamily: "Georgia, serif" }}>
                    &ldquo;{line}&rdquo;
                  </p>
                ),
              )}
            </blockquote>
          );
        }

        if (t.startsWith("# "))
          return <h2 key={i} className="mb-3 mt-8 text-[1.5rem] font-bold text-[#1c1b1a]">{t.slice(2)}</h2>;
        if (t.startsWith("## "))
          return <h3 key={i} className="mb-2 mt-6 text-[1.2rem] font-bold text-[#1c1b1a]">{t.slice(3)}</h3>;
        if (t.startsWith("### "))
          return <h4 key={i} className="mb-2 mt-5 text-[1.05rem] font-bold text-[#1c1b1a]">{t.slice(4)}</h4>;

        if (t.split("\n").every((l) => l.trim().startsWith("- "))) {
          const items = t.split("\n").map((l) => l.replace(/^-\s/, ""));
          return (
            <ul key={i} className="my-4 list-none space-y-3 pl-0">
              {items.map((item, ii) => {
                const ci = item.indexOf(": ");
                const label = ci > -1 ? item.slice(0, ci) : null;
                const rest = ci > -1 ? item.slice(ci + 2) : item;
                return (
                  <li key={ii} className="flex gap-2 text-[0.9rem] leading-[1.7] text-[#3a3632]">
                    <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#3a3632]" />
                    <span>
                      {label ? (
                        <><strong className="font-semibold text-[#1c1b1a]">{label}:</strong> {rest}</>
                      ) : item}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (t.split("\n").every((l) => /^\d+\.\s/.test(l.trim()))) {
          const items = t.split("\n").map((l) => l.replace(/^\d+\.\s/, ""));
          return (
            <ol key={i} className="my-4 list-none space-y-2 pl-0">
              {items.map((item, ii) => (
                <li key={ii} className="flex gap-2 text-[0.9rem] leading-[1.7] text-[#3a3632]">
                  <span className="shrink-0 font-semibold text-[#6b6560]">{ii + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          );
        }

        return <p key={i} className="my-4 text-[0.93rem] leading-[1.78] text-[#3a3632]">{t}</p>;
      })}
    </div>
  );
}
