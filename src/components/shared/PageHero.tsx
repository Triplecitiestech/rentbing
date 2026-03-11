import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  badge,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-primary-800 via-primary-900 to-secondary-950 py-20 sm:py-28 lg:py-32",
        className
      )}
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl" />
      </div>
      <Container className="relative z-10 text-center">
        {badge && (
          <span className="mb-4 inline-block rounded-full bg-primary-600/20 px-4 py-1.5 text-sm font-medium text-primary-400 border border-primary-500/30">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary-400 sm:text-xl">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
