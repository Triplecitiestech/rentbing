"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface CarouselProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  status: string;
  property_images: { image_url: string; sort_order: number }[];
}

interface PropertyCarouselProps {
  properties: CarouselProperty[];
}

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = properties.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, total]);

  if (total === 0) return null;

  const property = properties[current];
  const mainImage = property.property_images?.sort(
    (a, b) => a.sort_order - b.sort_order
  )[0];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main carousel card */}
      <Link
        href={`/properties/${property.id}`}
        className="group block overflow-hidden rounded-2xl border border-secondary-700/50 bg-secondary-900 transition-all duration-300 hover:border-primary-600/50 hover:shadow-2xl hover:shadow-primary-500/10"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96 lg:w-3/5">
            {mainImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={property.id}
                src={mainImage.image_url}
                alt={property.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-600/80 via-primary-700/60 to-primary-900/80">
                <svg
                  className="h-20 w-20 text-white/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
            <div className="absolute right-4 top-4">
              <Badge
                variant={
                  property.status === "available" ? "success" : "default"
                }
              >
                {property.status === "available" ? "For Rent" : "Rented"}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="mb-2 inline-block w-fit rounded-full bg-primary-500 px-3 py-1 text-xs font-bold text-white">
              {property.price}
            </div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              {property.title}
            </h3>
            <p className="mt-2 text-sm text-secondary-400">
              {property.address}, {property.city}, {property.state}
            </p>
            <div className="mt-4 flex items-center gap-5 text-sm text-secondary-300">
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-5 w-5 text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21V6.75a.75.75 0 01.75-.75h12a.75.75 0 01.75.75V21"
                  />
                </svg>
                {property.bedrooms}{" "}
                {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-5 w-5 text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "Bath" : "Baths"}
              </span>
              <span className="text-secondary-500">
                {property.property_type}
              </span>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-400 transition-colors group-hover:text-primary-300">
                View Details
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prev();
            }}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
            aria-label="Previous property"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
            aria-label="Next property"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {properties.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-primary-400"
                  : "w-2 bg-secondary-600 hover:bg-secondary-500"
              }`}
              aria-label={`Go to property ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
