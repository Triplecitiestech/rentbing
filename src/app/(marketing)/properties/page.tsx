import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Properties For Rent",
  description:
    "Browse available apartments for rent near Binghamton University. Two bedrooms, studios, and multi-bedroom units in Downtown Binghamton.",
  openGraph: {
    title: "Properties For Rent | RentBing",
    description:
      "Browse available apartments for rent near Binghamton University. Now leasing for 2026-2027.",
  },
};

export const dynamic = "force-dynamic";

interface PropertyWithImages {
  id: string;
  title: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  status: string;
  property_images: { image_url: string; sort_order: number }[];
}

export default async function PropertiesPage() {
  let listings: PropertyWithImages[] = [];
  let dbError: string | null = null;

  try {
    const supabase = await createClient();
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*, property_images(image_url, sort_order)")
      .order("created_at", { ascending: false });

    if (error) {
      dbError = error.message;
    }
    listings = properties || [];
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Failed to connect to database";
  }

  return (
    <>
      <PageHero
        title="Properties For Rent"
        subtitle="Off-campus apartments near Binghamton University"
      />

      <Section background="gradient">
        {dbError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-600/10 px-4 py-3 text-sm text-red-400">
            <strong>Database error:</strong> {dbError}
          </div>
        )}
        {listings.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-secondary-400">
              Property listings are being set up. Please check back soon or
              contact us directly.
            </p>
            <Link href="/contact" className="mt-4 inline-block">
              <Button>Contact Us</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {listings.map((property) => {
              const mainImage = property.property_images?.sort(
                (a, b) => a.sort_order - b.sort_order
              )[0];
              const thumbnails = property.property_images
                ?.sort((a, b) => a.sort_order - b.sort_order)
                .slice(0, 4);

              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group block"
                >
                <Card
                  variant="glass"
                  padding="none"
                  className="overflow-hidden transition-all duration-300 group-hover:border-primary-600/50 group-hover:shadow-2xl group-hover:shadow-primary-500/10"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image section */}
                    <div className="shrink-0 sm:w-64 lg:w-80">
                      {mainImage ? (
                        <div>
                          <img
                            src={mainImage.image_url}
                            alt={property.title}
                            className="h-48 w-full object-cover sm:h-full"
                          />
                          {thumbnails && thumbnails.length > 1 && (
                            <div className="flex gap-1 p-1">
                              {thumbnails.slice(1).map((img, i) => (
                                <img
                                  key={i}
                                  src={img.image_url}
                                  alt={`${property.title} photo ${i + 2}`}
                                  className="h-12 w-12 rounded object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-secondary-800 sm:h-full">
                          <svg className="h-16 w-16 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-xl font-bold">{property.title}</h2>
                          <Badge variant={property.status === "available" ? "success" : "default"}>
                            {property.status === "available" ? "For Rent" : "Rented"}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-secondary-300">
                          <span className="inline-flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
                          </span>
                          <span className="text-secondary-600">·</span>
                          <span className="inline-flex items-center gap-1.5">
                            {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
                          </span>
                          <span className="text-secondary-600">·</span>
                          <span className="capitalize">{property.property_type}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-lg font-bold text-primary-400">
                          {property.price}
                        </p>
                        <span className="text-sm font-medium text-primary-400 transition-colors group-hover:text-primary-300">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
