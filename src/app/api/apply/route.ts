import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function sanitize(str: string | undefined | null): string {
  return (str || "").trim().replace(/<[^>]*>/g, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const first_name = sanitize(body.first_name);
    const last_name = sanitize(body.last_name);
    const email = sanitize(body.email);
    const phone = sanitize(body.phone);

    if (!first_name || !last_name || !email || !phone) {
      return NextResponse.json(
        { error: "First name, last name, email, and phone are required" },
        { status: 400 }
      );
    }

    if (!body.consent) {
      return NextResponse.json(
        { error: "You must agree to the terms" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error: dbError } = await supabase
      .from("rental_applications")
      .insert({
        first_name,
        last_name,
        email,
        phone,
        date_of_birth: body.date_of_birth || null,
        current_address: sanitize(body.current_address) || null,
        employer: sanitize(body.employer) || null,
        job_title: sanitize(body.job_title) || null,
        monthly_income: body.monthly_income ? Number(body.monthly_income) : null,
        employment_duration: sanitize(body.employment_duration) || null,
        previous_landlord_name: sanitize(body.previous_landlord_name) || null,
        previous_landlord_phone: sanitize(body.previous_landlord_phone) || null,
        previous_address: sanitize(body.previous_address) || null,
        reason_for_leaving: sanitize(body.reason_for_leaving) || null,
        desired_property: sanitize(body.desired_property) || null,
        desired_move_in: body.desired_move_in || null,
        lease_term: sanitize(body.lease_term) || null,
        num_occupants: body.num_occupants ? Number(body.num_occupants) : 1,
        pets: sanitize(body.pets) || null,
        consent: true,
        status: "submitted",
      });

    if (dbError) {
      console.error("Failed to save application:", dbError);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email via Resend

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
