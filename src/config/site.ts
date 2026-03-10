export const siteConfig = {
  name: "RentBing",
  description:
    "Premier off-campus student housing for Binghamton University students and graduate students. Apartments for rent in Binghamton, NY.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@rentbing.com",
  phone: "607-484-7654",
  ogImage: "/og-home.jpg",
  externalLinks: {
    application:
      "https://rentbing1.managebuilding.com/Resident/rental-application/new/apply",
    tenantLogin:
      "https://rentbing1.managebuilding.com/Resident/public/home",
    instagram: "https://www.instagram.com/rentbing",
  },
} as const;
