import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export function ServiceCard({
  title,
  description,
  features,
  ctaText,
  ctaHref,
}: ServiceCardProps) {
  return (
    <Card variant="glass" hover className="flex flex-col">
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-secondary-400">{description}</p>
      <ul className="mb-6 flex-1 space-y-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-secondary-300"
          >
            <span className="mt-0.5 text-accent-emerald">&#10003;</span>
            {feature}
          </li>
        ))}
      </ul>
      <Link href={ctaHref}>
        <Button variant="outline" className="w-full">
          {ctaText}
        </Button>
      </Link>
    </Card>
  );
}
