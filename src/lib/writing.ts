import { parseFrontmatter } from "comark";
import { parseMarkdown } from "./markdown.js";
import * as v from "valibot";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const WritingSlugSchema = v.pipe(
  v.string(),
  v.slug("Writing filenames must use lowercase kebab-case."),
);

const WritingFrontmatterSchema = v.object(
  {
    title: v.pipe(v.string(), v.trim(), v.nonEmpty("Title must not be empty.")),
    date: v.pipe(
      v.string(),
      v.trim(),
      v.isoDate("Date must use YYYY-MM-DD format."),
      v.check(isValidCalendarDate, "Date must be a valid calendar date."),
    ),
    description: v.pipe(v.string(), v.trim(), v.nonEmpty("Description must not be empty.")),
    draft: v.optional(v.boolean(), false),
  },
  "Frontmatter must be an object.",
);

type WritingDocument = Awaited<ReturnType<typeof parseMarkdown>>;

export type Writing = Omit<WritingDocument, "frontmatter"> & {
  slug: string;
  frontmatter: v.InferOutput<typeof WritingFrontmatterSchema>;
  formattedDate: string;
  minutes: number;
};

export function writingSlug(sourcePath: string): string {
  const filename = sourcePath.split("/").at(-1);
  if (!filename?.endsWith(".md")) {
    throw new Error("Invalid writing source path: " + sourcePath);
  }

  const result = v.safeParse(WritingSlugSchema, filename.slice(0, -3));
  if (!result.success) {
    throw new Error(`Invalid writing filename ${sourcePath}:\n${v.summarize(result.issues)}`);
  }

  return result.output;
}

export async function parseWriting(sourcePath: string, source: string): Promise<Writing> {
  const { content, data } = parseFrontmatter(source);
  const result = v.safeParse(WritingFrontmatterSchema, data);

  if (!result.success) {
    throw new Error(`Invalid frontmatter in ${sourcePath}:\n${v.summarize(result.issues)}`);
  }

  const document = await parseMarkdown(content);

  return {
    ...document,
    slug: writingSlug(sourcePath),
    frontmatter: result.output,
    formattedDate: dateFormatter.format(new Date(result.output.date + "T00:00:00Z")),
    minutes: readingMinutes(content),
  };
}

function readingMinutes(body: string): number {
  const words = body.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu);
  return Math.max(1, Math.ceil((words?.length ?? 0) / 225));
}

function isValidCalendarDate(value: string): boolean {
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
