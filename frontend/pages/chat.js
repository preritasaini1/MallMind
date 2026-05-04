import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import StoreCard from '../components/StoreCard';
import { fetchShoppingRecommendations } from '../lib/api';

const QUICK_PROMPTS = [
  "Blue suit under ₹8,000",
  "Sneakers + coffee",
  "Gift for mom under ₹2k",
  "Kids birthday outfit",
  "Bed sheet + Pillows",
];

const MOCK_STORES = [
  { id: 1, name: 'Arrow', category: 'Menswear', floor: 'F2', distance: '3 min', price: '₹6,499', item: 'Navy Slim-Fit Blazer', inStock: true, rating: 4.6, discount: '15% OFF', color: '#1a3a5c', icon: '👔' },
  { id: 2, name: 'Manyavar', category: 'Ethnic Wear', floor: 'F3', distance: '5 min', price: '₹7,200', item: 'Navy Sherwani Set', inStock: true, rating: 4.4, discount: null, color: '#3a1a5c', icon: '🥻' },
  { id: 3, name: 'H&M', category: 'Fast Fashion', floor: 'F1', distance: '2 min', price: '₹3,999', item: 'Slim Suit Jacket', inStock: false, rating: 4.2, discount: '20% OFF', color: '#1a3a2c', icon: '🧥' },
  { id: 4, name: 'Blue Tokai', category: 'Specialty Coffee', floor: 'GF', distance: '7 min', price: '₹380', item: 'Pour-Over + Croissant', inStock: true, rating: 4.8, discount: null, color: '#3a2a1a', icon: '☕' },
];

const GREETING = {
  role: 'ai',
  text: "Hi! I'm your MallMind concierge 👋\n\nTell me what you're shopping for. I'll check live inventory across all 30 stores, find the best deals, and build your optimised walking route.",
};

// We will use the live API instead of buildAIResponse

