import { useRef } from 'react';

export default function ChatBox({ value, onChange, onSend, loading, placeholder }) {
  const ref = useRef();

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-end',
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '10px 10px 10px 18px',
      transition: 'border-color 0.2s',
    }}
      onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'}
      onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder || 'Type your message…'}
        rows={1}
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '0.92rem',
          resize: 'none', lineHeight: 1.6, maxHeight: 140, overflowY: 'auto',
        }}
        onInput={e => {
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
        }}
      />
      <button
        onClick={() => onSend(value)}
        disabled={!value.trim() || loading}
        style={{
          width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: value.trim() && !loading
            ? 'linear-gradient(135deg, var(--gold), var(--amber))'
            : 'rgba(255,255,255,0.08)',
          color: value.trim() && !loading ? '#0a0a0f' : 'var(--white50)',
          fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s', flexShrink: 0,
        }}
      >
        {loading ? '⏳' : '↑'}
      </button>
    </div>
  );
}
