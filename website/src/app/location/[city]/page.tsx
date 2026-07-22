import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    city: string;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getCities() {
  try {
    const res = await fetch(`${API_URL}/seo/cities`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((city: any) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cities = await getCities();
  const cityData = cities.find((c: any) => c.slug === params.city);
  if (!cityData) return { title: 'City Not Found' };

  const title = `Best Insurance Agents & Quotes in ${cityData.name}, Nepal`;
  const description = `Find the best motor, health, and life insurance policies in ${cityData.name}. Compare rates from top insurers and buy instantly online.`;

  return { title, description };
}

export default async function CityPage({ params }: Props) {
  const cities = await getCities();
  const cityData = cities.find((c: any) => c.slug === params.city);
  if (!cityData) notFound();

  const localSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": `NepaCompare ${cityData.name}`,
    "areaServed": {
      "@type": "City",
      "name": cityData.name,
      "addressCountry": "NP"
    },
    "description": `Insurance comparison service serving ${cityData.name}.`
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      
      <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
            📍 Serving {cityData.name}
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            Compare Insurance in {cityData.name}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Join thousands of residents in {cityData.name} who save money on their insurance premiums every year.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px', margin: '3rem auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚗</div>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>Motor Insurance</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Instant third-party and comprehensive quotes for bikes and cars in {cityData.name}.</p>
            <Link href="/wizard/motor" className="btn btn-primary">Compare Motor</Link>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏥</div>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>Health Insurance</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Find policies covering major hospitals and clinics across the {cityData.name} region.</p>
            <Link href="/wizard/health" className="btn btn-primary">Compare Health</Link>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍👩‍👧‍👦</div>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>Life Insurance</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Secure your family's future with term life policies tailored for you.</p>
            <Link href="/wizard/life" className="btn btn-primary">Compare Life</Link>
          </div>

        </div>

        <div className="card" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '1.5rem' }}>
            Why do {cityData.name} residents choose NepaCompare?
          </h2>
          <p style={{ color: 'var(--text-color)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            With a population of over {cityData.population.toLocaleString()}, {cityData.name} has a high demand for reliable insurance services. Historically, buying insurance meant navigating through one of the estimated {cityData.agentsCount} local agents, often resulting in paying higher commissions.
          </p>
          <p style={{ color: 'var(--text-color)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            NepaCompare digitizes this process. Whether you are looking for <strong>{cityData.popularType || 'insurance'}</strong>, which is currently highly trending in {cityData.name}, our platform allows you to bypass the middlemen and get direct, unbiased quotes.
          </p>
        </div>
      </div>
    </div>
  );
}
