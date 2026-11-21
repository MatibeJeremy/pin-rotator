export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") return;

    const { default: cron } = await import("node-cron");
    const { rotatePin } = await import("./lib/rotatePin");

    cron.schedule(
        "*/10 * * * *",
        async () => {
            try {
                await rotatePin();
                console.log("PIN rotated and emailed");
            } catch (err) {
                console.error("PIN rotation failed:", err);
            }
        },
        { timezone: "Africa/Nairobi" }
    );
}