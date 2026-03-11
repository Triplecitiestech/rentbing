import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function sanitize(str: string | undefined | null): string {
  return (str || "").trim().replace(/<[^>]*>/g, "");
}

const VALID_CATEGORIES = [
  "plumbing", "electrical", "hvac", "appliance",
  "structural", "pest", "exterior", "general", "other",
];

const VALID_PRIORITIES = ["low", "medium", "high", "emergency"];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const title = sanitize(body.title);
    const description = sanitize(body.description);
    const category = sanitize(body.category);
    const priority = sanitize(body.priority);

    if (!name || !email || !title || !description || !category) {
      return NextResponse.json(
        { error: "Name, email, title, description, and category are required" },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("maintenance_requests")
      .insert({
        property_id: body.property_id || null,
        name,
        email,
        phone: sanitize(body.phone) || null,
        unit_number: sanitize(body.unit_number) || null,
        category,
        priority,
        title,
        description,
        status: "new",
      });

    if (dbError) {
      console.error("Failed to save maintenance request:", dbError);
      return NextResponse.json(
        { error: "Failed to submit request" },
        { status: 500 }
      );
    }

    // TODO: Sync to Buildium when API is configured
    // TODO: Send email notification via Resend when configured

    return NextResponse.json({
      success: true,
      message: "Maintenance request submitted",
    });
  } catch (error) {
    console.error("Maintenance request error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
