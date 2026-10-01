import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { findOfficialPage } from './official.server';

export const getOfficialPage = createServerFn({ method: 'GET' })
  .inputValidator((d) => z.object({ section: z.string().max(40), slug: z.string().max(80) }).parse(d))
  .handler(async ({ data }) => {
    const p = findOfficialPage(data.section, data.slug);
    if (!p) return null;
    return { section: p.section, slug: p.slug, title: p.title, html: p.html, documents: p.documents, sourceUrl: p.sourceUrl, fetchedAt: p.fetchedAt, empty: p.text.length < 40 && p.documents.length === 0 };
  });
