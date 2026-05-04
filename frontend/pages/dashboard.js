import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const STORES_DATA = [
  { name: 'Arrow', floor: 'F2', visits: 312, conversions: 87, revenue: '₹2.8L', trend: '+12%', trendUp: true },
  { name: 'Zara', floor: 'F1', visits: 489, conversions: 134, revenue: '₹5.1L', trend: '+24%', trendUp: true },
  { name: 'H&M', floor: 'F1', visits: 267, conversions: 62, revenue: '₹1.6L', trend: '-3%', trendUp: false },
  { name: 'Nike', floor: 'F2', visits: 198, conversions: 55, revenue: '₹2.2L', trend: '+8%', trendUp: true },
  { name: 'Manyavar', floor: 'F3', visits: 143, conversions: 41, revenue: '₹1.9L', trend: '+17%', trendUp: true },
  { name: 'Blue Tokai', floor: 'GF', visits: 521, conversions: 398, revenue: '₹1.2L', trend: '+31%', trendUp: true },
];

const HEATMAP_DATA = [
  [30, 45, 20, 60, 80, 90, 70],
  [20, 30, 40, 75, 95, 85, 60],
  [15, 20, 35, 50, 70, 65, 45],
  [10, 15, 25, 40, 55, 50, 35],
];
const FLOORS = ['GF', 'F1', 'F2', 'F3'];
const HOURS = ['10', '11', '12', '1', '2', '3', '4'];

function MiniBar({ value, max = 100, color = 'var(--gold)' }) {
  return (
    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
    </div>
  );
}

function StatCard({ label, value, sub, icon, color = 'var(--gold)' }) {
  return (
    <div className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--white50)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
        <div style={{ fontSize: '1.2rem' }}>{icon}</div>
      </div>
      <div className="font-display" style={{ fontSize: '2rem', fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--white50)' }}>{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = ['overview', 'stores', 'heatmap', 'agents'];

  return (
    <>
      <Head><title>MallMind — Admin Dashboard</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top nav */}
        <div style={{
          padding: '0 32px', height: 64,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, var(--gold), var(--amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, color: '#0a0a0f' }}>M</div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--white)' }}>Mall<span style={{ color: 'var(--gold)' }}>Mind</span></span>
              </div>
            </Link>
            <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>/</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--white50)', fontWeight: 500 }}>Admin Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.25)', borderRadius: 999 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 6px var(--teal)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 600 }}>Live · 3,218 active sessions</span>
            </div>
            <Link href="/chat"><span className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>Open Concierge</span></Link>
          </div>
        </div>

        <div style={{ flex: 1, padding: '32px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          {/* Page header */}
          <div style={{ marginBottom: 32 }}>
            <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 }}>
              Ambience Mall, Delhi — <span className="gradient-text">Today</span>
            </h1>
            <p style={{ color: 'var(--white50)', fontSize: '0.85rem' }}>Live analytics powered by MallMind agents · Auto-refreshes every 30s</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--card)', padding: 4, borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: activeTab === t ? 'linear-gradient(135deg, var(--gold), var(--amber))' : 'transparent',
                color: activeTab === t ? '#0a0a0f' : 'var(--white50)',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem',
                textTransform: 'capitalize', transition: 'all 0.2s',
              }}>{t}</button>
            ))}
          </div>

          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'stores' && <StoresTab />}
          {activeTab === 'heatmap' && <HeatmapTab />}
          {activeTab === 'agents' && <AgentsTab />}
        </div>
      </div>
    </>
  );
}

