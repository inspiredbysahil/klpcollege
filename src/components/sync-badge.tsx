import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { syncFeedQuery } from '@/lib/official-items.functions';

export function timeAgo(iso: string) {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h} hour${h > 1 ? 's' : ''} ago` : `${Math.round(h / 24)} days ago`;
}

export function SyncBadge() {
  const { data } = useQuery(syncFeedQuery);
  if (!data) return null;
  const failed = data.lastRun && !data.lastRun.ok;
  const text = data.lastSuccess ? `Updated from the official site ${timeAgo(data.lastSuccess)}` : 'Automatic update pending';
  return <Link to="/sync-status" className={`sync-badge${failed ? ' sync-badge-warn' : ''}`}>
    {failed ? <AlertTriangle size={14}/> : <RefreshCw size={14}/>}
    <span suppressHydrationWarning>{failed ? `Last check failed · ${text}` : text}</span>
  </Link>;
}
