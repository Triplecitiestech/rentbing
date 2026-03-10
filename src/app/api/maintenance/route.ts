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
    const property_address = sanitize(body.property_address);
    const category = sanitize(body.category);
    const description = sanitize(body.description);
    const priority = sanitize(body.priority);

    if (!name || !email || !property_address || !category || !description) {
      return NextResponse.json(
        { error: "Name, email, address, category, and description are required" },
        { status: 400 }
      );
    }

    if (!["low", "medium", "high", "emergency"].includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority level" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("maintenance_requests")
      .insert({
        name,
        email,
        phone: sanitize(body.phone) || null,
        property_address,
        unit_number: sanitize(body.unit_number) || null,
        category,
        priority,
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

    // TODO: Send notification email to property manager via Resend

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
