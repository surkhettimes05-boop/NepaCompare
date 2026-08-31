import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import ChatWidget from '@/components/ChatWidget';
import WebVitals from '@/components/WebVitals';
import { absoluteUrl, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Compare Insurance in Nepal | Motor, Health & Life | Khaacho',
    template: '%s | Khaacho'
  },
  description: 'Compare sourced, indicative motor insurance information in Nepal and learn how health, life and travel cover works.',
  keywords: ['insurance nepal', 'bike insurance nepal', 'health insurance nepal', 'compare insurance', 'Khaacho'],
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    url: SITE_URL,
    title: 'Compare Insurance in Nepal | Motor, Health & Life',
    description: 'Compare indicative pricing across Motor, Health, and Life insurance in Nepal — free, with no agent pressure.',
    siteName: 'Khaacho',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Insurance in Nepal | Khaacho',
    description: 'Compare sourced, indicative motor insurance information in Nepal.',
  },
  verification: {
    google: 'lO9MCJwjXpsRdukdOtj2j1qRqrJZSmyoYe_cnIduYqU',
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Khaacho',
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    description: 'Independent insurance information and comparison platform for Nepal.'
  };
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Khaacho',
    url: SITE_URL,
    inLanguage: 'en-NP',
  };

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, websiteSchema]) }} />
      </head>
      <body>
        <DisclaimerBanner />
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
        <WebVitals />
      </body>
    </html>
  );
}
