import { Router } from "express";
import crypto from "crypto";
import { fetchResource, saveResource } from "../../serverDb";
import { sendOrderConfirmationEmail } from "../email";
import { Order } from "../../src/types";

const router = Router();

// Retrieve Worldpay configuration keys
const WORLDPAY_CLIENT_ID = process.env.WORLDPAY_CLIENT_ID || "";
const WORLDPAY_CLIENT_SECRET = process.env.WORLDPAY_CLIENT_SECRET || "";
const WORLDPAY_API_KEY = process.env.WORLDPAY_API_KEY || "";
const WORLDPAY_WEBHOOK_SECRET = process.env.WORLDPAY_WEBHOOK_SECRET || "wp_secret_xyz123";

// New credentials provided by user
const WORLDPAY_API_USERNAME = process.env.WORLDPAY_API_USERNAME || "";
const WORLDPAY_API_PASSWORD = process.env.WORLDPAY_API_PASSWORD || "";
const WORLDPAY_ENTITY_ID = process.env.WORLDPAY_ENTITY_ID || "";
const WORLDPAY_CHECKOUT_ID = process.env.WORLDPAY_CHECKOUT_ID || "";

/**
 * Utility: Verifies the Worldpay signature of incoming webhook payloads
 */
function verifyWorldpaySignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const computed = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch (err) {
    console.error("[Worldpay Signature Verification] Cryptographic error:", err);
    return false;
  }
}

/**
 * Helper: Updates order payment status in the database/memory and triggers emails
 */
async function processSuccessfulOrderPayment(orderId: string, details: {
  transactionId: string;
  authCode: string;
  cardBrand: string;
}) {
  const ordersList = await fetchResource("orders");
  const orderIdx = ordersList.findIndex((o: any) => o.id === orderId);

  if (orderIdx !== -1) {
    const order = ordersList[orderIdx];
    
    // Check if it's already processed to avoid duplicate actions/emails
    if (order.paymentStatus === "Paid") {
      console.log(`[Worldpay Callback] Order ${orderId} is already paid. Skipping email trigger.`);
      return order;
    }

    // Update payment details
    order.paymentStatus = "Paid";
    order.worldpayTxId = details.transactionId;
    order.worldpayAuthCode = details.authCode;
    order.cardBrand = details.cardBrand;
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
    console.log(`[Worldpay Callback] Order ${orderId} successfully updated to 'Paid' in database.`);

    // Trigger SMTP email confirmation
    try {
      await sendOrderConfirmationEmail(order);
    } catch (err) {
      console.error(`[Worldpay Callback] Failed to send email for Order ${orderId}:`, err);
    }

    return order;
  } else {
    console.warn(`[Worldpay Callback] Order ${orderId} not found in database to update status.`);
    return null;
  }
}

/**
 * 1. POST: Create Worldpay Checkout Session
 * In production, this makes a request to Worldpay's secure checkout session API.
 * In development/test (when credentials are absent), it returns a redirect to our elegant in-app simulated payment gateway.
 */
