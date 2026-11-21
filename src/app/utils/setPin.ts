async function createPin(pinValue: string) {
    const res = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin_value: pinValue, active: true }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
    }
    return data;
}

export default createPin;