import { NextResponse } from "next/server";
import { apiGet, apiPost } from "../database";

export async function POST(req: Request) {
 let body: { pin_value?: unknown; active?: unknown };
 try {
  body = await req.json();
 } catch {
  return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
 }

 const { pin_value, active = true } = body;
 if (typeof pin_value !== "string" || pin_value.length === 0) {
  return NextResponse.json({ error: "pin_value is required" }, { status: 400 });
 }
 if (typeof active !== "boolean") {
  return NextResponse.json({ error: "active must be true or false" }, { status: 400 });
 }

 try {
  if (active) {
   await apiPost(`UPDATE pins SET active = 0 WHERE active = 1`, []);
  }

  await apiPost(
      `INSERT INTO pins (pin_value, active) VALUES (?, ?)`,
      [pin_value, active ? 1 : 0]
  );

  return NextResponse.json(
      { message: "Successfully created new pin" },
      { status: 201 }
  );
 } catch (err) {
  console.error("Failed to create pin:", err);
  return NextResponse.json({ error: "Could not create pin" }, { status: 500 });
 }
}


export async function GET() {
 // Don't select pinValue: the API shouldn't hand stored PINs back to callers
 const query = `SELECT rowid AS id, active FROM pins`;

 try {
  const rows = await apiGet(query);
  return NextResponse.json(rows);
 } catch (err) {
  console.error("Failed to load pins:", err);
  return NextResponse.json({ error: "Could not load pins" }, { status: 500 });
 }
}