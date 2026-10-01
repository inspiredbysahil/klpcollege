CREATE TABLE public.official_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'notice',
  title text NOT NULL,
  date_text text,
  href text NOT NULL UNIQUE,
  source_url text NOT NULL,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.official_items TO anon, authenticated;
GRANT ALL ON public.official_items TO service_role;
ALTER TABLE public.official_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read official items" ON public.official_items FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX official_items_kind_seen ON public.official_items (kind, first_seen DESC);

CREATE TABLE public.sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  ok boolean NOT NULL DEFAULT false,
  found integer NOT NULL DEFAULT 0,
  added integer NOT NULL DEFAULT 0,
  error text
);
GRANT SELECT ON public.sync_runs TO anon, authenticated;
GRANT ALL ON public.sync_runs TO service_role;
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read sync runs" ON public.sync_runs FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX sync_runs_started ON public.sync_runs (started_at DESC);