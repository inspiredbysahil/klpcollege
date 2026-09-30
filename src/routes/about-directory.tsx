import { createFileRoute } from '@tanstack/react-router';
import { SectionDirectory } from '@/components/section-directory';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/about-directory')({
  head: () => seo({ title: 'About the College | K.L.P. College, Rewari', description: 'Explore K.L.P. College history, facilities, governance, annual reports and more through verified official resources.', path: '/about-directory' }),
  component: () => <SectionDirectory section="about" />,
});