function useIsMobile() {
  const [mobile, setMobile] = useState(true); // default true → mobile-first
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

// ── Agent Steps ────────────────────────────────────────────────────────────
function AgentSteps({ steps, currentStep }) {
  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(245,166,35,0.04)',
      border: '1px solid rgba(245,166,35,0.12)',
      borderRadius: 14, marginBottom: 4,
    }}>
      {steps.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: i < steps.length - 1 ? 9 : 0,
          opacity: i <= currentStep ? 1 : 0.22,
          transition: 'opacity 0.3s',
        }}>
          <span style={{ fontSize: '0.88rem', width: 20 }}>{s.icon}</span>
          <span style={{ fontSize: '0.82rem', color: i <= currentStep ? 'var(--white80)' : 'var(--white50)', flex: 1 }}>
            {s.label}
          </span>
          {i === currentStep && (
            <div style={{ display: 'flex', gap: 3 }}>
              {[0,1,2].map(j => (
                <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', animation: `typing 1s ease ${j*0.2}s infinite` }} />
              ))}
            </div>
          )}
          {i < currentStep && <span style={{ color: 'var(--teal)', fontSize: '0.82rem' }}>✓</span>}
        </div>
      ))}
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────
function Message({ msg, isMobile }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14, animation: 'fadeUp 0.3s ease' }}>
        <div style={{
          maxWidth: isMobile ? '80%' : '65%',
          padding: '11px 16px',
          background: 'linear-gradient(135deg, #c47d0e, var(--gold))',
          color: '#0a0a0f', borderRadius: '18px 18px 4px 18px',
          fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.55,
          wordBreak: 'break-word',
        }}>
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 18, animation: 'fadeUp 0.3s ease', maxWidth: isMobile ? '98%' : '84%' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        background: 'linear-gradient(135deg, rgba(245,166,35,0.22), rgba(255,140,66,0.22))',
        border: '1px solid rgba(245,166,35,0.28)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
      }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {msg.agentSteps && <AgentSteps steps={msg.agentSteps} currentStep={msg.agentStep ?? msg.agentSteps.length} />}
        {msg.text && (
          <div style={{
            padding: '12px 15px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '4px 18px 18px 18px',
            fontSize: '0.9rem', color: 'var(--white80)', lineHeight: 1.7,
            marginBottom: msg.stores?.length ? 12 : 0,
            whiteSpace: 'pre-line', wordBreak: 'break-word',
          }}>
            {msg.text.split('**').map((part, i) =>
              i % 2 === 1 ? <strong key={i} style={{ color: 'var(--white)', fontWeight: 600 }}>{part}</strong> : part
            )}
          </div>
        )}
        {msg.stores?.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px,1fr))',
            gap: 10, marginTop: 10,
          }}>
            {msg.stores.map(s => <StoreCard key={s.id} store={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sidebar / Bottom Sheet ─────────────────────────────────────────────────
function Drawer({ messages, onNewChat, open, onClose, isMobile }) {
  const history = messages.filter(m => m.role === 'user').slice(-5).reverse();

  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,var(--gold),var(--amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, color: '#0a0a0f' }}>M</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--white)' }}>Mall<span style={{ color: 'var(--gold)' }}>Mind</span></span>
          </div>
        </Link>
        {isMobile && <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--white50)', fontSize: '1.3rem', cursor: 'pointer', padding: '4px 6px' }}>✕</button>}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 0', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => { onNewChat(); onClose(); }} style={{ width: '100%', padding: '11px 14px', marginBottom: 18, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 10, color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>✦</span> New Session
        </button>

        <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--white50)', textTransform: 'uppercase', marginBottom: 10 }}>Active Agents</div>
        {[
          { name: 'Stylist Agent', color: 'var(--gold)', status: 'Ready' },
          { name: 'Scout Agent', color: 'var(--teal)', status: 'Watching' },
          { name: 'Navigator', color: 'var(--rose)', status: 'Ready' },
          { name: 'Negotiator', color: '#a78bfa', status: 'Standby' },
        ].map(a => (
          <div key={a.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', marginBottom: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{a.name}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--white50)' }}>{a.status}</span>
          </div>
        ))}

        {history.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--white50)', textTransform: 'uppercase', marginBottom: 10 }}>This Session</div>
            {history.map((m, i) => (
              <div key={i} style={{ padding: '7px 10px', marginBottom: 3, borderRadius: 8, fontSize: '0.78rem', color: 'var(--white50)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                💬 {m.text.slice(0, 30)}…
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', flexShrink: 0, paddingBottom: isMobile ? 'max(12px, env(safe-area-inset-bottom))' : '12px' }}>
        <div style={{ padding: '11px 14px', borderRadius: 10, background: 'rgba(0,201,167,0.07)', border: '1px solid rgba(0,201,167,0.2)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--teal)', marginBottom: 2 }}>📍 Ambience Mall, Delhi</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--white50)' }}>30 stores · B1–F3 · Open till 10 PM</div>
        </div>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <aside style={{ width: 256, height: '100dvh', flexShrink: 0, background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
        {inner}
      </aside>
    );
  }

  // Mobile: bottom sheet
  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }} />
      )}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 151,
        height: '80dvh',
        background: 'var(--bg2)',
        borderRadius: '22px 22px 0 0',
        border: '1px solid var(--border)', borderBottom: 'none',
        transform: open ? 'translateY(0)' : 'translateY(102%)',
        transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>
        {inner}
      </div>
    </>
  );
}

