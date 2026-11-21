import nodemailer from "nodemailer";

async function main() {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.verify();
    console.log("SMTP login OK");

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: "SMTP test",
        text: "If you can read this, email sending works.",
    });
    console.log("Test email sent");
}

main().catch((err) => {
    console.error("SMTP test failed:", err.message);
    process.exit(1);
});