'use client';

interface ArticleCardProps {
  tag: string;
  readTime: string;
  title: string;
  description: string;
}

export default function ArticleCard({ tag, readTime, title, description }: ArticleCardProps) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem',
        borderRadius: '12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        borderLeft: '4px solid var(--primary-accent)',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <span style={{
          background: 'rgba(59, 130, 246, 0.1)',
          color: 'var(--primary-accent)',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          {tag}
        </span>
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{readTime}</span>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: '1.4', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
        {title}
      </h2>

      <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
        {description}
      </p>

      <span style={{ color: 'var(--primary-accent)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        Read article
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    </div>
  );
}
