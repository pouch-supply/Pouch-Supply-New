import nodemailer from "nodemailer";
import { Order } from "../src/types";

// Dynamic in-memory configuration with environment variable fallbacks
let currentEmailConfig = {
  senderEmail: process.env.SENDER_EMAIL || process.env.EMAIL_FROM || "scottkivlinpouch@gmail.com",
  smtpUser: process.env.SMTP_USER || process.env.EMAIL_USER || "scottkivlinpouch@gmail.com",
  smtpPass: process.env.SMTP_PASS || process.env.EMAIL_PASS || "",
  smtpHost: process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com",
  smtpPort: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "465", 10),
};

export function getEmailConfig() {
  return {
    senderEmail: currentEmailConfig.senderEmail,
    smtpUser: currentEmailConfig.smtpUser,
    smtpPass: currentEmailConfig.smtpPass ? "••••••••••••" : "",
    hasPasswordSet: Boolean(currentEmailConfig.smtpPass),
    smtpHost: currentEmailConfig.smtpHost,
    smtpPort: currentEmailConfig.smtpPort,
  };
}

export function updateEmailConfig(config: Partial<typeof currentEmailConfig>) {
  if (config.senderEmail) currentEmailConfig.senderEmail = config.senderEmail.trim();
  if (config.smtpUser) currentEmailConfig.smtpUser = config.smtpUser.trim();
  if (config.smtpPass !== undefined && config.smtpPass !== "••••••••••••") {
    currentEmailConfig.smtpPass = config.smtpPass.trim();
  }
  if (config.smtpHost) currentEmailConfig.smtpHost = config.smtpHost.trim();
  if (config.smtpPort) currentEmailConfig.smtpPort = Number(config.smtpPort);
  return getEmailConfig();
}

/**
 * Creates a nodemailer transporter using the configured credentials
 */
