import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Rent Bing. Contact us about available properties, property management services, or general inquiries.",
};

const contactInfo = [
  {
    label: "Email",
    value: "contact@rentbing.com",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "(509) 555-0123",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: "Office",
    value: "Tri-Cities, WA",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        badge="Get in Touch"
      />

      <Section background="gradient">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card variant="glass" padding="lg">
              <h2 className="mb-6 text-2xl font-bold">Send a Message</h2>
              <ContactForm />
            </Card>
          </div>

          {/* Contact info sidebar */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <Card key={info.label} variant="glass">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-600/20 text-primary-400">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-secondary-300">
                      {info.label}
                    </h3>
                    <p className="mt-1 text-white">{info.value}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card variant="glass">
              <h3 className="mb-3 text-sm font-medium text-secondary-300">
                Office Hours
              </h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex justify-between">
                  <span className="text-secondary-400">Mon - Fri</span>
                  <span className="text-white">9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-secondary-400">Saturday</span>
                  <span className="text-white">10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-secondary-400">Sunday</span>
                  <span className="text-white">Closed</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
