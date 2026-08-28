import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DropoffTracker from '@/components/DropoffTracker';
import QuoteActions from '@/components/QuoteActions';
import './compare.css';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ vertical: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
type Rate = { id: string; insurer: string; plan: string; premium: string; coverage: string; exclusions: string[]; deductible: string; claimRatio?: number | null; sourceUrl: string; verifiedAt: string; rankingReason: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params;
  if (vertical !== 'motor') return {};
  return pageMetadata('compare/motor', 'Motor Insurance Comparison Results', 'Compare sourced, indicative motor insurance plan information for your vehicle.', { robots: { index: false, follow: true } });
}

export default async function ComparePage({ params, searchParams }: Props) {
  const { vertical } = await params;
  if (vertical !== 'motor') notFound();
  const values = await searchParams;
  const safeValues = Object.fromEntries(Object.entries(values).flatMap(([key, value]) => typeof value === 'string' ? [[key, value]] : []));
  const query = new URLSearchParams({ vertical, ...safeValues }).toString();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  let rates: Rate[] = [];
  let serviceUnavailable = false;
  try {
    const response = await fetch(`${apiUrl}/quotes?${query}`, { cache: 'no-store' });
    if (response.ok) rates = await response.json(); else serviceUnavailable = true;
  } catch { serviceUnavailable = true; }

  return <div className="compare-container animate-fade-up"><div className="container">
    <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>MOTOR · INDICATIVE COMPARISON</p>
      <h1 className="heading-1">Compare motor insurance plans</h1>
      <p className="text-muted">Current sourced records appear before price. Final premium and eligibility are confirmed by the insurer.</p>
      <p style={{ marginTop: '.75rem' }}><Link href="/ranking-policy">How ranking works</Link> · <Link href="/wizard/motor">Edit vehicle details</Link></p>
    </header>

    {rates.length === 0 ? <section className="card" style={{ textAlign: 'center', padding: '2.5rem', maxWidth: 720, margin: '0 auto' }}>
      <h2 className="heading-3">{serviceUnavailable ? 'The comparison service is temporarily unavailable' : 'No current verified plans match yet'}</h2>
      <p className="text-muted" style={{ margin: '1rem 0' }}>{serviceUnavailable ? 'Your details were not submitted. Please try again later.' : 'We do not generate placeholder premiums or claim ratios. A result appears only after its source and review date are recorded.'}</p>
      <Link href="/claims" className="btn btn-outline">Find insurer claims contacts</Link> <Link href="/contact" className="btn btn-primary">Request help</Link>
    </section> : <div className="comparison-grid">
      {rates.map((rate, index) => <article key={rate.id} className="compare-card glass-panel" style={{ position: 'relative' }}>
        {index === 0 && <div className="comparison-badge">FIRST BY PUBLISHED METHOD</div>}
        <h2 className="heading-3">{rate.insurer}</h2><p className="plan-name text-gradient">{rate.plan}</p>
        <div className="premium-block"><span className="premium-label">Indicative premium</span><span className="premium-amount">{rate.premium}</span></div>
        <dl className="comparison-details"><div><dt>Coverage</dt><dd>{rate.coverage}</dd></div><div><dt>Deductible</dt><dd>{rate.deductible}</dd></div>{rate.claimRatio != null && <div><dt>Published claim ratio</dt><dd>{rate.claimRatio}%</dd></div>}</dl>
        <div className="exclusions"><strong>Key exclusions</strong>{rate.exclusions.length ? <ul>{rate.exclusions.map(item => <li key={item}>{item}</li>)}</ul> : <p>Confirm in current policy wording.</p>}</div>
        <p className="verification">Verified {new Date(rate.verifiedAt).toLocaleDateString('en-NP')} · <a href={rate.sourceUrl} target="_blank" rel="noreferrer">View source</a></p>
        <p className="text-muted" style={{ fontSize: '.82rem' }}>{rate.rankingReason}</p>
        <Link href={`/get-quote?vertical=motor&plan=${encodeURIComponent(rate.id)}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Continue to insurer request</Link>
        <QuoteActions quote={rate} />
      </article>)}
    </div>}
  </div><DropoffTracker vertical="motor" /></div>;
}
