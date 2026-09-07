import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../site';
import { getPosts, postPath } from '../posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${site.name} — Writing`,
    description: site.description,
    site: context.site!,
    xmlns: { dcterms: 'http://purl.org/dc/terms/' },
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postPath(post.id),
      customData: post.data.updated
        ? `<dcterms:modified>${post.data.updated.toISOString()}</dcterms:modified>`
        : undefined,
    })),
    customData: '<language>en</language>',
    trailingSlash: true,
  });
}
