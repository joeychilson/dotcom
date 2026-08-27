import { prerender } from "$app/server";
import { error } from "@sveltejs/kit";
import { writings, writingSlugs } from "./writing.server.js";

export const listWritings = prerender(async () =>
  (await writings).map(({ slug, frontmatter, formattedDate }) => ({
    slug,
    frontmatter,
    formattedDate,
  })),
);

export const getWriting = prerender(
  "unchecked",
  async (slug: string) => {
    const writing = (await writings).find((post) => post.slug === slug);
    if (!writing) error(404, "Writing not found");
    return writing;
  },
  { inputs: () => writingSlugs, dynamic: true },
);
