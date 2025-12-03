'use client';

export function Topbar() {
  return (
    <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#1a1a1a] text-sm py-2 px-4 flex items-center justify-center gap-2 font-avantt font-semibold">
      <span>Gratis verzending</span>
      <button 
        className="underline hover:no-underline transition-all duration-200"
        onClick={() => {
          const shopSection = document.getElementById('shop');
          if (shopSection) {
            shopSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Shop Nu
      </button>
    </div>
  );
}