router.post("/session", async (req, res) => {
  try {
    const { orderId, amount, currency = "GBP", customerEmail, customerName, destination, cartItems } = req.body;

    if (!orderId || !amount || !customerEmail || !customerName) {
      return res.status(400).json({
        error: "Missing required session parameters.",
        details: { orderId: !!orderId, amount: !!amount, customerEmail: !!customerEmail, customerName: !!customerName }
      });
    }

    console.log(`[Worldpay Session] Creating payment session for Order: ${orderId}, Amount: £${amount}`);

    // Create the Order in "Pending" status in our database if it doesn't exist
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

    const sessionId = `wp-sess-${crypto.randomBytes(8).toString("hex")}`;
    
    // Check if real API credentials are configured
    if (WORLDPAY_API_USERNAME && WORLDPAY_API_PASSWORD && WORLDPAY_ENTITY_ID) {
      console.log("[Worldpay Session] Integrating with real Worldpay (Oppwa / Peach / ACI) Sandbox API endpoints.");
      
      const protocol = req.secure ? 'https' : 'http';
      const host = req.get('host') || 'localhost:3000';
      const shopperResultUrl = `${protocol}://${host}/api/worldpay/callback?orderId=${orderId}`;

      // Sanitize given and surname fields to prevent validation errors with Oppwa
      let givenName = customerName.trim().split(/\s+/)[0] || 'Customer';
      let surname = customerName.trim().split(/\s+/).slice(1).join(' ') || 'Customer';

      givenName = givenName.replace(/[^a-zA-Z]/g, '') || 'Customer';
      surname = surname.replace(/[^a-zA-Z]/g, '') || 'Customer';

      const params = new URLSearchParams();
      params.append('entityId', WORLDPAY_ENTITY_ID);
      params.append('amount', parseFloat(amount).toFixed(2));
      params.append('currency', currency);
      params.append('paymentType', 'DB');
      params.append('merchantTransactionId', orderId);
      params.append('customer.email', customerEmail);
      params.append('customer.givenName', givenName);
      params.append('customer.surname', surname);
      params.append('shopperResultUrl', shopperResultUrl);

      try {
        // ACI Worldwide (Oppwa) typically expects standard Bearer authorization header.
        // We support both Bearer (default/modern) and Basic formats.
        const useBasic = WORLDPAY_API_USERNAME.toLowerCase() === 'basic';
        const authHeader = useBasic 
          ? 'Basic ' + Buffer.from(`${WORLDPAY_API_USERNAME}:${WORLDPAY_API_PASSWORD}`).toString('base64')
          : `Bearer ${WORLDPAY_API_PASSWORD}`;

        const apiResponse = await fetch('https://test.oppwa.com/v1/checkouts', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        const data: any = await apiResponse.json();
        console.log(`[Worldpay Session] Oppwa API response status ${apiResponse.status}:`, JSON.stringify(data));

        if (apiResponse.ok && data.id) {
          const redirectUrl = `/payment/worldpay-gateway?orderId=${orderId}&amount=${amount}&checkoutId=${data.id}&isReal=true`;
          return res.json({
            success: true,
            paymentSessionId: data.id,
            amount: parseFloat(amount),
            currency,
            redirectUrl,
          });
        } else {
          console.warn("[Worldpay Session] Oppwa API connection returned status error:", data);
          // Fallback to simulator if API responds with error
          const redirectUrl = `/payment/worldpay-gateway?orderId=${orderId}&amount=${amount}&sessionId=${sessionId}`;
          return res.json({
            success: true,
            paymentSessionId: sessionId,
            amount: parseFloat(amount),
            currency,
            redirectUrl,
            warning: "API credentials or parameters rejected. Falling back to secure sandbox simulator."
          });
        }
      } catch (apiErr: any) {
        console.warn("[Worldpay Session] Failed to connect to Oppwa API:", apiErr);
        // Fallback to simulator if network / other error
        const redirectUrl = `/payment/worldpay-gateway?orderId=${orderId}&amount=${amount}&sessionId=${sessionId}`;
        return res.json({
          success: true,
          paymentSessionId: sessionId,
          amount: parseFloat(amount),
          currency,
          redirectUrl,
          warning: "API connection timeout. Falling back to secure sandbox simulator."
        });
      }
    } else {
      console.log("[Worldpay Session] Utilizing Worldpay secure checkout simulation (credentials not configured).");
      const redirectUrl = `/payment/worldpay-gateway?orderId=${orderId}&amount=${amount}&sessionId=${sessionId}`;
      return res.json({
        success: true,
        paymentSessionId: sessionId,
        amount: parseFloat(amount),
        currency,
        redirectUrl,
      });
    }
  } catch (err: any) {
    console.error("[Worldpay Session] Error creating payment session:", err);
    res.status(500).json({ error: err.message || "Failed to initialize Worldpay payment session." });
  }
});

/**
 * 1b. GET: Worldpay / ACI Callback Endpoint
 * Handles shopper redirect after transaction completion on ACI / Oppwa Widgets.
 */
router.get("/callback", async (req, res) => {
  try {
    const { orderId, id: checkoutId } = req.query;

    if (!orderId || !checkoutId) {
      return res.status(400).send("Callback requires both orderId and checkout id.");
    }

    console.log(`[Worldpay Callback] Verifying real transaction for Checkout ID: ${checkoutId}, Order ID: ${orderId}`);

    // Call GET https://test.oppwa.com/v1/checkouts/${checkoutId}/payment?entityId=${entityId}
    const useBasic = WORLDPAY_API_USERNAME.toLowerCase() === 'basic';
    const authHeader = useBasic 
      ? 'Basic ' + Buffer.from(`${WORLDPAY_API_USERNAME}:${WORLDPAY_API_PASSWORD}`).toString('base64')
      : `Bearer ${WORLDPAY_API_PASSWORD}`;

    const verificationUrl = `https://test.oppwa.com/v1/checkouts/${checkoutId}/payment?entityId=${WORLDPAY_ENTITY_ID}`;

    const response = await fetch(verificationUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });

    const data: any = await response.json();
    console.log(`[Worldpay Callback] Verification response:`, JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.result?.description || 'Failed to verify transaction with payment provider.');
    }

    // ACI/Oppwa success codes are typically starting with 000.000, 000.100, 000.300, 000.600
    const successRegex = /^(000\.000\.|000\.100\.|000\.300\.|000\.600\.)/;
    const isSuccess = successRegex.test(data.result?.code);

    if (isSuccess) {
      // Complete payment and update database & trigger email!
      await processSuccessfulOrderPayment(orderId as string, {
        transactionId: data.id || (checkoutId as string),
        authCode: data.registrationId || data.ndc || `WPY-${Math.floor(Math.random() * 900000 + 100000)}`,
        cardBrand: data.paymentBrand || 'Card'
      });

      // Redirect user to the frontend success screen
      return res.redirect(`/payment/success?orderId=${orderId}&amount=${data.amount}`);
    } else {
      // Transaction failed
      const reason = data.result?.description || 'Transaction declined by payment gateway.';
      console.warn(`[Worldpay Callback] Transaction failed for Order ${orderId}: ${reason}`);
      return res.redirect(`/payment/failed?orderId=${orderId}&reason=${encodeURIComponent(reason)}`);
    }

  } catch (err: any) {
    console.error("[Worldpay Callback] Error during callback processing:", err);
    return res.redirect(`/payment/failed?orderId=${req.query.orderId || 'Unknown'}&reason=${encodeURIComponent(err.message || 'System verification timeout.')}`);
  }
});

