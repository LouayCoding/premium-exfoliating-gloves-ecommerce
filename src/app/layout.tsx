import type { Metadata } from "next";
import "./globals.css";
import { Topbar } from "@/components/topbar";
import { Navbar } from "@/components/navbar";
import { Cart } from "@/components/cart";
import { CartProvider } from "@/contexts/cart-context";
import { AppWrapper } from "@/components/app-wrapper";
import { avantt, fkScreamer, fkScreamerLegacy } from "@/lib/fonts";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEBHOOK_URL || 'https://hdsgloves.nl'),
  title: "HDS Gloves - Premium Exfoliating Gloves | Washandjes voor Zijdezachte Huid",
  description: "✨ Ontdek het HDS Washandje™ — professionele exfoliatie voor zijdezachte huid. Premium washandjes voor dode huidcellen verwijdering. Altijd gratis verzending.",
  keywords: "exfoliating gloves, washandjes, huidverzorging, exfoliatie, dode huidcellen, premium washandjes, HDS gloves, zijdezachte huid",
  authors: [{ name: "HDS Gloves" }],
  openGraph: {
    title: "HDS Premium Exfoliating Gloves - Professionele Washandjes",
    description: "Ontdek zijdezachte huid met HDS Premium Exfoliating Gloves. Professionele exfoliatie voor thuis.",
    images: [
      {
        url: "/images/hds-washandjes-premium-exfoliating-gloves-hero.webp",
        width: 1200,
        height: 630,
        alt: "HDS Premium Exfoliating Gloves - Professionele washandjes voor zijdezachte huid",
      },
    ],
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "HDS Premium Exfoliating Gloves",
    description: "Professionele exfoliatie voor zijdezachte huid thuis",
    images: ["/images/hds-washandjes-premium-exfoliating-gloves-hero.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "HDS Gloves",
              "description": "Premium exfoliating gloves voor professionele huidverzorging thuis",
              "url": "https://hdsgloves.nl",
              "logo": "/images/hds-washandjes-premium-exfoliating-gloves-hero.webp",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Dutch"
              },
              "sameAs": [],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "HDS Exfoliating Gloves",
                "itemListElement": [
                  {
                    "@type": "Product",
                    "name": "HDS Premium Exfoliating Gloves",
                    "description": "Professionele washandjes voor exfoliatie en dode huidcellen verwijdering",
                    "image": "/images/hds-exfoliating-gloves-product-showcase.png",
                    "brand": {
                      "@type": "Brand",
                      "name": "HDS Gloves"
                    },
                    "category": "Beauty & Personal Care",
                    "offers": {
                      "@type": "AggregateOffer",
                      "priceCurrency": "EUR",
                      "lowPrice": "24.95",
                      "highPrice": "59.95",
                      "availability": "https://schema.org/InStock"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body
        className={`${avantt.variable} ${fkScreamer.variable} ${fkScreamerLegacy.variable} antialiased font-sans w-full overflow-x-hidden`}
        style={{
          backgroundColor: '#ffffff'
        }}
      >
        <div className="bg-white min-h-screen w-full overflow-x-hidden">
          <AppWrapper>
            <CartProvider>
              <Topbar />
              <Navbar />
              <div className="w-full">
                {children}
              </div>
              <Cart />
            </CartProvider>
          </AppWrapper>
        </div>
      </body>
    </html>
  );
}
