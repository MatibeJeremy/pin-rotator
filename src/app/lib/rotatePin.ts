import { randomInt } from "crypto";
import { apiPost } from "@/app/api/database";
import { sendMail } from "./mailer";
import { pinEmail } from "./emailTemplates";

export async function rotatePin() {
    const pin = String(randomInt(0, 10_000)).padStart(4, "0");

    const { subject, text, html } = pinEmail({ pin, appName: "Pin Rotator" });

    // Send first, so a failed email doesn't leave you with a PIN nobody received
    await sendMail({ to: process.env.MAIL_TO!, subject, text, html });

    await apiPost(`UPDATE pins SET active = 0 WHERE active = 1`, []);
    await apiPost(`INSERT INTO pins (pin_value, active) VALUES (?, 1)`, [pin]);
}