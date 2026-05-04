import Head from 'next/head';

// This page is meant to be PRINTED and placed at mall entrances.
// The QR code on it points to: https://yourdomain.com/onboard?mall=ambience&floor=entrance
// When scanned on any phone, it opens as a PWA — no install needed.

export default function QRPrintPage() {
  const mallUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/onboard?mall=ambience&floor=entrance`
    : 'https://mallmind.app/onboard?mall=ambience&floor=entrance';

  return (
    <>
      <Head>
        <title>MallMind — QR Code Print Sheet</title>
        <style>{`
          @media print {
            body { background: white !important; }
            .no-print { display: none !important; }
            .qr-card { break-inside: avoid; }
          }
          body { background: #0a0a0f; font-family: 'DM Sans', sans-serif; }
        `}</style>
      </Head>

      {/* Print button — hidden when printing */}
      <div className="no-print" style={{ padding: '20px 5%', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#f5a623,#ff8c42)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#0a0a0f', fontSize:'0.9rem' }}>M</div>
          <span style={{ fontFamily:'Playfair Display, serif', fontWeight:700, fontSize:'1.1rem', color:'white' }}>Mall<span style={{color:'#f5a623'}}>Mind</span> QR Print Sheet</span>
        </div>
        <button onClick={() => window.print()} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#f5a623,#ff8c42)', border:'none', borderRadius:10, color:'#0a0a0f', fontWeight:700, fontSize:'0.9rem', cursor:'pointer' }}>
          🖨 Print QR Codes
        </button>
      </div>

      {/* Print layout */}
      <div style={{ padding:'40px 5%', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:32, maxWidth:1000, margin:'0 auto' }}>
        {[
          { location: 'Main Entrance', floor: 'Ground Floor', icon: '🚪', url: '/onboard?mall=ambience&floor=entrance' },
          { location: 'Food Court', floor: 'Ground Floor', icon: '🍽', url: '/onboard?mall=ambience&floor=gf-food' },
          { location: 'Fashion Zone', floor: 'Floor 1', icon: '👗', url: '/onboard?mall=ambience&floor=f1' },
          { location: 'Sports & Footwear', floor: 'Floor 2', icon: '👟', url: '/onboard?mall=ambience&floor=f2' },
          { location: 'Ethnic & Formal', floor: 'Floor 3', icon: '🥻', url: '/onboard?mall=ambience&floor=f3' },
          { location: 'Parking Exit', floor: 'Basement', icon: '🅿️', url: '/onboard?mall=ambience&floor=b1' },
        ].map((spot, i) => (
          <QRCard key={i} spot={spot} baseUrl={typeof window !== 'undefined' ? window.location.origin : 'https://mallmind.app'} />
        ))}
      </div>

      {/* Instructions */}
      <div className="no-print" style={{ maxWidth:700, margin:'0 auto 60px', padding:'0 5%', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Playfair Display,serif', color:'white', fontSize:'1.4rem', marginBottom:12 }}>How to deploy</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
          {[
            { n:'1', t:'Print this page', d:'Use A4/Letter paper, colour preferred. Laminate for durability.' },
            { n:'2', t:'Place at entrances', d:'Put each card at the matching location in your mall.' },
            { n:'3', t:'Shoppers scan & go', d:'Phone camera → QR → instant PWA. No app download needed.' },
          ].map(s => (
            <div key={s.n} style={{ padding:'20px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#f5a623', fontWeight:700, marginBottom:10 }}>{s.n}</div>
              <div style={{ fontWeight:600, color:'white', marginBottom:6, fontSize:'0.88rem' }}>{s.t}</div>
              <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function QRCard({ spot, baseUrl }) {
  const fullUrl = `${baseUrl}${spot.url}`;
  // We use a free QR API — in production replace with your own QR generation
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}&bgcolor=ffffff&color=0a0a0f&qzone=2&format=png`;

  return (
    <div className="qr-card" style={{
      background:'white', borderRadius:20, overflow:'hidden',
      boxShadow:'0 8px 40px rgba(0,0,0,0.5)',
      fontFamily:'DM Sans,sans-serif',
    }}>
      {/* Gold header */}
      <div style={{ background:'linear-gradient(135deg,#f5a623,#ff8c42)', padding:'18px 20px', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:'1.6rem' }}>{spot.icon}</span>
        <div>
          <div style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(0,0,0,0.5)', marginBottom:2 }}>Scan to start</div>
          <div style={{ fontWeight:800, fontSize:'1rem', color:'#0a0a0f', lineHeight:1.2 }}>{spot.location}</div>
          <div style={{ fontSize:'0.72rem', color:'rgba(0,0,0,0.5)', marginTop:2 }}>{spot.floor}</div>
        </div>
        <div style={{ marginLeft:'auto', fontFamily:'Playfair Display,serif', fontWeight:900, fontSize:'1.1rem', color:'#0a0a0f' }}>M</div>
      </div>

      {/* QR code */}
      <div style={{ padding:'20px', textAlign:'center' }}>
        <div style={{ display:'inline-block', padding:12, background:'white', borderRadius:14, border:'2px solid #f0e8d4', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt={`QR for ${spot.location}`} width={160} height={160} style={{ display:'block', borderRadius:6 }} />
        </div>

        {/* CTA */}
        <div style={{ marginTop:14, fontSize:'0.82rem', fontWeight:600, color:'#333', marginBottom:4 }}>
          📱 Point your camera here
        </div>
        <div style={{ fontSize:'0.72rem', color:'#888', marginBottom:14 }}>
          No app download · Works on any phone
        </div>

        {/* Feature pills */}
        <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
          {['Live Inventory', 'Smart Route', 'Best Deals'].map(f => (
            <span key={f} style={{ padding:'4px 10px', borderRadius:999, background:'#fff8ed', border:'1px solid #f5a62355', fontSize:'0.65rem', fontWeight:600, color:'#c47d0e' }}>{f}</span>
          ))}
        </div>

        {/* URL fallback */}
        <div style={{ marginTop:14, padding:'8px 12px', background:'#f8f8f8', borderRadius:8, fontSize:'0.62rem', color:'#aaa', wordBreak:'break-all' }}>
          {fullUrl}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:'10px 20px 14px', borderTop:'1px solid #f0f0f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:'0.9rem', color:'#0a0a0f' }}>Mall<span style={{color:'#f5a623'}}>Mind</span></span>
        <span style={{ fontSize:'0.65rem', color:'#bbb' }}>Powered by Agentic AI</span>
      </div>
    </div>
  );
}
