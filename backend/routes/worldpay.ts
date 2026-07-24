import { Router, Request, Response } from "express";
import crypto from "crypto";
import { fetchResource, saveResource } from "../../serverDb";
import { sendOrderConfirmationEmail } from "../email";
import { Order } from "../../src/types";

const router = Router();

/**
 * Worldpay Hosted Payment Pages (HPP) Configuration
 */
const getInstallationId = () => process.env.WORLDPAY_INSTALLATION_ID || process.env.WORLDPAY_INST_ID || "";
const getTestMode = () => process.env.WORLDPAY_TEST_MODE || "0"; // "100" for Test Mode, "0" for Live Mode
const getWebhookSecret = () => process.env.WORLDPAY_WEBHOOK_SECRET || process.env.WORLDPAY_CALLBACK_PASSWORD || "";
const getAppUrl = (req?: Request) => {
  if (process.env.APP_URL && process.env.APP_URL.trim() !== "") {
    return process.env.APP_URL.trim().replace(/\/$/, "");
  }
  if (req) {
    const protocol = req.headers["x-forwarded-proto"] || (req.secure ? "https" : "http");
    const host = req.headers["x-forwarded-host"] || req.get("host") || "localhost:3000";
    return `${protocol}://${host}`;
  }
  return "http://localhost:3000";
};

/**
 * Utility: Verifies Worldpay HMAC-SHA256 Signature using raw request body
 */
function verifyWorldpaySignature(rawBody: string | Buffer, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const payload = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, "utf8");
    const computed = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(signature, "hex"));
  } catch (err) {
    console.error("[Worldpay Signature Verification] Error:", err);
    return false;
  }
}

/**
 * Updates order payment status in database and triggers email.
 * Idempotent: Prevents duplicate status updates or duplicate emails.
 */
export async function processSuccessfulOrderPayment(orderId: string, details: {
  transactionId: string;
  authCode?: string;
  cardBrand?: string;
  amount?: number;
}) {
  const ordersList = await fetchResource("orders");
  const orderIdx = ordersList.findIndex((o: any) => o.id === orderId);

  if (orderIdx === -1) {
    console.warn(`[Worldpay Order] Order ${orderId} not found in database to update status.`);
    return null;
  }

  const order = ordersList[orderIdx];

  // Prevent duplicate processing or duplicate emails
  if (order.paymentStatus === "Paid") {
    console.log(`[Worldpay Order] Order ${orderId} is already marked as Paid. Skipping duplicate email.`);
    return order;
  }

  // Update order fields
  order.paymentStatus = "Paid";
  order.worldpayTxId = details.transactionId;
  order.worldpayAuthCode = details.authCode || `WPY-AUTH-${Math.floor(Math.random() * 900000 + 100000)}`;
  order.cardBrand = details.cardBrand || "Worldpay Card";
  if (details.amount && details.amount > 0) {
    order.total = details.amount;
  }
  order.date = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }) + " (UTC)";

  ordersList[orderIdx] = order;
  await saveResource("orders", ordersList);
  console.log(`[Worldpay Order] Order ${orderId} successfully set to 'Paid' (TxID: ${details.transactionId}).`);

  // Trigger SMTP order confirmation email
  try {
    console.log(`[Worldpay Order] Sending order confirmation email for Order ${orderId} to ${order.customerEmail}...`);
    await sendOrderConfirmationEmail(order);
    console.log(`[Worldpay Order] Order confirmation email sent successfully for Order ${orderId}.`);
  } catch (emailErr: any) {
    console.error(`[Worldpay Order] Failed to send order confirmation email for Order ${orderId}:`, emailErr);
  }

  return order;
}

/**
 * 1. POST: Create Worldpay Hosted Payment Page Redirect Session
 */
