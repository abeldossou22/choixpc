// Pays proposés à l'inscription : code ISO + indicatif téléphonique.
// Les noms sont générés dans la langue du site par le navigateur (Intl.DisplayNames).
export const COUNTRIES: { code: string; dial: string }[] = [
  // Afrique de l'Ouest
  { code: "BJ", dial: "229" }, { code: "TG", dial: "228" }, { code: "CI", dial: "225" }, { code: "SN", dial: "221" },
  { code: "BF", dial: "226" }, { code: "ML", dial: "223" }, { code: "NE", dial: "227" }, { code: "GN", dial: "224" },
  { code: "NG", dial: "234" }, { code: "GH", dial: "233" }, { code: "LR", dial: "231" }, { code: "SL", dial: "232" },
  { code: "GM", dial: "220" }, { code: "GW", dial: "245" }, { code: "CV", dial: "238" }, { code: "MR", dial: "222" },
  // Afrique centrale
  { code: "CM", dial: "237" }, { code: "GA", dial: "241" }, { code: "CG", dial: "242" }, { code: "CD", dial: "243" },
  { code: "TD", dial: "235" }, { code: "CF", dial: "236" }, { code: "GQ", dial: "240" }, { code: "ST", dial: "239" },
  { code: "AO", dial: "244" },
  // Afrique du Nord
  { code: "MA", dial: "212" }, { code: "DZ", dial: "213" }, { code: "TN", dial: "216" }, { code: "LY", dial: "218" },
  { code: "EG", dial: "20" }, { code: "SD", dial: "249" },
  // Afrique de l'Est et australe
  { code: "KE", dial: "254" }, { code: "TZ", dial: "255" }, { code: "UG", dial: "256" }, { code: "RW", dial: "250" },
  { code: "BI", dial: "257" }, { code: "ET", dial: "251" }, { code: "DJ", dial: "253" }, { code: "SO", dial: "252" },
  { code: "SS", dial: "211" }, { code: "ER", dial: "291" }, { code: "MG", dial: "261" }, { code: "MU", dial: "230" },
  { code: "KM", dial: "269" }, { code: "SC", dial: "248" }, { code: "ZA", dial: "27" }, { code: "ZM", dial: "260" },
  { code: "ZW", dial: "263" }, { code: "MZ", dial: "258" }, { code: "MW", dial: "265" }, { code: "BW", dial: "267" },
  { code: "NA", dial: "264" }, { code: "LS", dial: "266" }, { code: "SZ", dial: "268" },
  // Reste du monde (diaspora et autres)
  { code: "FR", dial: "33" }, { code: "BE", dial: "32" }, { code: "CH", dial: "41" }, { code: "LU", dial: "352" },
  { code: "CA", dial: "1" }, { code: "US", dial: "1" }, { code: "GB", dial: "44" }, { code: "DE", dial: "49" },
  { code: "ES", dial: "34" }, { code: "IT", dial: "39" }, { code: "PT", dial: "351" }, { code: "NL", dial: "31" },
  { code: "TR", dial: "90" }, { code: "AE", dial: "971" }, { code: "SA", dial: "966" }, { code: "QA", dial: "974" },
  { code: "LB", dial: "961" }, { code: "IN", dial: "91" }, { code: "CN", dial: "86" }, { code: "BR", dial: "55" },
  { code: "HT", dial: "509" },
];

export const DEFAULT_COUNTRY = "BJ";

export const isCountry = (code: unknown): code is string =>
  typeof code === "string" && COUNTRIES.some(c => c.code === code);

export const dialOf = (code: string) => COUNTRIES.find(c => c.code === code)?.dial ?? "229";

export function countryName(code: string, locale: "fr" | "en"): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** Liste triée par nom dans la langue demandée. */
export function countryOptions(locale: "fr" | "en") {
  return COUNTRIES
    .map(c => ({ ...c, name: countryName(c.code, locale) }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
