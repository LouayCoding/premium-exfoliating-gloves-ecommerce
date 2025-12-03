// HDS Gloves Design System
// Centralized design tokens for consistent styling

export const designTokens = {
  // Colors
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#f8f9fa',
      100: '#f1f3f4',
      200: '#e8eaed',
      300: '#dadce0',
      400: '#bdc1c6',
      500: '#9aa0a6',
      600: '#80868b',
      700: '#5f6368',
      800: '#3c4043',
      900: '#202124',
      950: '#121212', // Main dark color
    },
    
    // Secondary Colors
    secondary: {
      50: '#fefefe',
      100: '#fdfdfd',
      200: '#fbf9f8', // Product card background
      300: '#f5f5f5',
      400: '#e5e5e5',
      500: '#d4d4d4',
      600: '#a3a3a3',
      700: '#737373',
      800: '#525252',
      900: '#1a1a1a', // Button background
    },
    
    // Accent Colors
    accent: {
      red: '#ef4444',
      yellow: '#fbbf24',
      green: '#10b981',
      blue: '#3b82f6',
    },
    
    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Typography
  typography: {
    // Font Families
    fontFamily: {
      avantt: ['var(--font-avantt)', 'system-ui', 'sans-serif'],
      screamer: ['var(--font-screamer)', 'system-ui', 'sans-serif'],
      screamerLegacy: ['var(--font-screamer-legacy)', 'system-ui', 'sans-serif'],
    },

    // Font Sizes
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      '5xl': ['3rem', { lineHeight: '1' }],         // 48px
      '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
      '7xl': ['4.5rem', { lineHeight: '1' }],       // 72px
      '8xl': ['6rem', { lineHeight: '1' }],         // 96px
      '9xl': ['8rem', { lineHeight: '1' }],         // 128px
      
      // Custom hero sizes
      'hero-sm': ['5rem', { lineHeight: '0.8' }],   // 80px
      'hero-md': ['7.5rem', { lineHeight: '0.8' }], // 120px
      'hero-lg': ['9.375rem', { lineHeight: '0.8' }], // 150px
    },

    // Font Weights
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    // Letter Spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Transitions
  transitionDuration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  // Z-Index
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
  },

  // Breakpoints
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Component-specific design tokens
export const componentTokens = {
  // Buttons
  button: {
    primary: {
      bg: designTokens.colors.secondary[900],      // #1a1a1a
      bgHover: designTokens.colors.primary[950],   // #121212
      text: '#ffffff',
      padding: {
        sm: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,   // py-2 px-4
        md: `${designTokens.spacing[3]} ${designTokens.spacing[8]}`,   // py-3 px-8
        lg: `${designTokens.spacing[4]} ${designTokens.spacing[10]}`,  // py-4 px-10
      },
      borderRadius: designTokens.borderRadius.full,
      fontSize: {
        sm: designTokens.typography.fontSize.sm,
        md: designTokens.typography.fontSize.base,
        lg: designTokens.typography.fontSize.xl,
      },
    },
  },

  // Cards
  card: {
    product: {
      bg: designTokens.colors.secondary[200],      // #fbf9f8
      borderRadius: designTokens.borderRadius['2xl'],
      padding: designTokens.spacing[8],            // p-8
    },
  },

  // Typography
  heading: {
    hero: {
      fontSize: {
        sm: designTokens.typography.fontSize['hero-sm'],
        md: designTokens.typography.fontSize['hero-md'],
        lg: designTokens.typography.fontSize['hero-lg'],
      },
      lineHeight: '0.8',
      fontFamily: designTokens.typography.fontFamily.screamer,
      fontWeight: designTokens.typography.fontWeight.medium,
    },
    section: {
      fontSize: {
        sm: designTokens.typography.fontSize['4xl'],
        md: designTokens.typography.fontSize['5xl'],
        lg: designTokens.typography.fontSize['6xl'],
      },
      fontFamily: designTokens.typography.fontFamily.avantt,
      fontWeight: designTokens.typography.fontWeight.medium,
      color: designTokens.colors.primary[950],
    },
  },
};












