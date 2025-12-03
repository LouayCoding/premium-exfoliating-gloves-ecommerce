import { Mail } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "Producten", href: "#shop" },
        { name: "Voordelen", href: "#voordelen" },
        { name: "Reviews", href: "#reviews" },
        { name: "FAQ", href: "#faq" }
      ]
    },
    {
      title: "Klantenservice",
      links: [
        { name: "Verzending & Retour", href: "#faq" },
        { name: "30 Dagen Garantie", href: "#garantie" },
        { name: "Veelgestelde Vragen", href: "#faq" },
        { name: "Contact", href: "mailto:info@hdsgloves.nl" }
      ]
    },
    {
      title: "Informatie",
      links: [
        { name: "Over Ons", href: "#about" },
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Algemene Voorwaarden", href: "/algemene-voorwaarden" },
        { name: "Cookie Policy", href: "#cookies" }
      ]
    }
  ];


  return (
    <>
      {/* Main Footer */}
      <footer className="bg-[#121212] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Section */}
            <div className="md:col-span-1">
              <h1 className="text-xl font-bold text-white mb-3 font-avantt">
                HDS Gloves
              </h1>
              <p className="text-gray-400 text-sm mb-4 font-avantt leading-relaxed">
                Premium exfoliating gloves voor professionele huidverzorging.
              </p>
              <a href="mailto:info@hdsgloves.nl" className="text-sm text-gray-400 hover:text-white transition-colors font-avantt">
                info@hdsgloves.nl
              </a>
              
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-avantt font-semibold text-white text-lg mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="font-avantt text-sm text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-sm font-avantt text-gray-400">
                © 2025 HDS Gloves. Alle rechten voorbehouden.
              </div>

              {/* Payment Methods */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400 font-avantt">Betaalmethoden:</span>
                <div className="flex items-center space-x-2">
                  {/* iDEAL */}
                  <div className="h-6 w-10 bg-white rounded border border-gray-600 flex items-center justify-center">
                    <svg viewBox="0 0 40 24" className="h-4 w-6">
                      <rect width="40" height="24" fill="#CC0066"/>
                      <text x="20" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">iDEAL</text>
                    </svg>
                  </div>
                  
                  {/* Visa */}
                  <div className="h-6 w-10 bg-white rounded border border-gray-600 flex items-center justify-center">
                    <svg viewBox="0 0 40 24" className="h-4 w-6">
                      <rect width="40" height="24" fill="#1A1F71"/>
                      <text x="20" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">VISA</text>
                    </svg>
                  </div>
                  
                  {/* Mastercard */}
                  <div className="h-6 w-10 bg-white rounded border border-gray-600 flex items-center justify-center">
                    <svg viewBox="0 0 40 24" className="h-4 w-6">
                      <rect width="40" height="24" fill="white"/>
                      <circle cx="15" cy="12" r="6" fill="#EB001B"/>
                      <circle cx="25" cy="12" r="6" fill="#F79E1B"/>
                      <path d="M20 7.5c1.5 1.2 2.5 3 2.5 4.5s-1 3.3-2.5 4.5c-1.5-1.2-2.5-3-2.5-4.5s1-3.3 2.5-4.5z" fill="#FF5F00"/>
                    </svg>
                  </div>
                  
                  {/* PayPal */}
                  <div className="h-6 w-10 bg-white rounded border border-gray-600 flex items-center justify-center">
                    <svg viewBox="0 0 40 24" className="h-4 w-6">
                      <rect width="40" height="24" fill="#003087"/>
                      <text x="20" y="16" textAnchor="middle" fill="#009CDE" fontSize="7" fontWeight="bold">PayPal</text>
                    </svg>
                  </div>
                  
                  {/* Klarna */}
                  <div className="h-6 w-10 bg-white rounded border border-gray-600 flex items-center justify-center">
                    <svg viewBox="0 0 40 24" className="h-4 w-6">
                      <rect width="40" height="24" fill="#FFB3C7"/>
                      <text x="20" y="16" textAnchor="middle" fill="#000" fontSize="7" fontWeight="bold">Klarna</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
