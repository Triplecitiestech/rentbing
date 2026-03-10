import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Available Rentals",
  description:
    "Browse available rental properties managed by Rent Bing. Find apartments, houses, and townhomes in the Tri-Cities area.",
};

interface PlaceholderProperty {
  id: string;
  name: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  available: boolean;
}

const placeholderProperties: PlaceholderProperty[] = [
  {
    id: "1",
    name: "Sunset Ridge Apartment",
    address: "123 Main St, Richland, WA",
    beds: 2,
    baths: 1,
    sqft: 950,
    rent: 1200,
    available: true,
  },
  {
    id: "2",
    name: "River View Townhome",
    address: "456 Columbia Dr, Kennewick, WA",
    beds: 3,
    baths: 2,
    sqft: 1400,
    rent: 1650,
    available: true,
  },
  {
    id: "3",
    name: "Downtown Loft",
    address: "789 George Washington Way, Richland, WA",
    beds: 1,
    baths: 1,
    sqft: 650,
    rent: 950,
    available: true,
  },
  {
    id: "4",
    name: "Garden Court Home",
    address: "321 Clearwater Ave, Kennewick, WA",
    beds: 4,
    baths: 2,
    sqft: 1800,
    rent: 2100,
    available: false,
  },
  {
    id: "5",
    name: "Pasco Family Duplex",
    address: "555 Road 68, Pasco, WA",
    beds: 3,
    baths: 1.5,
    sqft: 1200,
    rent: 1400,
    available: true,
  },
  {
    id: "6",
    name: "Hillside Studio",
    address: "222 Jadwin Ave, Richland, WA",
    beds: 0,
    baths: 1,
    sqft: 450,
    rent: 750,
    available: true,
  },
];

function PropertyCard({ property }: { property: PlaceholderProperty }) {
  return (
    <Card variant="glass" hover padding="none" className="overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-secondary-700 to-secondary-800 flex items-center justify-center">
        <svg className="h-16 w-16 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">{property.name}</h3>
          <Badge variant={property.available ? "success" : "danger"}>
            {property.available ? "Available" : "Leased"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-secondary-400">{property.address}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-secondary-300">
          <span>{property.beds === 0 ? "Studio" : `${property.beds} Bed`}</span>
          <span>{property.baths} Bath</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-primary-400">
            ${property.rent.toLocaleString()}
            <span className="text-sm font-normal text-secondary-400">/mo</span>
          </p>
          {property.available && (
            <Link href="/contact">
              <Button size="sm" variant="outline">
                Inquire
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function PropertiesPage() {
  return (
    <>
      <PageHero
        title="Available Rentals"
        subtitle="Browse our current listings and find your next home."
        badge="Properties"
      />

      <Section background="gradient">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-secondary-400">
            Property listings will be updated with live data from our management
            system. Contact us for the latest availability.
          </p>
        </div>
      </Section>
    </>
  );
}
