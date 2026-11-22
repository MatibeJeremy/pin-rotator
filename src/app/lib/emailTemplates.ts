const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
    );

type PinEmailOptions = {
    pin: string;
    appName?: string;
    rotatedAt?: Date;
};

export function pinEmail({ pin, appName = "Pin Rotator", rotatedAt = new Date() }: PinEmailOptions) {
    // The PIN goes into HTML, so only accept digits
    if (!/^\d{4,8}$/.test(pin)) throw new Error("PIN must be 4 to 8 digits");

    const when = rotatedAt.toLocaleString("en-KE", {
        timeZone: "Africa/Nairobi",
        dateStyle: "medium",
        timeStyle: "short",
    });
    const name = escapeHtml(appName);

    const digitCells = pin
        .split("")
        .map(
            (d) => `
        <td align="center" width="56" height="64" style="width:56px;height:64px;background:#f1f3f5;border:2px solid #111111;border-radius:12px;font-family:'SFMono-Regular',Menlo,Consolas,'Courier New',monospace;font-size:30px;font-weight:700;color:#111111;">${escapeHtml(d)}</td>`
        )
        .join("");

    const subject = `Your new ${appName} PIN`;   // never put the PIN in the subject: it shows in previews

    const text = [
        `${appName}`,
        "",
        "Your new PIN",
        "",
        `    ${pin.split("").join(" ")}`,
        "",
        "This PIN replaces your previous one.",
        `Generated: ${when} (EAT)`,
        "",
        "If you didn't expect this email, change your PIN and review your account.",
    ].join("\n");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f4f7;">
    Your PIN has been updated. Open this email to see it.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <!-- Accent bar -->
          <tr><td height="6" style="height:6px;line-height:6px;font-size:0;background:#111111;">&nbsp;</td></tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 32px 0 32px;">
              <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6b7280;font-weight:600;">${name}</div>
              <h1 style="margin:12px 0 0 0;font-size:26px;line-height:32px;color:#111111;font-weight:700;">Your new PIN</h1>
              <p style="margin:12px 0 0 0;font-size:15px;line-height:24px;color:#4b5563;">
                Use this PIN the next time you're asked to verify.
              </p>
            </td>
          </tr>

          <!-- PIN -->
          <tr>
            <td align="center" style="padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:10px 0;">
                <tr>${digitCells}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb;border-radius:12px;">
                <tr>
                  <td style="padding:16px 18px;font-size:13px;line-height:20px;color:#4b5563;">
                    <strong style="color:#111111;">This PIN replaces your previous one.</strong><br>
                    Generated ${escapeHtml(when)} (EAT).
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:0 32px 32px 32px;font-size:12px;line-height:18px;color:#9ca3af;">
              Didn't expect this email? Change your PIN and review your account.<br>
              Never share your PIN with anyone.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return { subject, text, html };
}