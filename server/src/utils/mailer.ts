import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (transporter) return transporter;

  // Check if standard SMTP config is available
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === '465',
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

  // Fallback: Use zero-network local JSON transport for instantaneous response and 100% offline support
  console.log('Mailer: No SMTP or SendGrid config found. Using zero-network local JSON transport.');
  transporter = nodemailer.createTransport({
    jsonTransport: true
  });
  return transporter;
};

export const sendOtpEmail = async (to: string, otp: string, userName: string) => {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@mamacare.rw';
  
  // Format dynamic and beautifully styled HTML content
  const emailHtml = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 48px 24px; color: #1f2937;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Verify Your Email Address</h1>
        </div>
        <div style="padding: 40px 32px;">
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
            Hello <strong>${userName}</strong>,
          </p>
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
            Thank you for registering with <strong>MamaCare</strong>! To complete your registration and activate your account, please enter the following 6-digit confirmation code:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="display: inline-block; background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px 32px; font-size: 32px; font-weight: 700; letter-spacing: 0.25em; color: #be185d; font-family: monospace;">${otp}</span>
          </div>
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
            This OTP code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #9ca3af; text-align: center;">
            © ${new Date().getFullYear()} MamaCare. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  // Print a high-visibility terminal ASCII banner containing the OTP
  console.log('\n' + '='.repeat(60));
  console.log('               MAMACARE EMAIL OTP VERIFICATION               ');
  console.log('='.repeat(60));
  console.log(`  To User:    ${userName} (${to})`);
  console.log(`  OTP Code:   [  ${otp}  ]`);
  console.log(`  Expires:    In 10 minutes`);
  console.log('='.repeat(60) + '\n');

  try {
    const mailTransporter = await getTransporter();
    const info = await mailTransporter.sendMail({
      from: `"MamaCare" <${fromEmail}>`,
      to,
      subject: `Verify your MamaCare account - ${otp}`,
      text: `Hello ${userName},\n\nYour MamaCare verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
      html: emailHtml,
    });

    // If Ethereal test account is used, print the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('='.repeat(60));
      console.log('  Ethereal Mail Preview URL:');
      console.log(`  ${previewUrl}`);
      console.log('='.repeat(60) + '\n');
    } else {
      console.log(`Mailer: Email sent successfully! Message ID: ${info.messageId}`);
    }
    return info;
  } catch (error) {
    console.error('Mailer: Error sending OTP email:', error);
    // Do not throw, keep server resilient in local environments
    return null;
  }
};
