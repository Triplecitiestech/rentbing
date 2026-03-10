import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function sanitize(str: string | undefined | null): string {
  return (str || "").trim().replace(/<[^>]*>/g, "");
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface ContactPayload {
  first_name: string;
  last_name?: string;
  phone: string;
  email: string;
  bedrooms?: string[];
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    const first_name = sanitize(body.first_name);
    const last_name = sanitize(body.last_name);
    const phone = sanitize(body.phone);
    const email = sanitize(body.email);
    const message = sanitize(body.message);
    const bedrooms = Array.isArray(body.bedrooms)
      ? body.bedrooms.map((b) => sanitize(b)).filter(Boolean)
      : [];

    if (!first_name || !phone || !email) {
      return NextResponse.json(
        { error: "First name, phone, and email are required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from("inquiries").insert({
      first_name,
      last_name: last_name || null,
      phone,
      email,
      bedrooms,
      message: message || null,
    });

    if (dbError) {
      console.error("Failed to save inquiry:", dbError);
      // Don't fail the request — we still want to acknowledge the submission
    }

    // TODO: Sync with Buildium when API is configured
    // TODO: Send email notification via Resend when configured

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
