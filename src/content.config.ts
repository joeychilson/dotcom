import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './writings' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      draft: z.boolean().default(true),
    })
    .refine((post) => !post.updated || post.updated >= post.date, {
      message: 'updated must not precede date',
    }),
});

export const collections = { writing };
