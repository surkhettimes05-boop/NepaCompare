import type { Metadata } from 'next';

export const SITE_URL = 'https://www.khaacho.com';

export function absoluteUrl(path: string): string {
  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function pageMetadata(path: string, title: string, description: string, options: Partial<Metadata> = {}): Metadata {
  const url = absoluteUrl(path);
  return {
    ...options,
    title,
    description,
    alternates: { canonical: url, ...options.alternates },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Khaacho',
      locale: 'en_NP',
      ...options.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...options.twitter,
    },
  };
}
