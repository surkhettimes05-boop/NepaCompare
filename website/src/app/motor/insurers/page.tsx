import type { Metadata } from 'next';

const insurers = ['Nepal Insurance Company Ltd.', 'The Oriental Insurance Company Ltd.', 'Rastriya Beema Company Ltd.', 'National Insurance Company Ltd.', 'United Ajod Insurance Limited', 'Neco Insurance Company Ltd.', 'Sagarmatha Lumbini Insurance Company Limited', 'Prabhu Insurance Ltd.', 'IGI Prudential Insurance Limited', 'Shikhar Insurance Company Ltd.', 'NLG Insurance Company Ltd.', 'Siddhartha Premier Insurance Ltd.', 'Himalayan Everest Insurance Limited', 'Sanima GIC Insurance Limited'];

export const metadata: Metadata = { title: 'Licensed Non-Life Insurers in Nepal', description: 'The non-life insurers currently listed by the Nepal Insurance Authority, with links to authoritative sources.', alternates: { canonical: '/motor/insurers' } };

export default function MotorInsurersPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Non-life insurers listed by the Nepal Insurance Authority', itemListElement: insurers.map((name, index) => ({ '@type': 'ListItem', position: index + 1, name })) };
  return <div className="container" style={{ maxWidth: 900, paddingTop: '4rem', paddingBottom: '5rem' }}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>VERIFIED DIRECTORY</p><h1 className="heading-1">Non-life insurers listed in Nepal</h1><p className="text-muted" style={{ margin: '1rem 0' }}>The Nepal Insurance Authority currently displays these 14 non-life insurers. Inclusion here does not mean every company offers every motor product or that Khaacho has a partnership.</p>
    <p className="text-muted" style={{ fontSize: '.85rem', marginBottom: '2rem' }}>Source reviewed 3 August 2026: <a href="https://nia.gov.np/" target="_blank" rel="noreferrer">Nepal Insurance Authority</a>.</p>
    <ol style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '.75rem', paddingLeft: '1.5rem' }}>{insurers.map(name => <li key={name} className="card" style={{ padding: '1rem 1.25rem' }}>{name}</li>)}</ol>
    <section className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}><h2 className="heading-3">Before choosing an insurer</h2><p className="text-muted">Confirm the company and product directly with the regulator and insurer. Compare current policy wording, exclusions, deductible, claims contact, service availability and final premium—not name recognition alone.</p></section>
  </div>;
}
