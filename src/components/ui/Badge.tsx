import { cn } from "@/utils/cn";

const variants = {
  default: "bg-secondary-700 text-secondary-200",
  primary: "bg-primary-600/20 text-primary-400 border border-primary-500/30",
  success: "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-600/20 text-amber-400 border border-amber-500/30",
  danger: "bg-red-600/20 text-red-400 border border-red-500/30",
} as const;

export interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
