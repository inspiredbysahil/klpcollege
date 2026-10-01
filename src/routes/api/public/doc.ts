import { createFileRoute } from '@tanstack/react-router';

const ALLOWED_HOSTS = new Set(['www.klpcollege.ac.in', 'klpcollege.ac.in', 'college.klpcollege.ac.in']);
const ALLOWED_TYPES = /^(application\/pdf|image\/|application\/(msword|vnd\.openxmlformats|vnd\.ms-)|application\/octet-stream)/;
const MAX_BYTES = 40 * 1024 * 1024;

export const Route = createFileRoute('/api/public/doc')({ staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const src = new URL(request.url).searchParams.get('src') ?? '';
        let target: URL;
        try { target = new URL(src); } catch { return new Response('Invalid document address', { status: 400 }); }
        if (!['https:', 'http:'].includes(target.protocol) || !ALLOWED_HOSTS.has(target.hostname)) return new Response('Document source not allowed', { status: 403 });
        target.protocol = 'https:';
        let upstream: Response;
        try { upstream = await fetch(target.toString(), { redirect: 'follow' }); } catch { return new Response('Document unavailable', { status: 502 }); }
        if (!upstream.ok || !upstream.body) return new Response('Document not found', { status: upstream.status === 404 ? 404 : 502 });
        let type = upstream.headers.get('content-type') ?? 'application/octet-stream';
        if (/\.pdf($|\?)/i.test(target.pathname) && !type.includes('pdf') && !type.startsWith('image/')) type = 'application/pdf';
        if (!ALLOWED_TYPES.test(type)) return new Response('Unsupported document type', { status: 415 });
        const len = Number(upstream.headers.get('content-length') ?? 0);
        if (len > MAX_BYTES) return new Response('Document too large', { status: 413 });
        const name = decodeURIComponent(target.pathname.split('/').pop() || 'document').replace(/["\r\n]/g, '');
        return new Response(upstream.body, { headers: { 'content-type': type, 'content-disposition': `inline; filename="${name}"`, 'cache-control': 'public, max-age=86400', 'x-content-type-options': 'nosniff' } });
      },
    },
  },
});
