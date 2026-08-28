import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.khaacho.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api/', '/_next/', '/login', '/register', '/forgot-password', '/get-quote', '/compare/motor'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
