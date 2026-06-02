import { useState, useEffect, useRef, useCallback } from "react";

// ─── UTILS ───────────────────────────────────────────────────────────────────
const getGuest = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("to") || "Tamu Undangan";
  } catch {
    return "Tamu Undangan";
  }
};

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────
function GoldParticles({ count = 80, active = true }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (!active) { animRef.current = requestAnimationFrame(draw); return; }
      particles.current.forEach((p) => {
        p.pulse += 0.02;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10 || p.x > W + 10) p.x = Math.random() * W;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        g.addColorStop(0, `rgba(212,175,55,${a})`);
        g.addColorStop(0.5, `rgba(244,226,184,${a * 0.6})`);
        g.addColorStop(1, `rgba(212,175,55,0)`);
        ctx.fillStyle = g;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count, active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        zIndex: 1, opacity: 0.9,
      }}
    />
  );
}

// ─── SVG ISLAMIC ORNAMENTS ────────────────────────────────────────────────────
const CrescentMoon = ({ size = 120, glow = true }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    {glow && (
      <defs>
        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    )}
    <path
      d="M75 20 C55 22, 30 40, 30 65 C30 88, 50 105, 72 107 C50 100, 38 82, 38 65 C38 42, 56 26, 75 20Z"
      fill="url(#moonGrad)" filter={glow ? "url(#moonGlow)" : undefined}
    />
    <defs>
      <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F4E2B8" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#B8960C" />
      </linearGradient>
    </defs>
    <circle cx="82" cy="32" r="5" fill="#F4E2B8" opacity="0.9" />
  </svg>
);

const GeometricPattern = ({ size = 200, opacity = 0.12 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" opacity={opacity}>
    <defs>
      <pattern id="islamic" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
        <polygon points="20,8 32,14 32,26 20,32 8,26 8,14" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
        <line x1="20" y1="2" x2="20" y2="8" stroke="#D4AF37" strokeWidth="0.5" />
        <line x1="38" y1="11" x2="32" y2="14" stroke="#D4AF37" strokeWidth="0.5" />
        <line x1="38" y1="29" x2="32" y2="26" stroke="#D4AF37" strokeWidth="0.5" />
        <line x1="20" y1="38" x2="20" y2="32" stroke="#D4AF37" strokeWidth="0.5" />
        <line x1="2" y1="29" x2="8" y2="26" stroke="#D4AF37" strokeWidth="0.5" />
        <line x1="2" y1="11" x2="8" y2="14" stroke="#D4AF37" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="200" height="200" fill="url(#islamic)" />
  </svg>
);

const Lantern = ({ size = 60 }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 60 96">
    <defs>
      <radialGradient id="lanternGlow" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#FFE066" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
      </radialGradient>
      <filter id="lg"><feGaussianBlur stdDeviation="3" /></filter>
    </defs>
    <ellipse cx="30" cy="48" rx="22" ry="35" fill="url(#lanternGlow)" filter="url(#lg)" />
    <rect x="27" y="8" width="6" height="10" fill="#D4AF37" rx="2" />
    <ellipse cx="30" cy="18" rx="14" ry="5" fill="#B8960C" />
    <path d="M16 22 Q10 48 16 74 Q30 82 44 74 Q50 48 44 22 Z" fill="#D4AF37" opacity="0.7" />
    <line x1="20" y1="22" x2="20" y2="74" stroke="#B8960C" strokeWidth="0.8" opacity="0.5" />
    <line x1="30" y1="22" x2="30" y2="74" stroke="#B8960C" strokeWidth="0.8" opacity="0.5" />
    <line x1="40" y1="22" x2="40" y2="74" stroke="#B8960C" strokeWidth="0.8" opacity="0.5" />
    <path d="M16 38 Q30 42 44 38" fill="none" stroke="#B8960C" strokeWidth="0.8" opacity="0.5" />
    <path d="M16 56 Q30 60 44 56" fill="none" stroke="#B8960C" strokeWidth="0.8" opacity="0.5" />
    <ellipse cx="30" cy="74" rx="14" ry="5" fill="#B8960C" />
    <path d="M24 74 L22 86 M30 74 L30 88 M36 74 L38 86" stroke="#D4AF37" strokeWidth="1.5" />
    <ellipse cx="30" cy="48" rx="12" ry="20" fill="#FFE066" opacity="0.4" />
  </svg>
);

const ArabicOrnament = ({ size = 40 }) => (
  <svg width={size} height={size / 4} viewBox="0 0 160 40">
    <path d="M0,20 C20,5 40,35 80,20 C120,5 140,35 160,20" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
    <circle cx="40" cy="14" r="4" fill="#D4AF37" opacity="0.6" />
    <circle cx="80" cy="20" r="5" fill="#D4AF37" opacity="0.8" />
    <circle cx="120" cy="14" r="4" fill="#D4AF37" opacity="0.6" />
    <path d="M70,20 L80,8 L90,20 L80,32 Z" fill="#D4AF37" opacity="0.5" />
  </svg>
);

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function useCountdown(target) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ id, children, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 1s ease, transform 1s ease",
      }}
    >
      {children}
    </section>
  );
}

