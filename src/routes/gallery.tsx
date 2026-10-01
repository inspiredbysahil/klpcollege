import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/site-layout';
import photos from '@/content/gallery-index.json';
export const Route = createFileRoute('/gallery')({
  head: () => seo({ title: 'Gallery | K.L.P. College, Rewari', description: 'Browse photographs, videos and official social channels from K.L.P. College, Rewari.', path: '/gallery' }),
  component: Gallery,
});

function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); if (e.key === 'ArrowRight') setSelected((selected + 1) % photos.length); if (e.key === 'ArrowLeft') setSelected((selected - 1 + photos.length) % photos.length); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected]);
  return <><SectionDirectory section="gallery"/><section className="section section-muted"><div className="site-container"><SectionHeading eyebrow="Photo gallery" title="Campus moments." description="Photographs from the college’s official gallery."/><div className="gallery-masonry">{photos.map((photo, index) => <Button key={`${photo.src}-${index}`} variant="ghost" className="gallery-tile" onClick={() => setSelected(index)} aria-label={`View ${photo.title}`}><img src={photo.src} alt={photo.title} loading="lazy"/><span>{photo.title}</span></Button>)}</div></div></section>{selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label={photos[selected]?.title ?? 'Photo'} onClick={() => setSelected(null)}><Button variant="ghost" size="icon" className="lightbox-close" aria-label="Close photo" onClick={() => setSelected(null)}><X size={24}/></Button><div onClick={e => e.stopPropagation()}><img src={photos[selected]?.src} alt={photos[selected]?.title}/><p>{photos[selected]?.title} · {selected + 1} / {photos.length}</p><div className="lightbox-controls"><Button variant="outline" onClick={() => setSelected((selected - 1 + photos.length) % photos.length)}>Previous</Button><Button variant="outline" onClick={() => setSelected((selected + 1) % photos.length)}>Next</Button></div></div></div>}</>;
}
