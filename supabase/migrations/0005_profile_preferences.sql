-- ChoixPC — profil (métier) de l'utilisateur et préférences par analyse
-- À exécuter après 0004_country.sql.

-- Profil choisi à l'inscription (etudiant, comptable, banquier, architecte… ou "autre" + précision).
alter table public.profiles
  add column if not exists profession text,
  add column if not exists profession_other text;

create index if not exists profiles_profession_idx on public.profiles (profession);

-- Choix faits dans le questionnaire, conservés avec chaque analyse.
alter table public.analyses
  add column if not exists os text,
  add column if not exists preferences text[] not null default '{}',
  add column if not exists brand text;

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

  insert into public.profiles (id, prenom, nom, email, whatsapp, locale, country, profession, profession_other)
  values (
    new.id,
    coalesce(nullif(meta->>'prenom', ''), 'Inconnu'),
    nullif(meta->>'nom', ''),
    new.email,
    coalesce(meta->>'whatsapp', ''),
    case when meta->>'locale' = 'en' then 'en' else 'fr' end,
    case when meta->>'country' ~ '^[A-Z]{2}$' then meta->>'country' else null end,
    nullif(left(meta->>'profession', 40), ''),
    nullif(left(meta->>'profession_other', 80), '')
  );

  foreach doc in array array['cgu', 'confidentialite', 'contact_whatsapp', 'offres_whatsapp'] loop
    insert into public.consents (user_id, document, version, granted)
    values (new.id, doc, version, coalesce((consents->>doc)::boolean, false));
  end loop;

  return new;
end;
$$;
