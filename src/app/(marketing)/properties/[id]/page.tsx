import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";
import { ImageGallery } from "@/components/properties/ImageGallery";
import {
  RentalPropertyJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/JsonLd";
import { cn } from "@/utils/cn";

interface PropertyDetail {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string | null;
  price: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number | null;
  property_type: string;
  status: string;
  property_images: { id: string; image_url: string; sort_order: number }[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: property } = await supabase
      .from("properties")
      .select("title, address, bedrooms, bathrooms, price")
      .eq("id", id)
      .single();

    if (!property) return { title: "Property Not Found" };

    const title = `${property.title} — ${property.bedrooms}BR — ${property.price}`;
    const description = `${property.title} at ${property.address}. ${property.bedrooms} bedroom, ${property.bathrooms} bath apartment for rent near Binghamton University.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | RentBing`,
        description,
        url: `${siteConfig.url}/properties/${id}`,
      },
    };
  } catch {
    return { title: "Property Not Found" };
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  let prop: PropertyDetail | null = null;

  try {
    const supabase = await createClient();
    const { data: property } = await supabase
      .from("properties")
      .select("*, property_images(id, image_url, sort_order)")
      .eq("id", id)
      .single();

    prop = property as PropertyDetail | null;
  } catch {
    notFound();
  }

  if (!prop) notFound();

  const images = prop.property_images?.sort((a, b) => a.sort_order - b.sort_order) || [];

  const propertyUrl = `${siteConfig.url}/properties/${prop.id}`;

  return (
    <div className="min-h-screen bg-secondary-950">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Properties", url: `${siteConfig.url}/properties` },
          { name: prop.title, url: propertyUrl },
        ]}
      />
      <RentalPropertyJsonLd
        name={prop.title}
        description={prop.description || ""}
        address={prop.address}
        city={prop.city}
        state={prop.state}
        zip={prop.zip}
        price={prop.price}
        bedrooms={prop.bedrooms}
        bathrooms={prop.bathrooms}
        squareFeet={prop.square_feet}
        url={propertyUrl}
        images={images.map((img) => img.image_url)}
        status={prop.status}
      />
      {/* Hero image */}
      {images.length > 0 ? (
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
          <img
            src={images[0].image_url}
            alt={prop.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center bg-secondary-800">
          <svg className="h-24 w-24 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
      )}

      <Container className="relative z-10 -mt-16 pb-16">
        {/* Title card */}
        <div className="rounded-xl border border-secondary-700/50 bg-secondary-900/95 p-6 backdrop-blur sm:p-8">
          {/* Title row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">{prop.title}</h1>
              <Badge variant={prop.status === "available" ? "success" : "default"}>
                {prop.status === "available" ? "For Rent" : "Rented"}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary-400 sm:text-3xl">{prop.price}</p>
          </div>
          <p className="mt-2 text-secondary-400">
            {prop.address}, {prop.city}, {prop.state} {prop.zip}
          </p>

          {/* Details grid */}
          <div className={cn(
            "mt-6 grid gap-4",
            prop.square_feet ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
          )}>
            <div className="rounded-lg border border-secondary-700/50 bg-secondary-800/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-secondary-400">Bedrooms</p>
              <p className="mt-1 text-xl font-bold">{prop.bedrooms}</p>
            </div>
            <div className="rounded-lg border border-secondary-700/50 bg-secondary-800/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-secondary-400">Bathrooms</p>
              <p className="mt-1 text-xl font-bold">{prop.bathrooms}</p>
            </div>
            <div className="rounded-lg border border-secondary-700/50 bg-secondary-800/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-secondary-400">Type</p>
              <p className="mt-1 text-xl font-bold capitalize">{prop.property_type}</p>
            </div>
            {prop.square_feet && (
              <div className="rounded-lg border border-secondary-700/50 bg-secondary-800/50 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-secondary-400">Sq Ft</p>
                <p className="mt-1 text-xl font-bold">{prop.square_feet.toLocaleString()}</p>
              </div>
            )}
          </div>

          {prop.description && (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-semibold">Description</h2>
              <p className="text-secondary-300 leading-relaxed">{prop.description}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">Inquire About This Property</Button>
            </Link>
            <a href={siteConfig.externalLinks.application} target="_blank" rel="noopener noreferrer" className="sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Apply Now</Button>
            </a>
            <a href={`tel:${siteConfig.phone}`} className="sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">{siteConfig.phone}</Button>
            </a>
          </div>
        </div>

        {/* Image gallery */}
        {images.length > 1 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">Photos</h2>
            <ImageGallery
              images={images.map((img) => ({
                url: img.image_url,
                alt: `${prop.title} photo`,
              }))}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
