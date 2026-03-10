import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "masscan",
  "nmap",
  "dirbuster",
  "gobuster",
  "nuclei",
  "wpscan",
];

const SQL_INJECTION_PATTERNS = [
  /(\b(union|select|insert|update|delete|drop|alter)\b.*\b(from|into|table|database)\b)/i,
  /(--|;|\/\*|\*\/|xp_|sp_)/i,
  /('|(\\')|(\\\\'))\s*(or|and)\s*('|(\\')|(\\\\'))/i,
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  for (const blocked of BLOCKED_USER_AGENTS) {
    if (userAgent.includes(blocked)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const url = request.nextUrl.search;
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(url)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
