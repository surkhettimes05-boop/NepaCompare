import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'Compare Insurance in Nepal | Motor, Health & Life',
  description: 'Find the best insurance policies in Nepal. Compare motor, health, life, and travel insurance premiums instantly and save money.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
