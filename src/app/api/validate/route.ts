import { NextResponse } from "next/server";
import { fetchPinByValue } from "@/app/api/database";

export async function POST(req: Request) {
    let body: { pin_value?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    try {
        const row = await fetchPinByValue(body.pin_value);

        if (!row) {
            return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error validating PIN" }, { status: 500 });
    }
}