router.post("/session", async (req: Request, res: Response) => {
  try {
    const { orderId, amount, currency = "GBP", customerEmail, customerName, destination, cartItems } = req.body;

    const instId = getInstallationId();
    if (!instId) {
      return res.status(400).json({
        error: "Worldpay Installation ID (WORLDPAY_INSTALLATION_ID) is missing. Please configure your Worldpay Installation ID in .env or the Admin Dashboard.",
        requiresConfig: true
      });
    }

    if (!orderId || !amount || !customerEmail || !customerName) {
      return res.status(400).json({
        error: "Missing required session parameters (orderId, amount, customerEmail, customerName)."
      });
    }

    const testMode = getTestMode();
    const appUrl = getAppUrl(req);

    // Pre-register pending order in database
    const ordersList = await fetchResource("orders");
    let existingOrder = ordersList.find((o: any) => o.id === orderId);

    if (!existingOrder) {
      const newOrder: Order = {
        id: orderId,
        customerName,
        customerEmail,
        tags: ["Storefront", "Worldpay Pending"],
        fulfillmentStatus: "Unfulfilled",
        paymentStatus: "Pending",
        total: parseFloat(amount),
        destination,
        date: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " (UTC)",
        deliveryMethod: "Standard Shipping",
        items: cartItems || [],
      };
      ordersList.push(newOrder);
      await saveResource("orders", ordersList);
      console.log(`[Worldpay Session] Pre-registered pending order ${orderId} in database.`);
    }

    // Worldpay Business Gateway Hosted Payment Page URL
    const baseUrl = testMode === "100"
      ? "https://select-test.worldpay.com/wcc/purchase"
      : "https://select.worldpay.com/wcc/purchase";

    const callbackUrl = `${appUrl}/api/worldpay/callback?orderId=${orderId}`;

    const hppParams = new URLSearchParams({
      instId: instId,
      cartId: orderId,
      amount: parseFloat(amount).toFixed(2),
      currency: currency,
      desc: `Pouch Supply Order #${orderId}`,
      name: customerName,
      email: customerEmail,
      address1: destination || '',
      testMode: testMode,
      MC_callback: callbackUrl
    });

    const redirectUrl = `${baseUrl}?${hppParams.toString()}`;

    console.log(`[Worldpay Session] Generated Worldpay HPP URL for Order ${orderId}: ${redirectUrl}`);

    return res.json({
      success: true,
      orderId,
      amount: parseFloat(amount),
      currency,
      redirectUrl,
      mode: "WORLDPAY_HOSTED_PAYMENT_PAGE"
    });

  } catch (err: any) {
    console.error("[Worldpay Session] Error initializing HPP session:", err);
    return res.status(500).json({ error: err.message || "Failed to initialize Worldpay Hosted Payment Page session." });
  }
});

/**
 * 2. GET & POST: Shopper Callback / Redirect Endpoint from Worldpay Hosted Payment Page
 */
const handleCallback = async (req: Request, res: Response) => {
  try {
    const params = { ...req.query, ...req.body };
    const orderId = (params.orderId || params.cartId || params.MC_orderId) as string;
    const transStatus = (params.transStatus || params.paymentStatus || params.status) as string;
    const transId = (params.transId || params.transactionId || params.worldpayTxId) as string;
    const authCode = (params.rawAuthCode || params.authCode) as string;
    const rawAmount = params.authAmount || params.amount;
    const amount = rawAmount ? parseFloat(rawAmount as string) : undefined;

    console.log(`[Worldpay Callback] Callback received for Order: ${orderId}, Status: ${transStatus}, TransID: ${transId}`);

    if (!orderId) {
      return res.status(400).send("Callback error: Missing order ID parameter.");
    }

    // Verify callback password if configured
    const webhookSecret = getWebhookSecret();
    if (webhookSecret && params.callbackPW && params.callbackPW !== webhookSecret) {
      console.warn(`[Worldpay Callback] Callback password mismatch for Order ${orderId}.`);
      return res.status(401).send("Unauthorized: Invalid Worldpay callback password.");
    }

    const isSuccess = transStatus === "Y" || transStatus === "AUTHORISED" || transStatus === "Paid" || transStatus === "APPROVED";
    const isCancelled = transStatus === "C" || transStatus === "CANCELLED";

    if (isSuccess) {
      const updatedOrder = await processSuccessfulOrderPayment(orderId, {
        transactionId: transId || `wp-tx-${Date.now()}`,
        authCode,
        cardBrand: (params.cardType as string) || "Worldpay Card",
        amount
      });

      const totalToPass = updatedOrder?.total || amount || 0;
      return res.redirect(`/payment/success?orderId=${orderId}&amount=${totalToPass}`);
    } else if (isCancelled) {
      console.log(`[Worldpay Callback] Transaction cancelled for Order ${orderId}.`);
      const ordersList = await fetchResource("orders");
      const idx = ordersList.findIndex((o: any) => o.id === orderId);
      if (idx !== -1) {
        ordersList[idx].paymentStatus = "Cancelled";
        await saveResource("orders", ordersList);
      }
      return res.redirect(`/payment/cancelled?orderId=${orderId}`);
    } else {
      const reason = (params.rawAuthMessage || params.reason || "Payment authorization declined by card issuer.") as string;
      console.warn(`[Worldpay Callback] Payment failed for Order ${orderId}: ${reason}`);
      const ordersList = await fetchResource("orders");
      const idx = ordersList.findIndex((o: any) => o.id === orderId);
      if (idx !== -1) {
        ordersList[idx].paymentStatus = "Failed";
        await saveResource("orders", ordersList);
      }
      return res.redirect(`/payment/failed?orderId=${orderId}&reason=${encodeURIComponent(reason)}`);
    }
  } catch (err: any) {
    console.error("[Worldpay Callback] Error during callback handling:", err);
    return res.redirect(`/payment/failed?orderId=${req.query.orderId || "Unknown"}&reason=${encodeURIComponent(err.message || "Gateway callback verification timeout.")}`);
  }
};

