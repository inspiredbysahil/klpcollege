import { Link } from '@tanstack/react-router';
import { Loader2, MessageCircleQuestion, Send, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

type Msg = { role: 'user' | 'assistant'; content: string; error?: boolean };
const STARTERS = ['Which programmes can I apply for in 2026–27?', 'How do I apply for admission?', 'What is the attendance requirement?', 'Which courses are self-finance?'];
const KEY = 'klp-ask-session';
const errorText = (s: string) => s === '429' ? 'Many students are asking right now. Please wait a moment and try again.' : s === '402' || s === '403' ? 'The assistant has reached its usage limit. Please call the college office at +91-1274-254964.' : 'Sorry, something went wrong. Please try again.';

export function AskAssistant({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { try { const s = sessionStorage.getItem(KEY); if (s) setMessages(JSON.parse(s)); } catch { /* ignore */ } }, []);
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(messages)); } catch { /* ignore */ } end.current?.scrollIntoView({ block: 'nearest' }); }, [messages]);

  async function send(text: string) {
    const q = text.trim(); if (!q || busy) return;
    const history = [...messages.filter(m => !m.error), { role: 'user' as const, content: q }];
    setMessages([...history, { role: 'assistant', content: '' }]); setInput(''); setBusy(true);
    const ctrl = new AbortController(); abort.current = ctrl;
    const update = (content: string, error = false) => setMessages(m => [...m.slice(0, -1), { role: 'assistant', content, error }]);
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-12).map(({ role, content }) => ({ role, content })) }), signal: ctrl.signal });
      if (!res.ok || !res.body) { const j = await res.json().catch(() => ({})); update(j.error ?? errorText(String(res.status)), true); return; }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = '';
      for (;;) { const { done, value } = await reader.read(); if (done) break; acc += dec.decode(value, { stream: true });
        const m = acc.match(/\[\[ERROR:(\d+)\]\]/); if (m) { update(errorText(m[1]), true); return; } update(acc); }
      if (!acc.trim()) update('I could not find an answer. Please call the college office at +91-1274-254964.', true);
    } catch (e) { if ((e as Error).name === 'AbortError') setMessages(m => { const last = m[m.length - 1]; return [...m.slice(0, -1), { ...last, content: (last.content || '') + '\n\n_Stopped._' }]; }); else update(errorText('500'), true); }
    finally { setBusy(false); abort.current = null; }
  }

  return <div className={`ask ${compact ? 'ask-compact' : ''}`}>
    <div className="ask-log" aria-live="polite">
      {messages.length === 0 && <div className="ask-empty"><MessageCircleQuestion size={28}/><p>Ask about programmes, eligibility, fees or how to apply. Answers use the college’s official website content.</p><div className="ask-starters">{STARTERS.map(s => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}</div></div>}
      {messages.map((m, i) => <div key={i} className={`ask-msg ask-${m.role} ${m.error ? 'ask-error' : ''}`}>
        {m.role === 'assistant' && !m.content ? <span className="ask-thinking"><Loader2 size={15} className="animate-spin"/> Looking through official information…</span>
          : m.role === 'assistant' ? <div className="ask-md"><ReactMarkdown components={{ a: ({ href = '', children }) => href.startsWith('/') ? <Link to={href}>{children}</Link> : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> }}>{m.content}</ReactMarkdown></div>
          : <p>{m.content}</p>}
      </div>)}
      <div ref={end}/>
    </div>
    <form className="ask-form" onSubmit={e => { e.preventDefault(); send(input); }}>
      <label htmlFor={compact ? 'ask-input-compact' : 'ask-input'} className="sr-only">Your question</label>
      <input id={compact ? 'ask-input-compact' : 'ask-input'} value={input} onChange={e => setInput(e.target.value)} placeholder="Type your question…" maxLength={500} autoComplete="off"/>
      {busy ? <Button type="button" size="icon" variant="outline" aria-label="Stop" onClick={() => abort.current?.abort()}><Square size={15}/></Button>
        : <Button type="submit" size="icon" aria-label="Send" disabled={!input.trim()}><Send size={16}/></Button>}
    </form>
    <p className="ask-note">AI answers can be incomplete. Confirm important details with the college office.{messages.length > 0 && <> · <button type="button" onClick={() => setMessages([])}>Clear chat</button></>}</p>
  </div>;
}

export function AskLauncher() {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, [open]);
  return <>
    {open && <div className="ask-panel" role="dialog" aria-label="Ask about programmes and admissions"><div className="ask-panel-head"><strong>Ask K.L.P. College</strong><span><Link to="/ask" onClick={() => setOpen(false)}>Open full page</Link><button type="button" aria-label="Close" onClick={() => setOpen(false)}>×</button></span></div><AskAssistant compact/></div>}
    <button type="button" className="ask-fab" aria-expanded={open} onClick={() => setOpen(!open)}><MessageCircleQuestion size={20}/><span>{open ? 'Close' : 'Ask a question'}</span></button>
  </>;
}