// ── Map Modal ──────────────────────────────────────────────────────────────
function MapModal({ onClose, isMobile, navigation }) {
  // Node centers: x = rect_x + w/2, y = rect_y + h/2 + 15 (below store name text)
  const storeNodes = {
    "Entrance":    { x: 565, y: 527, type: "entry"       }, // rect 530,505 w70 h30
    "Blue Tokai":  { x: 547, y: 433, type: "food"        }, // rect 504,400 w86 h42
    "H&M":         { x: 132, y: 400, type: "apparel"     }, // rect 40,335 w185 h100
    "Zara":        { x: 385, y: 455, type: "apparel"     }, // rect 270,400 w230 h85
    "Arrow":       { x: 678, y: 245, type: "apparel"     }, // rect 624,170 w108 h120
    "Cafe":        { x:  85, y: 518, type: "food"        }, // rect 40,495 w90 h30
    "Manyavar":    { x: 347, y: 103, type: "apparel"     }, // rect 270,40 w155 h100
    "Croma":       { x: 678, y: 373, type: "electronics" }, // rect 624,295 w108 h130
    "Home Centre": { x: 132, y: 273, type: "home"        }, // rect 40,230 w185 h60
    "Max":         { x: 320, y: 378, type: "apparel"     }, // rect 270,335 w100 h60
    "Barista":     { x: 442, y: 195, type: "food"        }, // rect 410,145 w65 h75
    "Puma":        { x: 302, y: 195, type: "apparel"     }, // rect 270,145 w65 h75
    "Fab India":   { x: 520, y: 195, type: "apparel"     }, // rect 480,145 w80 h75
    "Suvidha":     { x: 132, y: 177, type: "home"        }, // rect 40,100 w185 h125
    "Easybuy":     { x:  85, y: 474, type: "home"        }, // rect 40,440 w90 h45
    "Pixy Land":   { x: 547, y: 474, type: "playzone"    }, // rect 504,447 w86 h38
    "Azorte":      { x: 678, y: 115, type: "apparel"     }, // rect 624,40 w108 h125
    "New Me":      { x: 180, y: 474, type: "apparel"     }, // rect 135,440 w90 h45
    "Blaaze":      { x:  87, y:  78, type: "playzone"    }, // rect 40,40 w95 h55
    "Toyzone":     { x: 182, y:  78, type: "playzone"    }, // rect 140,40 w85 h55
    "Chunmun":     { x: 507, y: 103, type: "apparel"     }, // rect 430,40 w155 h100
    "Nykaa Beauty": { x: 320, y: 275, type: "makeup"   }, // rect 270,230 w100 h60
    "Bata":          { x: 415, y: 275, type: "footwear" }, // rect 375,230 w80 h60
    "Blue stone":    { x: 180, y: 510, type: "jewel"    }, // rect 135,495 w90 h30
  };

  const path  = navigation?.path || ["Entrance"];
  const rPts  = path.filter(n => storeNodes[n]).map(n => `${storeNodes[n].x},${storeNodes[n].y}`);
  const rPath = rPts.length > 1 ? `M ${rPts.join(' L ')}` : "";

  const C = {
    bg:"#0d2028", floor:"#14303a", wall:"#193e4c", corr:"#11272f",
    border:"#255060", apparel:"#008f63", food:"#c98f26",
    elec:"#245d9e", home:"#4d7325", play:"#0c5540",
    jewel:"#545454", entry:"#1060aa", text:"#dde8ea",
    route:"#fcd34d", gold:"#ddb94a", iconY:"#c5a030",
    makeup:"#9c3070", footwear:"#5a3080",
  };

  const Icon = ({ label, icon }) => (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <div style={{width:40,height:40,background:C.iconY,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem"}}>
        {icon}
      </div>
      <div style={{fontSize:"0.5rem",color:"#c4dce0",textTransform:"uppercase",textAlign:"center",maxWidth:46,letterSpacing:.5,lineHeight:1.2}}>{label}</div>
    </div>
  );

  const Leg = ({ title, stores, color }) => (
    <div style={{marginBottom:11}}>
      <div style={{background:color,color:"#fff",padding:"2px 9px",fontSize:"0.7rem",fontWeight:700,display:"inline-block",marginBottom:3,borderRadius:2}}>{title}</div>
      <div style={{fontSize:"0.6rem",color:"#7aa8b2",lineHeight:1.6,textTransform:"uppercase"}}>{stores}</div>
    </div>
  );



  /* store block helper */
  const S = ({x,y,w,h,col,label,fs=12}) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={col} stroke={C.bg} strokeWidth="1.5" rx="2"/>
      {label.split("\n").map((l,i)=>(
        <text key={i} x={x+w/2} y={y+h/2+(i-(label.split("\n").length-1)/2)*13+4}
          textAnchor="middle" fill={C.text} fontSize={fs} fontWeight="700">{l}</text>
      ))}
    </g>
  );

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:C.bg,display:"flex",flexDirection:"column"}} onClick={onClose}>

      {/* TOP BAR */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 20px",
        background:C.floor,borderBottom:`1px solid ${C.border}`,flexShrink:0}} onClick={e=>e.stopPropagation()}>

        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {/* logo */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:0,height:0,borderLeft:"12px solid transparent",borderRight:"12px solid transparent",borderBottom:`18px solid ${C.gold}`}}/>
            <div>
              <div style={{color:C.gold,fontSize:"1.2rem",fontWeight:900,letterSpacing:2,lineHeight:1}}>MALLMIND</div>
              <div style={{color:"#7aa8b2",fontSize:"0.55rem",letterSpacing:3,textTransform:"uppercase"}}>Premium Concierge</div>
            </div>
          </div>
          <div style={{width:1,height:36,background:C.border}}/>
          <div>
            <div style={{color:C.gold,fontSize:"1.35rem",fontWeight:300,fontFamily:"Georgia,serif",lineHeight:1}}>GROUND FLOOR</div>
            <div style={{color:"#7aa8b2",fontSize:"0.6rem",letterSpacing:1}}>Interactive Directory</div>
          </div>
        </div>



        <button onClick={onClose}
          style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,color:"#fff",
            width:34,height:34,borderRadius:"50%",fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      </div>

      {/* MAIN BODY */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>

        {/* SVG MAP */}
        <div style={{flex:1,overflow:"hidden",position:"relative"}}>
          <svg viewBox="0 0 770 560" style={{width:"100%",height:"100%"}} preserveAspectRatio="xMidYMid meet">

            {/* ── MALL BOUNDARY (irregular polygon like the reference) ── */}
            <polygon points="30,30 740,30 740,510 600,540 30,540"
              fill={C.wall} stroke={C.border} strokeWidth="3"/>
            {/* inner floor */}
            <polygon points="40,40 730,40 730,500 602,528 40,528"
              fill={C.floor} stroke={C.border} strokeWidth="1" strokeDasharray="5,5" opacity="0.35"/>

            {/* ── PARKING (top-left notch) ── */}
            <rect x="30" y="30" width="130" height="60" rx="3" fill="#111e25" stroke={C.border} strokeWidth="1.5"/>
            <text x="95" y="60" textAnchor="middle" fill={C.iconY} fontSize="10" fontWeight="700">🅿 PARKING</text>
            <text x="95" y="74" textAnchor="middle" fill={C.iconY} fontSize="8">4-WHEELER</text>

            {/* ── CORRIDORS ── */}
            {/* main H corridor */}
            <rect x="40" y="295" width="690" height="38" fill={C.corr} opacity="0.85"/>
            {/* main V corridor */}
            <rect x="228" y="40" width="38" height="490" fill={C.corr} opacity="0.85"/>
            {/* right-side V corridor */}
            <rect x="590" y="40" width="30" height="470" fill={C.corr} opacity="0.7"/>
            {/* bottom H corridor */}
            <rect x="40" y="490" width="570" height="40" fill={C.corr} opacity="0.7"/>

            {/* ═══════ STORE BLOCKS ═══════ */}

            {/* TOP-LEFT: large SUVIDHA (hypermarket style) */}
            <S x={40}  y={100} w={185} h={125} col={C.home}    label={"SUVIDHA"}        fs={14}/>

            {/* TOP-LEFT lower: HOME CENTRE */}
            <S x={40}  y={230} w={185} h={60}  col={C.home}    label={"HOME CENTRE"}    fs={11}/>

            {/* top-left: small BLAAZE playzone */}
            <S x={40}  y={40}  w={95}  h={55}  col={C.play}    label={"BLAAZE"}         fs={10}/>
            <S x={140} y={40}  w={85}  h={55}  col={C.play}    label={"TOYZONE"}        fs={10}/>

            {/* CENTER-TOP: MANYAVAR + CHUNMUN */}
            <S x={270} y={40}  w={155} h={100} col={C.apparel} label={"MANYAVAR"}       fs={13}/>
            <S x={430} y={40}  w={155} h={100} col={C.apparel} label={"CHUNMUN"}        fs={13}/>

            {/* TOP-RIGHT: large AZORTE */}
            <S x={624} y={40}  w={108} h={125} col={C.apparel} label={"AZORTE"}         fs={12}/>

            {/* Second row left: PUMA + small shops */}
            <S x={270} y={145} w={65}  h={75}  col={C.apparel} label={"PUMA"}           fs={10}/>
            <S x={340} y={145} w={65}  h={75}  col={C.apparel} label={"ONLY"}           fs={10}/>
            <S x={410} y={145} w={65}  h={75}  col={C.food}    label={"BARISTA"}        fs={10}/>
            <S x={480} y={145} w={80}  h={75}  col={C.apparel} label={"FAB INDIA"}      fs={10}/>
            <S x={565} y={145} w={55}  h={75}  col={C.apparel} label={"VERO\nMODA"}     fs={9}/>

            {/* Second row right: ARROW (big) */}
            <S x={624} y={170} w={108} h={120} col={C.apparel} label={"ARROW"}          fs={14}/>

            {/* Mid-left: H&M (large) */}
            <S x={40}  y={335} w={185} h={100} col={C.apparel} label={"H&M"}            fs={16}/>

            {/* Mid row center: MAX + PORTICO cluster */}
            <S x={270} y={335} w={100} h={60}  col={C.apparel} label={"MAX"}            fs={12}/>
            <S x={375} y={335} w={75}  h={60}  col={C.home}    label={"PORTICO"}        fs={10}/>
            <S x={455} y={335} w={75}  h={60}  col={C.jewel}   label={"SAFARI"}         fs={10}/>
            <S x={535} y={335} w={50}  h={60}  col={C.jewel}   label={"MIA"}            fs={10}/>

            {/* Mid-right: large CROMA */}
            <S x={624} y={295} w={108} h={130} col={C.elec}    label={"CROMA"}          fs={14}/>

            {/* Mid lower: EASYBUY + NEW ME */}
            <S x={40}  y={440} w={90}  h={45}  col={C.home}    label={"EASYBUY"}        fs={10}/>
            <S x={135} y={440} w={90}  h={45}  col={C.apparel} label={"NEW ME"}         fs={10}/>

            {/* Center lower: ZARA (dominant central) */}
            <S x={270} y={400} w={230} h={85}  col={C.apparel} label={"ZARA"}           fs={20}/>

            {/* BLUE TOKAI + PIXY LAND bottom right */}
            <S x={504} y={400} w={86}  h={42}  col={C.food}    label={"BLUE TOKAI"}     fs={9}/>
            <S x={504} y={447} w={86}  h={38}  col={C.play}    label={"PIXY LAND"}      fs={9}/>

            {/* BLUE STONE bottom-far-left */}
            <S x={40}  y={495} w={90}  h={30}  col={C.food}    label={"CAFE"}           fs={9}/>
            <S x={135} y={495} w={90}  h={30}  col={C.jewel}   label={"BLUE STONE"}      fs={9}/>

            {/* NYKAA BEAUTY — makeup store in middle row */}
            <S x={270} y={230} w={100} h={60}  col={C.makeup}  label={"NYKAA\nBEAUTY"}  fs={9}/>

            {/* BATA — footwear beside Nykaa */}
            <S x={375} y={230} w={80}  h={60}  col={C.footwear} label={"BATA"}           fs={11}/>

            {/* ENTRY — single block at bottom-center-right */}
            <rect x="530" y="505" width="70" height="30" rx="4" fill={C.entry} stroke={C.gold} strokeWidth="2"/>
            <text x="565" y="520" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">MAIN ENTRY ↑</text>



            {/* ── ROUTE PATH ── */}
            {rPath && (
              <path d={rPath} stroke={C.route} strokeWidth="4" fill="none"
                strokeDasharray="10,8" strokeLinecap="round"
                style={{animation:"dash-flow-route 0.8s linear infinite"}}/>
            )}

            {/* ── ROUTE NODES (dot on store center, no floating label) ── */}
            {Object.keys(storeNodes).map(key => {
              if (!path.includes(key)) return null;
              const n = storeNodes[key];
              const isT = path[path.length-1]===key;
              return (
                <g key={key} transform={`translate(${n.x},${n.y})`}>
                  {isT && <circle r="22" fill="rgba(252,211,77,.22)" style={{animation:"ping-route 1.3s infinite"}}/>}
                  <circle r="7" fill={C.route} stroke={C.bg} strokeWidth="2.5"/>
                </g>
              );
            })}

          </svg>
        </div>

        {/* LEGEND SIDEBAR */}
        {!isMobile && (
          <div style={{width:240,background:C.floor,borderLeft:`1px solid ${C.border}`,overflowY:"auto",padding:"18px 16px",flexShrink:0}}>
            <div style={{color:C.gold,fontSize:"0.75rem",fontWeight:800,letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>Store Directory</div>
            <Leg color={C.apparel}  title="APPAREL"              stores="ZARA | H&M | MAX | FAB INDIA | ARROW | PUMA | MANYAVAR | ONLY | NEW ME | AZORTE | CHUNMUN | VERO MODA"/>
            <Leg color={C.home}     title="HYPERMARKET"          stores="SUVIDHA | EASYBUY | HOME CENTRE | PORTICO"/>
            <Leg color={C.play}     title="PLAYZONE"             stores="PIXY LAND | TOYZONE | BLAAZE"/>
            <Leg color={C.elec}     title="HOMEDECOR & APPLIANCES" stores="CROMA | HOME CENTRE"/>
            <Leg color={C.makeup}   title="BEAUTY & MAKEUP"      stores="NYKAA BEAUTY"/>
            <Leg color={C.footwear} title="FOOTWEAR"             stores="BATA"/>
            <Leg color={C.food}     title="SNACKS & SWEETS"      stores="BLUE TOKAI | CAFE | BARISTA"/>
            <Leg color={C.jewel}    title="JEWELLERY & ACCESS."  stores="MIA | KISNA | SAFARI | GIVA | BLUE STONE"/>
          </div>
        )}
      </div>

      {/* ROUTE FOOTER */}
      {path.length > 1 && (
        <div style={{background:"rgba(13,32,40,.97)",borderTop:`1px solid ${C.border}`,padding:"10px 20px",
          display:"flex",alignItems:"center",gap:16,flexShrink:0,overflowX:"auto"}} onClick={e=>e.stopPropagation()}>
          <div style={{color:C.route,fontSize:"0.8rem",fontWeight:900,letterSpacing:1,whiteSpace:"nowrap"}}>📍 ROUTE</div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {path.map((k,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                <div style={{padding:"4px 11px",borderRadius:16,
                  background:i===path.length-1?C.route:C.wall,
                  color:i===path.length-1?C.bg:"#fff",
                  fontSize:"0.78rem",fontWeight:700,
                  border:`1px solid ${i===path.length-1?C.route:C.border}`}}>{k}</div>
                {i<path.length-1 && <span style={{color:C.border,fontSize:"1rem"}}>→</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes dash-flow-route { to { stroke-dashoffset: -18; } }
        @keyframes ping-route { 0%{transform:scale(1);opacity:.85} 100%{transform:scale(2.2);opacity:0} }
      `}}/>

    </div>
  );
}

// ── Try-On Modal ───────────────────────────────────────────────────────────
function TryOnModal({ onClose, isMobile }) {
  const [stage, setStage] = useState('upload');
  const fileRef = useRef();
  const handleFile = () => { setStage('processing'); setTimeout(() => setStage('done'), 2500); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', padding: isMobile ? 0 : 20, animation: 'fadeIn 0.2s ease' }} onClick={onClose}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: isMobile ? '22px 22px 0 0' : 24, overflow: 'hidden', width: '100%', maxWidth: isMobile ? '100%' : 480, animation: 'fadeUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
        {isMobile && <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 4px' }}><div style={{ width:36, height:4, borderRadius:2, background:'rgba(255,255,255,0.15)' }}/></div>}
        <div style={{ padding: isMobile ? '4px 18px 14px' : '18px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', fontWeight:700 }}>Virtual Try-On</h3>
            <div style={{ fontSize:'0.72rem', color:'var(--white50)', marginTop:2 }}>Powered by Generative AI</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--white50)', fontSize:'1.3rem', cursor:'pointer', padding:'4px 8px' }}>✕</button>
        </div>
        <div style={{ padding: isMobile ? '20px 18px 32px' : 26, textAlign:'center' }}>
          {stage === 'upload' && <>
            <div style={{ width:100, height:100, borderRadius:'50%', margin:'0 auto 16px', background:'rgba(245,166,35,0.08)', border:'2px dashed rgba(245,166,35,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', cursor:'pointer' }} onClick={() => fileRef.current?.click()}>📸</div>
            <input ref={fileRef} type="file" accept="image/*" capture="user" style={{ display:'none' }} onChange={handleFile}/>
            <h4 style={{ fontWeight:600, marginBottom:8 }}>Upload your selfie</h4>
            <p style={{ fontSize:'0.82rem', color:'var(--white50)', marginBottom:20, lineHeight:1.6 }}>AI simulates any outfit on you — photorealistic results in seconds.</p>
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:'0.95rem' }} onClick={() => fileRef.current?.click()}>📷 Take or Upload Photo</button>
            <div style={{ marginTop:10, fontSize:'0.7rem', color:'var(--white50)' }}>🔒 Never stored · Session-only</div>
          </>}
          {stage === 'processing' && <>
            <div style={{ width:68, height:68, borderRadius:'50%', margin:'0 auto 16px', border:'3px solid rgba(245,166,35,0.2)', borderTopColor:'var(--gold)', animation:'spin-slow 1s linear infinite' }}/>
            <h4 style={{ fontWeight:600, marginBottom:6 }}>Processing your look…</h4>
            <p style={{ fontSize:'0.8rem', color:'var(--white50)', marginBottom:16 }}>Diffusion model rendering outfit</p>
            {['Detecting body shape','Mapping outfit geometry','Rendering preview'].map((s,i)=>(
              <div key={i} style={{ padding:'8px 14px', marginBottom:6, background:'rgba(245,166,35,0.05)', borderRadius:8, fontSize:'0.78rem', color:'var(--white50)', display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)', animation:`typing 1.2s ease ${i*0.3}s infinite` }}/> {s}
              </div>
            ))}
          </>}
          {stage === 'done' && <>
            <div style={{ width:'100%', height:160, borderRadius:14, background:'linear-gradient(135deg,rgba(245,166,35,0.1),rgba(255,107,138,0.08))', border:'1px solid rgba(245,166,35,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', marginBottom:16 }}>✨</div>
            <h4 style={{ fontWeight:600, marginBottom:6 }}>Looking great!</h4>
            <p style={{ fontSize:'0.82rem', color:'var(--white50)', marginBottom:18 }}>Arrow Navy Slim-Fit Blazer suits you!</p>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-primary" style={{ flex:1, justifyContent:'center', padding:'13px' }}>Reserve in Store</button>
              <button className="btn-ghost" style={{ flex:1, justifyContent:'center', padding:'13px' }} onClick={() => setStage('upload')}>Try Another</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();
  const isMobile = useIsMobile();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    document.body.style.overflow = (drawerOpen || showMap || showTryOn) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, showMap, showTryOn]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    
    const steps = [
      { icon: '🧠', label: 'Parsing your request…' },
      { icon: '🔍', label: 'Scout Agent querying 30 stores…' },
      { icon: '📦', label: 'Checking live inventory…' },
      { icon: '🗺', label: 'Building your route…' },
    ];
    
    setMessages(prev => [...prev, { role: 'user', text: text.trim() }]);
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'ai', agentSteps: steps, agentStep: 0, text: '', stores: [] }]);
    
    // Simulate agent processing steps
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < 3) {
        setMessages(prev => { const c=[...prev]; c[c.length-1]={...c[c.length-1], agentStep: currentStep}; return c; });
      }
    }, 500);

    // Call actual backend API
    const response = await fetchShoppingRecommendations(text);
    
    clearInterval(stepInterval);
    
    // Show final mapping step
    setMessages(prev => { const c=[...prev]; c[c.length-1]={...c[c.length-1], agentStep: 3}; return c; });
    await new Promise(r => setTimeout(r, 400));
    
    setMessages(prev => { const c=[...prev]; c[c.length-1]={ role:'ai', agentSteps:steps, agentStep:steps.length, text:response.text, stores:response.stores, navigation: response.rawIntent?.navigation }; return c; });
    setLoading(false);
  }, [loading]);

  const handleKey = (e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } };
  const newChat = () => { setMessages([GREETING]); setInput(''); };

  return (
    <>
      <Head>
        <title>MallMind — AI Concierge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0a0a0f" />
      </Head>

      <div style={{ display:'flex', height:'100dvh', overflow:'hidden', position:'relative' }}>
        {/* Desktop sidebar — hidden on mobile */}
        {!isMobile && <Drawer messages={messages} onNewChat={newChat} open={true} onClose={()=>{}} isMobile={false} />}
        {/* Mobile bottom drawer */}
        {isMobile && <Drawer messages={messages} onNewChat={newChat} open={drawerOpen} onClose={() => setDrawerOpen(false)} isMobile={true} />}

        {/* Main */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

          {/* Top bar */}
          <div style={{
            flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:`env(safe-area-inset-top, 0px) 14px 0`,
            height:`calc(${isMobile ? 54 : 60}px + env(safe-area-inset-top, 0px))`,
            paddingLeft: isMobile ? 12 : 22, paddingRight: isMobile ? 12 : 22,
            background:'rgba(10,10,15,0.88)', backdropFilter:'blur(16px)',
            borderBottom:'1px solid var(--border)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:'env(safe-area-inset-top,0px)' }}>
              {isMobile && (
                <button onClick={() => setDrawerOpen(true)} style={{ width:38, height:38, borderRadius:11, background:'rgba(255,255,255,0.06)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', color:'var(--white)', flexShrink:0 }}>☰</button>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--teal)', boxShadow:'0 0 8px var(--teal)' }}/>
                <span style={{ fontSize:isMobile?'0.82rem':'0.85rem', fontWeight:600 }}>Live Session</span>
              </div>
              {!isMobile && <><span style={{ color:'var(--border)' }}>·</span><span style={{ fontSize:'0.78rem', color:'var(--white50)' }}>30 stores indexed</span></>}
            </div>
            <div style={{ display:'flex', gap:7, paddingTop:'env(safe-area-inset-top,0px)' }}>
              {[{icon:'🗺',label:'Route',action:()=>setShowMap(true)},{icon:'👗',label:'Try-On',action:()=>setShowTryOn(true)}].map(b=>(
                <button key={b.label} onClick={b.action} style={{ padding: isMobile?'7px 11px':'7px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', borderRadius:9, color:'var(--white80)', fontSize:'0.78rem', cursor:'pointer', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
                  {b.icon}{!isMobile && ` ${b.label}`}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding: isMobile?'14px 12px':'22px 26px', WebkitOverflowScrolling:'touch' }}>
            {messages.map((msg,i) => <Message key={i} msg={msg} isMobile={isMobile} />)}
            <div ref={bottomRef} style={{ height:6 }} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: isMobile?'0 12px 8px':'0 26px 8px', display:'flex', gap:7, overflowX:'auto', flexWrap:'nowrap', WebkitOverflowScrolling:'touch', msOverflowStyle:'none', scrollbarWidth:'none' }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)} style={{ padding: isMobile?'8px 14px':'7px 13px', borderRadius:999, flexShrink:0, background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', color:'var(--white80)', fontSize: isMobile?'0.82rem':'0.78rem', cursor:'pointer', whiteSpace:'nowrap' }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input — thumb-friendly, safe-area-aware */}
          <div style={{
            flexShrink:0, padding: isMobile?'10px 12px':'10px 20px',
            paddingBottom: isMobile ? 'max(10px, env(safe-area-inset-bottom, 10px))' : '14px',
            borderTop:'1px solid var(--border)',
            background:'rgba(10,10,15,0.7)', backdropFilter:'blur(12px)',
          }}>
            <div style={{ display:'flex', gap:8, alignItems:'flex-end', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius: isMobile?24:16, padding: isMobile?'10px 8px 10px 16px':'10px 8px 10px 18px', transition:'border-color 0.2s' }}
              onFocusCapture={e=>e.currentTarget.style.borderColor='rgba(245,166,35,0.45)'}
              onBlurCapture={e=>e.currentTarget.style.borderColor='var(--border)'}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="What are you looking for…"
                rows={1}
                style={{
                  flex:1, background:'none', border:'none', outline:'none',
                  color:'var(--white)', fontFamily:'var(--font-body)',
                  fontSize:'16px', /* 16px stops iOS zoom on focus */
                  resize:'none', lineHeight:1.5, maxHeight:90, overflowY:'auto',
                  WebkitAppearance:'none',
                }}
                onInput={e => { e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight,90)+'px'; }}
              />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()||loading} style={{
                width: isMobile?46:40, height: isMobile?46:40, borderRadius: isMobile?16:12,
                border:'none', cursor:'pointer',
                background: input.trim()&&!loading ? 'linear-gradient(135deg,var(--gold),var(--amber))' : 'rgba(255,255,255,0.08)',
                color: input.trim()&&!loading ? '#0a0a0f' : 'var(--white50)',
                fontSize: isMobile?'1.15rem':'1rem', display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.2s', flexShrink:0,
              }}>
                {loading ? '⏳' : '↑'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {showMap    && <MapModal    onClose={()=>setShowMap(false)}    isMobile={isMobile} navigation={messages[messages.length - 1]?.navigation} />}
      {showTryOn  && <TryOnModal  onClose={()=>setShowTryOn(false)}  isMobile={isMobile} />}
    </>
  );
}
