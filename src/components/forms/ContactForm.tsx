"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const BEDROOM_OPTIONS = [
  "Two Bedroom",
  "Three Bedroom",
  "Studio/One Bedroom",
  "Other",
];

interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  bedrooms: string[];
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    bedrooms: [],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleBedroom(option: string) {
    setForm((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(option)
        ? prev.bedrooms.filter((b) => b !== option)
        : [...prev.bedrooms, option],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");
      setForm({ first_name: "", last_name: "", phone: "", email: "", bedrooms: [], message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 p-6 text-center">
        <h3 className="text-lg font-semibold text-accent-emerald">
          Message Sent!
        </h3>
        <p className="mt-2 text-sm text-secondary-300">
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
        <Button variant="ghost" className="mt-4" onClick={() => setStatus("idle")}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="first_name"
          label="First name *"
          required
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <Input
          id="last_name"
          label="Last name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
      </div>
      <Input
        id="phone"
        label="Phone *"
        type="tel"
        required
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input
        id="email"
        label="Email *"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Bedroom preference checkboxes */}
      <div>
        <p className="mb-2 text-sm font-medium text-secondary-300">
          How Many Bedrooms is your group looking for?
        </p>
        <div className="space-y-2">
          {BEDROOM_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.bedrooms.includes(option)}
                onChange={() => toggleBedroom(option)}
                className="h-4 w-4 rounded border-secondary-600 bg-secondary-800 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-300">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <Textarea
        id="message"
        label="Message"
        placeholder="Tell us what you're looking for..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      <Button type="submit" isLoading={status === "loading"} className="w-full">
        Submit
      </Button>
    </form>
  );
}
