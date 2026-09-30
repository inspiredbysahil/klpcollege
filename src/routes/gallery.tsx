import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/gallery')({
  head: () => seo({ title: 'Gallery | K.L.P. College, Rewari', description: 'Browse photographs, videos and official social channels from K.L.P. College, Rewari.', path: '/gallery' }),
  component: () => <SectionDirectory section="gallery" />,
});
