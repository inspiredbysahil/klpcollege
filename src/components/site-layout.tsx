import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowUpRight, ChevronDown, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { college, images } from '@/lib/college';

const nav = [
  { label: 'About', to: '/about', children: [{ label: 'The college', to: '/about' }, { label: 'Campus', to: '/campus' }] },
  { label: 'Academics', to: '/academics', children: [{ label: 'Programmes', to: '/academics' }, { label: 'Admissions', to: '/admissions' }] },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Campus life', to: '/campus' },
  { label: 'Notices', to: '/notices' },
  { label: 'Contact', to: '/contact' },
] as const;

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => { setOpen(false); setDropdown(null); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <div className="utility-bar"><div className="site-container flex items-center justify-between gap-4">
      <span className="hidden sm:inline">Rewari, Haryana · Established 1964</span>
      <span className="sm:hidden">Rewari, Haryana</span>
      <div className="flex items-center gap-4 sm:gap-6"><a href={college.feePayment} target="_blank" rel="noopener noreferrer">Fee payment <ArrowUpRight size={12}/></a><a href={college.portal} target="_blank" rel="noopener noreferrer">Student login <ArrowUpRight size={12}/></a></div>
    </div></div>
    <header className="site-header"><div className="site-container header-inner">
      <Link to="/" className="brand" aria-label="K.L.P. College home"><img src={images.crest} alt="" className="brand-mark" /><span className="brand-text"><strong>K.L.P. College</strong><small>Kishan Lal Public College · Rewari</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(item => <div className="nav-item" key={item.label} onMouseEnter={() => 'children' in item && setDropdown(item.label)} onMouseLeave={() => setDropdown(null)}>
        <div className="nav-item-top"><Link to={item.to} activeProps={{ className: 'nav-active' }} activeOptions={{ exact: true }}>{item.label}</Link>{'children' in item && <Button variant="ghost" size="icon" className="nav-chevron" aria-label={`${item.label} submenu`} aria-expanded={dropdown === item.label} onClick={() => setDropdown(dropdown === item.label ? null : item.label)}><ChevronDown size={14}/></Button>}</div>
        {'children' in item && dropdown === item.label && <div className="nav-dropdown">{item.children.map(child => <Link key={child.to} to={child.to}>{child.label}<ArrowUpRight size={14}/></Link>)}</div>}
      </div>)}</nav>
      <div className="header-actions"><Button asChild className="header-apply"><Link to="/admissions">Explore admissions <ArrowUpRight size={15}/></Link></Button><Button variant="ghost" size="icon" className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24}/> : <Menu size={24}/>}</Button></div>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation"><div className="site-container">{nav.map(item => <Link to={item.to} key={item.label}>{item.label}<ArrowUpRight size={16}/></Link>)}<div className="mobile-nav-extras"><a href={college.portal} target="_blank" rel="noopener noreferrer">Student login <ArrowUpRight size={15}/></a><a href={college.feePayment} target="_blank" rel="noopener noreferrer">Fee payment <ArrowUpRight size={15}/></a></div></div></nav>}
    </header>
    <main id="main">{children}</main>
    <footer className="site-footer"><div className="site-container"><div className="footer-top"><div className="footer-identity"><img src={images.crest} alt=""/><div><strong>K.L.P. College</strong><span>Kishan Lal Public College, Rewari</span></div><p>An institution of learning in the heart of Rewari since 1964.</p></div><div className="footer-column"><h2>Explore</h2><Link to="/about">About the college</Link><Link to="/academics">Academics</Link><Link to="/campus">Campus life</Link><Link to="/notices">Notices</Link></div><div className="footer-column"><h2>For students</h2><Link to="/admissions">Admissions</Link><a href={college.portal} target="_blank" rel="noopener noreferrer">Student portal</a><a href={college.feePayment} target="_blank" rel="noopener noreferrer">Fee payment</a><a href={college.staffPortal} target="_blank" rel="noopener noreferrer">Staff login</a></div><div className="footer-column footer-contact"><h2>Get in touch</h2><a href={`tel:${college.phone.replaceAll('-', '')}`}><Phone size={16}/>{college.phone}</a><a href={`mailto:${college.email}`}><Mail size={16}/>{college.email}</a><span><MapPin size={16}/>{college.address}</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Kishan Lal Public College</span><a href={college.official} target="_blank" rel="noopener noreferrer">Official college website <ArrowUpRight size={13}/></a></div></div></footer>
  </>;
}

export function PageIntro({ eyebrow, title, description, image }: { eyebrow: string; title: string; description: string; image?: string }) {
  return <section className={`page-intro ${image ? 'page-intro-image' : ''}`}>{image && <><img className="page-intro-photo" src={image} alt="" /><div className="page-intro-shade" /></>}<div className="site-container"><p className="eyebrow light-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div></section>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}
