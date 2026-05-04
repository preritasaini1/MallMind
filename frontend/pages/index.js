import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// ─── Data ──────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '⚡', label: 'NLP', title: 'Natural Language Shopping', desc: 'Just describe what you need — "blue suit under ₹8k" — the AI understands everything instantly.', color: 'gold' },
  { icon: '🔍', label: 'Agentic AI', title: 'Live Inventory Scout', desc: 'Our Scout Agent queries every store simultaneously, matching size, colour, and budget before you move.', color: 'teal' },
  { icon: '🗺', label: 'Mapbox', title: 'Optimised Indoor Route', desc: 'Walk the shortest path through every store you need. Dynamic rerouting adapts in real-time.', color: 'rose' },
  { icon: '👗', label: 'GenAI', title: 'Virtual Try-On', desc: 'Upload a selfie and see any outfit on you — photorealistic, powered by diffusion models.', color: 'gold' },
  { icon: '🎯', label: 'AI Agent', title: 'Personal Stylist', desc: 'Occasion, budget, body type — the Stylist Agent considers everything to serve looks that fit your life.', color: 'teal' },
  { icon: '🏷', label: 'Live', title: 'Dynamic Deals', desc: 'Exclusive session-only offers triggered by your route, dwell time, and preferences.', color: 'rose' },
];

const STEPS = [
  { n: '01', icon: '📱', title: 'Scan QR at Entrance', desc: 'Point your phone camera at the QR code posted at the mall entrance. No app download needed — it opens instantly in your browser.' },
  { n: '02', icon: '💬', title: 'Tell Us What You Need', desc: '"Blue blazer under ₹4000 and a coffee" — the AI understands everything.' },
  { n: '03', icon: '🔍', title: 'Agents Get to Work', desc: 'Scout checks live inventory. Navigator builds your route. Stylist curates looks. All in under 2 seconds.' },
  { n: '04', icon: '🛍', title: 'Shop Smarter', desc: 'Walk in, pick up, checkout. MallMind has done the hard work before you take a single step.' },
];

