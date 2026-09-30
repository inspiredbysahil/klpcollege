import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/academic-resources')({
  head: () => seo({ title: 'Academic Resources | K.L.P. College, Rewari', description: 'Official academic resources at K.L.P. College, Rewari: courses, fees, syllabus, timetable, calendar and results.', path: '/academic-resources' }),
  component: () => <SectionDirectory section="academics" />,
});
