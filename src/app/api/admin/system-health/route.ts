import { NextResponse } from "next/server";
import type { HealthCheckResult, ServiceHealth } from "@/types";

export const dynamic = "force-dynamic";

async function checkSupabase(): Promise<ServiceHealth> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { status: "unconfigured", message: "SUPABASE_URL not set" };
  }
  try {
    const start = Date.now();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        },
      }
    );
    const latency = Date.now() - start;
    return res.ok
      ? { status: "healthy", latency }
      : { status: "degraded", latency, message: `HTTP ${res.status}` };
  } catch (error) {
    return {
      status: "down",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function checkEmail(): ServiceHealth {
  if (!process.env.RESEND_API_KEY) {
    return { status: "unconfigured", message: "RESEND_API_KEY not set" };
  }
  return { status: "healthy" };
}

function checkTurnstile(): ServiceHealth {
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    return { status: "unconfigured", message: "TURNSTILE keys not set" };
  }
  return { status: "healthy" };
}

export async function GET() {
  const [supabase] = await Promise.allSettled([checkSupabase()]);

  const services: Record<string, ServiceHealth> = {
    supabase:
      supabase.status === "fulfilled"
        ? supabase.value
        : { status: "down", message: "Check failed" },
    email: checkEmail(),
    turnstile: checkTurnstile(),
  };

  const statuses = Object.values(services).map((s) => s.status);
  let overall: HealthCheckResult["status"] = "healthy";
  if (statuses.includes("down")) overall = "down";
  else if (statuses.includes("degraded") || statuses.includes("unconfigured"))
    overall = "degraded";

  const result: HealthCheckResult = {
    status: overall,
    services,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(result);
}
