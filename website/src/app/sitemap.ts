import type { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { absoluteUrl, SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ['/', 1], ['/compare', .9], ['/motor', .9], ['/health', .8], ['/life', .8], ['/travel', .8],
    ['/motor/insurers', .7], ['/motor/plans', .7], ['/how-it-works', .7], ['/about', .6], ['/contact', .6], ['/renew', .6], ['/claims', .6], ['/privacy', .4], ['/terms', .4], ['/disclaimer', .5], ['/ranking-policy', .6], ['/editorial-policy', .6], ['/authors/editorial-team', .5], ['/reviewers/research-desk', .5], ['/blog', .8], ['/glossary', .7], ['/np', .7], ['/np/motor', .7], ['/np/blog', .7],
  ] as const;
  const routes: MetadataRoute.Sitemap = pages.map(([path, priority]) => ({ url: absoluteUrl(path), changeFrequency: path === '/' ? 'weekly' : 'monthly', priority }));
  try {
    return [...routes, ...getSortedPostsData().map(post => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: 'monthly' as const, priority: .6 }))];
  } catch { return routes; }
}
