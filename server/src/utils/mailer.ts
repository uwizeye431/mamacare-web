import nodemailer, { type Transporter } from 'nodemailer';
import { promises as dns } from 'dns';

let transporter: Transporter | null = null;

const getTransporter = async (): Promise<Transporter> => {
  if (transporter) return transporter;

  // Check if standard SMTP config is available
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    // Connect over IPv4: many networks have no IPv6 route, which makes
    // nodemailer fail with ENETUNREACH when it picks the host's IPv6 address.
    let connectHost = smtpHost;
    try {
      connectHost = (await dns.lookup(smtpHost, { family: 4 })).address;
    } catch (err) {
      console.warn(`Mailer: IPv4 lookup for ${smtpHost} failed, using hostname.`, err);
    }

    transporter = nodemailer.createTransport({
      host: connectHost,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === '465',
      tls: { servername: smtpHost },
      // Fail fast instead of leaving the signup request hanging (OTPs only live 60s)
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    console.log('Mailer: Configured SMTP transport.');
    return transporter;
  }

  // Check for SendGrid configuration (direct SMTP or via SendGrid service)
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  if (sendgridApiKey) {
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: sendgridApiKey,
      },
    });
    console.log('Mailer: Configured SendGrid SMTP transport.');
    return transporter;
  }

  // No email service configured. Production must not pretend emails were sent.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('No email service configured: set RESEND_API_KEY (recommended) or the SMTP_* variables.');
  }

  // Local development: zero-network JSON transport (codes still appear in the terminal banner)
  console.log('Mailer: No email config found. Using local JSON transport (emails are not really sent).');
  transporter = nodemailer.createTransport({
    jsonTransport: true
  });
  return transporter;
};

interface OutgoingEmail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Resend sends over HTTPS, which works on hosts that block SMTP ports (e.g. Render's free plan)
const sendViaResend = async (email: OutgoingEmail): Promise<{ messageId: string }> => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
    signal: AbortSignal.timeout(15000),
  });
  const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!response.ok || !body.id) {
    throw new Error(`Resend API error ${response.status}: ${body.message ?? 'unknown error'}`);
  }
  return { messageId: body.id };
};

/** Sends one email through Resend if RESEND_API_KEY is set, otherwise through SMTP. */
const deliverEmail = async (email: OutgoingEmail): Promise<{ messageId: string }> => {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(email);
  }
  const info = await (await getTransporter()).sendMail(email);
  return { messageId: String(info.messageId ?? '') };
};

// User-supplied text (e.g. the name) must be escaped before it goes into HTML
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

// What the code is for: confirming a new account, or resetting a forgotten password
export type CodePurpose = 'verify' | 'reset';

const COPY: Record<CodePurpose, { title: string; intro: string; subject: string; textIntro: string }> = {
  verify: {
    title: 'Verify Your Email Address',
    intro: 'Thank you for registering with <strong>MamaCare</strong>! To complete your registration and activate your account, please enter the following 6-digit confirmation code:',
    subject: 'Verify your MamaCare account',
    textIntro: 'Your MamaCare verification code is',
  },
  reset: {
    title: 'Reset Your Password',
    intro: 'We received a request to reset the password for your <strong>MamaCare</strong> account. Enter this 6-digit code to choose a new password:',
    subject: 'Reset your MamaCare password',
    textIntro: 'Your MamaCare password reset code is',
  },
};

export const sendOtpEmail = async (to: string, otp: string, userName: string, purpose: CodePurpose = 'verify') => {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@mamacare.rw';
  const copy = COPY[purpose];
  
  // Format dynamic and beautifully styled HTML content
  const emailHtml = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 48px 24px; color: #1f2937;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">${copy.title}</h1>
        </div>
        <div style="padding: 40px 32px;">
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
            Hello <strong>${escapeHtml(userName)}</strong>,
          </p>
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
            ${copy.intro}
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="display: inline-block; background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 32px; font-size: 32px; font-weight: 700; letter-spacing: 0.25em; color: #be185d; font-family: monospace;">${otp}</span>
          </div>
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
            This code is valid for <strong>60 seconds</strong>. If it expires, tap "Resend Code" in the app. If you did not request this code, please ignore this email: your account is safe.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9ca3af; text-align: center;">
            © ${new Date().getFullYear()} MamaCare. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  // Print a high-visibility terminal ASCII banner containing the OTP (dev only:
  // in production the code must never end up in logs)
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n' + '='.repeat(60));
    console.log(`               MAMACARE EMAIL CODE (${purpose})`);
    console.log('='.repeat(60));
    console.log(`  To User:    ${userName} (${to})`);
    console.log(`  OTP Code:   [  ${otp}  ]`);
    console.log(`  Expires:    In 60 seconds`);
    console.log('='.repeat(60) + '\n');
  }

  try {
    const info = await deliverEmail({
      from: `MamaCare <${fromEmail}>`,
      to,
      subject: `${copy.subject} - ${otp}`,
      text: `Hello ${userName},\n\n${copy.textIntro}: ${otp}\n\nThis code expires in 60 seconds.`,
      html: emailHtml,
    });
    console.log(`Mailer: Email sent (${process.env.RESEND_API_KEY ? 'Resend' : 'SMTP'}). Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Mailer: Error sending email:', error instanceof Error ? error.message : error);
    // Callers treat null as "not sent" and tell the user
    return null;
  }
};

export interface ContactNotification {
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}

/**
 * Tells the MamaCare team about a new contact-form message (the message itself is stored in the
 * database and readable in the admin area). Goes to CONTACT_RECEIVER_EMAIL, or SMTP_USER.
 * Returns false if no receiver is configured or sending failed.
 */
export const sendContactNotification = async (msg: ContactNotification): Promise<boolean> => {
  const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
  if (!receiver) return false;
  const fromEmail = process.env.FROM_EMAIL || 'noreply@mamacare.rw';
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px;color:#6b7280;font-weight:600;vertical-align:top;width:110px">${label}</td><td style="padding:8px;color:#1f2937">${escapeHtml(value)}</td></tr>`;

  try {
    await deliverEmail({
      from: `MamaCare Contact <${fromEmail}>`,
      to: receiver,
      subject: `[MamaCare Contact] ${msg.subject.replace(/[\r\n]+/g, ' ')}`,
      text: `New contact message from ${msg.fullName} (${msg.email})\nPhone: ${msg.phone || 'N/A'}\nSubject: ${msg.subject}\n\n${msg.message}\n\nAlso available in the MamaCare admin area.`,
      html: `<div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#be185d">New contact message</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${row('Name', msg.fullName)}${row('Email', msg.email)}${row('Phone', msg.phone || 'Not provided')}${row('Subject', msg.subject)}
        </table>
        <p style="white-space:pre-wrap;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;font-size:14px;line-height:1.6">${escapeHtml(msg.message)}</p>
        <p style="font-size:12px;color:#9ca3af">Also available in the MamaCare admin area.</p>
      </div>`,
    });
    return true;
  } catch (error) {
    console.error('Mailer: Error sending contact notification:', error instanceof Error ? error.message : error);
    return false;
  }
};
