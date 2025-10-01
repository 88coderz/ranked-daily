import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const { data: articles } = await supabase.from('articles').select('slug, updated_at').eq('status', 'published');

  const articleRoutes = articles?.map(({ slug, updated_at }) => ({
    url: `https://rankeddaily.com/articles/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) ?? [];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: 'https://rankeddaily.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://rankeddaily.com/login',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://rankeddaily.com/signup',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://rankeddaily.com/articles/new',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...articleRoutes];
}