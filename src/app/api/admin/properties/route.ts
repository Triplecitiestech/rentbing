import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.ADMIN_API_KEY;

function isAuthorized(request: NextRequest): boolean {
  if (!ADMIN_KEY) return false;
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_KEY}`;
}

// GET: List all properties with image count
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(id)")
    .order("title");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const properties = (data ?? []).map((p) => ({
    ...p,
    image_count: Array.isArray(p.property_images)
      ? p.property_images.length
      : 0,
    property_images: undefined,
  }));

  return NextResponse.json({ properties });
}

// POST: Create a new property
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      address,
      city,
      state,
      zip,
      description,
      price,
      bedrooms,
      bathrooms,
      square_feet,
      property_type,
      status,
      featured,
    } = body;

    if (!title || !address || !price) {
      return NextResponse.json(
        { error: "title, address, and price are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("properties")
      .insert({
        title,
        address,
        city: city || "Binghamton",
        state: state || "NY",
        zip: zip || "13901",
        description: description || null,
        price,
        bedrooms: bedrooms ?? 1,
        bathrooms: bathrooms ?? 1,
        square_feet: square_feet || null,
        property_type: property_type || "Apartment",
        status: status || "available",
        featured: featured ?? false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ property: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update a property
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Property id is required" },
        { status: 400 }
      );
    }

    // Only allow known fields
    const allowed = [
      "title",
      "address",
      "city",
      "state",
      "zip",
      "description",
      "price",
      "bedrooms",
      "bathrooms",
      "square_feet",
      "property_type",
      "status",
      "featured",
    ];
    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) {
        safeUpdates[key] = updates[key];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("properties")
      .update(safeUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ property: data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a property
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Property id is required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted: id });
}
