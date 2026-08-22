import { site } from "#lib/site.js";
import { writings } from "#lib/writing.server.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

function escapeXml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]!,
  );
}

export const GET: RequestHandler = async () => {
  const posts = await writings;
  const items = posts.map(({ slug, frontmatter }) => {
    const { title, date, description } = frontmatter;
    const url = `${site.url}/writing/${slug}`;
    return `<item>
  <title>${escapeXml(title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${new Date(`${date}T00:00:00Z`).toUTCString()}</pubDate>
  <description>${escapeXml(description)}</description>
</item>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(site.name)}</title>
  <link>${site.url}/</link>
  <description>${escapeXml(site.description)}</description>
  <language>en-us</language>
  <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
</channel>
</rss>
`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
};
