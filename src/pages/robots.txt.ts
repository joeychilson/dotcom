import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  const text = import.meta.env.PROD
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site)}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
