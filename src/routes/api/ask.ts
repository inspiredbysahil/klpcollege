import { createFileRoute } from '@tanstack/react-router';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { buildContext } from '@/lib/official.server';

const Body = z.object({ messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) })).min(1).max(20) });
const RUN = 'X-Lovable-AIG-Run-ID';

export const Route = createFileRoute('/api/ask')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env['LOVABLE_API_KEY'];
        if (!apiKey) return Response.json({ error: 'The assistant is not configured yet.' }, { status: 500 });
        let parsed;
        try { parsed = Body.parse(await request.json()); } catch { return Response.json({ error: 'Please type a shorter question.' }, { status: 400 }); }
        const lastUser = [...parsed.messages].reverse().find(m => m.role === 'user')?.content ?? '';
        const context = buildContext(parsed.messages.filter(m => m.role === 'user').slice(-3).map(m => m.content).join(' ') + ' ' + lastUser);
        let runId: string | undefined;
        const provider = createOpenAI({
          baseURL: 'https://ai.gateway.lovable.dev/v1', apiKey,
          headers: { 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
          fetch: async (input, init) => { const h = new Headers(init?.headers); if (runId) h.set(RUN, runId); const r = await fetch(input, { ...init, headers: h }); runId ??= r.headers.get(RUN) ?? undefined; return r; },
        });
        const system = `You are the admissions help desk for Kishan Lal Public College (K.L.P. College), Rewari. Answer questions from prospective students about degree programmes and admissions using ONLY the official college content below. Never invent facts, fees, dates, seats or eligibility. If the content does not contain the answer, say so plainly and suggest calling the college (${'+91-1274-254964'}) or checking the admission page. Reply in the language the student uses (English or Hindi). Keep answers short and clear, using markdown bullet points where helpful. End with a line "Sources:" listing the in-site page paths you used as markdown links, e.g. [Admission 2026–27](/students/admission-2026-27).\n\nOFFICIAL CONTENT:\n${context}`;
        let status = 0;
        const result = streamText({
          model: provider.responses('openai/gpt-6-astra'), system, messages: parsed.messages, abortSignal: request.signal, maxRetries: 0,
          providerOptions: { openai: { forceReasoning: true, reasoningEffort: 'low', reasoningSummary: 'auto', store: false, include: ['reasoning.encrypted_content'] } },
          onError: ({ error }) => { status = (error as { statusCode?: number })?.statusCode ?? 500; console.error('ask error', error); },
        });
        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(ctrl) {
            try { for await (const part of result.fullStream) { if (part.type === 'text-delta') ctrl.enqueue(enc.encode(part.text)); if (part.type === 'error') { const s = (part.error as { statusCode?: number })?.statusCode ?? status; ctrl.enqueue(enc.encode(`\n\n[[ERROR:${s}]]`)); } } }
            catch (e) { if (!request.signal.aborted) ctrl.enqueue(enc.encode(`\n\n[[ERROR:${(e as { statusCode?: number })?.statusCode ?? 500}]]`)); }
            ctrl.close();
          },
        });
        return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-cache, no-transform' } });
      },
    },
  },
});
