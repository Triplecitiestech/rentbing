import { cn } from "@/utils/cn";
import { type HTMLAttributes, forwardRef } from "react";

const variants = {
  default: "bg-secondary-800/50 border border-secondary-700/50",
  elevated:
    "bg-secondary-800/50 border border-secondary-700/50 shadow-xl shadow-black/20",
  glass: "bg-white/5 backdrop-blur-sm border border-white/10",
  outlined: "border border-secondary-600",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingSizes = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hover = false,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl",
          variants[variant],
          paddingSizes[padding],
          hover &&
            "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export { Card };
