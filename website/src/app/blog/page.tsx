import type { Metadata } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('blog', 'Motor Insurance Guides for Nepal', 'Source-backed motor insurance guides covering comparison, claims, exclusions, renewals and policy wording in Nepal.', { alternates: { languages: { en: '/blog', ne: '/np/blog', 'x-default': '/blog' } } });

export default function BlogIndex() {
  const posts = getSortedPostsData();
  return <div className="container" style={{ padding: '4rem 1rem' }}><header style={{ textAlign: 'center', marginBottom: '3rem' }}><h1 className="heading-1">Motor insurance guides</h1><p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: 680, margin: '1rem auto' }}>Source-backed explanations from regulator and insurer materials. Editorially reviewed; not personal insurance advice.</p><p><Link href="/editorial-policy">Editorial policy</Link> · <Link href="/np/blog">नेपाली सारांश</Link></p></header>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', maxWidth: 1050, margin: '0 auto' }}>{posts.map(post => <Link href={`/blog/${post.slug}`} key={post.slug} style={{ textDecoration: 'none', color: 'inherit' }}><article className="blog-card"><p style={{ color: 'var(--primary-accent)', fontSize: '.8rem', fontWeight: 700 }}>{post.date} · {post.author}</p><h2 className="heading-3" style={{ margin: '.65rem 0' }}>{post.title}</h2><p className="text-muted" style={{ flex: 1 }}>{post.description}</p><span style={{ color: 'var(--primary-accent)', fontWeight: 600, marginTop: '1rem' }}>Read article →</span></article></Link>)}</div>
  </div>;
}