function OverviewTab() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Visitors Today" value="3,218" sub="↑ 14% vs yesterday" icon="👥" color="var(--white)" />
        <StatCard label="AI Sessions" value="1,847" sub="57% engagement rate" icon="🤖" color="var(--gold)" />
        <StatCard label="Conversions" value="824" sub="44.6% conversion rate" icon="✅" color="var(--teal)" />
        <StatCard label="Revenue Influenced" value="₹14.2L" sub="↑ 23% via MallMind" icon="💰" color="var(--gold)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Hourly chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div className="section-label">Session Activity</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Hourly visitor flow</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
            {[45, 62, 80, 110, 145, 180, 165, 140, 190, 210, 175, 130].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  height: `${(v / 210) * 120}px`,
                  background: i === 9 ? 'linear-gradient(180deg, var(--gold), var(--amber))' : 'rgba(245,166,35,0.25)',
                  transition: 'height 0.8s ease',
                }} />
                <span style={{ fontSize: '0.6rem', color: 'var(--white50)' }}>{10 + i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top intents */}
        <div className="card" style={{ padding: 24 }}>
          <div className="section-label" style={{ marginBottom: 4 }}>Top Intents</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>What shoppers want</h3>
          {[
            { label: 'Clothing & Fashion', pct: 68, color: 'var(--gold)' },
            { label: 'Food & Coffee', pct: 52, color: 'var(--teal)' },
            { label: 'Footwear', pct: 38, color: '#a78bfa' },
            { label: 'Gifts', pct: 24, color: 'var(--rose)' },
            { label: 'Electronics', pct: 15, color: 'var(--white50)' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--white80)' }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 600 }}>{item.pct}%</span>
              </div>
              <MiniBar value={item.pct} color={item.color} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function StoresTab() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
        padding: '14px 24px', borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        {['Store', 'Floor', 'AI Visits', 'Conversions', 'Revenue', 'Trend'].map(h => (
          <span key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--white50)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</span>
        ))}
      </div>
      {STORES_DATA.map((s, i) => (
        <div key={s.name} style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
          padding: '16px 24px',
          borderBottom: i < STORES_DATA.length - 1 ? '1px solid var(--border)' : 'none',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.name}</span>
          <span style={{ color: 'var(--white50)', fontSize: '0.82rem' }}>{s.floor}</span>
          <span style={{ fontSize: '0.88rem' }}>{s.visits}</span>
          <span style={{ fontSize: '0.88rem' }}>{s.conversions}</span>
          <span style={{ fontSize: '0.88rem', color: 'var(--gold)', fontWeight: 600 }}>{s.revenue}</span>
          <span style={{ fontSize: '0.82rem', color: s.trendUp ? 'var(--teal)' : 'var(--rose)', fontWeight: 600 }}>
            {s.trend}
          </span>
        </div>
      ))}
    </div>
  );
}

function HeatmapTab() {
  return (
    <div className="card" style={{ padding: 28 }}>
      <div className="section-label" style={{ marginBottom: 4 }}>Foot Traffic</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 24 }}>Mall heatmap by floor & hour</h3>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 6, minWidth: 500 }}>
          {/* Hour labels */}
          <div />
          {HOURS.map(h => (
            <div key={h} style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--white50)', paddingBottom: 6 }}>{h}pm</div>
          ))}

          {/* Heatmap rows */}
          {HEATMAP_DATA.map((row, ri) => (
            <>
              <div key={`label-${ri}`} style={{ fontSize: '0.75rem', color: 'var(--white50)', display: 'flex', alignItems: 'center' }}>{FLOORS[ri]}</div>
              {row.map((val, ci) => (
                <div key={`${ri}-${ci}`} style={{
                  height: 44, borderRadius: 8,
                  background: `rgba(245,166,35,${val / 100 * 0.85 + 0.05})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 600,
                  color: val > 60 ? '#0a0a0f' : 'var(--white50)',
                }}>
                  {val}%
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--white50)' }}>Low</span>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(245,166,35,0.1), rgba(245,166,35,0.9))' }} />
        <span style={{ fontSize: '0.72rem', color: 'var(--white50)' }}>High</span>
      </div>
    </div>
  );
}

function AgentsTab() {
  const agents = [
    { name: 'Stylist Agent', icon: '👗', status: 'Active', tasks: 284, success: 96, desc: 'Provides personalized fashion recommendations based on user style, occasion, and budget.' },
    { name: 'Scout Agent', icon: '🔍', status: 'Active', tasks: 1847, success: 99, desc: 'Queries live store inventory across 47 stores, matching availability, size, color, and price.' },
    { name: 'Navigator Agent', icon: '🗺', status: 'Active', tasks: 632, success: 98, desc: 'Generates optimised indoor walking routes and handles dynamic rerouting based on crowds.' },
    { name: 'Negotiator Agent', icon: '🏷', status: 'Standby', tasks: 143, success: 87, desc: 'Triggers personalised promotional offers based on dwell time, route, and purchase history.' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {agents.map(a => (
        <div className="card" key={a.name} style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.name}</div>
                <div style={{ fontSize: '0.7rem', color: a.status === 'Active' ? 'var(--teal)' : 'var(--white50)' }}>● {a.status}</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--white50)', lineHeight: 1.65, marginBottom: 16 }}>{a.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)' }}>{a.tasks.toLocaleString()}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--white50)' }}>Tasks today</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--teal)' }}>{a.success}%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--white50)' }}>Success rate</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
