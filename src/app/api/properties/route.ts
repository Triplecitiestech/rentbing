import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, address")
      .order("title");

    if (error) {
      console.error("Failed to fetch properties:", error);
      return NextResponse.json({ properties: [] });
    }

    return NextResponse.json({ properties: data });
  } catch {
    return NextResponse.json({ properties: [] });
  }
}
