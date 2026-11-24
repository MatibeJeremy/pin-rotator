async function validatePin(pinValue: string, email: string) {
    const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin_value: pinValue, email: email}),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
    }
    return data;
}

export default validatePin;