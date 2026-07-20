import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nepa-compare.vercel.app'
  
  // Base routes
  const routes = [
    '',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Automatically fetch all blog posts from the file system
  const blogDirectory = path.join(process.cwd(), 'src/app/blog')
  let blogRoutes: MetadataRoute.Sitemap = []
  
  try {
    const entries = fs.readdirSync(blogDirectory, { withFileTypes: true })
    blogRoutes = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        url: `${baseUrl}/blog/${entry.name}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
  } catch (error) {
    console.error("Could not read blog directory for sitemap", error)
  }

  return [...routes, ...blogRoutes]
}
