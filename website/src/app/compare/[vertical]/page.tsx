import Link from 'next/link';
import './compare.css';

interface Props {
  params: { vertical: string };
}

export default async function ComparePage({ params, searchParams }: any) {
  const vertical = (await params).vertical;
  const title = vertical.charAt(0).toUpperCase() + vertical.slice(1);
  const searchParamsAwaited = await searchParams;

  // Build query string from all search params (e.g. age, cc)
  const query = new URLSearchParams({ vertical, ...searchParamsAwaited }).toString();
  
  // Fetch dynamic quotes from backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  let rateTable = [];
  try {
    const res = await fetch(`${apiUrl}/quotes?${query}`, { next: { revalidate: 0 } });
    if (res.ok) {
      rateTable = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
  }

  return (
    <div className="compare-container animate-fade-up">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-1">Compare {title} Insurance</h1>
          <p className="text-muted">Indicative premiums based on standard underwriting profiles.</p>
        </div>

        {rateTable.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
            <p className="text-muted">No quotes available for your specific criteria right now.</p>
            <Link href="/" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>Go Back</Link>
          </div>
        ) : (
          <div className="comparison-grid">
            {rateTable.map((rate: any) => (
              <div key={rate.id} className="compare-card glass-panel">
                <h2 className="heading-3">{rate.insurer}</h2>
                <p className="plan-name text-gradient">{rate.plan}</p>
                
                <div className="premium-block">
                  <span className="premium-label">Est. Premium</span>
                  <span className="premium-amount">{rate.premium}</span>
                </div>
                
                <ul className="coverage-list">
                  <li>Coverage: <strong>{rate.coverage}</strong></li>
                  <li>Cashless Network: <strong>Yes</strong></li>
                  <li>Claim Settlement: <strong>92%</strong></li>
                </ul>

                <Link href={`/get-quote?vertical=${vertical}&plan=${rate.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                  Get This Quote
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
