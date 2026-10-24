type BylineRowProps = {
  authorFirst: string;
  authorLast: string;
  wordCount: number;
  published: boolean;
};

export function BylineRow({ authorFirst, authorLast, wordCount, published }: BylineRowProps) {
  return (
    <div className="mt-5 grid grid-cols-4 gap-x-4 border-y border-[#e0d8ce] py-3">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b9188]">By</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1c1b1a]">
          {authorFirst}<br />{authorLast}
        </p>
      </div>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b9188]">Month</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1c1b1a]">
          {new Date().toLocaleString("default", { month: "long" })}<br />
          {new Date().getFullYear()}
        </p>
      </div>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b9188]">Word Count</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1c1b1a]">
          {wordCount.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b9188]">Status</p>
        <div className="mt-0.5 inline-flex items-center rounded-sm bg-[#1c1b1a] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
          {published ? "Published" : "Ready to Publish"}
        </div>
      </div>
    </div>
  );
}
