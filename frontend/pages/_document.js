import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0f" />
        <link rel="icon" href="/favicon.ico" />

        {/* iOS PWA — makes it feel like a native app when added to home screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MallMind" />

        {/* Android PWA */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />

        <meta name="description" content="MallMind – Hyper-Personalized AI Shopping Concierge for Smart Malls" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
