import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import ChatWidget from '@/components/ChatWidget';
import WebVitals from '@/components/WebVitals';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.khaacho.com'),
  title: {
    default: 'Compare Insurance in Nepal | Motor, Health & Life | Khaacho',
    template: '%s | Khaacho'
  },
  description: 'Compare sourced, indicative motor insurance information in Nepal and learn how health, life and travel cover works.',
  keywords: ['insurance nepal', 'bike insurance nepal', 'health insurance nepal', 'compare insurance', 'Khaacho'],
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    url: '/',
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
    canonical: '/',
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
    url: 'https://www.khaacho.com',
    logo: 'https://www.khaacho.com/favicon.ico',
    description: 'Independent insurance information and comparison platform for Nepal.'
  };

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
