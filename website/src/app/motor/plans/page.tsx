import type { Metadata } from 'next';
import Link from 'next/link';

const products = [
  { insurer: 'Shikhar Insurance Company Ltd.', product: 'Vehicle Insurance', verified: '14 July 2026', source: 'https://shikharinsurance.com/products/vehicle-insurance', facts: ['Official page describes comprehensive and third-party liability options.', 'The page lists accidental physical damage and third-party bodily injury/property liability within comprehensive cover.', 'Official exclusions include driving without a licence, intoxication and accidents outside the stated geographical area.'] },
  { insurer: 'Siddhartha Premier Insurance Ltd.', product: 'Vehicle Insurance', verified: '3 August 2026', source: 'https://siddharthapremier.com.np/?p=152', facts: ['Official product directory describes comprehensive and third-party vehicle insurance.', 'The insurer states the product is available for cars, bikes and commercial vehicles.', 'Final scope and price must be confirmed in the current insurer wording and proposal.'] },
];

export const metadata: Metadata = { title: 'Verified Motor Insurance Product Sources', description: 'Source-backed motor insurance product information from official insurer pages in Nepal.', alternates: { canonical: '/motor/plans' } };

export default function MotorPlansPage() {
  return <div className="container" style={{ maxWidth: 920, paddingTop: '4rem', paddingBottom: '5rem' }}><p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>SOURCE LIBRARY</p><h1 className="heading-1">Verified motor product information</h1><p className="text-muted" style={{ margin: '1rem 0 2rem' }}>This is a source library, not a price ranking. Only claims visible on an official insurer page are summarized.</p>
    <div style={{ display: 'grid', gap: '1rem' }}>{products.map(item => <article className="card" style={{ padding: '1.5rem' }} key={item.insurer}><p style={{ color: 'var(--success)', fontWeight: 700, fontSize: '.75rem' }}>OFFICIAL SOURCE REVIEWED {item.verified.toUpperCase()}</p><h2 className="heading-3">{item.insurer}: {item.product}</h2><ul className="text-muted" style={{ paddingLeft: '1.2rem', margin: '1rem 0' }}>{item.facts.map(fact => <li key={fact}>{fact}</li>)}</ul><a href={item.source} target="_blank" rel="noreferrer">Open official product source</a></article>)}</div>
    <p className="text-muted" style={{ marginTop: '2rem' }}>For the complete regulator list, see <Link href="/motor/insurers">licensed non-life insurers</Link>. Khaacho will add a plan to price comparison only after authorized rates, effective dates and policy details are supplied.</p>
  </div>;
}
