import { images, siteUrl } from './college';

export function seo({ title, description, path, image = images.building }: { title: string; description: string; path: string; image?: string }) {
  const url = `${siteUrl}${path}`;
  const img = image.startsWith('http') ? image : `${siteUrl}${image}`;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: 'K.L.P. College, Rewari' },
      { property: 'og:image', content: img },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: img },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}
