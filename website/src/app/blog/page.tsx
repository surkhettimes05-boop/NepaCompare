import Link from 'next/link';
import type { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'Financial Literacy & Insurance Insights | NepaCompare',
  description: 'Read practical guides on motor, health, and life insurance in Nepal. Understand your options before you buy.',
};

const articles = [
  {
    slug: 'term-life-before-30',
    title: 'Why Your Office Health Insurance is a Trap (And Why You Need Term Life Before 30)',
    description:
      'Learn why relying on corporate insurance is dangerous and how a personal Term Life policy saves you money on premiums — and on your tax bill.',
    tag: 'Life Insurance',
    readTime: '5 min read',
  },
];

export default function BlogIndexPage() {
  return (
    <div style={{ minHeight: '80vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Page Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ color: 'var(--primary-accent)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Resources
          </p>
          <h1 className="heading-1" style={{ marginBottom: '1rem' }}>
            Financial Literacy &amp; Insurance Insights
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px' }}>
            Plain-language guides to help you understand Nepal&apos;s insurance landscape — so you can make confident decisions without an agent pushing you.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '3rem' }} />

        {/* Article List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ArticleCard
                tag={article.tag}
                readTime={article.readTime}
                title={article.title}
                description={article.description}
              />
            </Link>
          ))}
        </div>

        {/* Coming Soon */}
        <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            More guides coming soon — covering motor insurance NCB, health policy waiting periods, and how to read a term life policy document.
          </p>
        </div>

      </div>
    </div>
  );
}
