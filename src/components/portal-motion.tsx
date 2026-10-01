import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useRouterState } from '@tanstack/react-router';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .55, ease: 'easeOut' }}>{children}</motion.div>;
}

export function RouteMotion({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const reduced = useReducedMotion();
  return <motion.div key={pathname} initial={reduced ? false : { opacity: .86, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28 }}>{children}</motion.div>;
}

export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible) return;
    if (reduced) { setCurrent(value); return; }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 1100);
      setCurrent(Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, value, reduced]);
  return <motion.span onViewportEnter={() => setVisible(true)} viewport={{ once: true }} aria-label={`${value}${suffix}`}>{current}{suffix}</motion.span>;
}