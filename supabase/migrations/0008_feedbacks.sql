-- ChoixPC — avis des utilisateurs sur leurs recommandations
-- À exécuter après 0007_hevelerp_fix.sql (SQL Editor → New query → Run).

-- Un seul avis par analyse. Supprimé avec l'analyse et donc avec le compte.
create table if not exists public.feedbacks (
  id           uuid primary key default gen_random_uuid(),
  analysis_id  uuid not null unique references public.analyses(id) on delete cascade,
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  rating       smallint not null check (rating between 1 and 5),
  comment      text check (char_length(comment) <= 1000),
  created_at   timestamptz not null default now()
);
create index if not exists feedbacks_created_idx on public.feedbacks (created_at desc);

alter table public.feedbacks enable row level security;

drop policy if exists "avis: lecture perso" on public.feedbacks;
create policy "avis: lecture perso" on public.feedbacks
  for select using (auth.uid() = user_id);
-- L'avis doit porter sur une analyse de l'utilisateur.
drop policy if exists "avis: ajout perso" on public.feedbacks;
create policy "avis: ajout perso" on public.feedbacks
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.analyses a where a.id = analysis_id and a.user_id = auth.uid())
  );