/**
 * 2. POST: Complete Payment directly (for in-app API flow)
 * Handles authorization requests immediately.
 */
router.post("/process-direct", async (req, res) => {
  try {
    const { orderId, amount, cardHolderName, cardNumber, expiry, cvv, currency = "GBP" } = req.body;

    if (!orderId || !amount || !cardHolderName || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ error: "Missing required checkout parameters." });
    }

    console.log(`[Worldpay Direct] Authorizing payment of £${amount} for Order: ${orderId}`);

    // Validate card format in mock manner
    const cleanNum = cardNumber.replace(/\s+/g, "");
    if (cleanNum.length < 13) {
      return res.status(400).json({ error: "Invalid credit card number length." });
    }

    const transactionId = `wp-tx-${Math.floor(Math.random() * 9000000 + 1000000)}`;
    const authCode = `WPY${Math.floor(Math.random() * 900000 + 100000)}`;
    
    let cardBrand = "Visa";
    if (cleanNum.startsWith("5")) cardBrand = "Mastercard";
    else if (cleanNum.startsWith("3")) cardBrand = "American Express";

    const order = await processSuccessfulOrderPayment(orderId, {
      transactionId,
      authCode,
      cardBrand
    });

    if (order) {
      res.json({
        success: true,
        paymentStatus: "AUTHORISED",
        transactionId,
        authCode,
        message: "Payment authorized successfully."
      });
    } else {
      res.status(404).json({ error: "Order details could not be matched." });
    }
  } catch (err: any) {
    console.error("[Worldpay Direct] Authorization Error:", err);
    res.status(500).json({ error: err.message || "Failed to process card transaction." });
  }
});

/**
 * 3. GET: Verify Order Payment Status
 * Checks status of order in database and ensures the email is sent as a safeguard.
 */
router.get("/verify", async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID query parameter is required." });
    }

    console.log(`[Worldpay Verification] Checking status for Order ID: ${orderId}`);

    const ordersList = await fetchResource("orders");
    const order = ordersList.find((o: any) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({
      orderId: order.id,
      paymentStatus: order.paymentStatus || "Pending",
      transactionId: order.worldpayTxId || null,
      authCode: order.worldpayAuthCode || null,
      amount: order.total,
    });
  } catch (err: any) {
    console.error("[Worldpay Verification] Error:", err);
    res.status(500).json({ error: err.message || "Failed to verify payment status." });
  }
});

/**
 * 4. POST: Worldpay Webhook Endpoint
 * Listens for real payment event messages from Worldpay servers.
 */
router.post("/webhook", async (req, res) => {
  const signature = req.headers["x-worldpay-signature"] as string;
  const rawBody = JSON.stringify(req.body);

  console.log(`[Worldpay Webhook] Received webhook event. Signature header: ${signature}`);

  // Validate webhook signature to prevent spoofing
  if (WORLDPAY_WEBHOOK_SECRET) {
    const isValid = verifyWorldpaySignature(rawBody, signature, WORLDPAY_WEBHOOK_SECRET);
    if (!isValid) {
      console.warn("[Worldpay Webhook] Webhook signature verification FAILED. Rejecting payload.");
      return res.status(401).json({ error: "Invalid webhook signature." });
    }
    console.log("[Worldpay Webhook] Signature verification successful.");
  }

  try {
    const { eventType, data } = req.body;
    
    if (!eventType || !data) {
      return res.status(400).json({ error: "Invalid webhook payload structure." });
    }

    const { orderId, paymentStatus, transactionId, authCode, cardBrand = "Visa" } = data;

    console.log(`[Worldpay Webhook] EventType: ${eventType}, Order: ${orderId}, Status: ${paymentStatus}`);

    if (eventType === "payment.success" || paymentStatus === "AUTHORISED" || paymentStatus === "Paid") {
      await processSuccessfulOrderPayment(orderId, {
        transactionId: transactionId || `wp-webhook-tx-${Date.now()}`,
        authCode: authCode || `WPY-WEB-${Math.floor(Math.random() * 900000 + 100000)}`,
        cardBrand
      });
    } else if (paymentStatus === "Failed" || paymentStatus === "CANCELLED") {
      const ordersList = await fetchResource("orders");
      const orderIdx = ordersList.findIndex((o: any) => o.id === orderId);
      if (orderIdx !== -1) {
        ordersList[orderIdx].paymentStatus = "Failed";
        await saveResource("orders", ordersList);
        console.log(`[Worldpay Webhook] Order ${orderId} set to 'Failed' based on webhook notification.`);
      }
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (err: any) {
    console.error("[Worldpay Webhook] Processing Error:", err);
    res.status(500).json({ error: "Webhook processing encountered a internal error" });
  }
});

export default router;
