-- ============================================================================
--  KARO GROUP — بەشی «حیساباتی کرێکار»
--  ---------------------------------------------------------------------------
--  ئەم فایلە لە Supabase → SQL Editor ـدا جێبەجێ بکە.
--  دووبارە جێبەجێکردنی زیانی نییە (idempotent).
--
--  دوو تەیبڵ دروست دەکات:
--    ١. workers      — ناوی کرێکارەکان و نرخی ئێستایان
--    ٢. worker_days  — تۆماری ڕۆژانەی ئیش
--
--  ⭐ گرنگ: worker_days نرخی ڕۆژ و سەعات لەگەڵ خۆیدا هەڵدەگرێت.
--     بۆیە گۆڕینی نرخی کرێکارێک هیچ کاریگەرییەکی لەسەر تۆمارە
--     کۆنەکان نییە — تەنها تۆمارە نوێیەکان نرخی نوێ وەردەگرن.
-- ============================================================================


-- ═══════════════════════════════════════════════════════════════════════════
--  ١) تەیبڵی کرێکارەکان
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.workers (
  id          text primary key,
  project     text not null,
  name        text not null default '',
  dailyrate   numeric not null default 0,   -- نرخی ڕۆژێکی تەواو (٩ سەعات)
  hourlyrate  numeric not null default 0,   -- نرخی یەک سەعاتی ئیزافی
  note        text default '',
  active      boolean not null default true,
  updated_at  timestamptz not null default now()
);

create index if not exists idx_workers_project on public.workers (project);


-- ═══════════════════════════════════════════════════════════════════════════
--  ٢) تۆماری ڕۆژانەی ئیش
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists public.worker_days (
  id             text primary key,
  project        text not null,
  workerid       text default '',
  workername     text default '',           -- کۆپی ناو — مێژوو نافەوتێت
  date           text default '',
  days           numeric not null default 0, -- ١ = ڕۆژێکی تەواو، ٠.٥ = نیو ڕۆژ
  overtimehours  numeric not null default 0,
  dailyrate      numeric not null default 0, -- ⭐ نرخی ئەو کاتە (snapshot)
  hourlyrate     numeric not null default 0, -- ⭐ نرخی ئەو کاتە (snapshot)
  amount         numeric not null default 0,
  note           text default '',
  marked         boolean not null default false,
  updated_at     timestamptz not null default now()
);

create index if not exists idx_worker_days_project on public.worker_days (project);
create index if not exists idx_worker_days_worker  on public.worker_days (project, workerid);
create index if not exists idx_worker_days_date    on public.worker_days (project, date);


-- ═══════════════════════════════════════════════════════════════════════════
--  ٣) updated_at خۆکار
-- ═══════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['workers','worker_days']
  loop
    execute format('drop trigger if exists trg_%I_touch on public.%I', t, t);
    execute format(
      'create trigger trg_%I_touch before update on public.%I
       for each row execute function public.karo_touch_updated_at()', t, t);
  end loop;
end $$;


-- ═══════════════════════════════════════════════════════════════════════════
--  ٤) REALTIME — بەبێ ئەمە گۆڕانکاری یەکسەر نایەت
-- ═══════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['workers','worker_days']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then
      null;
    end;
  end loop;
end $$;

alter table public.workers     replica identity full;
alter table public.worker_days replica identity full;


-- ═══════════════════════════════════════════════════════════════════════════
--  ٥) پشکنین — دەبێت 2 و 2 بگەڕێننەوە
-- ═══════════════════════════════════════════════════════════════════════════
select
  (select count(*) from information_schema.tables
    where table_schema = 'public' and table_name in ('workers','worker_days')) as tables_created,
  (select count(*) from pg_publication_tables
    where pubname = 'supabase_realtime'
      and tablename in ('workers','worker_days'))                              as realtime_enabled;
