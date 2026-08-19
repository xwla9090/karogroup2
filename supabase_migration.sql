-- ============================================================================
--  KARO GROUP — Supabase Migration  (sync v3)
--  ---------------------------------------------------------------------------
--  ئەم فایلە لە Supabase → SQL Editor ـدا جێبەجێ بکە.
--  دووبارە جێبەجێکردنی زیانی نییە (idempotent).
--
--  ئەمە ٣ شت دەکات:
--    ١. karo_cash_delta()  — گۆڕینی قاسە بە شێوەی atomic (delta)
--    ٢. updated_at         — بۆ چاودێری و شیکاری
--    ٣. Realtime + Index   — بۆ ئەوەی گۆڕانکاری یەکسەر بگات
-- ============================================================================


-- ═══════════════════════════════════════════════════════════════════════════
--  ١) ئیندێکس — گەڕان بە پێی project خێراتر دەکات
-- ═══════════════════════════════════════════════════════════════════════════
create index if not exists idx_expenses_project   on public.expenses   (project);
create index if not exists idx_concrete_project   on public.concrete   (project);
create index if not exists idx_loans_project      on public.loans      (project);
create index if not exists idx_contractor_project on public.contractor (project);
create index if not exists idx_invoices_project   on public.invoices   (project);
create index if not exists idx_cash_project       on public.cash       (project);
create index if not exists idx_persons_project    on public.persons    (project);


-- ═══════════════════════════════════════════════════════════════════════════
--  ٢) updated_at — کاتی دوایین گۆڕانکاری
--     کلاینت پێویستی پێی نییە بۆ کارکردن، بەڵام بۆ debug و ڕاپۆرت بەسوودە.
-- ═══════════════════════════════════════════════════════════════════════════
do $$
declare
  t text;
begin
  foreach t in array array['expenses','concrete','loans','contractor','invoices','cash']
  loop
    execute format(
      'alter table public.%I add column if not exists updated_at timestamptz not null default now()', t);
  end loop;
end $$;

create or replace function public.karo_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['expenses','concrete','loans','contractor','invoices','cash']
  loop
    execute format('drop trigger if exists trg_%I_touch on public.%I', t, t);
    execute format(
      'create trigger trg_%I_touch before update on public.%I
       for each row execute function public.karo_touch_updated_at()', t, t);
  end loop;
end $$;


-- ═══════════════════════════════════════════════════════════════════════════
--  ٣) karo_cash_delta — گرنگترین بەش
--  ---------------------------------------------------------------------------
--  پێشتر کلاینت نرخی ڕەهای قاسەی دەنووسی:   cashiqd = 900
--  ئێستا جیاوازییەکە دەنێرێت:                cashiqd = cashiqd - 100
--
--  بۆچی گرنگە:
--    قاسە = ١٠٠٠. بەکارهێنەری A خەرجی ١٠٠ زیاد دەکات، بەکارهێنەری B
--    خەرجی ٥٠ زیاد دەکات — لە هەمان چرکەدا.
--      • بە نرخی ڕەها  → ئەنجام ٩٠٠ یان ٩٥٠ (یەکێکیان لەناودەچێت) ❌
--      • بە delta      → ئەنجام ٨٥٠ هەمیشە ✅
--
--  هەروەها: هەر تۆمارێکی مێژوو id ـێکی تایبەتی هەیە، کەواتە ئەگەر
--  کلاینت بەهۆی کێشەی تۆڕ دووبارە هەوڵ بدات، دوو جار جێبەجێ نابێت.
-- ═══════════════════════════════════════════════════════════════════════════
do $$
declare
  logtype text;
  body    text;
begin
  select data_type into logtype
    from information_schema.columns
   where table_schema = 'public' and table_name = 'cash' and column_name = 'cashlog';

  -- جۆری ستوونی cashlog دەکرێت text بێت یان jsonb — بۆ هەردووکیان
  body := $body$
create or replace function public.karo_cash_delta(
  p_project text,
  p_diqd    numeric,
  p_dusd    numeric,
  p_log     jsonb default '[]'::jsonb
)
returns table (cashiqd numeric, cashusd numeric, exchangerate numeric)
language plpgsql
as $fn$
declare
  v_log_id  text;
  v_current %LOGCAST%;
