DROP POLICY IF EXISTS "Public can read sync runs" ON public.sync_runs;
REVOKE SELECT ON public.sync_runs FROM anon, authenticated;