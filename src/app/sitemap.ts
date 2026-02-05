import type { MetadataRoute } from 'next';
import { archiveEntries } from '../lib/archiveData';

const baseUrl = 'https://aurascan.lol';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/scan', '/archive', '/signal', '/status'];
  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const archiveRoutes = archiveEntries.map((entry) => ({
    url: `${baseUrl}/archive/${entry.id}`,
    lastModified: entry.date
  }));

  return [...staticEntries, ...archiveRoutes];
}
