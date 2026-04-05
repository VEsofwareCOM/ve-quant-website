import { useState, useEffect, useRef } from "react";

// ─── TIER DATA ─────────────────────────────────────────────────────────────
const TIERS = [
  {
    name: "Bronze",
    price: 100,
    color: "#cd7f32",
    glow: "rgba(205,127,50,0.25)",
    tag: null,
    features: [
      { text: "Constraint validation engine", included: true },
      { text: "Judge model predictions", included: true },
      { text: "1 firm per run", included: true },
      { text: "Basic performance report", included: true },
      { text: "50 runs per season", included: true },
      { text: "Monte Carlo simulations", included: false },
      { text: "Complexity scoring", included: false },
      { text: "Scenario & stress testing", included: false },
      { text: "Competitive intelligence", included: false },
      { text: "Feature discovery engine", included: false },
      { text: "Custom rules builder", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Silver",
    price: 300,
    color: "#a8a9ad",
    glow: "rgba(168,169,173,0.25)",
    tag: "Most Popular",
    features: [
      { text: "Constraint validation engine", included: true },
      { text: "Judge model predictions", included: true },
      { text: "3 firms per run", included: true },
      { text: "Advanced performance report", included: true },
      { text: "200 runs per season", included: true },
      { text: "Monte Carlo (1,000 sims)", included: true },
      { text: "Complexity scoring", included: true },
      { text: "Scenario & stress testing", included: false },
      { text: "Competitive intelligence", included: false },
      { text: "Feature discovery engine", included: false },
      { text: "Custom rules builder", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Gold",
    price: 750,
    color: "#ffd700",
    glow: "rgba(255,215,0,0.25)",
    tag: "Best Value",
    features: [
      { text: "Constraint validation engine", included: true },
      { text: "Judge model predictions", included: true },
      { text: "5 firms per run", included: true },
      { text: "Full analytics report + export", included: true },
      { text: "Unlimited runs", included: true },
      { text: "Monte Carlo (10,000 sims)", included: true },
      { text: "Complexity scoring", included: true },
      { text: "Scenario & stress testing", included: true },
      { text: "Feature discovery engine", included: true },
      { text: "Competitive intelligence", included: false },
      { text: "Custom rules builder", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    name: "Platinum",
    price: 2000,
    color: "#e5e4e2",
    glow: "rgba(229,228,226,0.3)",
    tag: "Maximum Edge",
    features: [
      { text: "Constraint validation engine", included: true },
      { text: "Judge model predictions", included: true },
      { text: "Up to 10 firms per run", included: true },
      { text: "Full analytics report + export", included: true },
      { text: "Unlimited runs", included: true },
      { text: "Monte Carlo (10,000 sims)", included: true },
      { text: "Complexity scoring", included: true },
      { text: "Scenario & stress testing", included: true },
      { text: "Feature discovery engine", included: true },
      { text: "Competitive intelligence", included: true },
      { text: "Custom rules builder", included: true },
      { text: "API access + dedicated onboarding", included: true },
    ],
  },
];

const STATS = [
  { value: "94.2%", label: "Backtest Accuracy" },
  { value: "10K+", label: "Monte Carlo Sims" },
  { value: "158", label: "Features Discovered" },
  { value: "3-Layer", label: "Constraint Engine" },
];

const CONTACT_EMAIL = "contact@aureliusquant.com";

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────
function AnimatedStat({ value, label, delay }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `all 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#c8ff00", letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6b6b7b", textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── TIER CARD ─────────────────────────────────────────────────────────────
function TierCard({ tier, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const isPlatinum = tier.name === "Platinum";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1a1a2e" : "#12121a",
        borderRadius: 16,
        padding: "32px 24px",
        position: "relative",
        transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 40px ${tier.glow}` : "none",
        flex: "1 1 200px",
        minWidth: 200,
        maxWidth: 260,
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Glow top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.35s",
      }} />

      {/* Tag */}
      {tier.tag && (
        <div style={{
          position: "absolute", top: 16, right: 16,
          background: isPlatinum ? "linear-gradient(135deg, #c8ff00, #8bcc00)" : tier.glow,
          color: isPlatinum ? "#0a0a0f" : tier.color,
          fontSize: 9, fontWeight: 600, letterSpacing: 1.5,
          textTransform: "uppercase", padding: "4px 10px", borderRadius: 20,
        }}>{tier.tag}</div>
      )}

      {/* Name */}
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: tier.color, marginBottom: 8 }}>{tier.name}</div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 2, marginBottom: 4 }}>
        <span style={{ fontSize: 14, color: "#6b6b7b", marginTop: 4 }}>$</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: -2, lineHeight: 1 }}>{tier.price}</span>
      </div>
      <div style={{ fontSize: 11, color: "#6b6b7b", marginBottom: 24 }}>per season</div>

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {tier.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
              background: f.included ? (isPlatinum ? "linear-gradient(135deg,#c8ff00,#8bcc00)" : "rgba(200,255,0,0.15)") : "rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {f.included ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4.5 7.5L8 3" stroke={isPlatinum ? "#0a0a0f" : "#c8ff00"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#3a3a4a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: 12, color: f.included ? "#c8c8d0" : "#3a3a4a", lineHeight: 1.4 }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(tier)}
        style={{
          width: "100%", padding: "12px 0", border: "none", borderRadius: 10, cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12, fontWeight: 500, letterSpacing: 1,
          background: isPlatinum
            ? "linear-gradient(135deg, #c8ff00, #8bcc00)"
            : hovered ? `${tier.color}22` : "rgba(255,255,255,0.05)",
          color: isPlatinum ? "#0a0a0f" : tier.color,
          transition: "all 0.25s",
        }}
      >
        {isPlatinum ? "GET MAXIMUM EDGE →" : `SELECT ${tier.name.toUpperCase()} →`}
      </button>
    </div>
  );
}

