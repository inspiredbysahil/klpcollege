import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/activities')({ staticData: { sitemap: true },
  head: () => seo({ title: 'Events & Activities | K.L.P. College, Rewari', description: 'Find NCC, NSS, clubs, student events and campus activities at K.L.P. College, Rewari.', path: '/activities' }),
  component: () => <SectionDirectory section="activities" />,
});
