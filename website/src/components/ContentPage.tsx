import Link from 'next/link';
import './ContentPage.css';

type Section = { title: string; body: React.ReactNode };

export default function ContentPage({
  eyebrow,
  title,
  intro,
  sections,
  updated = '3 August 2026',
  cta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  updated?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <article className="content-page container">
      <header className="content-hero">
        <p className="content-eyebrow">{eyebrow}</p>
        <h1 className="heading-1">{title}</h1>
        <p className="content-intro">{intro}</p>
        <p className="content-updated">Last updated: {updated}</p>
      </header>
      <div className="content-layout">
        <nav aria-label="On this page" className="content-nav">
          <strong>On this page</strong>
          {sections.map((section) => (
            <a key={section.title} href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{section.title}</a>
          ))}
        </nav>
        <div className="content-sections">
          {sections.map((section) => (
            <section key={section.title} id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <h2 className="heading-2">{section.title}</h2>
              <div>{section.body}</div>
            </section>
          ))}
          {cta && <Link className="btn btn-primary content-cta" href={cta.href}>{cta.label}</Link>}
        </div>
      </div>
    </article>
  );
}
