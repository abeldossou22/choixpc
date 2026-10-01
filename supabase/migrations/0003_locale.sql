-- ChoixPC — langue de l'utilisateur (fr / en)
-- À exécuter après 0002_account.sql. Sert à écrire à chaque personne dans sa langue.

alter table public.profiles
  add column if not exists locale text not null default 'fr' check (locale in ('fr', 'en'));

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

  insert into public.profiles (id, prenom, nom, email, whatsapp, locale)
  values (
    new.id,
    coalesce(nullif(meta->>'prenom', ''), 'Inconnu'),
    nullif(meta->>'nom', ''),
    new.email,
    coalesce(meta->>'whatsapp', ''),
    case when meta->>'locale' = 'en' then 'en' else 'fr' end
  );

  foreach doc in array array['cgu', 'confidentialite', 'contact_whatsapp', 'offres_whatsapp'] loop
    insert into public.consents (user_id, document, version, granted)
    values (new.id, doc, version, coalesce((consents->>doc)::boolean, false));
  end loop;

  return new;
end;
$$;
