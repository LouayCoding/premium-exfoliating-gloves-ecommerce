# Setup Instructies

## WooCommerce Configuratie

### Stap 1: Genereer WooCommerce API Keys

1. Log in op je WordPress admin panel
2. Ga naar **WooCommerce > Instellingen > Geavanceerd > REST API**
3. Klik op **Sleutel toevoegen**
4. Vul in:
   - **Beschrijving**: Next.js Website
   - **Gebruiker**: Selecteer een admin gebruiker
   - **Rechten**: Lezen/Schrijven
5. Klik op **Sleutel genereren**
6. Kopieer de **Consumer Key** en **Consumer Secret** (je kunt deze maar 1 keer zien!)

### Stap 2: Configureer Environment Variables

1. Open het bestand `.env.local` in de root van het project
2. Vul je WooCommerce credentials in:

```env
NEXT_PUBLIC_REST_API_ENDPOINT=https://jouwwebsite.nl/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=ck_jouw_consumer_key_hier
WOOCOMMERCE_CONSUMER_SECRET=cs_jouw_consumer_secret_hier
```

### Stap 3: Start de Development Server

```bash
npm run dev
```

De website is nu beschikbaar op http://localhost:3000

## Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### "WooCommerce credentials niet geconfigureerd"
- Check of `.env.local` bestaat en de juiste credentials bevat
- Herstart de development server na het aanpassen van `.env.local`

### "WooCommerce authenticatie gefaald"
- Controleer of de Consumer Key en Secret correct zijn
- Check of de API Key niet is verlopen in WooCommerce

### "WooCommerce API endpoint niet gevonden"
- Controleer of `NEXT_PUBLIC_REST_API_ENDPOINT` correct is ingesteld
- Zorg dat het eindigt op `/wp-json/wc/v3`
- Test de URL in je browser: `https://jouwwebsite.nl/wp-json/wc/v3`
