import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'नेपालमा बीमा तुलना', description: 'नेपालमा मोटर बीमासम्बन्धी स्रोतसहितको जानकारी र तुलना।', alternates: { canonical: '/np', languages: { en: '/', ne: '/np', 'x-default': '/' } } };

export default function NepaliHomePage() {
  return <div className="container" lang="ne" style={{ maxWidth: 900, paddingTop: '4rem', paddingBottom: '5rem' }}><p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>नेपाली</p><h1 className="heading-1">बीमा तुलना गर्दा मूल्य मात्र होइन, सर्त पनि हेर्नुहोस्</h1><p className="text-muted" style={{ fontSize: '1.15rem', margin: '1rem 0 2rem' }}>Khaacho ले नेपालमा मोटर बीमाको कभरेज, अपवाद, स्रोत र समीक्षा मिति बुझ्न मद्दत गर्छ। यहाँ देखाइने रकम अन्तिम बीमाशुल्क होइन; अन्तिम निर्णय बीमकले गर्छ।</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}><Link href="/np/motor" className="btn btn-primary">मोटर बीमा बुझ्नुहोस्</Link><Link href="/np/blog" className="btn btn-outline">नेपाली मार्गदर्शिका</Link><Link href="/" className="btn btn-outline">English</Link></div></div>;
}
