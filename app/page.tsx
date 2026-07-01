import type { Metadata } from "next"
import { HeroSection } from "@/components/landing/hero-section"
import { TrustStrip } from "@/components/landing/trust-strip"
import { FeatureGrid } from "@/components/landing/feature-grid"
import { ShowcaseSection } from "@/components/landing/showcase-section"
import { VisionSection } from "@/components/landing/vision-section"
import { FinalCtaSection } from "@/components/landing/final-cta"

export const metadata: Metadata = {
  title: "Youbairia | Digital Products, Instant Stores, Courses, Software and Communities",
  description:
    "Youbairia helps people buy and sell digital products, launch instant stores, create communities, sell courses, software, AI tools, ebooks, PDFs, and run marketing campaigns.",
  alternates: {
    canonical: "https://youbairia.com",
  },
  openGraph: {
    title: "Youbairia | Build and sell digital products online",
    description:
      "Create an instant digital storefront for courses, software, AI tools, ebooks, PDFs, communities, and marketing campaigns.",
    url: "https://youbairia.com",
    siteName: "Youbairia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Youbairia | Digital marketplace for internet businesses",
    description:
      "Buy, sell, and launch digital products with instant stores, communities, courses, software, AI tools, ebooks, and campaigns.",
  },
  keywords: [
    "Youbairia",
    "digital marketplace",
    "sell digital products",
    "instant online store",
    "sell courses online",
    "sell software online",
    "AI tools marketplace",
    "community platform",
    "marketing campaigns",
    "sell ebooks",
    "sell PDFs",
  ],
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Youbairia",
  url: "https://youbairia.com",
  description:
    "A digital marketplace for buying, selling, and launching digital products, instant stores, courses, software, AI tools, ebooks, communities, and marketing campaigns.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://youbairia.com/products?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Youbairia",
    url: "https://youbairia.com",
    sameAs: ["https://www.instagram.com/youbairia", "https://www.x.com/youbairia"],
  },
  hasPart: [
    "Courses",
    "Software",
    "AI tools",
    "Marketing campaigns",
    "Communities",
    "Instant stores",
    "Digital products",
  ].map((name) => ({
    "@type": "Service",
    name,
    provider: {
      "@type": "Organization",
      name: "Youbairia",
    },
  })),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
      <TrustStrip />
      <FeatureGrid />
      <ShowcaseSection />
      <VisionSection />
      <FinalCtaSection />
    </>
  )
}
