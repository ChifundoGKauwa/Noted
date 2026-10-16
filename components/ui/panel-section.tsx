import type { ReactNode } from "react";

type PanelSectionProps = {
  label?: string;
  children: ReactNode;
};

export function PanelSection({ label, children }: PanelSectionProps) {
  return (
    <div className="border-b border-[#d4c9b8] px-4 py-4">
      {label && (
        <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9b9188]">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}
