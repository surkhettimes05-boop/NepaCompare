import type { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.khaacho.com';
  const now = new Date();
  const pages = [
    ['', 1], ['/compare', .9], ['/motor', .9], ['/wizard/motor', .7], ['/health', .6], ['/life', .6], ['/travel', .6],
    ['/motor/insurers', .8], ['/motor/plans', .8], ['/how-it-works', .7], ['/about', .6], ['/contact', .6], ['/renew', .7], ['/claims', .7], ['/privacy', .4], ['/terms', .4], ['/disclaimer', .5], ['/ranking-policy', .6], ['/editorial-policy', .6], ['/authors/editorial-team', .5], ['/reviewers/research-desk', .5], ['/blog', .8], ['/glossary', .6], ['/np', .8], ['/np/motor', .8], ['/np/blog', .7],
  ] as const;
  const routes: MetadataRoute.Sitemap = pages.map(([path, priority]) => ({ url: `${baseUrl}${path}`, lastModified: now, changeFrequency: path === '' ? 'weekly' : 'monthly', priority }));
  try {
    return [...routes, ...getSortedPostsData().map(post => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: 'monthly' as const, priority: .6 }))];
  } catch { return routes; }
}
