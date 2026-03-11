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

// GET: List all maintenance requests
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("maintenance_requests")
    .select("*, properties(title, address)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ requests: data });
}

// PATCH: Update maintenance request status
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, priority } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Request id is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "new",
      "triaged",
      "in_progress",
      "waiting_parts",
      "scheduled",
      "completed",
      "cancelled",
    ];
    const validPriorities = ["low", "medium", "high", "emergency"];

    const updates: Record<string, unknown> = {};
    if (status) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      updates.status = status;
    }
    if (priority) {
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          {
            error: `Invalid priority. Must be: ${validPriorities.join(", ")}`,
          },
          { status: 400 }
        );
      }
      updates.priority = priority;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("maintenance_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ request: data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
