/**
 * POST /api/webhook
 * Handles Stripe webhook events.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET  — from Stripe dashboard → Webhooks → signing secret
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_URL
 *
 * In Vercel: Settings → Functions → Body Size Limit should be >= 1mb
 * In Stripe dashboard, point webhook to: https://your-domain/api/webhook
 * Events to listen for: checkout.session.completed
 */

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeKey || !webhookSecret) {
    return res.status(500).json({ error: "Stripe not configured." });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20" });

  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Webhook Error: " + err.message });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { tier, userId } = session.metadata || {};
    const customerEmail = session.customer_email || session.customer_details?.email;

    console.log(`✅ Payment complete: ${customerEmail} → ${tier}`);

    // Update user tier in Supabase if configured
    if (supabaseUrl && supabaseServiceKey && userId) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from("profiles")
          .upsert({ id: userId, tier, stripe_customer_id: session.customer, updated_at: new Date().toISOString() });
        console.log(`✅ Updated profile tier for user ${userId} → ${tier}`);
      } catch (err) {
        console.error("Supabase update failed:", err.message);
      }
    }
  }

  return res.status(200).json({ received: true });
}
