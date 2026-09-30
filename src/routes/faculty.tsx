import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/faculty')({
  head: () => seo({ title: 'Faculty & Departments | K.L.P. College, Rewari', description: 'Explore the faculty, departments, staff and committees of K.L.P. College, Rewari.', path: '/faculty' }),
  component: () => <SectionDirectory section="faculty" />,
});
