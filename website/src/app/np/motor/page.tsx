import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'नेपालमा मोटर बीमा', description: 'तेस्रो-पक्ष र व्यापक मोटर बीमाको फरक, आवश्यक कागजात र तुलना गर्ने तरिका।', alternates: { canonical: '/np/motor', languages: { en: '/motor', ne: '/np/motor', 'x-default': '/motor' } } };

export default function NepaliMotorPage() {
  return <article className="container" lang="ne" style={{ maxWidth: 820, paddingTop: '4rem', paddingBottom: '5rem' }}><p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>मोटर बीमा</p><h1 className="heading-1">मोटर बीमा तुलना गर्ने आधार</h1><p className="text-muted" style={{ margin: '1rem 0 2rem' }}>यो सामान्य जानकारी हो, व्यक्तिगत बीमा सल्लाह होइन। बीमालेख, प्रस्ताव र अन्तिम शुल्क सम्बन्धित बीमकबाट पुष्टि गर्नुहोस्।</p>
    <section className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}><h2 className="heading-3">तेस्रो-पक्ष र व्यापक बीमा</h2><p className="text-muted">तेस्रो-पक्ष बीमाले बीमित सवारीबाट अरू व्यक्तिलाई भएको कभर्ड शारीरिक वा सम्पत्तिको क्षति समेट्न सक्छ। व्यापक बीमाले सर्तअनुसार आफ्नै सवारीको आकस्मिक क्षति पनि थप्न सक्छ। “व्यापक” भनेको सबै घटना समेटिन्छ भन्ने होइन।</p></section>
    <section className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}><h2 className="heading-3">तुलना गर्दा जाँच्नुहोस्</h2><ul className="text-muted" style={{ paddingLeft: '1.2rem' }}><li>बीमक नेपाल बीमा प्राधिकरणको सूचीमा छ कि छैन</li><li>कभरेज र मुख्य अपवाद</li><li>कटौतीयोग्य रकम र मूल्यह्रास</li><li>सवारीको घोषित प्रयोग</li><li>दाबी सम्पर्क र प्रक्रिया</li><li>स्रोत र अन्तिम समीक्षा मिति</li></ul></section>
    <p className="text-muted">मुख्य स्रोत: <a href="https://nia.gov.np/" target="_blank" rel="noreferrer">नेपाल बीमा प्राधिकरण</a>, <a href="https://shikharinsurance.com/products/vehicle-insurance" target="_blank" rel="noreferrer">शिखर इन्स्योरेन्सको सवारी बीमा पृष्ठ</a>।</p><div style={{ marginTop: '2rem' }}><Link href="/wizard/motor" className="btn btn-primary">मोटर तुलना सुरु गर्नुहोस्</Link> <Link href="/motor" className="btn btn-outline">English version</Link></div>
  </article>;
}
