import { NextResponse } from 'next/server';

type ContactPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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

    // Temporary handling: log contact requests until email/SMS integration is added.
    console.log('New contact request:', {
      fullName,
      email,
      phone: phone || 'N/A',
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

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