router.get("/callback", handleCallback);
router.post("/callback", handleCallback);

/**
 * 3. POST: Asynchronous Worldpay Webhook Endpoint
 */
router.post("/webhook", async (req: Request, res: Response) => {
  const secret = getWebhookSecret();
  const signature = req.headers["x-worldpay-signature"] as string;

  console.log(`[Worldpay Webhook] Notification received. Signature header: ${signature || 'None'}`);

  // Retrieve raw unparsed body for signature verification
  const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body || {}));

  if (secret) {
    if (!signature) {
      console.warn("[Worldpay Webhook] Missing x-worldpay-signature header with secret configured.");
      return res.status(401).json({ error: "Missing webhook signature header." });
    }

    const isValid = verifyWorldpaySignature(rawBody, signature, secret);
    if (!isValid) {
      console.warn("[Worldpay Webhook] Webhook HMAC signature verification FAILED.");
      return res.status(401).json({ error: "Invalid webhook signature." });
    }
    console.log("[Worldpay Webhook] HMAC signature verified successfully.");
  }

  try {
    const payload = req.body || {};
    const eventType = payload.eventType || payload.event;
    const data = payload.data || payload;

    const orderId = data.orderId || data.cartId;
    const transStatus = data.paymentStatus || data.transStatus;
    const transactionId = data.transactionId || data.transId;
    const authCode = data.authCode || data.rawAuthCode;

    if (!orderId) {
      return res.status(400).json({ error: "Invalid webhook payload structure: missing orderId." });
    }

    console.log(`[Worldpay Webhook] Processing event for Order ${orderId}, Status: ${transStatus}`);

    if (eventType === "payment.success" || transStatus === "Y" || transStatus === "AUTHORISED" || transStatus === "Paid" || transStatus === "APPROVED") {
      await processSuccessfulOrderPayment(orderId, {
        transactionId: transactionId || `wp-wh-${Date.now()}`,
        authCode,
        cardBrand: data.cardBrand || "Worldpay Card"
      });
    } else if (transStatus === "Failed" || transStatus === "CANCELLED" || transStatus === "C" || transStatus === "N") {
      const ordersList = await fetchResource("orders");
      const idx = ordersList.findIndex((o: any) => o.id === orderId);
      if (idx !== -1) {
        ordersList[idx].paymentStatus = transStatus === "C" ? "Cancelled" : "Failed";
        await saveResource("orders", ordersList);
      }
    }

    return res.status(200).json({ success: true, message: "Webhook processed successfully." });
  } catch (err: any) {
    console.error("[Worldpay Webhook] Processing Error:", err);
    return res.status(500).json({ error: "Webhook processing encountered an internal error." });
  }
});

/**
 * 4. GET: Verify Order Payment Status from Database
 */
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID query parameter is required." });
    }

    const ordersList = await fetchResource("orders");
    const order = ordersList.find((o: any) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.json({
      orderId: order.id,
      paymentStatus: order.paymentStatus || "Pending",
      transactionId: order.worldpayTxId || null,
      authCode: order.worldpayAuthCode || null,
      amount: order.total,
      customerEmail: order.customerEmail
    });
  } catch (err: any) {
    console.error("[Worldpay Verification] Error:", err);
    return res.status(500).json({ error: err.message || "Failed to verify payment status." });
  }
});

export default router;
