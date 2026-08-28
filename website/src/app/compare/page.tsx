import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Compare Insurance', description: 'Choose an insurance product to compare in Nepal.', alternates: { canonical: '/compare' } };

const products = [
  { name: 'Motor', description: 'Complete comparison journey for bikes and cars.', href: '/wizard/motor', available: true },
  { name: 'Health', description: 'Educational preview while verified plan data is prepared.', href: '/health', available: false },
  { name: 'Life', description: 'Educational preview while verified plan data is prepared.', href: '/life', available: false },
  { name: 'Travel', description: 'Educational preview while verified plan data is prepared.', href: '/travel', available: false },
];

export default function CompareLandingPage() {
  return <div className="container" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-24)' }}>
    <header style={{ maxWidth: 720, marginBottom: 'var(--space-12)' }}>
      <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-xs', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>CHOOSE A PRODUCT</p>
      <h1 className="heading-1">What would you like to compare?</h1>
      <p className="text-muted" style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}>Motor comparison is available in early access. Other products remain educational until their data and journeys meet the same standard.</p>
    </header>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
      {products.map(product => <article key={product.name} className="card" style={{ padding: 'var(--space-8)', transition: 'all var(--transition-base)' }}>
        <span className={`badge ${product.available ? 'badge-success' : 'badge-warning'}`} style={{ marginBottom: 'var(--space-3)' }}>{product.available ? 'AVAILABLE' : 'IN PREPARATION'}</span>
        <h2 className="heading-3" style={{ marginTop: 'var(--space-2', marginBottom: 'var(--space-2)' }}>{product.name} insurance</h2>
        <p className="text-muted" style={{ margin: '0 0 var(--space-6)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{product.description}</p>
        <Link className={`btn ${product.available ? 'btn-primary' : 'btn-secondary'}`} href={product.href} style={{ width: '100%' }}>{product.available ? `Compare ${product.name}` : 'Learn more'}</Link>
      </article>)}
    </div>
  </div>;
}
