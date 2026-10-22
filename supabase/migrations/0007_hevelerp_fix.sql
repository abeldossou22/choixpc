-- ChoixPC — correctif de 0006 : l'envoi à hevelerp fonctionne même si les migrations 0004
-- (pays) ou 0005 (profil) n'ont pas été exécutées.
-- À exécuter après 0006_hevelerp.sql (SQL Editor → New query → Run).

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
