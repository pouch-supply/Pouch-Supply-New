import nodemailer from "nodemailer";
import { Order } from "../src/types";

// Setup SMTP connection credentials using environment variables with the user's defaults
const SMTP_HOST = process.env.SMTP_HOST || "smtp.pouch-supply.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== "false"; // default true for port 465
const SMTP_USER = process.env.SMTP_USER || "Support@pouch-supply.com";
const SMTP_PASS = process.env.SMTP_PASS || "January14!2019";

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
      // Do not fail on invalid certs for custom domain mail servers
      rejectUnauthorized: false
    }
  });
}

/**
 * Sends a highly styled order confirmation email to the customer
 * and sends a notification copy to Support@pouch-supply.com
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  console.log(`[Email Service] Preparing order confirmation email for Order ID: ${order.id} to ${order.customerEmail}`);

  const transporter = createTransporter();

  // Create an elegant HTML template for the email
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #1e293b;">
        <strong style="color: #0f172a;">${item.productTitle}</strong>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Qty: ${item.quantity} × £${item.price.toFixed(2)}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-family: sans-serif; font-size: 14px; color: #0f172a; text-align: right; font-weight: bold;">
        £${(item.price * item.quantity).toFixed(2)}
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
      <title>Order Confirmed - ${order.id}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0f172a; padding: 40px 32px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; tracking: -0.025em; letter-spacing: -0.5px;">POUCH SUPPLY</h1>
                  <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Order Confirmed</p>
                </td>
              </tr>
              
              <!-- Body Content -->
              <tr>
                <td style="padding: 32px;">
                  <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-top: 0;">
                    Hello <strong>${order.customerName}</strong>,
                  </p>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6;">
                    Thank you for shopping with Pouch Supply! Your order has been securely processed and is being assembled by our logistics team. Here is your official purchase receipt:
                  </p>
                  
                  <!-- Order Meta Table -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; background-color: #f1f5f9; border-radius: 12px; padding: 16px;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Order ID</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.id}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Date Placed</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.date}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b; padding-bottom: 6px;">Payment Status</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #16a34a; font-weight: bold; text-align: right; padding-bottom: 6px;">${order.paymentStatus || "Paid"}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #64748b;">Delivery Method</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #0f172a; font-weight: bold; text-align: right;">${order.deliveryMethod}</td>
                    </tr>
                  </table>
                  
                  <!-- Itemized Receipt -->
                  <h3 style="margin-top: 32px; font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Order Details</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 16px 0; font-family: sans-serif; font-size: 15px; color: #475569; font-weight: bold;">Grand Total</td>
                      <td style="padding: 16px 0; font-family: sans-serif; font-size: 18px; color: #0f172a; font-weight: 900; text-align: right;">
                        £${order.total.toFixed(2)}
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Shipping Address Block -->
                  <h3 style="margin-top: 24px; font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Shipping Address</h3>
                  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 0;">
                    ${order.destination}
                  </p>
                </td>
              </tr>
              
              <!-- Footer Info -->
              <tr>
                <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
                    If you have any questions regarding this order, feel free to reply directly to this email or reach out to our team at <strong>Support@pouch-supply.com</strong>.
                  </p>
                  <p style="font-size: 11px; color: #94a3b8; margin-top: 12px;">
                    © ${new Date().getFullYear()} Pouch Supply. All rights reserved.
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
    // 1. Send Order Confirmation to customer
    const info = await transporter.sendMail({
      from: `"Pouch Supply Support" <${SMTP_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation: ${order.id} - Pouch Supply`,
      html: emailHtml,
    });
    console.log(`[Email Service] Success! Message sent to ${order.customerEmail}. Message ID: ${info.messageId}`);

    // 2. Send Notification Copy to Support@pouch-supply.com
    try {
      await transporter.sendMail({
        from: `"Pouch Supply System" <${SMTP_USER}>`,
        to: SMTP_USER,
        subject: `[NEW ORDER] ${order.id} placed by ${order.customerName} (£${order.total.toFixed(2)})`,
        html: `<p>A new order has been placed on the Pouch Supply storefront.</p>
               <p><strong>Order ID:</strong> ${order.id}</p>
               <p><strong>Customer Name:</strong> ${order.customerName}</p>
               <p><strong>Customer Email:</strong> ${order.customerEmail}</p>
               <p><strong>Total Amount:</strong> £${order.total.toFixed(2)}</p>
               <p><strong>Shipping Location:</strong> ${order.destination}</p>
               <hr/>
               ${emailHtml}`,
      });
      console.log(`[Email Service] Support notification copy sent successfully.`);
    } catch (supportErr) {
      console.warn(`[Email Service] Failed to send copy to support email (ignoring):`, supportErr);
    }

    return true;
  } catch (err: any) {
    console.error(`[Email Service] Error sending order confirmation email via SMTP:`, err);
    // Return false instead of throwing to prevent blocking the checkout state transition
    return false;
  }
}