// ─── FOMO TICKER ───────────────────────────────────────────────────────────
const FOMO_ITEMS = [
  "Lincoln High upgraded to Platinum",
  "Roosevelt Academy joined at Gold",
  "Westfield Prep running Monte Carlo sims",
  "Oak Ridge High upgraded to Gold",
  "Summit Academy signed up — Silver",
  "Eastside Charter running stress tests",
  "Meridian High upgraded to Platinum",
  "Pacific View Academy joined at Silver",
];

function FOMOTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FOMO_ITEMS.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      background: "rgba(200,255,0,0.04)",
      borderRadius: 10, padding: "10px 20px",
      display: "flex", alignItems: "center", gap: 12,
      maxWidth: 520, margin: "0 auto",
    }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#c8ff00", boxShadow: "0 0 6px #c8ff00", flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: "#8aaa50", fontStyle: "italic" }}>{FOMO_ITEMS[idx]}</span>
    </div>
  );
}

// ─── CONTACT MODAL ─────────────────────────────────────────────────────────
function ContactModal({ tier, onClose }) {
  const subject = encodeURIComponent(`Aurelius Quant — ${tier.name} Plan ($${tier.price}/season)`);
  const body = encodeURIComponent(
    `Hi,\n\nI'm interested in the ${tier.name} plan for my VE firm.\n\nSchool: \nFirm name: \nSeason: \n\nPlease send me onboarding details.\n\nThanks`
  );
  const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#12121a", borderRadius: 20, padding: "36px 32px",
          maxWidth: 460, width: "100%",
          boxShadow: `0 24px 80px rgba(200,255,0,0.12)`,
          position: "relative",
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8,
          width: 32, height: 32, cursor: "pointer", color: "#6b6b7b", fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        <div style={{ fontSize: 11, color: "#c8ff00", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Get Started</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
          {tier.name} Plan
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: tier.color, fontFamily: "'Syne', sans-serif", marginBottom: 20 }}>
          ${tier.price}<span style={{ fontSize: 13, fontWeight: 400, color: "#6b6b7b" }}>/season</span>
        </div>

        <p style={{ fontSize: 13, color: "#6b6b7b", lineHeight: 1.7, marginBottom: 28 }}>
          Click below to send us an email and we'll get your account set up within 24 hours. Include your school name, firm name, and which season you're competing in.
        </p>

        <a href={mailtoLink} style={{
          display: "block", textAlign: "center",
          background: "linear-gradient(135deg, #c8ff00, #8bcc00)", color: "#0a0a0f",
          borderRadius: 10, padding: "14px 0",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600,
          letterSpacing: 0.5, textDecoration: "none",
          boxShadow: "0 4px 24px rgba(200,255,0,0.25)",
        }}>
          EMAIL US TO GET STARTED →
        </a>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#3a3a4a" }}>
          or email {CONTACT_EMAIL} directly
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("home");
  const [selectedTier, setSelectedTier] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (s) => {
    setSection(s);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e8e8ec", fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, opacity: 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }} />

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,15,0.9)", backdropFilter: "blur(12px)",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("home")}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, #c8ff00, #8bcc00)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z" stroke="#0a0a0f" strokeWidth="1.8" fill="none"/>
              <path d="M7 4L9.5 5.5V8.5L7 10L4.5 8.5V5.5L7 4Z" fill="#0a0a0f"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>Aurelius Quant</span>
        </div>

        {/* Desktop nav links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="desktop-nav">
          {["home", "pricing", "demo"].map(s => (
            <button key={s} onClick={() => navigate(s)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
              color: section === s ? "#c8ff00" : "#6b6b7b",
              letterSpacing: 1, textTransform: "uppercase",
              transition: "color 0.2s", fontWeight: 500,
            }}>{s}</button>
          ))}
          <button onClick={() => navigate("pricing")} style={{
            background: "linear-gradient(135deg, #c8ff00, #8bcc00)", color: "#0a0a0f",
            border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
          }}>GET STARTED →</button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(o => !o)}
          style={{
            display: "none",
            background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8,
            width: 36, height: 36, cursor: "pointer", color: "#c8ff00",
            fontSize: 18, alignItems: "center", justifyContent: "center",
          }}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? "×" : "≡"}
        </button>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 56, left: 0, right: 0, zIndex: 49,
          background: "rgba(10,10,15,0.98)", backdropFilter: "blur(12px)",
          padding: "16px 24px 24px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {["home", "pricing", "demo"].map(s => (
            <button key={s} onClick={() => navigate(s)} style={{
              background: section === s ? "rgba(200,255,0,0.08)" : "none",
              border: "none", cursor: "pointer", borderRadius: 8,
              fontSize: 13, fontFamily: "'IBM Plex Mono', monospace",
              color: section === s ? "#c8ff00" : "#a0a0b0",
              letterSpacing: 1, textTransform: "uppercase", fontWeight: 500,
              padding: "14px 16px", textAlign: "left",
            }}>{s}</button>
          ))}
          <button onClick={() => navigate("pricing")} style={{
            marginTop: 8,
            background: "linear-gradient(135deg, #c8ff00, #8bcc00)", color: "#0a0a0f",
            border: "none", borderRadius: 8, padding: "14px 0", cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600,
          }}>GET STARTED →</button>
        </div>
      )}

      {/* Responsive styles injected */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {/* PAGES */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {section === "home" && <HomePage setSection={navigate} />}
        {section === "pricing" && <PricingPage onSelect={setSelectedTier} />}
        {section === "demo" && <DemoPage setSection={navigate} />}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "60px 24px 40px", marginTop: 80 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Aurelius Quant</div>
        <div style={{ fontSize: 11, color: "#3a3a4a", letterSpacing: 1 }}>© 2026 AURELIUS QUANT. ALL RIGHTS RESERVED.</div>
      </footer>

      {/* Contact modal */}
      {selectedTier && <ContactModal tier={selectedTier} onClose={() => setSelectedTier(null)} />}
    </div>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
function HomePage({ setSection }) {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 40px", textAlign: "center" }}>
      {/* Badge */}
      <div style={{
        display: "inline-block", background: "rgba(200,255,0,0.1)",
        borderRadius: 20, padding: "5px 16px", fontSize: 11, color: "#c8ff00",
        letterSpacing: 2, textTransform: "uppercase", marginBottom: 24, fontWeight: 500,
      }}>Quantitative Decision Platform</div>

      {/* Hero */}
      <h1 style={{
        fontFamily: "'Syne', sans-serif", fontSize: "clamp(42px, 7vw, 72px)",
        fontWeight: 800, lineHeight: 1.05, letterSpacing: -2.5, marginBottom: 24,
        background: "linear-gradient(140deg, #ffffff 20%, #c8ff00 80%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        The edge your<br />rivals don't have.
      </h1>

      <p style={{ fontSize: 15, color: "#6b6b7b", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
        AI-powered quantitative analysis built for competitive business simulation. Monte Carlo simulations, constraint enforcement, and predictive scoring — all running server-side. Your competitors never see how it works.
      </p>

      {/* FOMO */}
      <div style={{ marginBottom: 40 }}><FOMOTicker /></div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 72 }}>
        <button onClick={() => setSection("pricing")} style={{
          background: "linear-gradient(135deg, #c8ff00, #8bcc00)", color: "#0a0a0f",
          border: "none", borderRadius: 10, padding: "14px 32px", cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
          boxShadow: "0 4px 24px rgba(200,255,0,0.25)", transition: "transform 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(200,255,0,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(200,255,0,0.25)"; }}
        >START WINNING →</button>
        <button onClick={() => setSection("demo")} style={{
          background: "transparent", color: "#c8ff00",
          border: "none", borderRadius: 10, padding: "14px 32px", cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, letterSpacing: 0.5,
          transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(200,255,0,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >SEE DEMO</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(32px, 6vw, 80px)", flexWrap: "wrap", marginBottom: 80 }}>
        {STATS.map((s, i) => <AnimatedStat key={i} value={s.value} label={s.label} delay={i * 120} />)}
      </div>

      {/* How it works */}
      <div style={{ textAlign: "left", marginTop: 40 }}>
        <div style={{ fontSize: 11, color: "#c8ff00", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>How it works</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { step: "01", title: "Submit", desc: "Enter your business plan details through the platform." },
            { step: "02", title: "Analyze", desc: "Engine runs constraints, predictions, and 10K Monte Carlo sims server-side." },
            { step: "03", title: "Optimize", desc: "Receive ranked strategies with complexity-adjusted win probabilities." },
            { step: "04", title: "Win", desc: "Deploy the optimal strategy with full confidence." },
          ].map((item, i) => (
            <div key={i} style={{
              flex: "1 1 180px", maxWidth: 220,
              background: "#12121a", borderRadius: 14, padding: "24px 20px",
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "rgba(200,255,0,0.15)", marginBottom: 8 }}>{item.step}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#6b6b7b", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOMO CTA */}
      <div style={{
        marginTop: 80,
        background: "linear-gradient(135deg, rgba(200,255,0,0.06), rgba(200,255,0,0.02))",
        borderRadius: 20, padding: "48px 32px", textAlign: "center",
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
          Your rivals are already using this.
        </div>
        <p style={{ fontSize: 13, color: "#6b6b7b", maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.7 }}>
          Every season more schools upgrade. The gap between teams using Aurelius Quant and teams that aren't grows every day.
        </p>
        <button onClick={() => setSection("pricing")} style={{
          background: "linear-gradient(135deg, #c8ff00, #8bcc00)", color: "#0a0a0f",
          border: "none", borderRadius: 10, padding: "13px 28px", cursor: "pointer",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600,
        }}>SEE PLANS →</button>
      </div>
    </div>
  );
}

// ─── PRICING PAGE ──────────────────────────────────────────────────────────
function PricingPage({ onSelect }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 40px", textAlign: "center" }}>
      <div style={{
        display: "inline-block", background: "rgba(200,255,0,0.1)",
        borderRadius: 20, padding: "5px 16px", fontSize: 11, color: "#c8ff00",
        letterSpacing: 2, textTransform: "uppercase", marginBottom: 20, fontWeight: 500,
      }}>Pricing</div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 48px)",
        fontWeight: 800, color: "#fff", letterSpacing: -1.5, marginBottom: 12,
      }}>Choose your edge.</h2>
      <p style={{ fontSize: 13, color: "#6b6b7b", maxWidth: 460, margin: "0 auto 16px", lineHeight: 1.7 }}>
        All tiers include server-side processing. Your data and our engine stay protected. No code is ever exposed.
      </p>
      <FOMOTicker />

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 48 }}>
        {TIERS.map((tier, i) => <TierCard key={i} tier={tier} onSelect={onSelect} />)}
      </div>

      {/* Trust bar */}
      <div style={{ marginTop: 64, display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
        {[
          { icon: "🔒", text: "Server-side only" },
          { icon: "🛡️", text: "Code never exposed" },
          { icon: "📊", text: "Results in seconds" },
          { icon: "🏫", text: "Built for schools" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 0.5 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DEMO PAGE ─────────────────────────────────────────────────────────────
function DemoPage({ setSection }) {
  const [businessPlan, setBusinessPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  async function runAnalysis() {
    if (!businessPlan.trim()) return;
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessPlan }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Analysis failed.");
      }

      const parsed = await response.json();
      setResults(parsed);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "80px 24px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          display: "inline-block", background: "rgba(200,255,0,0.1)",
          borderRadius: 20, padding: "5px 16px", fontSize: 11, color: "#c8ff00",
          letterSpacing: 2, textTransform: "uppercase", marginBottom: 20, fontWeight: 500,
        }}>Live Demo</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 10,
        }}>Try the engine.</h2>
        <p style={{ fontSize: 13, color: "#6b6b7b", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
          Enter a business plan below. The engine will run constraints, Monte Carlo simulations, and return a full quantitative report.
        </p>
      </div>

      {/* Input */}
      <div style={{ background: "#12121a", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <label style={{ fontSize: 11, color: "#c8ff00", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 10 }}>
          Business Plan
        </label>
        <textarea
          value={businessPlan}
          onChange={e => setBusinessPlan(e.target.value)}
          placeholder={`Example: Our firm "TechForward" will sell a SaaS product targeting small businesses. We plan to hire 4 employees, price at $50/month, and target 500 customers by end of year. Startup costs are $8,000 and monthly operating costs are $3,500...`}
          rows={6}
          style={{
            width: "100%", background: "rgba(0,0,0,0.3)", border: "none", outline: "none",
            borderRadius: 10, padding: "14px 16px", color: "#e8e8ec", resize: "vertical",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, lineHeight: 1.7,
          }}
        />
        <button
          onClick={runAnalysis}
          disabled={loading || !businessPlan.trim()}
          style={{
            marginTop: 16, width: "100%", padding: "14px 0", border: "none", borderRadius: 10,
            cursor: loading || !businessPlan.trim() ? "not-allowed" : "pointer",
            background: loading ? "#2a2a3a" : "linear-gradient(135deg, #c8ff00, #8bcc00)",
            color: loading ? "#6b6b7b" : "#0a0a0f",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1,
            transition: "all 0.2s",
          }}
        >
          {loading ? "RUNNING ANALYSIS..." : "RUN QUANT ANALYSIS →"}
        </button>
      </div>

      {error && (
        <div style={{
          background: "rgba(255,77,77,0.1)", borderRadius: 10, padding: "12px 16px",
          color: "#ff6b6b", fontSize: 13, marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div ref={resultsRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, rgba(200,255,0,0.08), rgba(200,255,0,0.02))",
            borderRadius: 16, padding: "24px 28px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#c8ff00", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Analysis Complete</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff" }}>{results.firm_name}</div>
                <div style={{ fontSize: 12, color: "#6b6b7b", marginTop: 4 }}>Type: {results.business_type}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#6b6b7b" }}>Win Probability</div>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, letterSpacing: -2, lineHeight: 1,
                  color: results.monte_carlo.win_probability_pct >= 60 ? "#c8ff00" : results.monte_carlo.win_probability_pct >= 40 ? "#ffb84d" : "#ff4d4d",
                }}>{results.monte_carlo.win_probability_pct}%</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#a0a0b0", marginTop: 16, lineHeight: 1.6 }}>{results.summary}</p>
          </div>

          {/* Constraints + Judge */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px", background: "#12121a", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: results.constraint_validation.passed ? "rgba(200,255,0,0.15)" : "rgba(255,77,77,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 12 }}>{results.constraint_validation.passed ? "✓" : "✗"}</span>
                </div>
                <span style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 1, textTransform: "uppercase" }}>Constraints</span>
              </div>
              <div style={{ fontSize: 13, color: results.constraint_validation.passed ? "#c8ff00" : "#ff4d4d", fontWeight: 500, marginBottom: 8 }}>
                {results.constraint_validation.passed ? "All Passed" : "Violations Found"}
              </div>
              <div style={{ fontSize: 11, color: "#6b6b7b" }}>{results.constraint_validation.checks_run} checks run</div>
              {results.constraint_validation.violations.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {results.constraint_validation.violations.map((v, i) => (
                    <div key={i} style={{ fontSize: 11, color: "#ff6b6b", background: "rgba(255,77,77,0.08)", borderRadius: 6, padding: "6px 10px", marginBottom: 4 }}>⚠ {v}</div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ flex: "1 1 300px", background: "#12121a", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Judge Prediction</div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { label: "Raw Score", value: results.judge_prediction.predicted_score, color: "#fff" },
                  { label: "Adjusted", value: results.judge_prediction.complexity_adjusted_score, color: "#c8ff00" },
                  { label: "Confidence", value: `${results.judge_prediction.confidence_pct}%`, color: "#4dbaff" },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: "#6b6b7b", marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monte Carlo + Complexity */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px", background: "#12121a", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
                Monte Carlo — {results.monte_carlo.simulations_run.toLocaleString()} sims
              </div>
              {[
                { label: "Best Case", value: results.monte_carlo.best_case_revenue, color: "#c8ff00" },
                { label: "Median", value: results.monte_carlo.median_revenue, color: "#4dbaff" },
                { label: "Worst Case", value: results.monte_carlo.worst_case_revenue, color: "#ff4d4d" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#6b6b7b" }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: item.color }}>${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ flex: "1 1 300px", background: "#12121a", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 1, textTransform: "uppercase" }}>Complexity Score</span>
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800,
                  color: results.complexity_score.composite < 0.4 ? "#c8ff00" : results.complexity_score.composite < 0.6 ? "#ffb84d" : "#ff4d4d",
                }}>{results.complexity_score.composite.toFixed(3)}</span>
              </div>
              {[
                { label: "Feature", value: results.complexity_score.feature_score },
                { label: "Model", value: results.complexity_score.model_score },
                { label: "Strategy", value: results.complexity_score.strategy_score },
                { label: "Robustness", value: results.complexity_score.robustness_score },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: "#6b6b7b" }}>{item.label}</span>
                    <span style={{ fontSize: 11, color: "#a0a0b0" }}>{item.value.toFixed(3)}</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{
                      height: "100%", width: `${item.value * 100}%`, borderRadius: 2,
                      background: item.value < 0.4 ? "#c8ff00" : item.value < 0.6 ? "#ffb84d" : "#ff4d4d",
                      transition: "width 0.6s cubic-bezier(.22,1,.36,1)",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financials + Scenarios */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px", background: "#12121a", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Financial Projection</div>
              {[
                { label: "Revenue", value: results.financial_projection.revenue_estimate, color: "#c8ff00" },
                { label: "Costs", value: results.financial_projection.cost_estimate, color: "#ff4d4d" },
                { label: "Cash Reserve", value: results.financial_projection.cash_reserve, color: "#4dbaff" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#6b6b7b" }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: item.color }}>${item.value.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#6b6b7b" }}>Profit Margin</span>
                <span style={{
                  fontSize: 14, fontWeight: 600,
                  color: results.financial_projection.profit_margin_pct >= 20 ? "#c8ff00" : results.financial_projection.profit_margin_pct >= 0 ? "#ffb84d" : "#ff4d4d",
                }}>{results.financial_projection.profit_margin_pct.toFixed(1)}%</span>
              </div>
            </div>

            <div style={{ flex: "1 1 300px", background: "#12121a", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Scenario Analysis</div>
              <div style={{ background: "rgba(200,255,0,0.06)", borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "#c8ff00", marginBottom: 2 }}>Best: {results.scenario_analysis.best_scenario.name}</div>
                <div style={{ fontSize: 13, color: "#c8ff00", fontWeight: 500 }}>Win: {results.scenario_analysis.best_scenario.win_prob_pct}%</div>
              </div>
              <div style={{ background: "rgba(255,77,77,0.06)", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#ff4d4d", marginBottom: 2 }}>Worst: {results.scenario_analysis.worst_scenario.name}</div>
                <div style={{ fontSize: 13, color: "#ff4d4d", fontWeight: 500 }}>Win: {results.scenario_analysis.worst_scenario.win_prob_pct}%</div>
              </div>
              <div style={{ fontSize: 11, color: "#6b6b7b", marginBottom: 4 }}>Recommended Strategy</div>
              <div style={{ fontSize: 12, color: "#a0a0b0", lineHeight: 1.5 }}>{results.scenario_analysis.recommended_strategy}</div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ background: "#12121a", borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 11, color: "#6b6b7b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Recommendations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {results.recommendations.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, background: "rgba(200,255,0,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, color: "#c8ff00",
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: "#c0c0c8", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade nudge */}
          <div style={{
            background: "linear-gradient(135deg, rgba(200,255,0,0.06), rgba(200,255,0,0.02))",
            borderRadius: 16, padding: "24px 28px", textAlign: "center",
          }}>
            <div style={{ fontSize: 13, color: "#a0a0b0", marginBottom: 8 }}>
              This demo runs <strong style={{ color: "#c8ff00" }}>1,000 simulations</strong>. Paid tiers unlock up to <strong style={{ color: "#c8ff00" }}>10,000 sims</strong>, stress testing, competitive intelligence, and more.
            </div>
            <div style={{ fontSize: 12, color: "#6b6b7b", marginBottom: 16 }}>Plans start at $100/season</div>
            <button onClick={() => setSection("pricing")} style={{
              background: "linear-gradient(135deg, #c8ff00, #8bcc00)", color: "#0a0a0f",
              border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600,
            }}>SEE PLANS →</button>
          </div>
        </div>
      )}
    </div>
  );
}
