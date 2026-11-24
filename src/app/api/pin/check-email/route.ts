import { NextResponse } from "next/server";
import { emailHasActivePin } from "@/app/api/database";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory limiter: 10 checks per minute per IP.
// It resets on restart and only works for a single server instance.
const hits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 10;
const WINDOW_MS = 60_000;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email } = body;
  console.log("Request >>>", email);

  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !EMAIL_RE.test(email.trim())
  ) {
    return NextResponse.json(
      { error: "A valid email is required" },
      { status: 400 },
    );
  }

  try {
    const registered = await emailHasActivePin(email);
    return NextResponse.json({ registered });
  } catch (err) {
    console.error("Email check failed:", err);
    return NextResponse.json(
      { error: "Could not check email" },
      { status: 500 },
    );
  }
}
