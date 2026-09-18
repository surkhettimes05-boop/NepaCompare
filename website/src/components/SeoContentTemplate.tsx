import Link from 'next/link';

export type ContentSection = {
  title: string;
  body: React.ReactNode;
};

export type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function SeoContentTemplate({
  title,
  description,
  updated,
  breadcrumbs,
  sections,
  faq = [],
  sourceLabel,
  sourceUrl,
  quoteHref = '/wizard/motor',
  quoteLabel = 'Get a quote',
  intro,
  notice,
}: {
  title: string;
  description: string;
  updated: string;
  breadcrumbs: BreadcrumbItem[];
  sections: ContentSection[];
  faq?: FAQItem[];
  sourceLabel?: string;
  sourceUrl?: string;
  quoteHref?: string;
  quoteLabel?: string;
  intro?: string;
  notice?: string;
}) {
  const pageUrl = 'https://www.khaacho.com' + (typeof window === 'undefined' ? '' : window.location.pathname);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://www.khaacho.com${item.href}` : pageUrl,
    })),
  };

  const faqSchema = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: typeof item.answer === 'string' ? item.answer : item.question,
          },
        })),
      }
    : null;

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    dateModified: updated,
    breadcrumb: breadcrumbSchema,
  };

  return (
    <article className="container" style={{ maxWidth: 980, padding: '4rem 1rem 5rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([pageSchema, breadcrumbSchema, faqSchema].filter(Boolean)) }} />

      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '.9rem' }}>
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {item.href ? (
              <Link href={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <span aria-hidden="true"> / </span>}
          </span>
        ))}
      </nav>

      <header style={{ marginBottom: '2.25rem' }}>
        <p style={{ margin: 0, color: 'var(--primary-accent)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '.78rem' }}>
          Educational guide
        </p>
        <h1 className="heading-1" style={{ marginTop: '.75rem', marginBottom: '.75rem' }}>{title}</h1>
        {intro ? <p className="text-muted" style={{ maxWidth: 760, fontSize: '1.08rem', lineHeight: 1.7 }}>{intro}</p> : <p className="text-muted" style={{ maxWidth: 760, fontSize: '1.08rem', lineHeight: 1.7 }}>{description}</p>}
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '.9rem' }}>Last updated: {updated}</p>
      </header>

      {notice && (
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', background: 'rgba(20, 118, 255, 0.04)', border: '1px solid rgba(20, 118, 255, 0.12)' }}>
          <strong>Important:</strong> {notice}
        </div>
      )}

      <div style={{ display: 'grid', gap: '2rem' }}>
        {sections.map((section) => (
          <section key={section.title} className="card" style={{ padding: '1.5rem 1.5rem 1.1rem' }}>
            <h2 className="heading-3" style={{ marginBottom: '1rem' }}>{section.title}</h2>
            <div className="text-muted" style={{ lineHeight: 1.75 }}>{section.body}</div>
          </section>
        ))}
      </div>

      {faq.length > 0 && (
        <section aria-label="Frequently asked questions" style={{ marginTop: '2.5rem' }}>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Frequently asked questions</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {faq.map((item) => (
              <div className="card" key={item.question} style={{ padding: '1rem 1.25rem' }}>
                <h3 className="heading-4" style={{ marginBottom: '.5rem' }}>{item.question}</h3>
                <div className="text-muted" style={{ lineHeight: 1.7 }}>{item.answer}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="card" style={{ marginTop: '2.5rem', padding: '1.5rem', display: 'grid', gap: '1rem' }}>
        <div>
          <strong>Source attribution</strong>
          <p className="text-muted" style={{ marginTop: '.35rem', marginBottom: 0 }}>
            {sourceUrl && sourceLabel ? (
              <>
                Reviewed using: <a href={sourceUrl} target="_blank" rel="noreferrer">{sourceLabel}</a>
              </>
            ) : (
              'Source details are included where the content depends on official insurer or regulator material.'
            )}
          </p>
        </div>
        <Link href={quoteHref} className="btn btn-primary" style={{ justifySelf: 'start' }}>
          {quoteLabel}
        </Link>
      </div>
    </article>
  );
}
