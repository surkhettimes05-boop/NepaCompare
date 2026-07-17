import Link from 'next/link';
import './compare.css';

interface Props {
  params: { vertical: string };
}

export default async function ComparePage({ params }: Props) {
  const vertical = (await params).vertical;
  const title = vertical.charAt(0).toUpperCase() + vertical.slice(1);

  // Mock static rate table data (as per PRD MVP constraints)
  const rateTable = [
    { id: '1', insurer: 'Nepal Life', plan: 'Term Protect Plus', premium: 'NPR 12,500/yr', coverage: '50 Lakhs' },
    { id: '2', insurer: 'Shikhar Insurance', plan: 'Comprehensive Motor', premium: 'NPR 18,200/yr', coverage: 'Full Value' },
    { id: '3', insurer: 'Sagarmatha Health', plan: 'Family Arogya', premium: 'NPR 8,500/yr', coverage: '5 Lakhs' },
  ];

  return (
    <div className="compare-container animate-fade-up">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="heading-1">Compare {title} Insurance</h1>
          <p className="text-muted">Indicative premiums based on standard underwriting profiles.</p>
        </div>

        <div className="comparison-grid">
          {rateTable.map((rate) => (
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
      </div>
    </div>
  );
}