const STATS = [
  { val: '30%', label: 'Less Shopping Time' },
  { val: '40%', label: 'Better Relevance' },
  { val: '20%', label: 'More Conversions' },
  { val: '95%', label: 'Nav Accuracy' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(true);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

const COLOR = {
  gold: { bg: 'rgba(245,166,35,0.1)', border: 'rgba(245,166,35,0.25)', text: 'var(--gold)' },
  teal: { bg: 'rgba(0,201,167,0.08)', border: 'rgba(0,201,167,0.25)', text: 'var(--teal)' },
  rose: { bg: 'rgba(255,107,138,0.08)', border: 'rgba(255,107,138,0.25)', text: 'var(--rose)' },
};

// ─── Navbar ────────────────────────────────────────────────────────────────

function NavBar({ isMobile }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: isMobile ? 56 : 64,
        padding: isMobile ? '0 16px' : '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(10,10,15,0.96)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,var(--gold),var(--amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.9rem', color: '#0a0a0f' }}>M</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>Mall<span style={{ color: 'var(--gold)' }}>Mind</span></span>
        </div>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Features', 'How It Works', 'Dashboard'].map(item => (
              <a key={item} href={item === 'Dashboard' ? '/dashboard' : `#${item.toLowerCase().replace(/ /g, '-')}`}
                style={{ color: 'var(--white50)', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--white)'}
                onMouseLeave={e => e.target.style.color = 'var(--white50)'}
              >{item}</a>
            ))}
            <button className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }} onClick={() => router.push('/chat')}>
              Try MallMind →
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'none', border: 'none', color: 'var(--white)', fontSize: '1.4rem', cursor: 'pointer', padding: 4, lineHeight: 1 }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99,
          background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 20px 20px',
          animation: 'fadeUp 0.2s ease',
        }}>
          {['Features', 'How It Works'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`}
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '13px 0', color: 'var(--white80)', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            >{item}</a>
          ))}
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '13px 0', color: 'var(--white80)', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>Dashboard</Link>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: '14px', fontSize: '1rem' }} onClick={() => router.push('/chat')}>
            Try MallMind →
          </button>
        </div>
      )}
    </>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function HeroSection({ isMobile, router }) {
  return (
    <section style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '80px 20px 60px' : '120px 5% 80px',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow — simple, not distracting */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: isMobile ? 300 : 600, height: isMobile ? 300 : 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, width: '100%' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '5px 14px 5px 6px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 999 }}>
          <span style={{ background: 'var(--gold)', color: '#0a0a0f', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.05em' }}>NEW</span>
          <span style={{ fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--white80)' }}>Agentic AI now in Ambience Mall</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? '2.4rem' : '4.2rem',
          lineHeight: 1.1, fontWeight: 900, marginBottom: 20,
          letterSpacing: '-0.02em',
        }}>
          Your mall,{' '}
          <span style={{ background: 'linear-gradient(135deg,var(--gold-light),var(--gold),var(--amber))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            reimagined
          </span>
          <br />by intelligent agents
        </h1>

        {/* Subtext */}
        <p style={{ fontSize: isMobile ? '0.95rem' : '1.15rem', color: 'var(--white50)', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Scan the QR at your mall entrance. Tell the AI what you need. It checks every store's live inventory, builds your route, and unlocks deals — all in seconds.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn-primary" style={{ fontSize: isMobile ? '1rem' : '1rem', padding: isMobile ? '15px 32px' : '15px 32px', width: isMobile ? '100%' : 'auto', justifyContent: 'center', maxWidth: 320 }} onClick={() => router.push('/chat')}>
            Start Shopping Free →
          </button>
          <button className="btn-ghost" style={{ fontSize: '0.95rem', padding: '13px 24px', width: isMobile ? '100%' : 'auto', justifyContent: 'center', maxWidth: 320 }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            See How It Works
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: isMobile ? 8 : 24, marginTop: isMobile ? 48 : 64, padding: isMobile ? '20px 0' : 0 }}>
          {STATS.map(s => (
            <div key={s.val} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 700, background: 'linear-gradient(135deg,var(--gold-light),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
              <div style={{ fontSize: isMobile ? '0.62rem' : '0.75rem', color: 'var(--white50)', marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── QR Explainer ──────────────────────────────────────────────────────────

function QRSection({ isMobile, router }) {
  return (
    <section style={{ padding: isMobile ? '60px 20px' : '100px 5%', background: 'linear-gradient(180deg, transparent, rgba(245,166,35,0.03) 50%, transparent)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>No App Needed</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.9rem' : '2.8rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Scan once. Shop smarter.
          </h2>
          <p style={{ color: 'var(--white50)', marginTop: 12, fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: 1.7, maxWidth: 500, margin: '12px auto 0' }}>
            MallMind is a PWA — it opens directly in your phone's browser when you scan the QR code. Nothing to install.
          </p>
        </div>

        {/* Flow diagram */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 0, alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'center', marginBottom: 48 }}>
          {[
            { icon: '📱', title: 'Scan QR', sub: 'At mall entrance\nPhone camera only', color: 'var(--teal)' },
            { icon: '🌐', title: 'Browser Opens', sub: 'No app download\nWorks on any phone', color: 'var(--gold)' },
            { icon: '🤖', title: 'AI Launches', sub: '4 agents activate\nInventory indexed', color: 'var(--rose)' },
            { icon: '🛍', title: 'Shop Smart', sub: 'Route + deals\nReady instantly', color: '#a78bfa' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', gap: isMobile ? 14 : 0, flex: isMobile ? 'none' : 1 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: isMobile ? 16 : 20, background: `${step.color}18`, border: `1.5px solid ${step.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '1.4rem' : '1.8rem' }}>{step.icon}</div>
                <div style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', background: 'var(--bg3)', border: `1.5px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: step.color }}>0{i+1}</div>
              </div>
              {!isMobile && <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '10px auto' }} />}
              <div style={{ textAlign: isMobile ? 'left' : 'center', flex: isMobile ? 1 : 'none' }}>
                <div style={{ fontWeight: 700, fontSize: isMobile ? '0.9rem' : '0.88rem', marginBottom: 3 }}>{step.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--white50)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{step.sub}</div>
              </div>
              {/* Arrow between steps — desktop only */}
              {!isMobile && i < 3 && <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.15)', margin: '0 8px', flexShrink: 0 }}>→</div>}
            </div>
          ))}
        </div>

        {/* QR mock card */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 20, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
            {/* Simulated QR */}
            <svg viewBox="0 0 120 120" width={isMobile ? 130 : 150} height={isMobile ? 130 : 150}>
              <rect width="120" height="120" fill="white"/>
              {/* Corners */}
              <rect x="6" y="6" width="36" height="36" rx="4" fill="none" stroke="#0a0a0f" strokeWidth="5"/>
              <rect x="14" y="14" width="20" height="20" rx="2" fill="#0a0a0f"/>
              <rect x="78" y="6" width="36" height="36" rx="4" fill="none" stroke="#0a0a0f" strokeWidth="5"/>
              <rect x="86" y="14" width="20" height="20" rx="2" fill="#0a0a0f"/>
              <rect x="6" y="78" width="36" height="36" rx="4" fill="none" stroke="#0a0a0f" strokeWidth="5"/>
              <rect x="14" y="86" width="20" height="20" rx="2" fill="#0a0a0f"/>
              {/* Data pixels */}
              {[[52,6],[60,6],[68,6],[52,14],[68,14],[60,22],[52,30],[68,38],[6,52],[14,52],[22,52],[6,60],[22,60],[6,68],[14,68],[22,68],
                [52,52],[60,52],[68,52],[78,52],[52,60],[68,60],[78,60],[86,60],[60,68],[78,68],[86,68],[94,68],[52,78],[68,78],[94,78],
                [52,86],[60,86],[78,86],[86,86],[52,94],[60,94],[68,94],[78,94],[94,94],[52,102],[60,102],[94,102],[68,110],[78,110],[94,110]
              ].map(([x,y],i) => <rect key={i} x={x} y={y} width="7" height="7" rx="1" fill="#0a0a0f"/>)}
              {/* M center */}
              <rect x="50" y="46" width="20" height="20" rx="4" fill="#f5a623"/>
              <text x="60" y="61" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0a0a0f" fontFamily="serif">M</text>
            </svg>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#333', marginBottom: 2 }}>📱 Scan to open MallMind</div>
              <div style={{ fontSize: '0.62rem', color: '#aaa' }}>No app needed · Any phone</div>
            </div>
          </div>

          <div style={{ maxWidth: 340 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.4rem' : '1.6rem', fontWeight: 700, marginBottom: 14, lineHeight: 1.2 }}>
              Mall prints it once.<br />Every shopper benefits.
            </h3>
            <p style={{ color: 'var(--white50)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 20 }}>
              Each QR code is location-aware — placed at the entrance, food court, or any floor. When scanned, MallMind knows exactly where the shopper is and builds routes from that point.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Works with iPhone & Android camera apps', 'Installs to home screen like a native app', 'Session starts in under 3 seconds'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: 'var(--white80)' }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '0.9rem' }}>✓</span> {t}
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: 22, padding: '12px 24px', fontSize: '0.9rem' }} onClick={() => router.push('/qr')}>
              Generate QR Codes →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ──────────────────────────────────────────────────────────────

function FeaturesSection({ isMobile }) {
  return (
    <section id="features" style={{ padding: isMobile ? '60px 20px' : '100px 5%' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Capabilities</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.9rem' : '2.8rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>Six agents. One seamless experience.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 18 }}>
          {FEATURES.map((f, i) => {
            const c = COLOR[f.color];
            return (
              <div key={i} className="card" style={{ padding: isMobile ? '20px 18px' : '26px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{f.icon}</div>
                  <span style={{ padding: '3px 10px', borderRadius: 999, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: '0.68rem', fontWeight: 600 }}>{f.label}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--white50)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────

function HowItWorksSection({ isMobile }) {
  return (
    <section id="how-it-works" style={{ padding: isMobile ? '60px 20px' : '100px 5%', background: 'linear-gradient(180deg, transparent, rgba(245,166,35,0.02) 50%, transparent)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Process</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.9rem' : '2.8rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            From entrance to exit,{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--gold-light),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>smarter every step</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 18, padding: isMobile ? '18px 18px' : '22px 24px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(245,166,35,0.08)', border: '1.5px solid rgba(245,166,35,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.05em' }}>{s.n}</span>
              </div>
              <div>
                <h3 style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--white50)', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chat Preview ──────────────────────────────────────────────────────────

function ChatPreviewSection({ isMobile, router }) {
  const msgs = [
    { role: 'user', text: 'Navy blue formal suit under ₹8000 and good coffee nearby.' },
    { role: 'ai',   text: 'Found 3 suits! Arrow has a slim-fit navy blazer at ₹6,499 (Floor 2, Size 38–44 in stock). Blue Tokai on GF is 40m away. Want me to build your route?' },
    { role: 'user', text: 'Yes please!' },
    { role: 'ai',   text: '✅ Route ready: Entrance → Arrow (F2, 3 min) → Blue Tokai (GF, 4 min). Total ~7 min walk. Starting navigation!' },
  ];

  return (
    <section style={{ padding: isMobile ? '60px 20px' : '100px 5%' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Live Preview</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.9rem' : '2.8rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>Watch the AI concierge work</h2>
          <p style={{ color: 'var(--white50)', marginTop: 10, fontSize: isMobile ? '0.88rem' : '1rem', lineHeight: 1.7, maxWidth: 480, margin: '10px auto 0' }}>
            Every message triggers 4 agents in parallel — resolved in under 2 seconds.
          </p>
        </div>

        {/* Chat mockup */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 22, overflow: 'hidden', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(245,166,35,0.03)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(245,166,35,0.25),rgba(255,140,66,0.25))', border: '1px solid rgba(245,166,35,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🤖</div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>MallMind AI</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }}/>4 agents active</div>
            </div>
          </div>
          <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: `fadeIn 0.4s ease ${0.3 + i * 0.4}s both` }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px', background: m.role === 'user' ? 'linear-gradient(135deg,#c47d0e,var(--gold))' : 'var(--bg3)', color: m.role === 'user' ? '#0a0a0f' : 'var(--white80)', fontSize: '0.82rem', lineHeight: 1.6, border: m.role === 'ai' ? '1px solid var(--border)' : 'none' }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-primary" style={{ padding: '13px 28px', fontSize: '0.95rem' }} onClick={() => router.push('/chat')}>
            Open Full Chat →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────────────────────────

function CTASection({ isMobile, router }) {
  return (
    <section style={{ padding: isMobile ? '60px 20px 80px' : '100px 5%' }}>
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', padding: isMobile ? '48px 24px' : '72px 48px', background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.06) 0%, transparent 70%)', border: '1px solid rgba(245,166,35,0.12)', borderRadius: 28 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Get Started</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: 900, marginBottom: 14, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Ready to shop like it's{' '}
          <span style={{ background: 'linear-gradient(135deg,var(--gold-light),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>2030?</span>
        </h2>
        <p style={{ color: 'var(--white50)', marginBottom: 32, fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: 1.7 }}>
          No installation. No signup. Just scan the QR at your mall entrance and let MallMind take over.
        </p>
        <button className="btn-primary" style={{ fontSize: '1rem', padding: '15px 36px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }} onClick={() => router.push('/chat')}>
          Launch AI Concierge →
        </button>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer({ isMobile }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: isMobile ? '24px 20px' : '32px 5%' }}>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,var(--gold),var(--amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.8rem', color: '#0a0a0f' }}>M</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>Mall<span style={{ color: 'var(--gold)' }}>Mind</span></span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--white50)' }}>© 2025 MallMind. Agentic retail intelligence.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(t => (
            <a key={t} href="#" style={{ fontSize: '0.78rem', color: 'var(--white50)', textDecoration: 'none' }}>{t}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <>
      <Head>
        <title>MallMind — Agentic Shopping Concierge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <NavBar isMobile={isMobile} />
      <HeroSection isMobile={isMobile} router={router} />
      <QRSection isMobile={isMobile} router={router} />
      <FeaturesSection isMobile={isMobile} />
      <HowItWorksSection isMobile={isMobile} />
      <ChatPreviewSection isMobile={isMobile} router={router} />
      <CTASection isMobile={isMobile} router={router} />
      <Footer isMobile={isMobile} />
    </>
  );
}
