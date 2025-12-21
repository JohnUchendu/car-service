import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import Brands from "@/components/Brands";

// ✅ Page-specific metadata (extends layout metadata)
export const metadata: Metadata = {
  title: "Premium Car Painting & Detailing Services | Refinish By Cleaning Pro Solution Services Port Harcourt",
  description: "Expert car painting, ceramic coating, chrome delete & auto detailing in Port Harcourt. Transform your vehicle with professional craftsmanship. 21+ 5-star reviews. Serving all of Rivers State.",
  keywords: [
    "car painting near me & in Port Harcourt",
    "auto detailing  near me & in Port Harcourt", 
    "ceramic coating service near me & in port harcourt",
    "chrome delete  near me & in Port Harcourt",
    "car body repair near me & in Rivers State",
    "vehicle protection film",
    "oven-baked painting Nigeria",
    "car interior cleaning near me & in Port Harcourt",
    "professional detailing near me",
    "car paint restoration near me & in Port Harcourt",
    "mobile detailing Port Harcourt",
    "paint protection film Nigeria",
    "window tinting Port Harcourt",
    "car polishing service"
  ],
  openGraph: {
    type: "website",
    title: "Premium Car Painting & Detailing Services | Refinish By Cleaning Pro Solution Services", 
    description: "Expert car painting, ceramic coating, chrome delete & auto detailing in Port Harcourt. Satisfaction guaranteed.",
    url: "https://refinishphc.com",
    siteName: "Refinish By Pro Cleaning Solution Services",
    locale: "en_NG",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Refinish By Cleaning Pro Solution Services - Premium Car Painting & Detailing Services in Port Harcourt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Car Painting & Detailing Services | Refinish By Cleaning Pro Solution Services Port Harcourt",
    description: "Expert car painting, ceramic coating, chrome delete & auto detailing in Port Harcourt. 21+ 5-star reviews.",
    images: ["/og.jpg"],
    creator: "@",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://refinishphc.com",
  },
  other: {
    // Additional page-specific meta tags
    "article:published_time": "2024-01-01T00:00:00+01:00",
    "article:modified_time": new Date().toISOString(),
    "article:author": "Refinish Pro",
    "article:section": "Automotive Services",
    "article:tag": ["Car Painting", "Auto Detailing", "Ceramic Coating", "Chrome Delete"],
  },
};

// ✅ Additional Structured Data for Homepage
const homepageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Premium Car Painting & Detailing Services | Refinish Pro",
  "description": "Expert car painting, ceramic coating, chrome delete & auto detailing services in Port Harcourt, Rivers State.",
  "url": "https://refinishphc.com",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://refinishphc.com"
      }
    ]
  },
  "mainEntity": {
    "@type": "AutoRepair",
    "name": "Refinish By Cleaning Pro Solution Services",
    "description": "Professional car painting, detailing, ceramic coating, and chrome delete services in Port Harcourt.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Port Harcourt",
      "addressRegion": "Rivers State",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 4.8156,
      "longitude": 7.0498
    },
    "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-16:00",
    "telephone": "+2348012345678",
    "priceRange": "₦₦₦",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "21",
      "bestRating": "5",
      "worstRating": "1"
    }
  }
};

export default function Home() {
  return (
    <>
      {/* ✅ Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      
      {/* ✅ Main Content */}
      <main className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Brands />
        <ProblemSolution />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <ContactCTA />
        <Footer />
      </main>
    </>
  );
}