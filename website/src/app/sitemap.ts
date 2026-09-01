import type { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { absoluteUrl, SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/compare', '/motor', '/health', '/life', '/travel', '/motor/insurers', '/motor/plans', '/how-it-works', '/about', '/contact', '/renew', '/claims', '/privacy', '/terms', '/disclaimer', '/ranking-policy', '/editorial-policy', '/authors/editorial-team', '/reviewers/research-desk', '/blog', '/glossary', '/np', '/np/motor', '/np/blog'] as const;
  const localized: Record<string, Record<string, string>> = {
    '/': { 'en-NP': absoluteUrl('/'), 'ne-NP': absoluteUrl('/np'), 'x-default': absoluteUrl('/') },
    '/motor': { 'en-NP': absoluteUrl('/motor'), 'ne-NP': absoluteUrl('/np/motor'), 'x-default': absoluteUrl('/motor') },
    '/blog': { 'en-NP': absoluteUrl('/blog'), 'ne-NP': absoluteUrl('/np/blog'), 'x-default': absoluteUrl('/blog') },
  };
  const routes: MetadataRoute.Sitemap = pages.map(path => ({ url: absoluteUrl(path), lastModified: new Date('2026-09-01'), alternates: localized[path] ? { languages: localized[path] } : undefined }));
  try {
    return [...routes, ...getSortedPostsData().map(post => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: new Date(post.reviewedDate) }))];
  } catch { return routes; }
}
