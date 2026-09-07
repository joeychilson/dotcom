import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'writing'>;

export function isPublished(post: Post, now = new Date()) {
  return !post.data.draft && post.data.date.getTime() <= now.getTime();
}

export function newestFirst(posts: Post[]) {
  return [...posts].sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

export function postPath(id: string) {
  return `/writing/${id.split('/').map(encodeURIComponent).join('/')}/`;
}

export async function getPosts({ preview = false } = {}) {
  const { getCollection } = await import('astro:content');
  return newestFirst(
    await getCollection('writing', (post) => preview || isPublished(post)),
  );
}
