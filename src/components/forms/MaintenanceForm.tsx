"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC / Heating / Cooling" },
  { value: "appliance", label: "Appliance" },
  { value: "structural", label: "Structural / Doors / Windows" },
  { value: "pest", label: "Pest Control" },
  { value: "exterior", label: "Exterior / Landscaping" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low - Cosmetic or minor issue" },
  { value: "medium", label: "Medium - Needs attention soon" },
  { value: "high", label: "High - Significantly impacts livability" },
  { value: "emergency", label: "Emergency - Immediate safety concern" },
];

interface MaintenanceData {
  name: string;
  email: string;
  phone: string;
  property_address: string;
  unit_number: string;
  category: string;
  priority: string;
  description: string;
}

export function MaintenanceForm() {
  const [form, setForm] = useState<MaintenanceData>({
    name: "",
    email: "",
    phone: "",
    property_address: "",
    unit_number: "",
    category: "",
    priority: "medium",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update(field: keyof MaintenanceData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 p-6 text-center">
        <h3 className="text-lg font-semibold text-accent-emerald">Request Submitted!</h3>
        <p className="mt-2 text-sm text-secondary-300">
          We&apos;ve received your maintenance request and will respond within 24 hours.
        </p>
        <Button variant="ghost" className="mt-4" onClick={() => setStatus("idle")}>
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id="maint_name" label="Your Name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        <Input id="maint_email" label="Email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id="maint_phone" label="Phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <Input id="maint_unit" label="Unit Number (if applicable)" value={form.unit_number} onChange={(e) => update("unit_number", e.target.value)} />
      </div>
      <Input id="maint_address" label="Property Address" required value={form.property_address} onChange={(e) => update("property_address", e.target.value)} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select id="maint_category" label="Category" required value={form.category} onChange={(e) => update("category", e.target.value)} options={CATEGORIES} placeholder="Select category" />
        <Select id="maint_priority" label="Priority" required value={form.priority} onChange={(e) => update("priority", e.target.value)} options={PRIORITIES} />
      </div>
      <Textarea id="maint_desc" label="Description" required placeholder="Please describe the issue in detail..." value={form.description} onChange={(e) => update("description", e.target.value)} />

      {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}

      <Button type="submit" isLoading={status === "loading"} className="w-full sm:w-auto">
        Submit Request
      </Button>
    </form>
  );
}
