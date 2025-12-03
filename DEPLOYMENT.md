# 🚀 Deployment Guide - HDS Gloves

## Pre-Deployment Checklist

### ✅ Vereisten
- [ ] WooCommerce webshop draait
- [ ] 3 producten aangemaakt in WooCommerce
- [ ] Mollie account met live API key
- [ ] Vercel account

---

## 1️⃣ WooCommerce Setup

### Producten aanmaken:
1. Ga naar WooCommerce > Producten > Nieuw
2. Maak 3 producten aan met deze namen:
   - **1+1 GRATIS** (2 paar)
   - **POPULAIR: 2+1 GRATIS** (3 paar) 
   - **BESTE DEAL: 3+2 GRATIS** (5 paar)

3. Noteer de Product IDs (bijv. 123, 124, 125)

### API Credentials genereren:
1. WooCommerce > Instellingen > Geavanceerd > REST API
2. Klik "Sleutel toevoegen"
3. Beschrijving: "HDS Gloves Webshop"
4. Gebruiker: Selecteer admin
5. Rechten: **Lezen/Schrijven**
6. Kopieer de Consumer Key en Secret

---

## 2️⃣ Mollie Setup

### Webhook configureren:
1. Log in op Mollie Dashboard
2. Ga naar Instellingen > Webhooks
3. Voeg toe: `https://jouw-vercel-url.vercel.app/api/webhooks/mollie`
4. Zorg dat webhook **actief** is

### Live API Key:
- Je live key: `live_R4tqQM9VQSGJR2zAJcg2capEa2dHr8`
- Test NOOIT met live key in development!

---

## 3️⃣ Vercel Deployment

### A. Environment Variables instellen:

Ga naar Vercel Dashboard > Project > Settings > Environment Variables

```bash
# WooCommerce
NEXT_PUBLIC_REST_API_ENDPOINT=https://jouw-woocommerce.nl/wp-json/wc/v3
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxx
NEXT_PUBLIC_CURRENCY=EUR

# Mollie (LIVE KEY!)
MOLLIE_API_KEY=live_R4tqQM9VQSGJR2zAJcg2capEa2dHr8

# Webhook URL (pas aan na eerste deployment)
NEXT_PUBLIC_WEBHOOK_URL=https://hdsgloves.vercel.app
```

### B. Deploy naar Vercel:

**Optie 1: Via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Optie 2: Via GitHub**
1. Push code naar GitHub
2. Importeer in Vercel
3. Vercel detecteert Next.js automatisch
4. Klik "Deploy"

### C. Na eerste deployment:
1. Kopieer de Vercel URL (bijv. `hdsgloves.vercel.app`)
2. Update `NEXT_PUBLIC_WEBHOOK_URL` in Vercel env vars
3. Update webhook URL in Mollie Dashboard
4. Redeploy (Vercel > Deployments > ... > Redeploy)

---

## 4️⃣ Custom Domain (optioneel)

### Domain koppelen:
1. Vercel > Project > Settings > Domains
2. Voeg toe: `hdsgloves.nl` en `www.hdsgloves.nl`
3. Update DNS bij je domain provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wacht op DNS propagatie (max 48 uur)
5. SSL certificaat wordt automatisch gegenereerd

---

## 5️⃣ Post-Deployment Checks

### Test de volledige flow:
- [ ] Homepage laadt correct
- [ ] Producten tonen juiste prijzen
- [ ] Toevoegen aan winkelwagen werkt
- [ ] Checkout formulier werkt
- [ ] iDEAL betaling werkt (test met €0.01)
- [ ] Webhook wordt ontvangen
- [ ] Order wordt aangemaakt in WooCommerce
- [ ] Success pagina toont order details

### Monitor logs:
```bash
vercel logs --follow
```

---

## 🔧 Troubleshooting

### Producten laden niet:
- Check WooCommerce API credentials
- Verify product IDs in code
- Check CORS instellingen WooCommerce

### Betaling faalt:
- Verify Mollie live API key
- Check webhook URL is correct
- Check Mollie Dashboard > Payments voor errors

### Webhook werkt niet:
- Verify webhook URL is publiek toegankelijk
- Check Vercel logs voor errors
- Test webhook met Mollie Dashboard > Webhooks > Test

---

## 📞 Support

Bij problemen:
- Check Vercel logs
- Check Mollie Dashboard
- Check WooCommerce logs
- Email: info@hdsgloves.nl

---

## 🎉 Success!

Je webshop is nu live op productie! 🚀

Volgende stappen:
1. Test grondig met kleine bedragen
2. Monitor eerste echte bestellingen
3. Setup analytics (Google Analytics, etc.)
4. Marketing campagnes starten
