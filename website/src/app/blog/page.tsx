import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export const metadata = {
  title: 'Insurance Blog & Guides',
  description: 'Read the latest insurance guides, tips, and news for the Nepali market.',
};

export default function BlogIndex() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>
          Insurance <span style={{ color: 'var(--primary-color)' }}>Blog & Guides</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Expert advice to help you navigate motor, health, and life insurance in Nepal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {allPostsData.map(({ slug, date, title, description, author }) => (
          <Link href={`/blog/${slug}`} key={slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }}
                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {date} • BY {author.toUpperCase()}
              </div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', lineHeight: 1.4 }}>{title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flex: 1, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {description}
              </p>
              <div style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Read Article <span style={{ fontSize: '1.2rem' }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
