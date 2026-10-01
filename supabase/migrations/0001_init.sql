-- ChoixPC — schéma initial
-- À exécuter dans Supabase : SQL Editor → New query → coller ce fichier → Run.

-- ─── Profils ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  prenom      text not null,
  nom         text,
  email       text not null,
  whatsapp    text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Consentements (historique, une ligne par document accepté/refusé) ──────
create table if not exists public.consents (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  document    text not null check (document in ('cgu', 'confidentialite', 'contact_whatsapp', 'offres_whatsapp')),
  version     text not null,
  granted     boolean not null,
  created_at  timestamptz not null default now()
);
create index if not exists consents_user_idx on public.consents (user_id, document, created_at desc);

-- ─── Analyses (questionnaire + résultat) ────────────────────────────────────
create table if not exists public.analyses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  usages        text[] not null default '{}',
  free_text     text,
  budget_label  text,
  budget_min    integer,
  budget_max    integer,
  has_vendor    boolean,
  proposals     jsonb not null default '[]'::jsonb,
  result        jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists analyses_user_idx on public.analyses (user_id, created_at desc);

-- ─── Sécurité : chaque utilisateur ne voit que ses propres données ──────────
alter table public.profiles enable row level security;
alter table public.consents enable row level security;
alter table public.analyses enable row level security;

drop policy if exists "profil: lecture perso" on public.profiles;
create policy "profil: lecture perso" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profil: modification perso" on public.profiles;
create policy "profil: modification perso" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "consentements: lecture perso" on public.consents;
create policy "consentements: lecture perso" on public.consents
  for select using (auth.uid() = user_id);
drop policy if exists "consentements: ajout perso" on public.consents;
create policy "consentements: ajout perso" on public.consents
  for insert with check (auth.uid() = user_id);
-- Pas de update/delete : l'historique des consentements est conservé tel quel.

drop policy if exists "analyses: lecture perso" on public.analyses;
create policy "analyses: lecture perso" on public.analyses
  for select using (auth.uid() = user_id);
drop policy if exists "analyses: ajout perso" on public.analyses;
create policy "analyses: ajout perso" on public.analyses
  for insert with check (auth.uid() = user_id);

-- ─── Création automatique du profil + consentements à l'inscription ─────────
-- Les données viennent de supabase.auth.signUp({ options: { data: {...} } }).
-- L'inscription est refusée si les CGU ou la politique de confidentialité ne sont pas acceptées.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta     jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  consents jsonb := coalesce(meta->'consents', '{}'::jsonb);
  version  text  := coalesce(meta->>'consent_version', 'inconnue');
  doc      text;
begin
  if coalesce((consents->>'cgu')::boolean, false) is not true
     or coalesce((consents->>'confidentialite')::boolean, false) is not true then
    raise exception 'Les CGU et la politique de confidentialité doivent être acceptées.';
  end if;

  insert into public.profiles (id, prenom, nom, email, whatsapp)
  values (
    new.id,
    coalesce(nullif(meta->>'prenom', ''), 'Inconnu'),
    nullif(meta->>'nom', ''),
    new.email,
    coalesce(meta->>'whatsapp', '')
  );

  foreach doc in array array['cgu', 'confidentialite', 'contact_whatsapp', 'offres_whatsapp'] loop
    insert into public.consents (user_id, document, version, granted)
    values (new.id, doc, version, coalesce((consents->>doc)::boolean, false));
  end loop;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
