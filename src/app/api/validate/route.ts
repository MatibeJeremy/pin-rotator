import { NextResponse } from "next/server";
import { fetchPinByValue } from "@/app/api/database";
import { timingSafeEqual } from "crypto";


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeEqual = (a: string, b: string) => {
  const A = new Uint8Array(Buffer.from(a));
  const B = new Uint8Array(Buffer.from(b));
  return A.length === B.length && timingSafeEqual(A, B);
};

export async function POST(req: Request) {
    let body: { pin_value?: unknown, email?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { pin_value, email } = body;
    if (typeof pin_value !== "string" || !/^\d{4}$/.test(pin_value)) {
      return NextResponse.json(
        { error: "pin_value must be a 4-digit string" },
        { status: 400 },
      );
    }
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

    const normalizedEmail = email.trim().toLowerCase();

    try {
        const row = await fetchPinByValue(pin_value);
        const valid =
          !!row &&
          Boolean(row.active) &&
          typeof row.email === "string" &&
          safeEqual(row.email.trim().toLowerCase(), normalizedEmail);

        if (!valid) {
            return NextResponse.json({ error: "Invalid PIN or email" }, { status: 401 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err){
        console.log("Pin validation failed:", err);
        return NextResponse.json({ error: "Error validating PIN" }, { status: 500 });
    }
}