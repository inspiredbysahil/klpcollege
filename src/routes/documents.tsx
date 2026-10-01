import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { seo } from '@/lib/seo';

type Search = { src?: string | undefined; title?: string | undefined };
export const Route = createFileRoute('/documents')({
  validateSearch: (s: Record<string, unknown>): Search => ({ src: typeof s['src'] === 'string' ? s['src'] : undefined, title: typeof s['title'] === 'string' ? s['title'].slice(0, 160) : undefined }),
  head: () => ({ ...seo({ title: 'Document viewer | K.L.P. College, Rewari', description: 'View college notices, syllabi, fee structures and staff documents without leaving the site.', path: '/documents' }), meta: [...seo({ title: 'Document viewer | K.L.P. College, Rewari', description: 'View college notices, syllabi, fee structures and staff documents without leaving the site.', path: '/documents' }).meta, { name: 'robots', content: 'noindex' }] }),
  component: DocumentViewer,
});

function DocumentViewer() {
  const { src, title } = Route.useSearch();
  const router = useRouter();
  const valid = !!src && /^https?:\/\/([a-z]+\.)?klpcollege\.ac\.in\//i.test(src);
  const proxied = valid ? `/api/public/doc?src=${encodeURIComponent(src)}` : '';
  const name = title || (src ? decodeURIComponent(src.split('/').pop() ?? 'Document') : 'Document');
  const isImage = valid && /\.(jpe?g|png|gif|webp)($|\?)/i.test(src!);
  const isPdf = valid && /\.pdf($|\?)/i.test(src!);
  return <section className="doc-viewer"><div className="site-container">
    <div className="doc-toolbar">
      <Button variant="outline" size="sm" onClick={() => router.history.length > 1 ? router.history.back() : router.navigate({ to: '/' })}><ArrowLeft size={15}/> Back</Button>
      <h1>{name}</h1>
      {valid && <div className="doc-actions"><Button asChild variant="outline" size="sm"><a href={proxied} target="_blank" rel="noopener"><Maximize2 size={15}/> Full screen</a></Button><Button asChild size="sm"><a href={proxied} download><Download size={15}/> Download</a></Button></div>}
    </div>
    {!valid ? <div className="official-empty"><h2>Document not available</h2><p>This link doesn’t point to a college document. Go back and choose a document from the list.</p></div>
      : isImage ? <img className="doc-image" src={proxied} alt={name}/>
      : isPdf ? <object className="doc-frame" data={proxied} type="application/pdf" aria-label={name}><div className="official-empty"><h2>Preview not supported on this device</h2><p>Your browser can’t show this document here. Use “Full screen” or “Download” above to open it.</p></div></object>
      : <div className="official-empty"><h2>Preview not available for this file type</h2><p>Use “Download” above to open this document.</p></div>}
  </div></section>;
}
