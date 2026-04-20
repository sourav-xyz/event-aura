import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function getBookingConfirmationEmail(booking: {
  trackingId: string;
  name: string;
  eventType: string;
  eventDate: Date;
  packageType: string;
  venue: string;
  guestCount: number;
}): string {
  const formattedDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">Event Aura</h1>
          <p style="color: #666; margin-top: 5px;">Your Event Management Partner</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">Booking Confirmed!</h2>
          <p style="margin: 0; opacity: 0.9;">Thank you for choosing Event Aura</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 20px 0; color: #1a1a2e; font-size: 18px;">Your Tracking ID</h3>
          <div style="background-color: #1a1a2e; color: #ffffff; padding: 15px 25px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 2px;">
            ${booking.trackingId}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 15px; text-align: center;">
            Use this ID to track your booking status
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #1a1a2e; margin: 0 0 20px 0; font-size: 18px;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e; font-weight: 500; text-align: right;">${booking.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Event Type</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e; font-weight: 500; text-align: right;">${booking.eventType}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Date</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e; font-weight: 500; text-align: right;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Package</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e; font-weight: 500; text-align: right;">${booking.packageType}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Venue</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1a1a2e; font-weight: 500; text-align: right;">${booking.venue}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666;">Guest Count</td>
              <td style="padding: 12px 0; color: #1a1a2e; font-weight: 500; text-align: right;">${booking.guestCount} guests</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>What's Next?</strong><br>
            Our team will review your booking and contact you within 24-48 hours to discuss further details and finalize your event planning.
          </p>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Questions? Contact us at<br>
            <a href="mailto:support@eventaura.com" style="color: #667eea; text-decoration: none;">support@eventaura.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getAdminNotificationEmail(booking: {
  trackingId: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date;
  packageType: string;
  venue: string;
  guestCount: number;
  additionalNotes?: string;
}): string {
  const formattedDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
        <div style="background-color: #1a1a2e; color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 20px;">New Booking Received</h2>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">Tracking ID: ${booking.trackingId}</p>
        </div>

        <h3 style="color: #1a1a2e; margin: 0 0 20px 0;">Customer Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600; width: 40%;">Name</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600;">Email</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;"><a href="mailto:${booking.email}">${booking.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600;">Phone</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;"><a href="tel:${booking.phone}">${booking.phone}</a></td>
          </tr>
        </table>

        <h3 style="color: #1a1a2e; margin: 0 0 20px 0;">Event Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600; width: 40%;">Event Type</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.eventType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600;">Date</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600;">Package</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.packageType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600;">Venue</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.venue}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600;">Guest Count</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.guestCount} guests</td>
          </tr>
          ${booking.additionalNotes ? `
          <tr>
            <td style="padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; font-weight: 600;">Notes</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${booking.additionalNotes}</td>
          </tr>
          ` : ''}
        </table>

        <p style="color: #666; font-size: 14px; margin: 0;">
          Please review and respond to this booking within 24-48 hours.
        </p>
      </div>
    </body>
    </html>
  `;
}
