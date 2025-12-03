# Mollie MCP Server Setup

Deze MCP server geeft je toegang tot Mollie payment operaties via Model Context Protocol.

## 🚀 Installatie

De dependencies zijn al geïnstalleerd:
- ✅ `@modelcontextprotocol/sdk`
- ✅ `@mollie/api-client`
- ✅ `tsx` (TypeScript runner)

## 🔧 Configuratie

De server gebruikt je bestaande `MOLLIE_API_KEY` uit `.env.local`:

```env
MOLLIE_API_KEY=test_xxxxx  # Of live_xxxxx voor productie
```

## 📋 Beschikbare Tools

### 1. **get_payment**
Haal details op van een specifieke betaling:
```json
{
  "paymentId": "tr_xxxxx"
}
```

### 2. **list_payments**
Lijst recente betalingen:
```json
{
  "limit": 10
}
```

### 3. **create_payment**
Maak een nieuwe betaling:
```json
{
  "amount": {
    "value": "10.00",
    "currency": "EUR"
  },
  "description": "Test betaling",
  "redirectUrl": "https://jouwsite.nl/return",
  "webhookUrl": "https://jouwsite.nl/webhook"
}
```

### 4. **cancel_payment**
Annuleer een betaling:
```json
{
  "paymentId": "tr_xxxxx"
}
```

### 5. **create_refund**
Maak een refund:
```json
{
  "paymentId": "tr_xxxxx",
  "amount": {
    "value": "5.00",
    "currency": "EUR"
  }
}
```

## 🏃 Server Starten

### Optie 1: Direct via npm
```bash
npm run mcp:mollie
```

### Optie 2: Via npx
```bash
npx tsx mcp-server-mollie.ts
```

## 🧪 Testen

### Test met een recente betaling:
```bash
# Start de server
npm run mcp:mollie

# In een andere terminal, gebruik de MCP client om te testen
# (De server luistert op stdio, dus je hebt een MCP client nodig)
```

### Handmatig testen via je checkout:
1. Start je Next.js app: `npm run dev`
2. Ga naar checkout en maak een test betaling
3. Gebruik de MCP server om de betaling op te halen met het payment ID

## 🔍 Debugging

De server logt naar stderr, dus je ziet:
```
Mollie MCP server running on stdio
```

Errors worden ook naar stderr gelogd.

## 📊 Gebruik in Claude Desktop

Voeg toe aan je Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` op Mac):

```json
{
  "mcpServers": {
    "mollie": {
      "command": "npm",
      "args": ["run", "mcp:mollie"],
      "cwd": "/path/to/premium-exfoliating-gloves-ecommerce",
      "env": {
        "MOLLIE_API_KEY": "test_xxxxx"
      }
    }
  }
}
```

## ✅ Wat kun je nu doen?

Met deze MCP server kun je:
- ✅ Betalingen opvragen en controleren
- ✅ Nieuwe test betalingen maken
- ✅ Betalingen annuleren
- ✅ Refunds verwerken
- ✅ Betaalstatussen monitoren
- ✅ Debugging van je checkout flow

## 🎯 Voorbeeld Workflow

1. **Maak een test bestelling** via je checkout
2. **Haal de betaling op** met `get_payment` en het payment ID
3. **Check de status** (paid, open, canceled, etc.)
4. **Test refunds** met `create_refund`
5. **Monitor betalingen** met `list_payments`

## 🔐 Security

- De server draait lokaal en gebruikt stdio (geen network exposure)
- API key wordt veilig geladen uit environment variables
- Gebruik `test_` keys voor development
- Gebruik `live_` keys alleen voor productie

## 📝 Notes

- De server is type-safe met TypeScript
- Alle responses zijn in JSON format
- Errors worden netjes afgehandeld
- Compatible met Mollie API v2
