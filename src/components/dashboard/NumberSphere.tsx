import { cn } from "@/lib/utils";

interface NumberSphereProps {
  number: number;
  selected?: boolean;
  fixed?: boolean;
  hot?: boolean;
  cold?: boolean;
  small?: boolean;
  onClick?: () => void;
  subtitle?: string;
}

export function NumberSphere({ number, selected, fixed, hot, cold, small, onClick, subtitle }: NumberSphereProps) {
  const base = small
    ? "w-7 h-7 text-xs font-heading font-bold rounded-md flex flex-col items-center justify-center transition-all"
    : "w-10 h-10 text-sm font-heading font-bold rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200";

  const colors = fixed
    ? "bg-orange text-primary-foreground shadow-[0_0_10px_hsl(var(--orange)/0.4)]"
    : selected
    ? "bg-gold text-primary-foreground shadow-[0_0_10px_hsl(var(--gold)/0.4)]"
    : hot
    ? "bg-gold text-primary-foreground"
    : cold
    ? "bg-primary text-primary-foreground"
    : "bg-secondary text-foreground hover:bg-muted";

  return (
    <div className={cn(base, colors)} onClick={onClick}>
      <span>{String(number).padStart(2, "0")}</span>
      {subtitle && <span className="text-[8px] opacity-70">{subtitle}</span>}
    </div>
  );
}
