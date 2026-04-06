/**
 * POST /api/run-engine
 * Proxies analysis requests to the deployed Python quant engine.
 *
 * Required env vars:
 *   ENGINE_API_URL   — e.g. https://ve-quant-engine.onrender.com
 *   ENGINE_API_KEY   — the engine's x-api-key header value
 *
 * Body (multipart/form-data OR JSON):
 *   snapshots   — CSV file or text
 *   outcomes    — CSV file or text
 *   config      — optional YAML text
 */

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const engineUrl = process.env.ENGINE_API_URL;
  const engineKey = process.env.ENGINE_API_KEY;

  if (!engineUrl) {
    return res.status(503).json({
      error: "engine_not_configured",
      message: "The quant engine is not yet deployed. Contact us at contact@aureliusquant.com to run a full analysis.",
    });
  }

  try {
    const upstream = await fetch(`${engineUrl}/runs/execute`, {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        ...(engineKey ? { "x-api-key": engineKey } : {}),
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Engine proxy error:", err.message);
    return res.status(502).json({ error: "Engine unreachable. Please try again shortly." });
  }
}
