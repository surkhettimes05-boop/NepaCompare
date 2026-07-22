import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nepa-compare.vercel.app'),
  title: {
    default: 'Compare Insurance in Nepal | Motor, Health & Life | NepaCompare',
    template: '%s | NepaCompare'
  },
  description: 'Find the best insurance policies in Nepal. Compare motor, health, life, and travel insurance premiums instantly and save money with zero agent commissions.',
  keywords: ['insurance nepal', 'bike insurance nepal', 'health insurance nepal', 'compare insurance', 'NepaCompare'],
  openGraph: {
    type: 'website',
    locale: 'en_NP',
    url: '/',
    title: 'Compare Insurance in Nepal | Motor, Health & Life',
    description: 'Compare indicative pricing across Motor, Health, and Life insurance in Nepal — free, with no agent pressure.',
    siteName: 'NepaCompare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Insurance in Nepal | NepaCompare',
    description: 'Find the best insurance policies in Nepal. Compare motor, health, life premiums instantly.',
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
    name: 'NepaCompare',
    url: 'https://nepa-compare.vercel.app',
    logo: 'https://nepa-compare.vercel.app/favicon.ico',
    sameAs: [
      'https://www.facebook.com/nepacompare',
      'https://www.linkedin.com/company/nepacompare'
    ]
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
      </body>
    </html>
  );
}
