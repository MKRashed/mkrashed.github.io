import { getCollection, type CollectionEntry } from 'astro:content';
export async function getPublishedPosts() {
  const now = new Date();
  return (
    await getCollection(
      'blog',
      ({ data }) => !data.draft && data.pubDate <= now,
    )
  ).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
export function readingTime(post: CollectionEntry<'blog'>) {
  const words = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
