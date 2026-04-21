import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// Email Templates
export const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to EventAura - Your Event Partner!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f9f5ff; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(147, 51, 234, 0.1); }
          .header { background: linear-gradient(135deg, #9333ea, #ec4899); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 32px; }
          .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
          .content { padding: 40px 30px; }
          .content h2 { color: #1f2937; margin: 0 0 20px; }
          .content p { color: #6b7280; line-height: 1.6; margin: 0 0 15px; }
          .cta { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 30px; text-align: center; }
          .footer p { color: #9ca3af; font-size: 14px; margin: 0; }
          .social { margin: 15px 0; }
          .social a { display: inline-block; margin: 0 10px; color: #9333ea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EventAura</h1>
            <p>Creating Magical Moments</p>
          </div>
          <div class="content">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for joining EventAura! We're thrilled to have you as part of our family.</p>
            <p>At EventAura, we specialize in creating unforgettable events - from dream weddings to corporate gatherings, birthday celebrations to traditional ceremonies.</p>
            <p>What you can do now:</p>
            <ul style="color: #6b7280; line-height: 1.8;">
              <li>Browse our event categories</li>
              <li>Explore themes and packages</li>
              <li>Get instant quotes</li>
              <li>Book your dream event</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}" class="cta">Explore Events</a>
          </div>
          <div class="footer">
            <div class="social">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">WhatsApp</a>
            </div>
            <p>Bhubaneswar & Berhampur, Odisha</p>
            <p>+91 9658780033 | hello@eventaura.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  verification: (name, token) => ({
    subject: 'Verify Your Email - EventAura',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f9f5ff; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #9333ea, #ec4899); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 40px 30px; text-align: center; }
          .content p { color: #6b7280; line-height: 1.6; }
          .cta { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .code { background: #f3f4f6; padding: 15px 30px; border-radius: 8px; font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #9333ea; display: inline-block; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; }
          .footer p { color: #9ca3af; font-size: 13px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EventAura</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p>Hi ${name},</p>
            <p>Please click the button below to verify your email address:</p>
            <a href="${process.env.FRONTEND_URL}/verify-email/${token}" class="cta">Verify Email</a>
            <p style="margin-top: 30px; font-size: 14px;">This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  resetPassword: (name, token) => ({
    subject: 'Reset Your Password - EventAura',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f9f5ff; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #9333ea, #ec4899); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 40px 30px; text-align: center; }
          .content p { color: #6b7280; line-height: 1.6; }
          .cta { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; }
          .footer p { color: #9ca3af; font-size: 13px; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EventAura</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}" class="cta">Reset Password</a>
            <p style="margin-top: 30px; font-size: 14px; color: #ef4444;">This link will expire in 10 minutes.</p>
          </div>
          <div class="footer">
            <p>If you didn't request this, please ignore this email or contact support.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderConfirmation: (order) => ({
    subject: `Order Confirmed - ${order.orderNumber} | EventAura`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f9f5ff; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #9333ea, #ec4899); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .badge { background: rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; display: inline-block; margin-top: 10px; }
          .content { padding: 40px 30px; }
          .order-details { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 20px 0; }
          .order-details h3 { margin: 0 0 15px; color: #1f2937; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #6b7280; }
          .detail-value { color: #1f2937; font-weight: 600; }
          .total-row { background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .cta { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 25px; text-align: center; }
          .footer p { color: #9ca3af; font-size: 13px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <div class="badge">${order.orderNumber}</div>
          </div>
          <div class="content">
            <p style="color: #6b7280; font-size: 16px;">Thank you for choosing EventAura! Your event booking has been confirmed.</p>
            
            <div class="order-details">
              <h3>Event Details</h3>
              <div class="detail-row">
                <span class="detail-label">Event</span>
                <span class="detail-value">${order.eventName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Package</span>
                <span class="detail-value">${order.packageSelected?.name || 'Standard'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${new Date(order.eventDetails.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Venue</span>
                <span class="detail-value">${order.eventDetails.venue || 'To be confirmed'}</span>
              </div>
              <div class="total-row" style="display: flex; justify-content: space-between;">
                <span>Total Amount</span>
                <span style="font-size: 20px;">Rs. ${order.pricing.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="cta">View Order Details</a>
            </p>

            <p style="color: #6b7280; font-size: 14px; text-align: center;">Our team will contact you within 24 hours to discuss further details.</p>
          </div>
          <div class="footer">
            <p><strong>Need help?</strong></p>
            <p>Call us: +91 9658780033</p>
            <p>WhatsApp: +91 9658780033</p>
            <p>Email: hello@eventaura.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderStatusUpdate: (order, status) => ({
    subject: `Order Update: ${status} - ${order.orderNumber} | EventAura`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f9f5ff; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #9333ea, #ec4899); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .status-badge { background: white; color: #9333ea; padding: 10px 20px; border-radius: 25px; font-weight: 600; display: inline-block; margin-top: 15px; }
          .content { padding: 40px 30px; text-align: center; }
          .content p { color: #6b7280; line-height: 1.6; }
          .cta { display: inline-block; background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; }
          .footer p { color: #9ca3af; font-size: 13px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Update</h1>
            <div class="status-badge">${status.toUpperCase()}</div>
          </div>
          <div class="content">
            <h2>Order ${order.orderNumber}</h2>
            <p>Your order status has been updated to <strong>${status}</strong>.</p>
            <p>Event Date: ${new Date(order.eventDetails.eventDate).toLocaleDateString('en-IN')}</p>
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="cta">View Order</a>
          </div>
          <div class="footer">
            <p>Questions? Contact us at +91 9658780033</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};
