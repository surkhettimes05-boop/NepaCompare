import type { Metadata } from 'next';

export const SITE_URL = 'https://www.khaacho.com';

export function absoluteUrl(path: string): string {
  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function pageMetadata(path: string, title: string, description: string, options: Partial<Metadata> = {}): Metadata {
  const url = absoluteUrl(path);
  const socialImage = { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: 'Khaacho — independent insurance comparison for Nepal' };
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
      images: [socialImage],
      ...options.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
      ...options.twitter,
    },
  };
}
