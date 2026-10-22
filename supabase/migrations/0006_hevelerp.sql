-- ChoixPC — envoi des inscrits à hevelerp
-- À exécuter après 0005_profile_preferences.sql (SQL Editor → New query → Run).
--
-- Dès qu'un inscrit confirme son adresse email, ses coordonnées partent vers hevelerp : il y
-- apparaît dans Clients comme prospect, avec l'origine « ChoixPC ». L'envoi se fait en arrière-plan
-- (extension pg_net) : une panne côté hevelerp ne bloque jamais une inscription.
--
-- Après cette migration, renseigner la liaison une seule fois (valeurs dans hevelerp →
-- Mon entreprise → Sites partenaires) :
--   insert into private.hevelerp_link (url, anon_key, intake_key)
--   values ('https://….supabase.co', 'clé publique de hevelerp', 'hk_…');
-- puis envoyer les inscrits déjà confirmés :
--   select private.send_to_hevelerp(id) from auth.users where email_confirmed_at is not null;

create extension if not exists pg_net with schema extensions;

-- Schéma non exposé par l'API : ni les visiteurs ni les inscrits n'y ont accès.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.hevelerp_link (
  id         integer primary key default 1 check (id = 1),
  url        text not null,
  anon_key   text not null,
  intake_key text not null
);
revoke all on private.hevelerp_link from public, anon, authenticated;

-- Envoie un inscrit à hevelerp. Sans liaison renseignée, ne fait rien.
create or replace function private.send_to_hevelerp(target uuid)
returns bigint
language plpgsql
security definer set search_path = ''
as $$
declare
  link   private.hevelerp_link;
  p      jsonb;
  offers boolean;
  note   text;
begin
  select * into link from private.hevelerp_link where id = 1;
  if not found then return null; end if;
  -- Lu en jsonb : fonctionne même si une migration précédente (pays, profil) n'a pas été exécutée.
  select to_jsonb(pr) into p from public.profiles pr where pr.id = target;
  if p is null then return null; end if;

  select c.granted into offers from public.consents c
  where c.user_id = target and c.document = 'offres_whatsapp'
  order by c.created_at desc limit 1;

  note := concat_ws(' · ',
    'Inscrit sur ChoixPC le ' || to_char((p ->> 'created_at')::timestamptz at time zone 'Africa/Porto-Novo', 'DD/MM/YYYY'),
    'Pays : ' || (p ->> 'country'),
    'Profil : ' || case when p ->> 'profession' = 'autre' then coalesce(nullif(p ->> 'profession_other', ''), 'autre') else p ->> 'profession' end,
    'Offres WhatsApp : ' || case when coalesce(offers, false) then 'acceptées' else 'refusées' end);

  return net.http_post(
    url     := rtrim(link.url, '/') || '/rest/v1/rpc/intake_prospect',
    headers := jsonb_build_object('Content-Type', 'application/json', 'apikey', link.anon_key, 'Authorization', 'Bearer ' || link.anon_key),
    body    := jsonb_build_object(
      'p_key',   link.intake_key,
      'p_name',  concat_ws(' ', nullif(p ->> 'prenom', 'Inconnu'), nullif(p ->> 'nom', '')),
      'p_phone', nullif(p ->> 'whatsapp', ''),
      'p_email', p ->> 'email',
      'p_note',  note)
  );
end;
$$;
revoke all on function private.send_to_hevelerp(uuid) from public, anon, authenticated;

-- Adresse email confirmée (ou compte créé déjà confirmé) : l'inscrit part vers hevelerp.
create or replace function private.on_user_confirmed()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.email_confirmed_at is not null and (tg_op = 'INSERT' or old.email_confirmed_at is null) then
    begin
      perform private.send_to_hevelerp(new.id);
    exception when others then
      raise warning 'Envoi à hevelerp impossible : %', sqlerrm;
    end;
  end if;
  return null;
end;
$$;
revoke all on function private.on_user_confirmed() from public, anon, authenticated;

-- Nom en « zz_ » : les déclencheurs passent par ordre alphabétique, celui-ci après
-- on_auth_user_created, qui crée le profil.
drop trigger if exists zz_send_to_hevelerp on auth.users;
create trigger zz_send_to_hevelerp
  after insert or update of email_confirmed_at on auth.users
  for each row execute function private.on_user_confirmed();
