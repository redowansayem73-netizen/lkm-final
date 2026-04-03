import Hero from "@/components/home/Hero";
import BrandsGrid from "@/components/home/BrandsGrid";
import ServicesGrid from "@/components/home/ServicesGrid";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Process from "@/components/home/Process";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import { Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";

// ── Homepage-specific SEO metadata ─────────────────────────────
export const metadata: Metadata = {
  title: "Mobile Repair Shop Lakemba | iPhone & Samsung Repair – Lakemba Mobile King",
  description:
    "Looking for a mobile repair shop in Lakemba? Lakemba Mobile King offers expert iPhone repair, Samsung repair, screen replacement, battery fix & mobile accessories at 52 Railway Parade, Lakemba NSW 2195. Open 7 days. Call 0410 807 546.",
  keywords: [
    "mobile repair shop",
    "mobile repair shop Lakemba",
    "phone repair Lakemba",
    "iPhone repair Lakemba",
    "Samsung repair Lakemba",
    "screen replacement Lakemba",
    "battery replacement Lakemba",
    "phone screen repair near me",
    "mobile phone repair Lakemba NSW",
    "phone accessories Lakemba",
    "Lakemba Mobile King",
    "smartphone repair Lakemba",
    "water damage repair Lakemba",
    "tablet repair Lakemba",
    "cheap phone repair Lakemba",
    "same day phone repair Lakemba",
    "walk in phone repair Lakemba",
  ],
  alternates: {
    canonical: "https://lakembamobileking.com.au",
  },
  openGraph: {
    title: "Mobile Repair Shop Lakemba | Lakemba Mobile King",
    description:
      "Lakemba's #1 mobile repair shop. Expert iPhone & Samsung repair, screen replacement, and mobile accessories. Walk-ins welcome, open 7 days a week.",
    url: "https://lakembamobileking.com.au",
    images: [
      {
        url: "/lakemba-logo.png",
        width: 1200,
        height: 630,
        alt: "Lakemba Mobile King – Best Mobile Repair Shop in Lakemba",
      },
    ],
  },
  twitter: {
    title: "Mobile Repair Shop Lakemba | Lakemba Mobile King",
    description:
      "Expert phone repair in Lakemba NSW. Screen replacement, battery fix, same-day repairs. Open 7 days.",
  },
};

// ── JSON-LD Structured Data ────────────────────────────────────
function StructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["MobilePhoneStore", "LocalBusiness"],
    name: "Lakemba Mobile King",
    alternateName: "LMK - Mobile Repair Shop Lakemba",
    description:
      "Expert mobile repair shop in Lakemba, NSW. We specialise in iPhone repair, Samsung repair, screen replacement, battery replacement, water damage repair and sell mobile phone accessories. Open 7 days a week with walk-in service.",
    url: "https://lakembamobileking.com.au",
    telephone: "+61410807546",
    email: "info@lakembamobileking.com.au",
    image: "https://lakembamobileking.com.au/lakemba-logo.png",
    logo: "https://lakembamobileking.com.au/lakemba-logo.png",
    priceRange: "$$",
    currenciesAccepted: "AUD",
    paymentAccepted: "Cash, Credit Card, Debit Card, EFTPOS",
    address: {
      "@type": "PostalAddress",
      streetAddress: "52 Railway Parade",
      addressLocality: "Lakemba",
      addressRegion: "NSW",
      postalCode: "2195",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.9185,
      longitude: 151.0753,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "14:00",
        closes: "23:00",
      },
    ],
    areaServed: [
      {
        "@type": "City",
        name: "Lakemba",
      },
      {
        "@type": "City",
        name: "Belmore",
      },
      {
        "@type": "City",
        name: "Wiley Park",
      },
      {
        "@type": "City",
        name: "Punchbowl",
      },
      {
        "@type": "City",
        name: "Bankstown",
      },
      {
        "@type": "State",
        name: "New South Wales",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Mobile Repair Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "iPhone Screen Replacement",
            description: "Professional iPhone screen repair and replacement service in Lakemba",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Samsung Screen Replacement",
            description: "Expert Samsung Galaxy screen repair and replacement in Lakemba",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Battery Replacement",
            description: "Fast mobile phone battery replacement for all brands",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Water Damage Repair",
            description: "Water damage diagnostic and repair for smartphones and tablets",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile Accessories",
            description: "Phone cases, screen protectors, chargers and accessories in Lakemba",
          },
        },
      ],
    },
    sameAs: [
      "https://www.facebook.com/lakembamobileking",
      "https://www.instagram.com/lakembamobileking",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "230",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lakemba Mobile King",
    alternateName: "LMK",
    url: "https://lakembamobileking.com.au",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://lakembamobileking.com.au/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lakembamobileking.com.au",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="overflow-x-hidden" itemScope itemType="https://schema.org/WebPage">
        {/* 1. Hero Section with Quick Quote */}
        <Hero />

        {/* 2. Brands Grid - Trust signals immediately after hero */}
        <section className="bg-white pt-4 pb-0 border-b border-gray-100" aria-label="Brands We Repair">
          <BrandsGrid />
        </section>

        {/* 3. Why Choose Us - Value Proposition */}
        <WhyChooseUs />

        {/* 4. Reviews Carousel - Social Proof */}
        <ReviewsCarousel />

        {/* 5. Services Grid - Main Business Offerings */}
        <ServicesGrid />

        {/* 6. Process - How it works */}
        <Process />

        {/* 7. CTA Section - Final push to visit */}
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden" aria-label="Visit Our Mobile Repair Shop in Lakemba">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 text-xs font-bold tracking-wider mb-6">
              WAITING FOR YOU
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Visit Lakemba Mobile King</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              We are open 7 days a week. Walk-ins welcome for instant repairs. No appointment needed.
            </p>

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-4xl mx-auto">
              {/* Location Card */}
              <address className="flex-1 bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group cursor-pointer hover:-translate-y-1 not-italic">
                <div className="flex flex-col items-center gap-4 h-full justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Our Location</span>
                    <p className="font-bold text-2xl mb-1">52 Railway Parade</p>
                    <p className="text-lg text-gray-300">Lakemba, NSW 2195</p>
                    <a href="https://maps.google.com/?q=52+Railway+Parade+Lakemba+NSW+2195" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-brand-yellow hover:text-white transition-colors text-sm font-bold">Get Directions →</a>
                  </div>
                </div>
              </address>

              {/* Contact Card */}
              <div className="flex-1 bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all group cursor-pointer hover:-translate-y-1">
                <div className="flex flex-col items-center gap-4 h-full justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-amber-500 rounded-2xl flex items-center justify-center text-gray-900 shadow-lg group-hover:scale-110 transition-transform">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Call Us Now</span>
                    <p className="text-3xl font-bold mb-1">0410 807 546</p>
                    <p className="text-lg text-gray-300">Open 2pm - 11pm</p>
                    <a href="tel:0410807546" className="inline-block mt-4 text-brand-yellow hover:text-white transition-colors text-sm font-bold" aria-label="Call Lakemba Mobile King at 0410 807 546">Call Now →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
