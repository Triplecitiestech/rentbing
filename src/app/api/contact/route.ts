import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const MIN_SUBMISSION_TIME_MS = 3000;

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  _gotcha?: string;
  _loadedAt?: number;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string): string {
  return str.trim().replace(/<[^>]*>/g, "");
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    // Honeypot check
    if (body._gotcha) {
      return NextResponse.json({ success: true, message: "Message sent" });
    }

    // Timing check
    if (body._loadedAt && Date.now() - body._loadedAt < MIN_SUBMISSION_TIME_MS) {
      return NextResponse.json(
        { error: "Please take a moment before submitting" },
        { status: 429 }
      );
    }

    const name = sanitize(body.name || "");
    const email = sanitize(body.email || "");
    const phone = sanitize(body.phone || "");
    const message = sanitize(body.message || "");

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
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
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        phone: phone || null,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("Failed to save contact submission:", dbError);
      // Don't fail the request — email notification is the primary action
    }

    // TODO: Send email via Resend when RESEND_API_KEY is configured
    // For now, just log and save to DB
    console.log("Contact form submission:", { name, email, phone, message });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
