import { officialIndex } from '@/content/official-index';

export const sectionTitles: Record<string, string> = {
  about: 'About', students: 'Students', academics: 'Academics', faculty: 'Faculty', gallery: 'Gallery', activities: 'Activities', iqac: 'IQAC', alumni: 'Alumni', more: 'More',
};
/** Directory page for each section (used for breadcrumbs). */
export const sectionHome: Record<string, string> = {
  about: '/about-directory', students: '/students', academics: '/academic-resources', faculty: '/faculty', gallery: '/gallery', activities: '/activities', iqac: '/iqac', alumni: '/alumni', more: '/',
};
export const pagesInSection = (section: string) => officialIndex.filter(p => p.section === section);
export const docHref = (url: string, title?: string) => `/documents?src=${encodeURIComponent(url)}${title ? `&title=${encodeURIComponent(title)}` : ''}`;
