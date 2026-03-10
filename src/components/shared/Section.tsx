import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";

const backgrounds = {
  dark: "bg-secondary-900",
  darker: "bg-secondary-950",
  gradient:
    "bg-gradient-to-b from-secondary-900 via-secondary-950 to-secondary-900",
  primary: "bg-gradient-to-br from-primary-900/50 via-secondary-900 to-secondary-950",
} as const;

export interface SectionProps {
  children: React.ReactNode;
  id?: string;
  background?: keyof typeof backgrounds;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  id,
  background = "dark",
  className,
  containerSize = "lg",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-16 sm:py-20 lg:py-24 overflow-hidden", backgrounds[background], className)}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
