"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

const STEPS = ["Personal Info", "Employment", "Rental History", "Property & Consent"];

interface ApplicationData {
  // Step 1
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  current_address: string;
  // Step 2
  employer: string;
  job_title: string;
  monthly_income: string;
  employment_duration: string;
  // Step 3
  previous_landlord_name: string;
  previous_landlord_phone: string;
  previous_address: string;
  reason_for_leaving: string;
  // Step 4
  desired_property: string;
  desired_move_in: string;
  lease_term: string;
  num_occupants: string;
  pets: string;
  consent: boolean;
}

const initialData: ApplicationData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  current_address: "",
  employer: "",
  job_title: "",
  monthly_income: "",
  employment_duration: "",
  previous_landlord_name: "",
  previous_landlord_phone: "",
  previous_address: "",
  reason_for_leaving: "",
  desired_property: "",
  desired_move_in: "",
  lease_term: "12",
  num_occupants: "1",
  pets: "",
  consent: false,
};

export function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ApplicationData>(initialData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update(field: keyof ApplicationData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setErrorMessage("You must agree to the terms to submit your application.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/apply", {
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
      <div className="rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 p-8 text-center">
        <h3 className="text-xl font-semibold text-accent-emerald">Application Submitted!</h3>
        <p className="mt-3 text-secondary-300">
          Thank you for applying. We&apos;ll review your application and get back to you within 2-3 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Step indicators */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step
                  ? "bg-primary-600 text-white"
                  : "bg-secondary-700 text-secondary-400"
              }`}
            >
              {i + 1}
            </div>
            <span className="hidden text-sm text-secondary-400 sm:inline">{label}</span>
            {i < STEPS.length - 1 && (
              <div className="mx-2 hidden h-px w-8 bg-secondary-700 sm:block lg:w-16" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="first_name" label="First Name" required value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
            <Input id="last_name" label="Last Name" required value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="email" label="Email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
            <Input id="phone" label="Phone" type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="dob" label="Date of Birth" type="date" value={form.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)} />
            <Input id="current_address" label="Current Address" value={form.current_address} onChange={(e) => update("current_address", e.target.value)} />
          </div>
        </div>
      )}

      {/* Step 2: Employment */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Employment & Income</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="employer" label="Employer" value={form.employer} onChange={(e) => update("employer", e.target.value)} />
            <Input id="job_title" label="Job Title" value={form.job_title} onChange={(e) => update("job_title", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="monthly_income" label="Monthly Income ($)" type="number" value={form.monthly_income} onChange={(e) => update("monthly_income", e.target.value)} />
            <Input id="employment_duration" label="How long at current job?" value={form.employment_duration} onChange={(e) => update("employment_duration", e.target.value)} />
          </div>
        </div>
      )}

      {/* Step 3: Rental History */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Rental History</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="prev_landlord" label="Previous Landlord Name" value={form.previous_landlord_name} onChange={(e) => update("previous_landlord_name", e.target.value)} />
            <Input id="prev_landlord_phone" label="Landlord Phone" type="tel" value={form.previous_landlord_phone} onChange={(e) => update("previous_landlord_phone", e.target.value)} />
          </div>
          <Input id="previous_address" label="Previous Address" value={form.previous_address} onChange={(e) => update("previous_address", e.target.value)} />
          <Textarea id="reason_for_leaving" label="Reason for Leaving" value={form.reason_for_leaving} onChange={(e) => update("reason_for_leaving", e.target.value)} />
        </div>
      )}

      {/* Step 4: Property & Consent */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Preference</h3>
          <Input id="desired_property" label="Desired Property / Location" value={form.desired_property} onChange={(e) => update("desired_property", e.target.value)} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input id="desired_move_in" label="Desired Move-in Date" type="date" value={form.desired_move_in} onChange={(e) => update("desired_move_in", e.target.value)} />
            <Select
              id="lease_term"
              label="Lease Term"
              value={form.lease_term}
              onChange={(e) => update("lease_term", e.target.value)}
              options={[
                { value: "6", label: "6 months" },
                { value: "12", label: "12 months" },
                { value: "24", label: "24 months" },
              ]}
            />
            <Input id="num_occupants" label="Number of Occupants" type="number" min="1" value={form.num_occupants} onChange={(e) => update("num_occupants", e.target.value)} />
          </div>
          <Input id="pets" label="Pets (type, breed, weight)" placeholder="e.g., Dog, Labrador, 60 lbs" value={form.pets} onChange={(e) => update("pets", e.target.value)} />

          <div className="mt-6 rounded-lg border border-secondary-700 bg-secondary-800/50 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-secondary-600 bg-secondary-800 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-secondary-300">
                I certify that the information provided is accurate and complete. I authorize Rent Bing to verify the information and conduct background/credit checks as part of the application process. I understand that providing false information may result in denial of my application.
              </span>
            </label>
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 0}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button type="submit" isLoading={status === "loading"}>
            Submit Application
          </Button>
        )}
      </div>
    </form>
  );
}
