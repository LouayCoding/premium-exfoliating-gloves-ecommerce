// Complete Design System - Based on current implementation
export const designSystem = {
  // Colors - All colors used in the project
  colors: {
    // Text colors
    text: {
      primary: '#121212',      // Main text (navbar, titles, prices)
      secondary: '#6b7280',    // Secondary text (reviews, descriptions) 
      white: '#ffffff',        // White text (hero, buttons)
      muted: '#9ca3af',        // Muted text (empty stars)
      dark: '#1f2937',         // Dark text (navigation hover)
    },
    
    // Background colors
    background: {
      primary: '#ffffff',      // Main white background
      secondary: '#fbf9f8',    // Beige/cream (product cards)
      dark: '#1a1a1a',        // Dark background (topbar, buttons)
      darker: '#121212',       // Darker (button hover)
      overlay: '#000000',      // Black overlay (mobile menu)
    },
    
    // Accent colors
    accent: {
      yellow: '#fbbf24',       // Stars rating
      red: '#ef4444',          // Badges, cart counter
      blue: '#3b82f6',         // Netherlands flag
      green: '#10b981',        // Success/checkmarks
    },
    
    // Interactive states
    hover: {
      text: '#6b7280',         // Text hover state
      background: '#f9fafb',   // Background hover
      button: '#121212',       // Button hover
    }
  },
  
  // Typography
  typography: {
    // Font families
    fonts: {
      primary: 'avantt',       // Main font (UI, buttons, text)
      display: 'screamer',     // Display font (hero titles)
      legacy: 'screamer-legacy' // Legacy screamer font
    },
    
    // Font sizes (in px for reference)
    sizes: {
      xs: '12px',     // text-xs
      sm: '14px',     // text-sm (topbar, reviews)
      base: '16px',   // text-base (buttons)
      lg: '18px',     // text-lg
      xl: '20px',     // text-xl (hero subtitle mobile)
      '2xl': '24px',  // text-2xl (hero subtitle desktop, product titles)
      '3xl': '30px',  // text-3xl (navbar logo desktop)
      '4xl': '36px',  // text-4xl
      '5xl': '48px',  // text-5xl (section titles mobile)
      '6xl': '60px',  // text-6xl (section titles desktop)
      hero: {
        mobile: '80px',   // Hero title mobile
        tablet: '120px',  // Hero title tablet
        desktop: '150px'  // Hero title desktop
      }
    },
    
    // Font weights
    weights: {
      normal: '400',    // font-normal
      medium: '500',    // font-medium (hero title, section titles)
      semibold: '600',  // font-semibold (buttons)
      bold: '700',      // font-bold (product titles, navbar logo)
    },
    
    // Line heights
    lineHeights: {
      tight: '1.25',    // leading-tight
      normal: '1.5',    // leading-normal
      relaxed: '1.625', // leading-relaxed
      hero: '0.8',      // leading-[0.8] (hero title)
    }
  },
  
  // Spacing
  spacing: {
    // Padding
    padding: {
      xs: '4px',      // p-1
      sm: '8px',      // p-2
      base: '16px',   // p-4 (navbar, general)
      md: '24px',     // p-6
      lg: '32px',     // p-8 (product cards)
      xl: '40px',     // p-10 (button horizontal)
      '2xl': '48px',  // p-12 (hero padding)
    },
    
    // Margins
    margin: {
      xs: '4px',      // mb-1
      sm: '8px',      // mb-2
      base: '16px',   // mb-4
      md: '24px',     // mb-6 (hero elements)
      lg: '32px',     // mb-8 (button spacing)
      xl: '48px',     // mb-12 (section title)
    },
    
    // Gaps
    gap: {
      xs: '4px',      // gap-1
      sm: '8px',      // gap-2 (topbar, rating)
      base: '16px',   // gap-4
      md: '24px',     // gap-6 (product grid desktop)
      lg: '32px',     // gap-8 (product grid mobile, navigation)
    }
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',        // rounded
    base: '8px',      // rounded-lg
    lg: '12px',       // rounded-xl
    xl: '16px',       // rounded-2xl (product cards, hero)
    full: '9999px',   // rounded-full (buttons, badges)
  },
  
  // Shadows (currently minimal/none)
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms',    // Quick interactions
    base: '200ms',    // Standard transitions
    slow: '300ms',    // Slower animations
  }
} as const;
