import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Reusable SMTP transporter — configured once
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'uwizeyekevin43@gmail.com',
    pass: process.env.SMTP_PASS || '',
  },
});

const RECEIVER_EMAIL = process.env.SMTP_USER || 'uwizeyekevin43@gmail.com';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const fullName = body.fullName?.trim() || '';
    const email = body.email?.trim() || '';
    const phone = body.phone?.trim() || '';
    const subject = body.subject?.trim() || '';
    const message = body.message?.trim() || '';

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message should be at least 10 characters long.' },
        { status: 400 }
      );
    }

    // Build a beautiful HTML email
    const emailHtml = `
      <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 48px 24px; color: #1f2937;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Contact Message</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Someone reached out via MamaCare Contact Form</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 600; width: 120px; vertical-align: top;">Full Name</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #1f2937;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 600; vertical-align: top;">Email</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #1f2937;"><a href="mailto:${email}" style="color: #be185d; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 600; vertical-align: top;">Phone</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #1f2937;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-weight: 600; vertical-align: top;">Subject</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; color: #1f2937; font-weight: 600;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 20px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 700;">Message</p>
              <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #1f2937; white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 28px 0 16px;">
            <p style="margin: 0; font-size: 11px; color: #9ca3af; text-align: center;">
              © ${new Date().getFullYear()} MamaCare. This email was sent from the Contact Us form on your website.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send the email to MamaCare admin
    await transporter.sendMail({
      from: `"MamaCare Contact" <${RECEIVER_EMAIL}>`,
      replyTo: `"${fullName}" <${email}>`,
      to: RECEIVER_EMAIL,
      subject: `[MamaCare Contact] ${subject}`,
      text: `New contact message from ${fullName} (${email}):\n\nPhone: ${phone || 'N/A'}\nSubject: ${subject}\n\n${message}`,
      html: emailHtml,
    });

    console.log(`Contact email sent successfully from ${fullName} (${email})`);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. Our team will contact you soon.',
    });
  } catch (error) {
    console.error('Contact request error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while sending your message. Please try again.' },
      { status: 500 }
    );
  }
}
