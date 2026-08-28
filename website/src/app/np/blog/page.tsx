import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'नेपाली मोटर बीमा मार्गदर्शिका', description: 'मोटर बीमा, नवीकरण, दाबी र बीमक तुलना सम्बन्धी नेपाली मार्गदर्शिका।', alternates: { canonical: '/np/blog', languages: { en: '/blog', ne: '/np/blog', 'x-default': '/blog' } } };

const guides = [
  ['तेस्रो-पक्ष र व्यापक बीमाको फरक', 'अरूलाई भएको दायित्व र आफ्नै सवारीको कभरेज एउटै होइन।'],
  ['दाबीपछि तयार गर्ने कागजात', 'बीमालेख, दर्ता, लाइसेन्स, फोटो, प्रहरी कागजात र बिल सुरक्षित राख्नुहोस्।'],
  ['नवीकरणअघि जाँचसूची', 'सवारी विवरण, प्रयोग, दाबी इतिहास, अपवाद र अन्तिम शुल्क फेरि जाँच्नुहोस्।'],
  ['बीमक कसरी तुलना गर्ने', 'प्राधिकरणको सूची, आधिकारिक बीमालेख, दाबी पहुँच र समान कभरेजको मूल्य तुलना गर्नुहोस्।'],
  ['EV बीमामा सोध्ने प्रश्न', 'ब्याट्री, चार्जर, पानी, आगलागी, टोइङ र मूल्यह्रास स्पष्ट गराउनुहोस्।'],
];

export default function NepaliBlogPage() { return <div className="container" lang="ne" style={{ maxWidth: 900, paddingTop: '4rem', paddingBottom: '5rem' }}><h1 className="heading-1">नेपाली मोटर बीमा मार्गदर्शिका</h1><p className="text-muted" style={{ margin: '1rem 0 2rem' }}>स्रोतसहितका छोटा परिचय। विस्तृत लेखहरू हाल अंग्रेजीमा उपलब्ध छन्; पूर्ण नेपाली अनुवाद प्रकाशनअघि भाषिक समीक्षा गरिनेछ।</p><div style={{ display: 'grid', gap: '1rem' }}>{guides.map(([title, body]) => <article className="card" style={{ padding: '1.5rem' }} key={title}><h2 className="heading-3">{title}</h2><p className="text-muted">{body}</p></article>)}</div><p style={{ marginTop: '2rem' }}><Link href="/blog">विस्तृत अंग्रेजी लेखहरू हेर्नुहोस्</Link></p></div>; }
