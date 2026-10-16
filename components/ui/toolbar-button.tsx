import { cn } from "@/lib/utils";

type TbBtnProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  small?: boolean;
  active?: boolean;
  disabled?: boolean;
  /** Use onMouseDown, NOT onClick, so the textarea doesn't lose focus/selection */
  onMouseDown?: (e: React.MouseEvent) => void;
};

export function TbBtn({ icon: Icon, label, small, active, disabled, onMouseDown }: TbBtnProps) {
  return (
    <button
      type="button"
      title={label}
      disabled={disabled}
      onMouseDown={onMouseDown}
      className={cn(
        "flex items-center justify-center rounded transition-colors",
        small ? "h-5 w-5" : "h-7 w-7",
        active ? "bg-[#1c1b1a] text-white" : "text-[#3a3632] hover:bg-[#ede7dc]",
        disabled ? "cursor-not-allowed opacity-30" : "",
      )}
    >
      <Icon className={small ? "h-3 w-3" : "h-3.5 w-3.5"} />
    </button>
  );
}

export function TbDivider() {
  return <span className="mx-1 h-4 w-px shrink-0 bg-[#d4c9b8]" />;
}
