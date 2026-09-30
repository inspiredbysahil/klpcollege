import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/iqac')({
  head: () => seo({ title: 'IQAC | K.L.P. College, Rewari', description: 'Internal Quality Assurance Cell resources, reports, minutes and feedback at K.L.P. College, Rewari.', path: '/iqac' }),
  component: () => <SectionDirectory section="iqac" />,
});
