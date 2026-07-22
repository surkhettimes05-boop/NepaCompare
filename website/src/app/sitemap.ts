import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/posts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to fetch live SEO data
async function fetchSeoData(endpoint: string) {
  try {
    const res = await fetch(`${API_URL}/seo/${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error(`Failed to fetch SEO data for ${endpoint}:`, e);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nepa-compare.vercel.app'
  
  // Base routes
  const routes = [
    '',
    '/compare',
    '/blog',
    '/glossary',
    '/motor',
    '/health',
    '/life',
    '/wizard/motor',
    '/wizard/health',
    '/wizard/life'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = getSortedPostsData()
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error("Could not read blog directory for sitemap", error)
  }

  const programmaticRoutes: MetadataRoute.Sitemap = [];

  // Programmatic Bike Routes from Live DB
  const vehicles = await fetchSeoData('vehicles');
  vehicles.forEach((vehicle: any) => {
    programmaticRoutes.push({
      url: `${baseUrl}/motor/bike/${vehicle.brandSlug}/${vehicle.slug.split('-').slice(1).join('-')}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    });
  });

  // Programmatic Cities from Live DB
  const cities = await fetchSeoData('cities');
  cities.forEach((city: any) => {
    programmaticRoutes.push({
      url: `${baseUrl}/location/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    });
  });

  // Programmatic Versus Pages from Live DB
  const insurers = await fetchSeoData('insurers');
  for (let i = 0; i < insurers.length; i++) {
    for (let j = 0; j < insurers.length; j++) {
      if (i !== j) {
        programmaticRoutes.push({
          url: `${baseUrl}/compare-insurers/${insurers[i].slug}-vs-${insurers[j].slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    }
  }

  return [...routes, ...blogRoutes, ...programmaticRoutes]
}
