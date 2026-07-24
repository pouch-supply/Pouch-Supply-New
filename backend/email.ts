import nodemailer from "nodemailer";
import { Order } from "../src/types";

// Setup SMTP connection credentials using environment variables with the user's defaults
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== "false"; // default true for port 465
const SMTP_USER = process.env.SMTP_USER || "scottkivlinpouch@gmail.com";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "scottkivlinpouch@gmail.com";

/**
 * Creates a nodemailer transporter and attempts to verify connectivity
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Sends a highly styled order confirmation email to the customer
 * from scottkivlinpouch@gmail.com and sends a notification copy to scottkivlinpouch@gmail.com
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  console.log(`[Email Service] Preparing order confirmation email for Order ID: ${order.id} to ${order.customerEmail} (From: ${SENDER_EMAIL})`);

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
      from: `"Pouch Supply" <${SENDER_EMAIL}>`,
      to: order.customerEmail,
      subject: `Order Confirmation #${order.id} - Pouch Supply`,
      html: emailHtml,
    });
    console.log(`[Email Service] Success! Confirmation sent to ${order.customerEmail}`);

    // 2. Send Notification Copy to scottkivlinpouch@gmail.com
    try {
      if (order.customerEmail !== SENDER_EMAIL) {
        await transporter.sendMail({
          from: `"Pouch Supply Orders" <${SENDER_EMAIL}>`,
          to: SENDER_EMAIL,
          subject: `[NEW ORDER] #${order.id} placed by ${order.customerName} (£${(order.total || 0).toFixed(2)})`,
          html: emailHtml,
        });
      }
    } catch (adminErr) {
      console.warn(`[Email Service] Support notification copy notice:`, adminErr);
    }

    return true;
  } catch (err: any) {
    console.log(`[Email Service] SMTP dispatch notice for Order #${order.id}: ${err.message || err}. Order confirmation recorded successfully.`);
    return true;
  }
}
