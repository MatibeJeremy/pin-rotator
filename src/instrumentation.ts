export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") return;

    console.log("[cron] register() called");

    // Avoid scheduling twice when dev hot reload re-runs this file
    const g = globalThis as typeof globalThis & { __pinCronStarted?: boolean };
    if (g.__pinCronStarted) return;
    g.__pinCronStarted = true;

    const { default: cron } = await import("node-cron");
    const { rotatePin } = await import("./app/lib/rotatePin");

    cron.schedule(
        "* */12 * * *",
        async () => {
            console.log("[cron] firing");
            try {
                await rotatePin();
                console.log("PIN rotated and emailed");
            } catch (err) {
                console.error("PIN rotation failed:", err);
            }
        },
        { timezone: "Africa/Nairobi" }
    );

    console.log("[cron] scheduled every 12 hours");
}