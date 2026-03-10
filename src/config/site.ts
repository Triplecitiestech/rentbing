export const siteConfig = {
  name: "Rent Bing",
  description:
    "Professional property management services. Find your next rental home or let us manage your investment property.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@rentbing.com",
  ogImage: "/og-home.jpg",
} as const;
