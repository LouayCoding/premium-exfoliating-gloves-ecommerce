# 🧤 HDS Gloves - Premium Exfoliating Gloves Webshop

Modern e-commerce platform voor HDS Premium Exfoliating Gloves, gebouwd met Next.js 16, WooCommerce en Mollie.

## 🚀 Features

- ✅ **Modern Design** - Clean, mobiel-vriendelijk design met gouden accenten
- ✅ **WooCommerce Integratie** - Real-time producten en voorraad
- ✅ **Mollie Betalingen** - iDEAL en andere betaalmethoden
- ✅ **Responsive** - Perfect op alle apparaten
- ✅ **SEO Optimized** - Meta tags, structured data
- ✅ **Performance** - Next.js 16 met optimalisaties

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, GSAP
- **E-commerce:** WooCommerce REST API
- **Payments:** Mollie API
- **Deployment:** Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your credentials
# Then start development server
npm run dev
```

## 🌐 Deployment

Zie [DEPLOYMENT.md](./DEPLOYMENT.md) voor complete deployment instructies.

### Quick Deploy naar Vercel:

```bash
npm run deploy
```

## 📝 Environment Variables

Vereiste environment variables (zie `.env.local.example`):

```bash
NEXT_PUBLIC_REST_API_ENDPOINT=https://jouw-woocommerce.nl/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
MOLLIE_API_KEY=live_xxxxx
NEXT_PUBLIC_WEBHOOK_URL=https://jouw-site.vercel.app
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── checkout/          # Checkout pagina
│   └── algemene-voorwaarden/  # Terms pagina
├── components/            # React components
├── contexts/              # React contexts (cart)
├── lib/                   # Utilities en helpers
│   ├── mollie/           # Mollie integratie
│   └── woocommerce/      # WooCommerce API
└── styles/               # Global styles
```

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📞 Support

- **Email:** info@hdsgloves.nl
- **Website:** https://hdsgloves.nl

## 📄 License

Private - © 2025 HDS Gloves. Alle rechten voorbehouden.
