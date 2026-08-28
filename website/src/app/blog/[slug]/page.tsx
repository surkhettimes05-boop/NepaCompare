import type { Metadata } from 'next';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getSortedPostsData().map(post => ({ slug: post.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const post = getPostData(slug); if (!post) return {};
  return { title: post.title, description: post.description, alternates: { canonical: `/blog/${slug}` }, openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date, modifiedTime: post.reviewedDate, authors: [post.author] }, twitter: { card: 'summary_large_image', title: post.title, description: post.description } };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; const post = getPostData(slug); if (!post) notFound();
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.khaacho.com';
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, datePublished: post.date, dateModified: post.reviewedDate, inLanguage: post.language, mainEntityOfPage: `${site}/blog/${slug}`, author: { '@type': 'Organization', name: post.author, url: `${site}/authors/editorial-team` }, reviewedBy: { '@type': 'Organization', name: post.reviewedBy, url: `${site}/reviewers/research-desk` }, publisher: { '@type': 'Organization', name: 'Khaacho', url: site }, citation: post.sources.map(source => source.url) };
  return <article className="container" style={{ maxWidth: 860, paddingTop: '4rem', paddingBottom: '5rem' }}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header style={{ marginBottom: '2rem' }}><p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>MOTOR INSURANCE GUIDE</p><h1 className="heading-1">{post.title}</h1><p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>{post.description}</p>
      <div className="card" style={{ padding: '1rem', marginTop: '1.5rem', fontSize: '.85rem' }}><p>Written by <Link href="/authors/editorial-team">{post.author}</Link> · Reviewed by <Link href="/reviewers/research-desk">{post.reviewedBy}</Link></p><p className="text-muted">Published {post.date} · Reviewed {post.reviewedDate} · {post.reviewStatus}</p></div>
    </header>
    <div className="card markdown-content" style={{ padding: '2rem', lineHeight: 1.8 }}><ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown></div>
    <section className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}><h2 className="heading-3">Primary sources</h2>{post.sources.length ? <ol style={{ paddingLeft: '1.2rem', marginTop: '.75rem' }}>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ol> : <p className="text-muted">No primary sources recorded. This article is withheld from the current publication set.</p>}</section>
    <p style={{ marginTop: '2rem' }}><Link href="/blog">← All motor insurance guides</Link></p>
  </article>;
}
