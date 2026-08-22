import { parseWriting } from "./writing.js";

const sources = import.meta.glob<string>("../writings/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const allWritings = Promise.all(
  Object.entries(sources).map(([path, source]) => parseWriting(path, source)),
).then((posts) => posts.toSorted((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date)));

export const writings = allWritings.then((posts) =>
  import.meta.env.DEV ? posts : posts.filter((post) => !post.frontmatter.draft),
);

export const writingSlugs = writings.then((posts) => posts.map(({ slug }) => slug));
