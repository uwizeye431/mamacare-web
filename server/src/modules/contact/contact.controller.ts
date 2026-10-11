import { Request, Response } from 'express';
import { query } from '../../db/client';
import { sendContactNotification } from '../../utils/mailer';

const LIMITS = { fullName: 100, email: 254, phone: 30, subject: 200, message: 5000 };
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
// Names and subjects end up in email headers: no line breaks
const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ');
const field = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

// POST /api/contact: stores the message (read in the admin area) and emails the team
export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const fullName = singleLine(field(req.body.fullName));
    const email = field(req.body.email);
    const phone = field(req.body.phone);
    const subject = singleLine(field(req.body.subject));
    const message = field(req.body.message);

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const values = { fullName, email, phone, subject, message };
    if ((Object.keys(LIMITS) as (keyof typeof LIMITS)[]).some((key) => values[key].length > LIMITS[key])) {
      return res.status(400).json({ error: 'One of the fields is too long. Please shorten it.' });
    }
    if (message.length < 10) {
      return res.status(400).json({ error: 'Message should be at least 10 characters long.' });
    }

    await query(
      `INSERT INTO contact_messages (full_name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)`,
      [fullName, email, phone || null, subject, message]
    );

    // The message is safely stored even if the notification email fails
    await sendContactNotification({ fullName, email, phone: phone || null, subject, message });

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. Our team will contact you soon.',
    });
  } catch (error) {
    console.error('Contact message error:', error);
    return res.status(500).json({ error: 'Something went wrong while sending your message. Please try again.' });
  }
};
