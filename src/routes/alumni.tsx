import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/alumni')({
  head: () => seo({ title: 'Alumni | K.L.P. College, Rewari', description: 'Discover the alumni community and official alumni resources at K.L.P. College, Rewari.', path: '/alumni' }),
  component: () => <SectionDirectory section="alumni" />,
});
