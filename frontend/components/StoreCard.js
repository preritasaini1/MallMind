import { useState } from 'react';

export default function StoreCard({ store }) {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{
      background: 'var(--bg3)',
      border: `1px solid ${store.inStock ? 'rgba(0,201,167,0.2)' : 'var(--border)'}`,
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      position: 'relative',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
        e.currentTarget.style.borderColor = store.inStock ? 'rgba(0,201,167,0.5)' : 'rgba(255,255,255,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = store.inStock ? 'rgba(0,201,167,0.2)' : 'var(--border)';
      }}
    >
      {/* Color accent band */}
      <div style={{
        height: 4,
        background: store.inStock
          ? 'linear-gradient(90deg, var(--teal), rgba(0,201,167,0.3))'
          : 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)',
      }} />

      <div style={{ padding: '14px 14px 12px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${store.color}33`,
              border: `1px solid ${store.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
            }}>{store.icon}</div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.2 }}>{store.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--white50)' }}>{store.category}</div>
            </div>
          </div>

          <button
            onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.85rem', color: saved ? 'var(--rose)' : 'var(--white50)',
              transition: 'color 0.2s, transform 0.2s',
              transform: saved ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            {saved ? '♥' : '♡'}
          </button>
        </div>

        {/* Item name */}
        <div style={{
          fontSize: '0.78rem', color: 'var(--white80)',
          marginBottom: 10, lineHeight: 1.4,
        }}>{store.item}</div>

        {/* Price & discount */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold)' }}>{store.price}</span>
          {store.discount && (
            <span style={{
              padding: '2px 8px', borderRadius: 999,
              background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)',
              fontSize: '0.65rem', fontWeight: 700, color: 'var(--teal)',
            }}>{store.discount}</span>
          )}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10, fontSize: '0.7rem', color: 'var(--white50)' }}>
            <span>📍 {store.floor}</span>
            <span>🚶 {store.distance}</span>
            <span>⭐ {store.rating}</span>
          </div>

          {/* Stock badge */}
          <div style={{
            padding: '3px 10px', borderRadius: 999,
            background: store.inStock ? 'rgba(0,201,167,0.1)' : 'rgba(255,107,138,0.1)',
            border: `1px solid ${store.inStock ? 'rgba(0,201,167,0.3)' : 'rgba(255,107,138,0.3)'}`,
            fontSize: '0.62rem', fontWeight: 700,
            color: store.inStock ? 'var(--teal)' : 'var(--rose)',
          }}>
            {store.inStock ? '● In Stock' : '○ Low Stock'}
          </div>
        </div>
      </div>
    </div>
  );
}
