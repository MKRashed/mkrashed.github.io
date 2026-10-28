import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/blog';
import { projects } from '../data/projects';
export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response(null, { status: 404 });
  const posts = await getPublishedPosts();
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
  const paths = [
    '/',
    '/about',
    '/projects',
    '/blog',
    '/contact',
    ...projects
      .filter((project) => project.status === 'Published')
      .map((project) => `/projects/${project.slug}`),
    ...posts.map((post) => `/blog/${post.id}`),
    ...tags.map((tag) => `/blog/tags/${encodeURIComponent(tag)}`),
  ];
  const escape = (value: string) =>
    value.replace(
      /[<>&'\"]/g,
      (char) =>
        ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          "'": '&apos;',
          '"': '&quot;',
        })[char]!,
    );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escape(new URL(path.endsWith('/') ? path : `${path}/`, site).href)}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
