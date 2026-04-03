import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/session-provider";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { DynamicFavicon } from "@/components/layout/DynamicFavicon";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"], variable: "--font-poppins", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#265795",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lakembamobileking.com.au"),

  title: {
    default: "Mobile Repair Shop Lakemba | Lakemba Mobile King – Phone Repair & Accessories",
    template: "%s | Lakemba Mobile King",
  },
  description:
    "Lakemba's #1 mobile repair shop. Expert iPhone, Samsung & smartphone repair in Lakemba NSW. Screen replacement, battery fix, water damage repair. Walk-ins welcome, 7 days. Call 0410 807 546.",
  keywords: [
    "mobile repair shop",
    "mobile repair shop Lakemba",
    "phone repair Lakemba",
    "iPhone repair Lakemba",
    "Samsung repair Lakemba",
    "screen replacement Lakemba",
    "battery replacement Lakemba",
    "smartphone repair Lakemba NSW",
    "phone screen fix near me",
    "mobile phone accessories Lakemba",
    "Lakemba Mobile King",
    "phone repair shop near Lakemba",
    "water damage repair Lakemba",
    "iPad repair Lakemba",
    "phone repair 2195",
  ],
  authors: [{ name: "Lakemba Mobile King" }],
  creator: "Lakemba Mobile King",
  publisher: "Lakemba Mobile King",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://lakembamobileking.com.au",
    siteName: "Lakemba Mobile King",
    title: "Mobile Repair Shop Lakemba | Lakemba Mobile King – Phone Repair & Accessories",
    description:
      "Lakemba's #1 mobile repair shop. Expert iPhone, Samsung & smartphone repair. Screen replacement, battery fix, water damage repair. Walk-ins welcome 7 days.",
    images: [
      {
        url: "/lakemba-logo.png",
        width: 1200,
        height: 630,
        alt: "Lakemba Mobile King – Mobile Repair Shop in Lakemba NSW",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    title: "Mobile Repair Shop Lakemba | Lakemba Mobile King",
    description:
      "Expert phone repair in Lakemba NSW. iPhone, Samsung, screen replacement, battery fix. Open 7 days. Call 0410 807 546.",
    images: ["/lakemba-logo.png"],
  },

  // Icons (static fallback – overridden dynamically by DynamicFavicon)
  icons: {
    icon: "/favicon.ico",
    apple: "/lakemba-logo.png",
  },

  // Alternates
  alternates: {
    canonical: "https://lakembamobileking.com.au",
  },

  // Verification (placeholders – set real values in Admin Settings)
  // verification: {
  //   google: "your-google-verification-code",
  // },

  // Category
  category: "Mobile Phone Repair",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <DynamicFavicon />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="geo.region" content="AU-NSW" />
        <meta name="geo.placename" content="Lakemba" />
        <meta name="geo.position" content="-33.9185;151.0753" />
        <meta name="ICBM" content="-33.9185, 151.0753" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} ${outfit.variable} ${inter.className}`} suppressHydrationWarning>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
