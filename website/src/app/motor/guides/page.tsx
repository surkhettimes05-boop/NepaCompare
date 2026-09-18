import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { contentArchitecture } from '@/lib/content-architecture';

export const metadata: Metadata = pageMetadata(
  '/motor/guides',
  'Motor Insurance Guides in Nepal',
  'Explore source-backed guidance on motor insurance in Nepal, including renewal, third-party cover, comprehensive options and FAQs.',
  {
    alternates: { canonical: '/motor/guides', languages: { en: '/motor/guides', ne: '/np/motor/guides', 'x-default': '/motor/guides' } },
  },
);

export default function MotorGuidesIndex() {
  const guides = contentArchitecture.motor.guides;

  return (
    <div className="container" style={{ maxWidth: 980, padding: '4rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '.9rem', marginBottom: '1.5rem' }}>
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/motor">Motor insurance</Link>
        <span aria-hidden="true">/</span>
        <span>Guides</span>
      </nav>

      <header style={{ marginBottom: '2.5rem' }}>
        <p style={{ margin: 0, color: 'var(--primary-accent)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '.8rem' }}>Motor insurance guides</p>
        <h1 className="heading-1" style={{ margin: '0.75rem 0 .75rem' }}>Motor insurance guides in Nepal</h1>
        <p className="text-muted" style={{ maxWidth: 700, fontSize: '1.05rem', lineHeight: 1.7 }}>
          This hub brings together practical, source-aware explanations for the motor insurance decisions customers often research before requesting a quote or renewing a policy.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>Last updated: 18 September 2026</p>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {guides.map((guide) => (
          <article key={guide.slug} className="card" style={{ padding: '1.25rem 1.4rem' }}>
            <p style={{ margin: 0, color: 'var(--primary-accent)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>Guide</p>
            <h2 className="heading-3" style={{ margin: '.5rem 0' }}>{guide.title}</h2>
            <p className="text-muted" style={{ marginBottom: '1rem', lineHeight: 1.7 }}>{guide.description}</p>
            <Link href={guide.href} className="btn btn-ghost" style={{ justifySelf: 'start' }}>Read guide</Link>
          </article>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2.5rem', padding: '1.5rem' }}>
        <h2 className="heading-3">Need a quote or policy help?</h2>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          Educational content is not the same as a guaranteed offer or insurer policy approval. Final coverage, premium and acceptance are determined by the insurer and the policy wording.
        </p>
        <Link href="/wizard/motor" className="btn btn-primary">Get motor insurance help</Link>
      </div>
    </div>
  );
}
