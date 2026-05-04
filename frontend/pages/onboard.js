import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// This page is what opens when a shopper scans the QR code.
// URL params: ?mall=ambience&floor=entrance
// It reads these, shows a quick personalisation step, then launches the chat.

const MALL_INFO = {
  ambience: { name: 'Ambience Mall', city: 'Delhi', stores: 30, floors: 'B1–F3', hours: '10 AM – 10 PM' },
  dlf:      { name: 'DLF Promenade', city: 'Delhi', stores: 62, floors: 'GF–F3', hours: '10 AM – 10 PM' },
  phoenix:  { name: 'Phoenix Palassio', city: 'Lucknow', stores: 38, floors: 'GF–F2', hours: '10 AM – 10 PM' },
};

const PREF_OPTIONS = {
  style:    ['Casual', 'Formal', 'Ethnic', 'Streetwear'],
  budget:   ['Under ₹1k', '₹1k–3k', '₹3k–8k', '₹8k+'],
  shopping: ['Just browsing', 'Know what I need', 'Gift shopping', 'Full outfit'],
};

export default function Onboard() {
  const router = useRouter();
  const { mall = 'ambience', floor = 'entrance' } = router.query;

  const [step, setStep] = useState('welcome'); // welcome | prefs | launching
  const [prefs, setPrefs] = useState({ style: '', budget: '', shopping: '' });
  const mallInfo = MALL_INFO[mall] || MALL_INFO.ambience;

  // Auto-detect if already has prefs saved → skip to chat
  useEffect(() => {
    const saved = sessionStorage.getItem('mm_prefs');
    if (saved) {
      router.push('/chat');
    }
  }, []);

  const saveAndLaunch = () => {
    sessionStorage.setItem('mm_prefs', JSON.stringify({ ...prefs, mall, floor }));
    setStep('launching');
    setTimeout(() => router.push('/chat'), 1800);
  };

  return (
    <>
      <Head>
        <title>MallMind — Welcome to {mallInfo.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0a0f" />
      </Head>

      <div style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        padding: 'env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)',
        overflowX: 'hidden',
      }}>
        {step === 'welcome'   && <WelcomeStep  mallInfo={mallInfo} floor={floor} onNext={() => setStep('prefs')} />}
        {step === 'prefs'     && <PrefsStep    prefs={prefs} setPrefs={setPrefs} onLaunch={saveAndLaunch} onSkip={() => { setStep('launching'); setTimeout(() => router.push('/chat'), 1600); }} />}
        {step === 'launching' && <LaunchingStep mallInfo={mallInfo} />}
      </div>
    </>
  );
}

// ── Welcome Step ───────────────────────────────────────────────────────────
function WelcomeStep({ mallInfo, floor, onNext }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 22px', overflowY: 'auto' }}>
      {/* Big logo area */}
      <div style={{ flex: '0 0 auto', paddingTop: 52, paddingBottom: 32, textAlign: 'center', position: 'relative' }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg,var(--gold),var(--amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 32px rgba(245,166,35,0.35)', fontSize: '2rem', fontWeight: 900, color: '#0a0a0f', fontFamily: 'var(--font-display)' }}>M</div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.1, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Welcome to<br /><span style={{ background: 'linear-gradient(135deg,var(--gold-light),var(--gold),var(--amber))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MallMind</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--white50)', lineHeight: 1.6 }}>
            Your AI shopping concierge is ready
          </p>
        </div>
      </div>

      {/* Mall info card */}
      <div style={{ background: 'var(--card)', border: '1px solid rgba(0,201,167,0.25)', borderRadius: 18, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(0,201,167,0.12)', border: '1px solid rgba(0,201,167,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📍</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{mallInfo.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--white50)', marginTop: 1 }}>{mallInfo.city}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 8px var(--teal)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: 600 }}>Live</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { val: mallInfo.stores, label: 'Stores' },
            { val: mallInfo.floors, label: 'Floors' },
            { val: '4 AI', label: 'Agents' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '10px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold)' }}>{s.val}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--white50)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What it does */}
      <div style={{ marginBottom: 28 }}>
        {[
          { icon: '🔍', title: 'Live Inventory Check', desc: 'See what\'s in stock before you walk there' },
          { icon: '🗺', title: 'Optimised Route', desc: 'Shortest path through all your stores' },
          { icon: '🏷', title: 'Exclusive Deals', desc: 'Session-only offers just for you' },
          { icon: '👗', title: 'Virtual Try-On', desc: 'See outfits on you before buying' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', flexShrink: 0 }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--white50)' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ paddingBottom: 28 }}>
        <button onClick={onNext} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,var(--gold),var(--amber))', border: 'none', borderRadius: 16, color: '#0a0a0f', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: 10 }}>
          Get Started →
        </button>
        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--white50)' }}>
          No signup · No download · Works in your browser
        </div>
      </div>
    </div>
  );
}