begin
  -- ڕیزەکە دروست بکە ئەگەر نەبوو (بە سفر — دواتر delta جێبەجێ دەکرێت)
  insert into public.cash (id, project, cashiqd, cashusd, exchangerate, cashlog)
  select p_project, p_project, 0, 0, 1500, %EMPTY%
   where not exists (select 1 from public.cash c where c.project = p_project);

  -- ⭐ IDEMPOTENCY: ئەگەر ئەم تۆمارە پێشتر جێبەجێ کراوە، دووبارەی مەکە
  if p_log is not null and jsonb_array_length(p_log) > 0 then
    v_log_id := p_log->0->>'id';
    select %LOGREAD% into v_current from public.cash c where c.project = p_project;
    if v_log_id is not null
       and coalesce(v_current, '[]'::jsonb) @> jsonb_build_array(jsonb_build_object('id', v_log_id))
    then
      return query
        select c.cashiqd, c.cashusd, c.exchangerate
          from public.cash c where c.project = p_project;
      return;
    end if;
  end if;

  return query
  update public.cash c
     set cashiqd = coalesce(c.cashiqd, 0) + coalesce(p_diqd, 0),
         cashusd = coalesce(c.cashusd, 0) + coalesce(p_dusd, 0),
         cashlog = %LOGWRITE%
   where c.project = p_project
  returning c.cashiqd, c.cashusd, c.exchangerate;
end;
$fn$;
$body$;

  if logtype = 'jsonb' then
    body := replace(body, '%LOGCAST%',  'jsonb');
    body := replace(body, '%EMPTY%',    '''[]''::jsonb');
    body := replace(body, '%LOGREAD%',  'coalesce(c.cashlog, ''[]''::jsonb)');
    body := replace(body, '%LOGWRITE%', 'coalesce(c.cashlog, ''[]''::jsonb) || coalesce(p_log, ''[]''::jsonb)');
  else
    body := replace(body, '%LOGCAST%',  'jsonb');
    body := replace(body, '%EMPTY%',    '''[]''');
    body := replace(body, '%LOGREAD%',  'coalesce(nullif(c.cashlog, ''''), ''[]'')::jsonb');
    body := replace(body, '%LOGWRITE%', '(coalesce(nullif(c.cashlog, ''''), ''[]'')::jsonb || coalesce(p_log, ''[]''::jsonb))::text');
  end if;

  execute body;
end $$;

grant execute on function public.karo_cash_delta(text, numeric, numeric, jsonb) to anon, authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
--  ٤) REALTIME — بەبێ ئەمە گۆڕانکاری یەکسەر نایەت (تەنها بە polling)
-- ═══════════════════════════════════════════════════════════════════════════
do $$
declare
  t text;
begin
  foreach t in array array['expenses','concrete','loans','contractor','invoices','cash','persons']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then
      null;   -- پێشتر زیادکراوە
    end;
  end loop;
end $$;

-- بۆ ئەوەی ڕووداوی DELETE ناسنامەی ڕیزەکە هەڵبگرێت
alter table public.expenses   replica identity full;
alter table public.concrete   replica identity full;
alter table public.loans      replica identity full;
alter table public.contractor replica identity full;
alter table public.invoices   replica identity full;


-- ═══════════════════════════════════════════════════════════════════════════
--  ٥) ⚠️ ئاسایش — تکایە بیخوێنەوە
--  ---------------------------------------------------------------------------
--  کلیلی anon لە کۆدی کلاینتدایە (هەموو کەسێک دەیبینێت). ئەگەر RLS
--  چالاک نەبێت، هەر کەسێک دەتوانێت هەموو داتاکە بخوێنێتەوە یان بیسڕێتەوە.
--
--  ئەم سیستەمە ئێستا سیستەمی خۆی بۆ چوونەژوورەوە بەکاردێنێت (تەیبڵی users)
--  نەک Supabase Auth، کەواتە RLS ـی بەپێی بەکارهێنەر ئاسان نییە.
--  لانیکەم ئەمانە پێشنیار دەکرێن:
--
--    ١. تۆکنی بۆتی تێلێگرام بگۆڕە (لە کۆدی کۆندا دەرکەوتبوو).
--    ٢. کلیلی anon ـیش بگۆڕە (Supabase → Settings → API → Roll key).
--    ٣. دواتر بۆ RLS ـی ڕاستەقینە، دەبێت Supabase Auth بەکار بهێنرێت.
--
--  بۆ کەمکردنەوەی مەترسی ئێستا، دەتوانیت سڕینەوەی کۆمەڵ قەدەغە بکەیت:
--  (ئەمە Format ـیش لەکار دەخات — تەنها ئەگەر پێویستت پێی بوو چالاکی بکە)
--
--  -- alter table public.expenses enable row level security;
--  -- create policy "read all"   on public.expenses for select using (true);
--  -- create policy "write all"  on public.expenses for insert with check (true);
--  -- create policy "update all" on public.expenses for update using (true);
--  -- create policy "delete one" on public.expenses for delete using (true);
-- ═══════════════════════════════════════════════════════════════════════════
