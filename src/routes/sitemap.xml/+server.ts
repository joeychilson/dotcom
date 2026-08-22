import { site } from "#lib/site.js";
import { writings } from "#lib/writing.server.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = async () => {
  const posts = await writings;
  const urls = [
    `<url><loc>${site.url}/</loc></url>`,
    ...posts.map(
      ({ slug, frontmatter }) =>
        `<url><loc>${site.url}/writing/${slug}</loc><lastmod>${frontmatter.date}</lastmod></url>`,
    ),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
