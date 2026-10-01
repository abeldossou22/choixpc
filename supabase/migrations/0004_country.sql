-- ChoixPC — pays de l'utilisateur (code ISO à 2 lettres, ex. BJ, SN, NG)
-- À exécuter après 0003_locale.sql. Sert à ne recommander que des ordinateurs disponibles sur place.

alter table public.profiles
  add column if not exists country text check (country is null or country ~ '^[A-Z]{2}$');

create index if not exists profiles_country_idx on public.profiles (country);

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

  insert into public.profiles (id, prenom, nom, email, whatsapp, locale, country)
  values (
    new.id,
    coalesce(nullif(meta->>'prenom', ''), 'Inconnu'),
    nullif(meta->>'nom', ''),
    new.email,
    coalesce(meta->>'whatsapp', ''),
    case when meta->>'locale' = 'en' then 'en' else 'fr' end,
    case when meta->>'country' ~ '^[A-Z]{2}$' then meta->>'country' else null end
  );

  foreach doc in array array['cgu', 'confidentialite', 'contact_whatsapp', 'offres_whatsapp'] loop
    insert into public.consents (user_id, document, version, granted)
    values (new.id, doc, version, coalesce((consents->>doc)::boolean, false));
  end loop;

  return new;
end;
$$;
