/**
 * POST /api/create-checkout
 * Creates a Stripe Checkout Session for the selected tier.
 *
 * Required env vars (set in Vercel dashboard):
 *   STRIPE_SECRET_KEY  — sk_live_... or sk_test_...
 *
 * Body: { tier: "Bronze"|"Silver"|"Gold"|"Platinum", userId, userEmail }
 * Returns: { url } — redirect the browser to this URL
 */

// Stripe Price IDs — create these in your Stripe dashboard and replace below
// Dashboard → Products → Add product → Add price (recurring, per season)
const PRICE_IDS = {
  Bronze:   process.env.STRIPE_PRICE_BRONZE   || "",
  Silver:   process.env.STRIPE_PRICE_SILVER   || "",
  Gold:     process.env.STRIPE_PRICE_GOLD     || "",
  Platinum: process.env.STRIPE_PRICE_PLATINUM || "",
};

const TIER_PRICES = { Bronze: 100, Silver: 300, Gold: 750, Platinum: 2000 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: "Stripe not configured." });
  }

  const { tier, userId, userEmail } = req.body || {};
  if (!tier || !TIER_PRICES[tier]) {
    return res.status(400).json({ error: "Invalid tier." });
  }

  const priceId = PRICE_IDS[tier];
  if (!priceId) {
    return res.status(500).json({ error: `Stripe price ID for ${tier} not configured.` });
  }

  const origin = req.headers.origin || "https://ve-quant-website-vohh.vercel.app";

  try {
    // Dynamic import of stripe (installed as a dependency of the api function)
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail || undefined,
      metadata: { tier, userId: userId || "" },
      success_url: `${origin}?session_id={CHECKOUT_SESSION_ID}&tier=${tier}#dashboard`,
      cancel_url: `${origin}#pricing`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return res.status(500).json({ error: "Could not create checkout session." });
  }
}
