import localFont from 'next/font/local';

// Avantt font for headers and navigation
export const avantt = localFont({
  src: [
    {
      path: '../fonts/avant/AvanttTRIAL-Light-BF6721a86aa5f5e.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/avant/AvanttTRIAL-Regular-BF6721a86b1a848.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/avant/AvanttTRIAL-Medium-BF6721a86adebb3.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/avant/AvanttTRIAL-SemiBold-BF6721a86b1576e.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/avant/AvanttTRIAL-Bold-BF6721a86b15f0a.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-avantt',
  display: 'swap',
});

// FK Screamer font family - used by Loop Earplugs for main content
export const fkScreamer = localFont({
  src: [
    {
      path: '../fonts/screamer/FKScreamerTrial-Regular-BF6571330a60d38.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/screamer/FKScreamerTrial-Medium-BF6571330a5823d.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/screamer/FKScreamerTrial-Bold-BF6571330a76e9b.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/screamer/FKScreamerTrial-Black-BF65713309d368f.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-fk-screamer',
  display: 'swap',
});

// FK Screamer Legacy for special text elements
export const fkScreamerLegacy = localFont({
  src: [
    {
      path: '../fonts/screamer/FKScreamerLegacyTrial-Upright-BF6571330a902da.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/screamer/FKScreamerLegacyTrial-Slanted-BF6571330a9078d.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-fk-screamer-legacy',
  display: 'swap',
});
