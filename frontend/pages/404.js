import Link from 'next/link';
import Head from 'next/head';

export default function NotFound() {
  return (
    <>
      <Head><title>404 — MallMind</title></Head>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40,
      }}>
        <div className="font-display gradient-text" style={{ fontSize: '6rem', fontWeight: 900, lineHeight: 1 }}>404</div>
        <h2 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 700, margin: '16px 0 8px' }}>Store not found</h2>
        <p style={{ color: 'var(--white50)', marginBottom: 32 }}>Looks like this aisle doesn't exist. Let our AI guide you back.</p>
        <Link href="/"><span className="btn-primary">← Back to MallMind</span></Link>
      </div>
    </>
  );
}
