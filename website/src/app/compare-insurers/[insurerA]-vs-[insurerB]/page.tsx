import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    insurerA: string;
    insurerB: string;
  };
};

async function getInsurers() {
  try {
    const res = await fetch('http://localhost:3001/seo/insurers', { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function generateStaticParams() {
  const insurers = await getInsurers();
  const params: { insurerA: string; insurerB: string }[] = [];
  
  for (let i = 0; i < insurers.length; i++) {
    for (let j = 0; j < insurers.length; j++) {
      if (i !== j) {
        params.push({
          insurerA: insurers[i].slug,
          insurerB: insurers[j].slug
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const insurers = await getInsurers();
  const compA = insurers.find((i: any) => i.slug === params.insurerA);
  const compB = insurers.find((i: any) => i.slug === params.insurerB);

  if (!compA || !compB) return { title: 'Comparison Not Found' };

  const title = `${compA.name} vs ${compB.name} | Which is better in Nepal? (2026)`;
  const description = `Compare ${compA.name} and ${compB.name} side-by-side. Look at claim settlement ratios, network branches, and premium pricing before you buy in Nepal.`;

  return { title, description };
}

export default async function VersusPage({ params }: Props) {
  const insurers = await getInsurers();
  const compA = insurers.find((i: any) => i.slug === params.insurerA);
  const compB = insurers.find((i: any) => i.slug === params.insurerB);

  if (!compA || !compB) notFound();

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase' }}>
            Head to Head Comparison
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            {compA.name} <span style={{ color: 'var(--primary-accent)' }}>VS</span> {compB.name}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Which insurance company is better for your needs in Nepal? We compare claim ratios, branch networks, and pricing.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px', margin: '3rem auto' }}>
        <div className="card" style={{ overflow: 'hidden', marginBottom: '3rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1.5rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Feature</th>
                <th style={{ padding: '1.5rem', fontSize: '1.2rem', color: 'var(--primary-color)' }}>{compA.name}</th>
                <th style={{ padding: '1.5rem', fontSize: '1.2rem', color: 'var(--primary-color)' }}>{compB.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>Established</td>
                <td style={{ padding: '1.5rem' }}>{compA.founded || 'N/A'}</td>
                <td style={{ padding: '1.5rem' }}>{compB.founded || 'N/A'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>Branch Network</td>
                <td style={{ padding: '1.5rem' }}>{compA.branches ? `${compA.branches}+ Branches` : 'N/A'}</td>
                <td style={{ padding: '1.5rem' }}>{compB.branches ? `${compB.branches}+ Branches` : 'N/A'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>Claim Settlement Ratio</td>
                <td style={{ padding: '1.5rem', color: (compA.claimRatio || 0) >= (compB.claimRatio || 0) ? 'green' : 'inherit', fontWeight: (compA.claimRatio || 0) >= (compB.claimRatio || 0) ? 600 : 400 }}>
                  {compA.claimRatio ? `${compA.claimRatio}%` : 'N/A'}
                </td>
                <td style={{ padding: '1.5rem', color: (compB.claimRatio || 0) >= (compA.claimRatio || 0) ? 'green' : 'inherit', fontWeight: (compB.claimRatio || 0) >= (compA.claimRatio || 0) ? 600 : 400 }}>
                  {compB.claimRatio ? `${compB.claimRatio}%` : 'N/A'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--text-color)' }}>Digital Locker Support</td>
                <td style={{ padding: '1.5rem' }}>✅ Yes (via NepaCompare)</td>
                <td style={{ padding: '1.5rem' }}>✅ Yes (via NepaCompare)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '1rem' }}>
            Should you choose {compA.name} or {compB.name}?
          </h2>
          <p style={{ color: 'var(--text-color)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            When comparing <strong>{compA.name}</strong> and <strong>{compB.name}</strong>, the most critical factor for Nepali consumers is the claim settlement ratio. {compA.name} boasts a settlement ratio of {compA.claimRatio || 'an estimated 80'}%, while {compB.name} sits at {compB.claimRatio || 'an estimated 80'}%.
          </p>
          <p style={{ color: 'var(--text-color)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Additionally, if you live outside the Kathmandu valley, you should consider the branch network. With {compA.branches || 'many'} branches, {compA.name} might offer better local support depending on your province compared to {compB.name}'s {compB.branches || 'many'} branches.
          </p>
        </div>

        <div style={{ background: '#f8fafc', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '2px solid var(--primary-color)' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', marginBottom: '1rem' }}>
            See Exact Prices for Both
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Don't guess. Enter your vehicle details and see exactly how much {compA.name} and {compB.name} will charge you for premium insurance today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/wizard/motor" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Compare Bike Rates
            </Link>
            <Link href="/wizard/motor" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem', background: 'white', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
              Compare Car Rates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
