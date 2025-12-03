# HDS Gloves Design System

Een centraal design system voor consistente styling door de hele applicatie.

## 📁 Bestandsstructuur

```
src/lib/
├── design-tokens.ts      # Centrale design tokens (kleuren, spacing, typography)
├── component-styles.ts   # Pre-built component styling utilities
└── design-system-docs.md # Deze documentatie
```

## 🎨 Design Tokens

### Kleuren

```typescript
// Primaire kleuren (grijs/zwart schaal)
primary: {
  50: '#f8f9fa',   // Zeer licht grijs
  ...
  950: '#121212',  // Hoofdkleur donker
}

// Secundaire kleuren (beige/crème schaal)
secondary: {
  50: '#fefefe',
  200: '#fbf9f8',  // Product card achtergrond
  900: '#1a1a1a',  // Button achtergrond
}

// Accent kleuren
accent: {
  red: '#ef4444',
  yellow: '#fbbf24',
  green: '#10b981',
  blue: '#3b82f6',
}
```

### Typography

```typescript
// Font families
fontFamily: {
  avantt: ['var(--font-avantt)', 'system-ui', 'sans-serif'],
  screamer: ['var(--font-screamer)', 'system-ui', 'sans-serif'],
}

// Font sizes (inclusief custom hero sizes)
fontSize: {
  'hero-sm': ['5rem', { lineHeight: '0.8' }],    // 80px - mobile
  'hero-md': ['7.5rem', { lineHeight: '0.8' }],  // 120px - tablet
  'hero-lg': ['9.375rem', { lineHeight: '0.8' }], // 150px - desktop
}
```

## 🧩 Component Styles

### Buttons

```typescript
// Gebruik:
import { buttonStyles, cn } from '@/lib/component-styles';

<button className={cn(
  buttonStyles.base,
  buttonStyles.sizes.md,
  buttonStyles.variants.primary
)}>
  Click me
</button>

// Of gebruik de pre-built combinatie:
import { componentCombinations } from '@/lib/component-styles';

<button className={componentCombinations.primaryButton}>
  Click me
</button>
```

**Beschikbare varianten:**
- `primary` - Donkere achtergrond (hoofdknoppen)
- `secondary` - Lichte achtergrond
- `outline` - Alleen border
- `ghost` - Transparante achtergrond

**Beschikbare maten:**
- `sm` - Klein (px-4 py-2)
- `md` - Medium (px-8 py-3)
- `lg` - Groot (px-10 py-4)

### Typography

```typescript
// Headings
<h1 className={typographyStyles.headings.hero}>Hero Title</h1>
<h2 className={typographyStyles.headings.section}>Section Title</h2>
<h3 className={typographyStyles.headings.subsection}>Subsection</h3>

// Body text
<p className={typographyStyles.body.large}>Large body text</p>
<p className={typographyStyles.body.base}>Base body text</p>
<p className={typographyStyles.body.small}>Small body text</p>

// Prijzen
<span className={typographyStyles.price.current}>€24.95</span>
<span className={typographyStyles.price.original}>€29.95</span>
```

### Cards

```typescript
// Product cards
<div className={cardStyles.product}>
  Product content
</div>

// Content cards
<div className={cardStyles.content}>
  Content
</div>

// Interactive cards
<div className={cardStyles.interactive}>
  Clickable content
</div>
```

### Layout

```typescript
// Container
<div className={layoutStyles.container}>
  <section className={layoutStyles.section}>
    Content
  </section>
</div>

// Product grid
<div className={layoutStyles.productGrid}>
  {products.map(...)}
</div>
```

## 🔧 Tailwind Config

Het design system is geïntegreerd in de Tailwind configuratie:

```typescript
// tailwind.config.ts
import { designTokens } from "./src/lib/design-tokens";

export default {
  theme: {
    extend: {
      colors: {
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
        // ...
      },
      fontSize: designTokens.typography.fontSize,
      // ...
    },
  },
}
```

Dit betekent dat je ook direct Tailwind classes kunt gebruiken:

```html
<!-- Direct Tailwind met design tokens -->
<div class="bg-primary-950 text-secondary-50 p-6 rounded-2xl">
  Content
</div>

<!-- Custom hero font sizes -->
<h1 class="text-hero-sm md:text-hero-md lg:text-hero-lg">
  Hero Title
</h1>
```

## 📝 Gebruik Richtlijnen

### 1. Gebruik altijd design tokens

❌ **Niet doen:**
```typescript
<button className="bg-[#1a1a1a] hover:bg-[#121212] text-white px-8 py-3 rounded-full">
```

✅ **Wel doen:**
```typescript
<button className={cn(buttonStyles.base, buttonStyles.variants.primary, buttonStyles.sizes.md)}>
```

### 2. Combineer utilities met cn()

```typescript
import { cn } from '@/lib/component-styles';

<div className={cn(
  cardStyles.product,
  "w-80 md:w-auto", // Extra Tailwind classes
  isActive && "ring-2 ring-primary-500" // Conditionele styling
)}>
```

### 3. Extend het systeem

Voeg nieuwe tokens toe in `design-tokens.ts`:

```typescript
export const designTokens = {
  colors: {
    // Voeg nieuwe kleuren toe
    tertiary: {
      500: '#your-color',
    },
  },
}
```

En gebruik ze in `component-styles.ts`:

```typescript
export const newComponentStyles = {
  special: 'bg-tertiary-500 text-white',
}
```

## 🎯 Voordelen

1. **Consistentie** - Alle componenten gebruiken dezelfde design tokens
2. **Onderhoudbaarheid** - Wijzig kleuren/spacing op één plek
3. **Type Safety** - TypeScript zorgt voor correcte usage
4. **Performance** - Geen duplicate CSS door herbruikbare utilities
5. **Developer Experience** - Autocomplete en IntelliSense support

## 🔄 Migratie van Bestaande Code

Om bestaande componenten te migreren:

1. Import de styling utilities
2. Vervang hardcoded classes met design system utilities
3. Test de component
4. Herhaal voor alle componenten

Voorbeeld migratie wordt getoond in `hero.tsx`.












