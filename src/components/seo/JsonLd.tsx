import { siteConfig } from "@/config/site";

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "132 Washington Street",
      addressLocality: "Binghamton",
      addressRegion: "NY",
      postalCode: "13901",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.0987,
      longitude: -75.9179,
    },
    areaServed: {
      "@type": "City",
      name: "Binghamton",
      containedInPlace: {
        "@type": "State",
        name: "New York",
      },
    },
    priceRange: "$600 - $1,525",
    serviceType: ["Student Housing", "Apartment Rentals", "Off-Campus Housing"],
    sameAs: [siteConfig.externalLinks.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "132 Washington Street",
      addressLocality: "Binghamton",
      addressRegion: "NY",
      postalCode: "13901",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: siteConfig.phone,
      email: siteConfig.contactEmail,
      availableLanguage: "English",
    },
    sameAs: [siteConfig.externalLinks.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface RentalPropertyJsonLdProps {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number | null;
  url: string;
  images?: string[];
  status: string;
}

export function RentalPropertyJsonLd({
  name,
  description,
  address,
  city,
  state,
  zip,
  price,
  bedrooms,
  bathrooms,
  squareFeet,
  url,
  images,
  status,
}: RentalPropertyJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name,
    description:
      description ||
      `${bedrooms} bedroom apartment for rent at ${address}, ${city}, ${state}`,
    url,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: state,
      postalCode: zip,
      addressCountry: "US",
    },
    numberOfRooms: bedrooms,
    numberOfBedrooms: bedrooms,
    numberOfBathroomsTotal: bathrooms,
    ...(squareFeet && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: squareFeet,
        unitCode: "FTK",
      },
    }),
    ...(images && images.length > 0 && { image: images }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability:
        status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