// ── Prefs Step ─────────────────────────────────────────────────────────────
function PrefsStep({ prefs, setPrefs, onLaunch, onSkip }) {
  const allSet = prefs.style && prefs.budget && prefs.shopping;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 22px', overflowY: 'auto' }}>
      <div style={{ paddingTop: 40, paddingBottom: 24 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Quick Setup</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.01em' }}>
          Tell us a little about yourself
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--white50)', lineHeight: 1.6 }}>
          Helps our Stylist Agent personalise your experience. Takes 10 seconds.
        </p>
      </div>

      <div style={{ flex: 1 }}>
        {Object.entries(PREF_OPTIONS).map(([key, options]) => (
          <div key={key} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--white80)', marginBottom: 10, textTransform: 'capitalize', letterSpacing: '0.02em' }}>
              {key === 'shopping' ? 'Today I am…' : key === 'style' ? 'My style' : 'My budget'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {options.map(opt => {
                const active = prefs[key] === opt;
                return (
                  <button key={opt} onClick={() => setPrefs(p => ({ ...p, [key]: opt }))} style={{
                    padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
                    background: active ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${active ? 'rgba(245,166,35,0.55)' : 'var(--border)'}`,
                    color: active ? 'var(--gold)' : 'var(--white80)',
                    fontSize: '0.85rem', fontWeight: active ? 600 : 400,
                    transition: 'all 0.15s', fontFamily: 'var(--font-body)',
                  }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: 32 }}>
        <button onClick={onLaunch} style={{
          width: '100%', padding: '16px',
          background: allSet ? 'linear-gradient(135deg,var(--gold),var(--amber))' : 'rgba(245,166,35,0.25)',
          border: 'none', borderRadius: 16,
          color: allSet ? '#0a0a0f' : 'rgba(245,166,35,0.6)',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem',
          cursor: allSet ? 'pointer' : 'default',
          marginBottom: 10, transition: 'all 0.2s',
        }}>
          {allSet ? 'Launch AI Concierge →' : 'Select your preferences above'}
        </button>
        <button onClick={onSkip} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: 'var(--white50)', fontSize: '0.85rem', cursor: 'pointer' }}>
          Skip — just open the chat
        </button>
      </div>
    </div>
  );
}

// ── Launching Step ─────────────────────────────────────────────────────────
function LaunchingStep({ mallInfo }) {
  const [agentIdx, setAgentIdx] = useState(0);
  const agents = ['Connecting to mall network…', 'Stylist Agent loading your profile…', 'Scout Agent indexing 30 stores…', 'Navigator building your map…', 'Ready! Opening concierge…'];

  useEffect(() => {
    const t = setInterval(() => setAgentIdx(i => Math.min(i + 1, agents.length - 1)), 340);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
      {/* Pulse rings */}
      <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 32px' }}>
        {[0, 1].map(i => (
          <div key={i} style={{ position: 'absolute', inset: i * -16, borderRadius: '50%', border: '2px solid rgba(245,166,35,0.2)', animation: `pulse-ring 1.8s ease ${i * 0.4}s infinite` }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', color: 'var(--gold)' }}>M</div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Launching your session</h2>
      <p style={{ fontSize: '0.82rem', color: 'var(--white50)', marginBottom: 32 }}>{mallInfo.name} · {mallInfo.stores} stores</p>

      <div style={{ width: '100%', maxWidth: 320 }}>
        {agents.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', opacity: i <= agentIdx ? 1 : 0.2, transition: 'opacity 0.4s' }}>
            <span style={{ fontSize: '0.8rem', color: i < agentIdx ? 'var(--teal)' : i === agentIdx ? 'var(--gold)' : 'var(--white50)', width: 18, textAlign: 'center' }}>
              {i < agentIdx ? '✓' : i === agentIdx ? '●' : '○'}
            </span>
            <span style={{ fontSize: '0.82rem', color: i <= agentIdx ? 'var(--white80)' : 'var(--white50)', textAlign: 'left' }}>{a}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
