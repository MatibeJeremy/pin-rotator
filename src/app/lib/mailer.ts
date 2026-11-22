type MailOptions = { to: string; subject: string; text: string; html?: string };

export async function sendMail({ to, subject, text, html }: MailOptions) {
    const key = process.env.MAILJET_API_KEY;
    const secret = process.env.MAILJET_SECRET_KEY;
    const fromEmail = process.env.MAIL_FROM_EMAIL;
    if (!key || !secret || !fromEmail) {
        throw new Error("MAILJET_API_KEY, MAILJET_SECRET_KEY and MAIL_FROM_EMAIL must be set");
    }

    console.log("[mail] sending via Mailjet API");

    const res = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            Authorization: "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
            "content-type": "application/json",
        },
        body: JSON.stringify({
            Messages: [
                {
                    From: { Email: fromEmail, Name: process.env.MAIL_FROM_NAME ?? "Pin Rotator" },
                    To: [{ Email: to }],
                    Subject: subject,
                    TextPart: text,
                    ...(html ? { HTMLPart: html } : {}),
                },
            ],
        }),
        signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
        throw new Error(`Mailjet API error ${res.status}: ${await res.text()}`);
    }
}