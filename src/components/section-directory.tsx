import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { officialSnapshotDate } from '@/content/official-index';
import { pagesInSection } from '@/lib/official-nav';
import { PageIntro, SectionHeading } from '@/components/site-layout';
import { officialLinks, type sectionLinks } from '@/lib/college';

type SectionKey = keyof typeof sectionLinks;
const directories: Record<SectionKey, { eyebrow: string; title: string; description: string; heading: string; note: string; official: string }> = {
  about: { eyebrow: 'About the college', title: 'About K.L.P. College', description: 'Explore the story, governance and facilities of Kishan Lal Public College, Rewari.', heading: 'Discover the college', note: 'Institutional details and reports are maintained on the official college website.', official: officialLinks.about },
  students: { eyebrow: 'For students', title: 'Student services', description: 'Find official information for your studies, support and life beyond the classroom.', heading: 'Your student resources', note: 'Admission, examination and support information can change. Follow the official pages for current details.', official: officialLinks.students },
  academics: { eyebrow: 'Academics', title: 'Academic resources', description: 'Curriculum, fees, schedules and examination resources from the college.', heading: 'Plan your studies', note: 'Fee documents and academic calendars may refer to different sessions. Check the date on each official document.', official: officialLinks.courses },
  faculty: { eyebrow: 'Our people', title: 'Faculty & departments', description: 'Find departments, staff directories and college committees.', heading: 'Connect with the academic community', note: 'Staff listings and departmental information are maintained by the college.', official: officialLinks.faculty },
  gallery: { eyebrow: 'Media', title: 'Gallery', description: 'Browse the college’s photographs, videos and official social channels.', heading: 'Moments from campus', note: 'The official media galleries are the source for the latest uploads.', official: officialLinks.gallery },
  activities: { eyebrow: 'Beyond the classroom', title: 'Events & activities', description: 'Explore student clubs, service initiatives and college activities.', heading: 'Find your community', note: 'Visit the official activity pages for current events and participation information.', official: officialLinks.activities },
  iqac: { eyebrow: 'Quality assurance', title: 'IQAC', description: 'Find the Internal Quality Assurance Cell’s reports, composition and student feedback resources.', heading: 'Quality resources', note: 'Official reports and minutes are available from the college’s IQAC pages.', official: officialLinks.iqac },
  alumni: { eyebrow: 'Community', title: 'Alumni', description: 'Stay connected with the college’s alumni community and its stories.', heading: 'Alumni resources', note: 'Find alumni information on the official college site.', official: officialLinks.alumni },
};
export function SectionDirectory({ section }: { section: SectionKey }) {
  const data = directories[section];
  const items = pagesInSection(section);
  return <><PageIntro eyebrow={data.eyebrow} title={data.title} description={data.description}/><section className="section"><div className="site-container"><div className="directory-heading"><SectionHeading eyebrow="Section directory" title={data.heading} description={`Every page below opens here on this website. Content copied from the official college website on ${officialSnapshotDate}.`}/></div><div className="directory-grid">{items.map(item => <Link key={item.slug} to="/$section/$page" params={{ section, page: item.slug }}><span>{item.label}{item.empty && <small className="directory-empty">No details published yet</small>}</span><ArrowUpRight size={17}/></Link>)}</div></div></section></>;
}
