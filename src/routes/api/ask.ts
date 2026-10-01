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
        const system = `You are the admissions help desk for Kishan Lal Public College (K.L.P. College), Rewari. Answer using ONLY the official college snapshot below. Prioritize the 2026–27 Admission notice for current process and listed programmes, then Programmes at a glance for college rules. Explain that the notice says students can apply at https://admissions.highereduhry.ac.in/ or visit the college desk for free form submission and registration, and cite /students/admission-2026-27. Use the query numbers from that notice exactly when relevant. The 75% attendance rule is a college examination requirement, NOT an admission eligibility threshold. Programme-specific eligibility and duration in the programme list are historical unless the current notice confirms them; label them historical and tell students to verify current requirements. Do not conflate M.A. Geography in older listings with M.Sc. Geography in the 2026–27 notice. Never invent fees, deadlines, seat counts or admissions criteria. If the material lacks an answer, say so and direct the student to the admission page or college office (+91-1274-254964). Reply in the student's language (English or Hindi). Keep answers concise. End with "Sources:" and relevant in-site markdown page links.\n\nOFFICIAL CONTENT:\n${context}`;
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