function createTransporter() {
  const host = currentEmailConfig.smtpHost;
  const user = currentEmailConfig.smtpUser;
  const pass = currentEmailConfig.smtpPass;
  const port = currentEmailConfig.smtpPort;

  if (host.includes("gmail") || user.endsWith("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass, // Gmail App Password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465,
    auth: {
      user: user,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Sends a live test email to verify Gmail SMTP connection
 */
export async function sendTestEmail(toEmail: string) {
  const recipient = toEmail || currentEmailConfig.senderEmail;
  console.log(`[Email Service] Testing email connection to ${recipient} via ${currentEmailConfig.smtpUser}`);

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Pouch Supply Verification" <${currentEmailConfig.senderEmail}>`,
      to: recipient,
      subject: `Pouch Supply Email Verification Test`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #e1192e; margin-top: 0;">Pouch Supply Email Setup Verified</h2>
          <p style="color: #334155; line-height: 1.5;">This is an automated test email confirming that your order confirmation email system is active and properly connected to <strong>${currentEmailConfig.smtpUser}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Sender: ${currentEmailConfig.senderEmail}<br/>Time: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    return {
      success: true,
      message: `Test email successfully delivered to ${recipient}!`,
      messageId: info.messageId,
      sender: currentEmailConfig.senderEmail
    };
  } catch (err: any) {
    console.error("[Email Service] Test email error:", err);
    return {
      success: false,
      message: err.message || "Failed to send test email.",
      error: err.toString(),
      sender: currentEmailConfig.senderEmail,
      hint: !currentEmailConfig.smtpPass ? "Gmail requires a 16-character App Password when 2FA is enabled on your Google Account." : undefined
    };
  }
}

/**
 * Sends a highly styled order confirmation email to the customer
 * from scottkivlinpouch@gmail.com and sends a notification copy to scottkivlinpouch@gmail.com
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<{ success: boolean; message: string; error?: string }> {
  const sender = currentEmailConfig.senderEmail;
  console.log(`[Email Service] Preparing order confirmation email for Order ID: #${order.id} to ${order.customerEmail} (From: ${sender})`);

  // Create an elegant HTML template for the email
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #1e293b;">
        <strong style="color: #0f172a;">${item.productTitle}</strong>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Qty: ${item.quantity} × £${(item.price || 0).toFixed(2)}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #0f172a; text-align: right; font-weight: bold;">
        £${((item.price || 0) * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed - #${order.id}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #e1192e; padding: 36px 32px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 1.5px;">POUCH SUPPLY</h1>
                  <p style="color: #ffe4e6; margin: 6px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px;">Official Order Confirmation & Receipt</p>
                </td>
              </tr>
              
              <!-- Body Content -->
              <tr>
                <td style="padding: 32px;">
                  <p style="font-size: 16px; color: #0f172a; line-height: 1.6; margin-top: 0;">
                    Dear <strong>${order.customerName || 'Valued Customer'}</strong>,
                  </p>
                  <p style="font-size: 14.5px; color: #475569; line-height: 1.6;">
                    Thank you for shopping with Pouch Supply! Your order <strong>#${order.id}</strong> has been securely processed and is being assembled by our logistics team for immediate dispatch.
                  </p>
                  
                  <!-- Order Meta Table -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; background-color: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #f1f5f9;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Order ID</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right; padding-bottom: 6px;">#${order.id}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Date Placed</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.date || new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Payment Status</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #16a34a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.paymentStatus || "Paid"}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Courier Service</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.carrier || 'Royal Mail'} (${order.deliveryMethod || 'Royal Mail Tracked'})</td>
                    </tr>
                    ${order.trackingId ? `
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b;">Tracking Reference</td>
                      <td style="font-family: monospace; font-size: 13px; color: #e1192e; font-weight: 900; text-align: right;">${order.trackingId}</td>
                    </tr>
                    ` : ''}
                  </table>
                  
                  <!-- Itemized Receipt -->
                  <h3 style="margin-top: 32px; font-size: 15px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Purchased Items</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 16px 0; font-family: sans-serif; font-size: 15px; color: #475569; font-weight: bold;">Grand Total Paid</td>
                      <td style="padding: 16px 0; font-family: sans-serif; font-size: 18px; color: #0f172a; font-weight: 900; text-align: right;">
                        £${(order.total || 0).toFixed(2)}
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Shipping Address Block -->
                  <h3 style="margin-top: 24px; font-size: 15px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Delivery Address</h3>
                  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 0;">
                    ${order.destination || 'Address Provided at Checkout'}
                  </p>
                </td>
              </tr>
              
              <!-- Footer Info -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                    If you have any questions regarding this order, feel free to reply directly to this email or reach out to our support team at <a href="mailto:scottkivlinpouch@gmail.com" style="color: #e1192e; font-weight: bold; text-decoration: none;">scottkivlinpouch@gmail.com</a>.
                  </p>
                  <p style="font-size: 11px; color: #94a3b8; margin-top: 12px;">
                    © ${new Date().getFullYear()} Pouch Supply UK. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();

    // 1. Send Order Confirmation to customer
    await transporter.sendMail({
      from: `"Pouch Supply" <${sender}>`,
      to: order.customerEmail,
      subject: `Order Confirmation #${order.id} - Pouch Supply`,
      html: emailHtml,
    });
    console.log(`[Email Service] Success! Confirmation sent to ${order.customerEmail}`);

    // 2. Send Notification Copy to scottkivlinpouch@gmail.com
    try {
      if (order.customerEmail !== sender) {
        await transporter.sendMail({
          from: `"Pouch Supply Orders" <${sender}>`,
          to: sender,
          subject: `[NEW ORDER] #${order.id} placed by ${order.customerName} (£${(order.total || 0).toFixed(2)})`,
          html: emailHtml,
        });
      }
    } catch (adminErr) {
      console.warn(`[Email Service] Admin copy notice:`, adminErr);
    }

    return { success: true, message: `Order confirmation email sent to ${order.customerEmail}` };
  } catch (err: any) {
    console.warn(`[Email Service] Order confirmation dispatch attempt for #${order.id}:`, err.message || err);
    return {
      success: false,
      message: `Order processed. Email dispatch notice: ${err.message || 'SMTP authentication pending'}`,
      error: err.toString()
    };
  }
}

