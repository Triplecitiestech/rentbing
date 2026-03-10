import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card variant="glass" hover className={cn("text-center", className)}>
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/20 text-primary-400">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-secondary-400">{description}</p>
    </Card>
  );
}
