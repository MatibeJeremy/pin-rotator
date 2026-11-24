export default async function checkEmail(email: string): Promise<boolean> {
  console.log("Email >>>", email);  
  const res = await fetch("/api/pin/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return Boolean(data.registered);
}
