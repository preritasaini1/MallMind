# MallMind QR Code — Deployment Guide

## How the QR Flow Works

```
Shopper scans QR  →  Phone opens browser  →  /onboard?mall=ambience&floor=entrance
       ↓
  Welcome screen (1 tap)
       ↓
  Quick preferences (10 sec, skippable)
       ↓
  AI launches → /chat
       ↓
  Full concierge experience (PWA — feels like an app, no install needed)
```

## Step 1 — Deploy your site

Push the frontend to Vercel (free):
```bash
cd frontend
npx vercel --prod
# Your URL: https://mallmind.vercel.app
```

## Step 2 — Generate QR codes

Visit `https://yourdomain.com/qr` and click **Print QR Codes**.

Each location gets its own QR pointing to:
```
https://yourdomain.com/onboard?mall=ambience&floor=entrance
https://yourdomain.com/onboard?mall=ambience&floor=f1
https://yourdomain.com/onboard?mall=ambience&floor=f2
... etc
```

## Step 3 — Print & place

- Print on **A4 colour paper**, laminate for durability
- Place at: entrance doors, food court tables, elevator lobbies, store fronts

## Step 4 — Shopper experience

1. Shopper points phone camera at QR → browser opens instantly
2. Welcome screen shows mall name + what MallMind does
3. Optional: 3-tap preference setup (style / budget / intent)
4. AI concierge opens → agents work in real-time
5. Shopper asks naturally: "blue suit under ₹8000 and good coffee"
6. AI returns matched stores, live stock, optimised walking route, deals

## PWA Install (optional for repeat visitors)

When a shopper visits 2+ times, the browser shows **"Add to Home Screen"** automatically.
- iOS: Safari → Share → Add to Home Screen
- Android: Chrome shows install banner automatically

Once installed, it opens full-screen like a native app with:
- Offline splash screen
- No browser address bar
- Native-feeling transitions

## URL Parameters

| Param  | Values                               | Purpose                    |
|--------|--------------------------------------|----------------------------|
| `mall` | `ambience`, `dlf`, `phoenix`         | Which mall database to use |
| `floor`| `entrance`, `gf`, `f1`, `f2`, `f3`  | Where shopper scanned from |

The `floor` param is passed to the Navigator Agent to calculate routes from the exact scan location.

## Customising for different malls

Edit `MALL_INFO` in `pages/onboard.js`:
```js
const MALL_INFO = {
  your_mall: {
    name: 'Your Mall Name',
    city: 'City',
    stores: 50,
    floors: 'GF–F3',
    hours: '10 AM – 9 PM'
  }
}
```

Then generate a QR pointing to:
`https://yourdomain.com/onboard?mall=your_mall&floor=entrance`
