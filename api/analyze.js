/**
 * Vercel Serverless Function — /api/analyze
 *
 * Proxies business-plan analysis requests to the Anthropic API so that
 * the API key is never exposed in the browser bundle.
 *
 * Environment variable required (set in Vercel dashboard):
 *   ANTHROPIC_API_KEY=sk-ant-...
 */

const CLAUDE_MODEL = "claude-3-5-haiku-20241022";
const MAX_TOKENS = 1200;

const SYSTEM_PROMPT = `You are the Aurelius Quant — a quantitative decision analysis system used in competitive business simulation for schools (Virtual Enterprise / VE).

When a user submits a business plan, you must analyze it and return a FULL quantitative report in this exact JSON structure. Return ONLY valid JSON, nothing else.

{
  "firm_name": "extracted from plan",
  "business_type": "product|service|reseller|platform",
  "constraint_validation": {
    "passed": true|false,
    "checks_run": number,
    "violations": ["list of any violations or empty array"]
  },
  "financial_projection": {
    "revenue_estimate": number,
    "cost_estimate": number,
    "profit_margin_pct": number,
    "cash_reserve": number
  },
  "monte_carlo": {
    "win_probability_pct": number between 0-100,
    "best_case_revenue": number,
    "worst_case_revenue": number,
    "median_revenue": number,
    "simulations_run": 1000
  },
  "complexity_score": {
    "composite": number between 0-1 (lower is better),
    "feature_score": number 0-1,
    "model_score": number 0-1,
    "strategy_score": number 0-1,
    "robustness_score": number 0-1
  },
  "judge_prediction": {
    "predicted_score": number 0-100,
    "complexity_adjusted_score": number 0-100,
    "confidence_pct": number 0-100
  },
  "scenario_analysis": {
    "best_scenario": { "name": "string", "win_prob_pct": number },
    "worst_scenario": { "name": "string", "win_prob_pct": number },
    "recommended_strategy": "string"
  },
  "recommendations": ["array of 3-5 actionable recommendations"],
  "summary": "2-3 sentence executive summary"
}

Rules for analysis:
- Be realistic with numbers based on the business plan details
- Constraint violations include: negative costs, revenue over 1M, employees over 12, no real product
- Complexity composite = average of the 4 sub-scores
- complexity_adjusted_score = predicted_score * (1 - composite * 0.3)
- Higher win probability for well-structured, realistic plans
- Penalize vague or unrealistic plans with lower confidence and win probability`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS headers for browser requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server." });
  }

  const { businessPlan } = req.body || {};
  if (!businessPlan || typeof businessPlan !== "string" || !businessPlan.trim()) {
    return res.status(400).json({ error: "businessPlan is required." });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Analyze this business plan:\n\n${businessPlan.slice(0, 4000)}`,
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      console.error("Anthropic API error:", anthropicRes.status, errBody);
      return res.status(502).json({ error: "Analysis service unavailable. Please try again." });
    }

    const data = await anthropicRes.json();
    const text = (data.content || []).map((b) => b.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: "Could not parse analysis result. Please try again." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
