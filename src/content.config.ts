import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const episodes = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './content/episodes' }),
  schema: z.object({
    slug: z.string(),
    epNumber: z.number(),
    dancerJa: z.string(),
    dancerEn: z.string(),
    youtubeId: z.string().optional().default(''),
    publishDate: z.coerce.date().nullable().optional().transform((d) => d ? d.toISOString().slice(0,10) : null),
    status: z.enum(['draft', 'published']),
    chapters: z.array(z.object({ numeral: z.string(), title: z.string() })),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './content/journal' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    category: z.string(),
    date: z.coerce.date().nullable().optional().transform((d) => d ? d.toISOString().slice(0,10) : null),
    status: z.enum(['draft', 'published']),
  }),
});

export const collections = { episodes, journal };
