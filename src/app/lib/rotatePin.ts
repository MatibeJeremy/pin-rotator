import { randomInt } from "crypto";
import { apiPost } from "@/app/api/database";
import { sendMail } from "./mailer";

export async function rotatePin() {
    const pin = String(randomInt(0, 10_000)).padStart(4, "0");   // crypto-grade, keeps leading zeros

    await apiPost(`UPDATE pins SET active = 0 WHERE active = 1`, []);
    await apiPost(`INSERT INTO pins (pin_value, active) VALUES (?, 1)`, [pin]);

    await sendMail(
        process.env.MAIL_TO!,
        "Your new PIN",
        `Your new PIN is ${pin}.`
    );
}