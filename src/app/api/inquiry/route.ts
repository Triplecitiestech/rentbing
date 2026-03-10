import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function sanitize(str: string | undefined | null): string {
  return (str || "").trim().replace(/<[^>]*>/g, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const message = sanitize(body.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("rental_inquiries")
      .insert({
        name,
        email,
        phone: sanitize(body.phone) || null,
        property_name: sanitize(body.property_name) || null,
        move_in_date: body.move_in_date || null,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("Failed to save inquiry:", dbError);
      return NextResponse.json(
        { error: "Failed to submit inquiry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
