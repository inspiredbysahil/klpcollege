import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/students')({ staticData: { sitemap: true },
  head: () => seo({ title: 'Student Services | K.L.P. College, Rewari', description: 'Student services at K.L.P. College, Rewari: programmes, exams, scholarships, helplines, grievances and online resources.', path: '/students' }),
  component: () => <SectionDirectory section="students" />,
});
