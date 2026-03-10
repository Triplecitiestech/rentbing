"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadedAt] = useState(Date.now());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _gotcha: "", // honeypot
          _loadedAt: loadedAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to send message"
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 p-6 text-center">
        <h3 className="text-lg font-semibold text-accent-emerald">
          Message Sent!
        </h3>
        <p className="mt-2 text-sm text-secondary-300">
          Thank you for reaching out. We&apos;ll get back to you within 24
          hours.
        </p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label="Name"
          placeholder="Your full name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <Input
        id="phone"
        label="Phone (optional)"
        type="tel"
        placeholder="(509) 555-0123"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Textarea
        id="message"
        label="Message"
        placeholder="How can we help you?"
        required
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      <Button type="submit" isLoading={status === "loading"} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