// ─── GLASS CARD ───────────────────────────────────────────────────────────────
const GlassCard = ({ children, style = {}, className = "" }) => (
  <div
    className={className}
    style={{
      background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(10,10,10,0.6) 100%)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(212,175,55,0.25)",
      borderRadius: "16px",
      boxShadow: "0 8px 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.15)",
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── DIVIDER ─────────────────────────────────────────────────────────────────
const GoldDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #D4AF37)" }} />
    <div style={{ color: "#D4AF37", fontSize: "18px" }}>✦</div>
    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #D4AF37)" }} />
  </div>
);

// ─── AUDIO PLAYER ────────────────────────────────────────────────────────────
function AudioPlayer({ src, playing, onToggle }) {
  const audioRef = useRef(null);
  const [vol, setVol] = useState(0.5);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = vol;
    if (playing) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing, vol]);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="metadata" />
      <div
        style={{
          position: "fixed", bottom: "90px", right: "20px", zIndex: 100,
          background: "linear-gradient(135deg, rgba(10,10,10,0.95), rgba(11,61,46,0.9))",
          border: "1px solid rgba(212,175,55,0.4)",
          borderRadius: "50px", padding: "8px 16px",
          display: "flex", alignItems: "center", gap: "12px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 30px rgba(212,175,55,0.15)",
        }}
      >
        <button
          onClick={onToggle}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#D4AF37", fontSize: "20px", display: "flex", alignItems: "center",
          }}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#D4AF37", fontSize: "12px" }}>🎵</span>
          <input
            type="range" min="0" max="1" step="0.05" value={vol}
            onChange={(e) => setVol(+e.target.value)}
            style={{ width: "60px", accentColor: "#D4AF37", cursor: "pointer" }}
          />
        </div>
      </div>
    </>
  );
}

