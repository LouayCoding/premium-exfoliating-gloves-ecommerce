// Component Style Utilities
// Consistent styling patterns for HDS Gloves components

import { designTokens, componentTokens } from './design-tokens';

// Button styles
export const buttonStyles = {
  // Base button styles
  base: 'font-avantt font-semibold rounded-full transition-colors duration-200 inline-flex items-center justify-center',
  
  // Size variants
  sizes: {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-xl',
  },
  
  // Color variants
  variants: {
    primary: 'bg-secondary-900 hover:bg-primary-950 text-white',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-primary-950',
    outline: 'border border-primary-950 text-primary-950 hover:bg-primary-950 hover:text-white',
    ghost: 'text-primary-950 hover:bg-secondary-100',
  },
} as const;

// Typography styles
export const typographyStyles = {
  // Headings
  headings: {
    hero: 'font-screamer font-medium text-hero-sm md:text-hero-md lg:text-hero-lg leading-[0.8] text-white tracking-normal',
    section: 'font-avantt font-medium text-4xl md:text-5xl lg:text-6xl text-primary-950 leading-tight',
    subsection: 'font-avantt font-medium text-3xl md:text-4xl lg:text-5xl text-primary-950 leading-none',
    card: 'font-avantt font-semibold text-3xl text-primary-950',
  },
  
  // Body text
  body: {
    large: 'font-avantt text-lg md:text-xl text-gray-700 leading-relaxed',
    base: 'font-avantt text-base md:text-lg text-gray-700 leading-relaxed',
    small: 'font-avantt text-sm text-gray-600 leading-relaxed',
    xs: 'font-avantt text-xs text-gray-500',
  },
  
  // Special text
  price: {
    current: 'font-avantt font-medium text-xl text-gray-700',
    original: 'font-avantt text-sm text-gray-400 line-through',
  },
  
  // Links
  links: {
    base: 'font-avantt text-gray-600 hover:text-primary-950 transition-colors duration-200 underline',
    button: 'font-avantt font-medium text-primary-950 hover:underline',
  },
} as const;

// Card styles
export const cardStyles = {
  // Product cards
  product: 'bg-secondary-200 rounded-2xl p-8 flex-shrink-0',
  
  // Content cards
  content: 'bg-white rounded-2xl p-6 shadow-md',
  
  // Interactive cards
  interactive: 'bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer',
} as const;

// Layout styles
export const layoutStyles = {
  // Containers
  container: 'max-w-7xl mx-auto px-4',
  section: 'py-16 md:py-20',
  
  // Grids
  productGrid: 'md:grid md:grid-cols-4 md:gap-6 flex md:flex-none overflow-x-auto gap-6 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none scrollbar-hide',
  
  // Flexbox utilities
  centerContent: 'flex items-center justify-center',
  spaceBetween: 'flex items-center justify-between',
} as const;

// Form styles
export const formStyles = {
  // Input fields
  input: 'w-full px-4 py-4 border border-gray-300 rounded-lg font-avantt text-base focus:outline-none focus:ring-2 focus:ring-primary-950 focus:border-transparent',
  
  // Labels
  label: 'font-avantt font-medium text-primary-950 mb-2 block',
  
  // Error states
  error: 'border-error text-error',
  errorMessage: 'font-avantt text-sm text-error mt-1',
} as const;

// Animation styles
export const animationStyles = {
  // Transitions
  smooth: 'transition-all duration-300 ease-in-out',
  fast: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  
  // Hover effects
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverLift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
} as const;

// Utility function to combine styles
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Pre-built component combinations
export const componentCombinations = {
  // Primary button
  primaryButton: cn(
    buttonStyles.base,
    buttonStyles.sizes.md,
    buttonStyles.variants.primary
  ),
  
  // Hero title
  heroTitle: typographyStyles.headings.hero,
  
  // Section title
  sectionTitle: typographyStyles.headings.section,
  
  // Product card
  productCard: cn(
    cardStyles.product,
    'w-80 md:w-auto snap-start'
  ),
  
  // Main container
  mainContainer: cn(
    layoutStyles.container,
    layoutStyles.section
  ),
} as const;
