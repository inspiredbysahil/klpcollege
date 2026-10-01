import { createFileRoute } from '@tanstack/react-router';
import { AskAssistant } from '@/components/ask-assistant';
import { PageIntro } from '@/components/site-layout';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/ask')({
  head: () => seo({ title: 'Ask about Programmes & Admissions | K.L.P. College, Rewari', description: 'Get quick answers about degree programmes, eligibility and admissions at K.L.P. College, based on official college information.', path: '/ask' }),
  component: () => <><PageIntro eyebrow="Admissions help desk" title="Ask a question." description="Get quick answers about programmes and admissions, drawn from the college’s official information."/><section className="section"><div className="site-container ask-page"><AskAssistant/></div></section></>,
});
