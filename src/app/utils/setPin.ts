async function createPin(pinValue: string, email: string) {
    const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin_value: pinValue,email: email, active: true }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
    }
    return data;
}

export default createPin;