// ─── FLOATING NAV ─────────────────────────────────────────────────────────────
function FloatingNav({ active }) {
  const items = [
    { id: "cover", icon: "🕌", label: "Home" },
    { id: "ayat", icon: "☪", label: "Ayat" },
    { id: "mempelai", icon: "💍", label: "Mempelai" },
    { id: "acara", icon: "📅", label: "Acara" },
    { id: "gift", icon: "🎁", label: "Gift" },
    { id: "rsvp", icon: "✉️", label: "RSVP" },
  ];
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav
      style={{
        position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
        zIndex: 200, display: "flex", gap: "4px",
        background: "linear-gradient(135deg, rgba(10,10,10,0.95), rgba(11,61,46,0.9))",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: "50px", padding: "8px 16px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.1)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scroll(item.id)}
          title={item.label}
          style={{
            background: active === item.id ? "rgba(212,175,55,0.2)" : "none",
            border: "none", cursor: "pointer",
            color: active === item.id ? "#D4AF37" : "rgba(244,226,184,0.5)",
            fontSize: "18px", padding: "8px 10px", borderRadius: "40px",
            transition: "all 0.3s ease",
          }}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}

// ─── RSVP FORM ────────────────────────────────────────────────────────────────
function RSVPForm() {
  const [form, setForm] = useState({ name: "", wa: "", count: "1", hadir: "hadir", ucapan: "" });
  const [sent, setSent] = useState(false);
  const [wishes, setWishes] = useState([]);

  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name || !form.ucapan) return;
    const entry = { ...form, time: new Date().toLocaleString("id-ID") };
    const saved = JSON.parse(localStorage.getItem("bw_wishes") || "[]");
    saved.unshift(entry);
    localStorage.setItem("bw_wishes", JSON.stringify(saved));
    setWishes(saved);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", wa: "", count: "1", hadir: "hadir", ucapan: "" });
  };

  useEffect(() => {
    setWishes(JSON.parse(localStorage.getItem("bw_wishes") || "[]"));
  }, []);

  const inputStyle = {
    width: "100%", background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.25)", borderRadius: "10px",
    padding: "12px 16px", color: "#F4E2B8", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
    fontFamily: "Poppins, sans-serif",
  };

  return (
    <div>
      {sent ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>✨</div>
          <p style={{ color: "#D4AF37", fontSize: "20px", fontFamily: "'Playfair Display', serif" }}>
            Jazakallah Khairan
          </p>
          <p style={{ color: "#F4E2B8", opacity: 0.7, fontSize: "14px" }}>
            Doa dan kehadiran Anda sangat berarti bagi kami
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input
            placeholder="Nama Anda *"
            value={form.name}
            onChange={(e) => handle("name", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Nomor WhatsApp"
            value={form.wa}
            onChange={(e) => handle("wa", e.target.value)}
            style={inputStyle}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <select
              value={form.count}
              onChange={(e) => handle("count", e.target.value)}
              style={{ ...inputStyle }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n} style={{ background: "#0A0A0A" }}>
                  {n} Orang
                </option>
              ))}
            </select>
            <select
              value={form.hadir}
              onChange={(e) => handle("hadir", e.target.value)}
              style={{ ...inputStyle }}
            >
              <option value="hadir" style={{ background: "#0A0A0A" }}>Hadir ✓</option>
              <option value="tidak" style={{ background: "#0A0A0A" }}>Tidak Hadir</option>
            </select>
          </div>
          <textarea
            placeholder="Ucapan & Doa *"
            rows={4}
            value={form.ucapan}
            onChange={(e) => handle("ucapan", e.target.value)}
            style={{ ...inputStyle, resize: "none" }}
          />
          <button
            onClick={submit}
            style={{
              background: "linear-gradient(135deg, #D4AF37, #B8960C)",
              border: "none", borderRadius: "50px", padding: "14px",
              color: "#0A0A0A", fontFamily: "'Playfair Display', serif",
              fontSize: "16px", fontWeight: "700", cursor: "pointer",
              letterSpacing: "1px",
              boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
            }}
          >
            Kirim Ucapan ✨
          </button>
        </div>
      )}

      {/* Wishes List */}
      {wishes.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <GoldDivider />
          <h3 style={{
            textAlign: "center", color: "#D4AF37",
            fontFamily: "'Playfair Display', serif", fontSize: "20px", marginBottom: "20px"
          }}>
            Doa & Ucapan Tamu
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
            {wishes.slice(0, 10).map((w, i) => (
              <GlassCard key={i} style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#D4AF37", fontWeight: "700", fontSize: "14px" }}>{w.name}</span>
                  <span style={{ color: "#F4E2B8", opacity: 0.4, fontSize: "11px" }}>{w.time}</span>
                </div>
                <p style={{ color: "#F4E2B8", opacity: 0.8, fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
                  {w.ucapan}
                </p>
                <span style={{
                  display: "inline-block", marginTop: "8px",
                  fontSize: "11px", padding: "2px 10px", borderRadius: "20px",
                  background: w.hadir === "hadir" ? "rgba(11,61,46,0.6)" : "rgba(100,0,0,0.4)",
                  color: w.hadir === "hadir" ? "#4CAF50" : "#EF5350",
                  border: `1px solid ${w.hadir === "hadir" ? "#4CAF50" : "#EF5350"}`,
                }}>
                  {w.hadir === "hadir" ? "✓ Hadir" : "✗ Tidak Hadir"}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GIFT CARD ────────────────────────────────────────────────────────────────
function GiftItem({ label, number, name }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };
  return (
    <GlassCard style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ color: "#D4AF37", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{
        color: "#F4E2B8", fontSize: "22px", fontFamily: "'Playfair Display', serif",
        letterSpacing: "2px", marginBottom: "6px",
      }}>
        {number}
      </div>
      <div style={{ color: "#D4AF37", fontSize: "13px", opacity: 0.8, marginBottom: "16px" }}>
        a.n. {name}
      </div>
      <button
        onClick={copy}
        style={{
          background: copied ? "rgba(11,61,46,0.8)" : "rgba(212,175,55,0.15)",
          border: `1px solid ${copied ? "#4CAF50" : "rgba(212,175,55,0.4)"}`,
          color: copied ? "#4CAF50" : "#D4AF37",
          borderRadius: "50px", padding: "8px 20px",
          cursor: "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif",
          transition: "all 0.3s",
        }}
      >
        {copied ? "✓ Tersalin!" : "Salin Nomor"}
      </button>
    </GlassCard>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [opened, setOpened] = useState(false);
  const [intro, setIntro] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeNav, setActiveNav] = useState("cover");
  const [hoverOpen, setHoverOpen] = useState(false);
  const guest = getGuest();
  const countdown = useCountdown("2026-07-02T08:00:00+07:00");

  const openInvitation = () => {
    setIntro(true);
    setPlaying(true);
    setTimeout(() => {
      setIntro(false);
      setOpened(true);
    }, 3500);
  };

  // Track active section
  useEffect(() => {
    if (!opened) return;
    const sections = ["cover", "ayat", "mempelai", "acara", "gift", "rsvp"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveNav(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [opened]);

  const audioSrc = "/mnt/user-data/uploads/Wedding_Nasheed_-_Muhammad_Al_Muqit___Lyrics_Arabic___Terjemahan___𝘈𝘳𝘢𝘣𝘪𝘤_𝘕𝘢𝘴𝘩𝘦𝘦𝘥___محمد_المقيط.mp3";

  // ── COVER SCREEN ──────────────────────────────────────────────────────────
  if (!opened && !intro) {
    return (
      <div style={{
        minHeight: "100vh", background: "#050508",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", position: "relative", overflow: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}>
        {/* Styles */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #050508; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0A0A0A; }
          ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          @keyframes pulse-gold { 0%,100%{box-shadow:0 0 20px rgba(212,175,55,0.3)} 50%{box-shadow:0 0 50px rgba(212,175,55,0.6)} }
          @keyframes rotate-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
          @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
          @keyframes lanternSwing { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
          @keyframes starTwinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
        `}</style>

        <GoldParticles count={60} active={true} />

        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{
            position: "fixed",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: "#F4E2B8", borderRadius: "50%",
            animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}

        {/* Corner patterns */}
        <div style={{ position: "fixed", top: 0, left: 0, opacity: 0.15 }}>
          <GeometricPattern size={200} opacity={1} />
        </div>
        <div style={{ position: "fixed", top: 0, right: 0, opacity: 0.15, transform: "scaleX(-1)" }}>
          <GeometricPattern size={200} opacity={1} />
        </div>

        {/* Lanterns */}
        <div style={{ position: "fixed", top: "5%", left: "5%", animation: "lanternSwing 4s ease-in-out infinite", opacity: 0.7 }}>
          <Lantern size={50} />
        </div>
        <div style={{ position: "fixed", top: "5%", right: "5%", animation: "lanternSwing 3.5s ease-in-out infinite reverse", opacity: 0.7 }}>
          <Lantern size={45} />
        </div>
        <div style={{ position: "fixed", top: "15%", left: "15%", animation: "lanternSwing 5s ease-in-out infinite", opacity: 0.4 }}>
          <Lantern size={30} />
        </div>
        <div style={{ position: "fixed", top: "15%", right: "15%", animation: "lanternSwing 4.5s ease-in-out infinite reverse", opacity: 0.4 }}>
          <Lantern size={30} />
        </div>

        {/* Ambient glow bg */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(11,61,46,0.25) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.05) 0%, transparent 50%)",
        }} />

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "20px", maxWidth: "500px" }}>
          
          {/* Crescent */}
          <div style={{ animation: "float 4s ease-in-out infinite", marginBottom: "16px" }}>
            <CrescentMoon size={80} />
          </div>

          {/* Bismillah */}
          <div style={{
            fontFamily: "'Amiri', serif", fontSize: "clamp(22px, 5vw, 32px)",
            color: "#D4AF37", marginBottom: "12px",
            textShadow: "0 0 30px rgba(212,175,55,0.5)",
            animation: "fadeInUp 1s ease 0.2s both",
          }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </div>

          <ArabicOrnament size={40} />

          {/* The Wedding Of */}
          <div style={{
            color: "rgba(244,226,184,0.5)", letterSpacing: "5px",
            fontSize: "11px", textTransform: "uppercase", margin: "16px 0 8px",
            animation: "fadeInUp 1s ease 0.4s both",
          }}>
            The Wedding Of
          </div>

          {/* Names */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(42px, 12vw, 72px)",
            background: "linear-gradient(135deg, #F4E2B8 0%, #D4AF37 40%, #B8960C 60%, #F4E2B8 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite, fadeInUp 1s ease 0.6s both",
            lineHeight: 1.1, marginBottom: "0",
          }}>
            Balhaz
          </h1>
          <div style={{ color: "#D4AF37", fontSize: "28px", margin: "0", animation: "float 3s ease-in-out infinite" }}>
            &
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(42px, 12vw, 72px)",
            background: "linear-gradient(135deg, #F4E2B8 0%, #D4AF37 40%, #B8960C 60%, #F4E2B8 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite 0.5s, fadeInUp 1s ease 0.8s both",
            lineHeight: 1.1,
          }}>
            Widiyanti
          </h1>

          {/* Date */}
          <div style={{
            margin: "20px auto",
            background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(11,61,46,0.3))",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "50px", padding: "10px 28px", display: "inline-block",
            animation: "fadeInUp 1s ease 1s both",
          }}>
            <span style={{ color: "#D4AF37", fontSize: "14px", letterSpacing: "3px", fontFamily: "'Playfair Display', serif" }}>
              02 Juli 2026
            </span>
          </div>

          {/* Guest */}
          <div style={{
            color: "rgba(244,226,184,0.6)", fontSize: "13px", margin: "16px 0 8px",
            animation: "fadeInUp 1s ease 1.2s both",
          }}>
            Kepada Yth.
          </div>
          <div style={{
            color: "#F4E2B8", fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(16px, 4vw, 20px)", marginBottom: "32px",
            animation: "fadeInUp 1s ease 1.4s both",
          }}>
            {guest}
          </div>

          {/* Open button */}
          <button
            onMouseEnter={() => setHoverOpen(true)}
            onMouseLeave={() => setHoverOpen(false)}
            onClick={openInvitation}
            style={{
              background: hoverOpen
                ? "linear-gradient(135deg, #F4E2B8, #D4AF37)"
                : "linear-gradient(135deg, #D4AF37, #B8960C)",
              border: "none", borderRadius: "50px",
              padding: "16px 48px", cursor: "pointer",
              color: "#0A0A0A", fontFamily: "'Playfair Display', serif",
              fontSize: "17px", fontWeight: "700", letterSpacing: "2px",
              boxShadow: hoverOpen
                ? "0 8px 50px rgba(212,175,55,0.6)"
                : "0 4px 30px rgba(212,175,55,0.3)",
              transform: hoverOpen ? "scale(1.05)" : "scale(1)",
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              animation: "pulse-gold 2s ease-in-out infinite, fadeInUp 1s ease 1.6s both",
            }}
          >
            ✨ Buka Undangan
          </button>
        </div>

        {/* Bottom text */}
        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          color: "rgba(244,226,184,0.25)", fontSize: "11px", letterSpacing: "2px",
          textTransform: "uppercase", zIndex: 10,
        }}>
          Scroll to explore
        </div>
      </div>
    );
  }

  // ── CINEMATIC INTRO ───────────────────────────────────────────────────────
  if (intro) {
    return (
      <div style={{
        minHeight: "100vh", background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "fixed", inset: 0, zIndex: 9999,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap');
          @keyframes introGlow { 0%{opacity:0;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.05)} 100%{opacity:0.8;transform:scale(1)} }
          @keyframes introFadeOut { 0%{opacity:1} 100%{opacity:0} }
          @keyframes moonRise { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
        `}</style>
        <GoldParticles count={100} active={true} />
        <div style={{ textAlign: "center", animation: "introGlow 3.5s ease forwards" }}>
          <div style={{ animation: "moonRise 1s ease 0.3s both" }}>
            <CrescentMoon size={120} />
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: "48px",
            background: "linear-gradient(135deg, #F4E2B8, #D4AF37, #F4E2B8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginTop: "20px",
          }}>
            B ♡ W
          </div>
          <div style={{ color: "rgba(244,226,184,0.5)", fontSize: "13px", letterSpacing: "4px", marginTop: "12px" }}>
            02 . 07 . 2026
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN CONTENT ──────────────────────────────────────────────────────────
  const mainBg = {
    minHeight: "100vh",
    background: "#050508",
    color: "#F4E2B8",
    fontFamily: "Poppins, sans-serif",
    overflowX: "hidden",
  };

  return (
    <div style={mainBg}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050508; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes rotate-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(212,175,55,0.2)} 50%{box-shadow:0 0 50px rgba(212,175,55,0.5)} }
        @keyframes lanternSwing { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes starTwinkle { 0%,100%{opacity:0.2} 50%{opacity:0.9} }
        @keyframes countPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        select option { background: #0A0A0A !important; color: #F4E2B8 !important; }
        input::placeholder, textarea::placeholder { color: rgba(244,226,184,0.35) !important; }
        input, textarea, select { font-family: Poppins, sans-serif !important; }
      `}</style>

      <GoldParticles count={70} active={playing} />

      {/* Stars */}
      {[...Array(25)].map((_, i) => (
        <div key={i} style={{
          position: "fixed",
          left: `${(i * 37 + 13) % 100}%`,
          top: `${(i * 53 + 7) % 70}%`,
          width: `${(i % 3) + 1}px`, height: `${(i % 3) + 1}px`,
          background: "#F4E2B8", borderRadius: "50%",
          animation: `starTwinkle ${2 + (i % 4)}s ease-in-out infinite`,
          animationDelay: `${(i * 0.3) % 3}s`, pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 20% 20%, rgba(11,61,46,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(212,175,55,0.04) 0%, transparent 40%)",
      }} />

      <AudioPlayer src={audioSrc} playing={playing} onToggle={() => setPlaying((p) => !p)} />
      <FloatingNav active={activeNav} />

      {/* ── SECTION 1: HERO ── */}
      <section id="cover" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", padding: "40px 20px", textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, opacity: 0.08 }}>
          <GeometricPattern size={250} opacity={1} />
        </div>
        <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.08, transform: "scaleX(-1)" }}>
          <GeometricPattern size={250} opacity={1} />
        </div>
        <div style={{ position: "absolute", top: "5%", left: "4%", animation: "lanternSwing 4s ease-in-out infinite" }}>
          <Lantern size={55} />
        </div>
        <div style={{ position: "absolute", top: "5%", right: "4%", animation: "lanternSwing 3.5s ease-in-out infinite reverse" }}>
          <Lantern size={50} />
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ animation: "float 5s ease-in-out infinite" }}>
            <CrescentMoon size={90} />
          </div>
          <div style={{
            fontFamily: "'Amiri', serif", fontSize: "clamp(20px, 5vw, 30px)",
            color: "#D4AF37", marginBottom: "10px", marginTop: "16px",
            textShadow: "0 0 30px rgba(212,175,55,0.4)",
          }}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </div>
          <ArabicOrnament size={44} />
          <div style={{ color: "rgba(244,226,184,0.45)", letterSpacing: "6px", fontSize: "11px", textTransform: "uppercase", margin: "16px 0 6px" }}>
            The Wedding Of
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(48px, 14vw, 88px)", lineHeight: 1,
            background: "linear-gradient(135deg, #F4E2B8 0%, #D4AF37 40%, #B8960C 60%, #F4E2B8 100%)",
            backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 5s linear infinite",
          }}>
            Balhaz
          </h1>
          <div style={{ fontSize: "32px", color: "#D4AF37", margin: "4px 0", animation: "float 3s ease-in-out infinite" }}>♡</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(48px, 14vw, 88px)", lineHeight: 1,
            background: "linear-gradient(135deg, #F4E2B8 0%, #D4AF37 40%, #B8960C 60%, #F4E2B8 100%)",
            backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 5s linear infinite 0.5s",
          }}>
            Widiyanti
          </h1>
          <div style={{
            marginTop: "24px",
            border: "1px solid rgba(212,175,55,0.3)", borderRadius: "50px",
            padding: "10px 32px", display: "inline-block",
            background: "rgba(212,175,55,0.06)",
          }}>
            <span style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "14px", fontFamily: "'Playfair Display', serif" }}>
              Kamis, 02 Juli 2026
            </span>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)",
          color: "rgba(212,175,55,0.4)", fontSize: "20px", animation: "float 2s ease-in-out infinite",
        }}>
          ↓
        </div>
      </section>

      {/* ── SECTION 2: GREETING ── */}
      <Section id="greeting" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(18px, 4vw, 24px)", color: "#D4AF37", marginBottom: "24px" }}>
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
          <GoldDivider />
          <p style={{ color: "rgba(244,226,184,0.8)", lineHeight: 2, fontSize: "15px", margin: "24px 0" }}>
            Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.
          </p>
          <p style={{ color: "rgba(244,226,184,0.7)", lineHeight: 2, fontSize: "14px" }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.
          </p>
        </div>
      </Section>

      {/* ── SECTION 3: QURAN VERSE ── */}
      <Section id="ayat" style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <GlassCard style={{ padding: "40px 32px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
              <GeometricPattern size={300} opacity={1} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "20px" }}>
                QS. Ar-Rum : 21
              </div>
              <div style={{
                fontFamily: "'Amiri', serif", fontSize: "clamp(22px, 5vw, 30px)",
                color: "#D4AF37", lineHeight: 2, marginBottom: "24px", direction: "rtl",
                textShadow: "0 0 20px rgba(212,175,55,0.3)",
              }}>
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
              </div>
              <GoldDivider />
              <p style={{ color: "rgba(244,226,184,0.8)", fontStyle: "italic", lineHeight: 1.9, fontSize: "14px", marginTop: "20px" }}>
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."
              </p>
            </div>
          </GlassCard>
        </div>
      </Section>

      {/* ── SECTION 4: BRIDE & GROOM ── */}
      <Section id="mempelai" style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "40px" }}>
            Mempelai
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "24px",
            alignItems: "center",
          }}>
            {/* Groom */}
            <GlassCard style={{ padding: "32px 24px", textAlign: "center" }}>
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <div style={{
                  width: "80px", height: "80px", margin: "0 auto",
                  background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "32px", boxShadow: "0 0 30px rgba(212,175,55,0.3)",
                }}>
                  ☪
                </div>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(20px, 4vw, 26px)", color: "#F4E2B8", marginBottom: "6px",
              }}>
                Balhaz Ainun Naim
              </h2>
              <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "2px", marginBottom: "16px" }}>
                Putra Ketiga dari Empat Bersaudara
              </div>
              <GoldDivider />
              <div style={{ color: "rgba(244,226,184,0.7)", fontSize: "13px", lineHeight: 2, marginTop: "12px" }}>
                Putra dari<br />
                <span style={{ color: "#D4AF37" }}>H. Jaenal Abidin</span><br />
                dan<br />
                <span style={{ color: "#D4AF37" }}>Hj. Pupung Muflihat (Almh.)</span>
              </div>
              <div style={{
                marginTop: "16px", padding: "8px 16px", borderRadius: "50px",
                background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)",
                color: "rgba(244,226,184,0.5)", fontSize: "11px", letterSpacing: "2px",
              }}>
                PURWAKARTA
              </div>
            </GlassCard>

            {/* Center monogram */}
            <div style={{
              textAlign: "center", padding: "20px 10px",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 6vw, 42px)",
                background: "linear-gradient(135deg, #F4E2B8, #D4AF37, #F4E2B8)",
                backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite, float 4s ease-in-out infinite",
                textShadow: "0 0 30px rgba(212,175,55,0.4)",
                whiteSpace: "nowrap",
              }}>
                B ♡ W
              </div>
            </div>

            {/* Bride */}
            <GlassCard style={{ padding: "32px 24px", textAlign: "center" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  width: "80px", height: "80px", margin: "0 auto",
                  background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "32px", boxShadow: "0 0 30px rgba(212,175,55,0.3)",
                }}>
                  🌸
                </div>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(20px, 4vw, 26px)", color: "#F4E2B8", marginBottom: "6px",
              }}>
                Widiyanti
              </h2>
              <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "2px", marginBottom: "16px" }}>
                Putri Ketiga dari Lima Bersaudara
              </div>
              <GoldDivider />
              <div style={{ color: "rgba(244,226,184,0.7)", fontSize: "13px", lineHeight: 2, marginTop: "12px" }}>
                Putri dari<br />
                <span style={{ color: "#D4AF37" }}>Bapak Suparman</span><br />
                dan<br />
                <span style={{ color: "#D4AF37" }}>Ibu Maryati</span>
              </div>
              <div style={{
                marginTop: "16px", padding: "8px 16px", borderRadius: "50px",
                background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)",
                color: "rgba(244,226,184,0.5)", fontSize: "11px", letterSpacing: "2px",
              }}>
                BANDUNG BARAT
              </div>
            </GlassCard>
          </div>
        </div>
      </Section>

      {/* ── SECTION 5: COUNTDOWN ── */}
      <Section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "12px" }}>
            Menuju Hari Bahagia
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 4vw, 24px)",
            color: "rgba(244,226,184,0.7)", marginBottom: "36px",
          }}>
            Kamis, 02 Juli 2026
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { v: countdown.d, l: "Hari" },
              { v: countdown.h, l: "Jam" },
              { v: countdown.m, l: "Menit" },
              { v: countdown.s, l: "Detik" },
            ].map(({ v, l }) => (
              <GlassCard key={l} style={{ padding: "24px 12px", textAlign: "center", animation: "pulse-glow 3s ease-in-out infinite" }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 8vw, 52px)", fontWeight: "700",
                  background: "linear-gradient(135deg, #F4E2B8, #D4AF37)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  lineHeight: 1, animation: "countPulse 1s ease-in-out infinite",
                }}>
                  {String(v).padStart(2, "0")}
                </div>
                <div style={{ color: "rgba(244,226,184,0.4)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginTop: "8px" }}>
                  {l}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 6: EVENT DETAILS ── */}
      <Section id="acara" style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "40px" }}>
            Detail Acara
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              { title: "Akad Nikah", time: "08.00 WIB", emoji: "🕌" },
              { title: "Resepsi", time: "09.00 WIB", emoji: "🎊" },
            ].map(({ title, time, emoji }) => (
              <GlassCard key={title} style={{ padding: "36px 28px" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{emoji}</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: "22px",
                  color: "#D4AF37", marginBottom: "12px",
                }}>
                  {title}
                </h3>
                <GoldDivider />
                <div style={{ color: "#F4E2B8", fontSize: "15px", lineHeight: 2, marginTop: "16px" }}>
                  <div>Kamis, 02 Juli 2026</div>
                  <div style={{ color: "#D4AF37", fontWeight: "600" }}>{time}</div>
                </div>
                <div style={{ color: "rgba(244,226,184,0.6)", fontSize: "13px", lineHeight: 1.8, marginTop: "12px" }}>
                  Kp. Palasari RT 01 RW 11<br />
                  Desa Cirawa Mekar, Kec. Cipatat<br />
                  Bandung Barat
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a
                    href="https://maps.app.goo.gl/3M937n1PRWyTUMcF9"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                      borderRadius: "50px", padding: "10px 22px",
                      color: "#0A0A0A", textDecoration: "none", fontSize: "13px",
                      fontWeight: "600", display: "flex", alignItems: "center", gap: "6px",
                    }}
                  >
                    📍 Lihat Lokasi
                  </a>
                  <button
                    onClick={() => {
                      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Balhaz+%26+Widiyanti&dates=20260702T010000Z/20260702T060000Z&details=Akad+Nikah+%26+Resepsi&location=Kp.+Palasari+RT+01+RW+11,+Desa+Cirawa+Mekar,+Kec.+Cipatat,+Bandung+Barat`;
                      window.open(url, "_blank");
                    }}
                    style={{
                      background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)",
                      borderRadius: "50px", padding: "10px 22px",
                      color: "#D4AF37", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    📅 Save to Calendar
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 7: LOVE JOURNEY ── */}
      <Section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "40px" }}>
            Perjalanan Cinta
          </div>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: "50%", top: 0, bottom: 0,
              width: "1px", background: "linear-gradient(to bottom, transparent, #D4AF37, transparent)",
              transform: "translateX(-50%)",
            }} />
            {[
              { icon: "🌸", title: "Perkenalan", desc: "Awal mula pertemuan yang penuh kebaikan" },
              { icon: "🤝", title: "Silaturahmi Keluarga", desc: "Dua keluarga bersatu dalam keberkahan" },
              { icon: "💍", title: "Khitbah", desc: "Ikatan suci yang mengawali segalanya" },
              { icon: "🕌", title: "Akad Nikah", desc: "02 Juli 2026 — Hari paling bahagia" },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} style={{
                display: "flex", alignItems: "flex-start", gap: "20px",
                marginBottom: "32px", flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                textAlign: i % 2 === 0 ? "left" : "right",
              }}>
                <div style={{ flex: 1 }}>
                  <GlassCard style={{ padding: "20px 24px" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", color: "#D4AF37", fontSize: "17px", marginBottom: "6px" }}>
                      {title}
                    </h4>
                    <p style={{ color: "rgba(244,226,184,0.65)", fontSize: "13px", lineHeight: 1.7 }}>{desc}</p>
                  </GlassCard>
                </div>
                <div style={{
                  width: "44px", height: "44px", flexShrink: 0,
                  background: "linear-gradient(135deg, #D4AF37, #B8960C)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", zIndex: 1, boxShadow: "0 0 20px rgba(212,175,55,0.4)",
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 8: ISLAMIC ART GALLERY ── */}
      <Section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "40px" }}>
            Kaligrafi & Seni Islam
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { ar: "بِسْمِ اللَّهِ", id: "Dengan Nama Allah" },
              { ar: "اللّهُ نُورُ السَّمَاوَاتِ", id: "Allah Cahaya Langit & Bumi" },
              { ar: "الحَمْدُ لِلَّهِ", id: "Segala Puji Bagi Allah" },
              { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", id: "Sesungguhnya setelah kesulitan ada kemudahan" },
              { ar: "رَبَّنَا هَبْ لَنَا", id: "Ya Tuhan kami, anugerahkanlah kepada kami" },
              { ar: "تَبَارَكَ اللَّهُ", id: "Maha Suci Allah" },
            ].map(({ ar, id }) => (
              <GlassCard key={id} style={{ padding: "28px 20px", cursor: "default", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(212,175,55,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "";
                }}>
                <div style={{
                  fontFamily: "'Amiri', serif", fontSize: "26px",
                  color: "#D4AF37", marginBottom: "12px", direction: "rtl",
                  textShadow: "0 0 20px rgba(212,175,55,0.3)",
                }}>
                  {ar}
                </div>
                <GoldDivider />
                <p style={{ color: "rgba(244,226,184,0.55)", fontSize: "12px", lineHeight: 1.6, marginTop: "10px" }}>{id}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION 9: GIFT ── */}
      <Section id="gift" style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "12px" }}>
            Wedding Gift
          </div>
          <p style={{ color: "rgba(244,226,184,0.6)", fontSize: "14px", marginBottom: "36px" }}>
            Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberikan hadiah:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <GiftItem label="DANA" number="083843197567" name="Widiyanti" />
            <GiftItem label="DANA" number="083816937951" name="Balhaz Ainun Naim" />
            <GiftItem label="BANK BRI" number="435601024030539" name="BALHAZ AINUN NAIM" />
          </div>
          <GlassCard style={{ marginTop: "24px", padding: "20px 24px", textAlign: "left" }}>
            <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "2px", marginBottom: "8px" }}>
              📦 ALAMAT KIRIM HADIAH
            </div>
            <p style={{ color: "rgba(244,226,184,0.75)", fontSize: "14px", lineHeight: 1.9 }}>
              Kp. Palasari RT 01 RW 11<br />
              Desa Cirawa Mekar, Kecamatan Cipatat<br />
              Bandung Barat
            </p>
          </GlassCard>
        </div>
      </Section>

      {/* ── SECTION 10 & 11: RSVP ── */}
      <Section id="rsvp" style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "10px" }}>
              RSVP & Ucapan
            </div>
            <p style={{ color: "rgba(244,226,184,0.6)", fontSize: "14px" }}>
              Konfirmasi kehadiran dan sampaikan doa terbaik Anda
            </p>
          </div>
          <GlassCard style={{ padding: "32px 28px" }}>
            <RSVPForm />
          </GlassCard>
        </div>
      </Section>

      {/* ── SECTION 12: CLOSING ── */}
      <Section style={{ padding: "100px 20px 140px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 60%, rgba(11,61,46,0.3) 0%, transparent 60%)",
          }} />
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ animation: "float 5s ease-in-out infinite" }}>
            <CrescentMoon size={100} />
          </div>
          <h2 style={{
            fontFamily: "'Amiri', serif",
            fontSize: "clamp(26px, 6vw, 38px)", color: "#D4AF37",
            marginBottom: "24px", marginTop: "20px",
            textShadow: "0 0 30px rgba(212,175,55,0.4)",
          }}>
            Jazakumullahu Khairan
          </h2>
          <p style={{
            color: "rgba(244,226,184,0.75)", maxWidth: "480px", margin: "0 auto 28px",
            lineHeight: 2, fontSize: "14px",
          }}>
            Atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i, kami mengucapkan terima kasih yang sebesar-besarnya. Semoga Allah SWT senantiasa melimpahkan keberkahan kepada kita semua.
          </p>
          <GoldDivider />
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 5vw, 32px)",
            background: "linear-gradient(135deg, #F4E2B8, #D4AF37, #F4E2B8)",
            backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
            marginTop: "24px",
          }}>
            Balhaz Ainun Naim & Widiyanti
          </h3>
          <div style={{
            marginTop: "16px", color: "#D4AF37", fontSize: "14px", letterSpacing: "4px",
          }}>
            02 . 07 . 2026
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "40px", opacity: 0.3 }}>
            <Lantern size={35} />
            <Lantern size={45} />
            <Lantern size={35} />
          </div>
        </div>
      </Section>
    </div>
  );
}
