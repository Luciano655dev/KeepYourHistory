import nodemailer from "nodemailer";

export const runtime = "nodejs";

type RequestPayload = {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeString(value: unknown, maxLength = 1000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSmtpErrorMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown SMTP error");

  if (message.includes("535") || message.toLowerCase().includes("badcredentials")) {
    return "SMTP login failed. For Gmail, use a Google App Password in SMTP_PASS.";
  }

  if (message.toLowerCase().includes("enotfound")) {
    return "SMTP host could not be reached. Check SMTP_HOST and network access.";
  }

  if (message.toLowerCase().includes("certificate")) {
    return "SMTP TLS certificate validation failed. Check SMTP security settings.";
  }

  return "Could not send your message right now.";
}

export async function POST(request: Request) {
  let body: Partial<RequestPayload>;

  try {
    body = (await request.json()) as Partial<RequestPayload>;
  } catch {
    return Response.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const organizationName = safeString(body.organizationName, 180);
  const contactName = safeString(body.contactName, 120);
  const email = safeString(body.email, 180).toLowerCase();
  const phone = safeString(body.phone, 80);
  const message = safeString(body.message, 4000);

  if (!organizationName || !contactName || !email || !message) {
    return Response.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return Response.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT ?? "465");
  const smtpSecure = (process.env.SMTP_SECURE ?? "true") === "true";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const recipientEmail =
    process.env.REQUEST_TO_EMAIL ?? "lucianomenezes655@gmail.com";

  if (!smtpUser || !smtpPass) {
    return Response.json(
      { error: "Email service is not configured on the server." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject = `New KeepYourHistory Contact - ${organizationName}`;
  const from = process.env.SMTP_FROM ?? `KeepYourHistory <${smtpUser}>`;

  const text = [
    "New contact submitted from KeepYourHistory website.",
    "",
    `Organization: ${organizationName}`,
    `Contact Name: ${contactName}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h2>New KeepYourHistory Contact</h2>
    <p><strong>Organization:</strong> ${escapeHtml(organizationName)}</p>
    <p><strong>Contact Name:</strong> ${escapeHtml(contactName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to: recipientEmail,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("keepyourhistory contact sendMail error:", error);
    return Response.json(
      { error: getSmtpErrorMessage(error) },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
