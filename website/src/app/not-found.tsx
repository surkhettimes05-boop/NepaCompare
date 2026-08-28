import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page Not Found', robots: { index: false, follow: true } };

export default function NotFound() {
  return <div className="container" style={{ minHeight: '60vh', padding: '6rem 1rem', textAlign: 'center' }}>
    <p style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>404</p>
    <h1 className="heading-1">This page could not be found</h1>
    <p className="text-muted" style={{ margin: '1rem auto 2rem', maxWidth: 520 }}>The address may be outdated or the page may have moved.</p>
    <Link href="/" className="btn btn-primary">Go to homepage</Link>
  </div>;
}