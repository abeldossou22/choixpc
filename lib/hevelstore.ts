import type { StoreItem, StoreProduct } from "./types";

// Articles de la boutique hevelstore (son stock est géré dans hevelerp).
// La boutique n'a pas d'API publique : on lit les produits intégrés à ses pages catalogue.
// Si la lecture échoue, l'analyse continue simplement sans articles.
export const HEVELSTORE_URL = "https://hevel-store.vercel.app";

const MAX_PAGES = 10;
const PAGE_TIMEOUT_MS = 5_000;
const CACHE_SECONDS = 3_600;
const MAX_SUGGESTIONS = 3;
// Catégories qui ne sont pas des équipements à proposer avec un ordinateur.
const EXCLUDED_CATEGORIES = new Set(["ordinateur-portable", "ordinateur-de-bureau", "portable", "telephones", "tondeuse", "camera-surveillance"]);

interface RawProduct {
  id: string; slug: string; title: string; category?: string; categorySlug?: string;
  price?: number; discountedPrice?: number; inStock?: boolean;
  imgs?: { thumbnails?: unknown; previews?: unknown };
}

/** Texte de la page tel que le site l'a transmis à son navigateur (blocs self.__next_f). */
function pagePayload(html: string): string {
  const blocks = html.matchAll(/self\.__next_f\.push\(\[1,"([^"\\]*(?:\\.[^"\\]*)*)"\]\)/g);
  return Array.from(blocks, m => JSON.parse(`"${m[1]}"`) as string).join("");
}

/** Isole le tableau "products" en suivant les crochets, sans se laisser tromper par ceux des textes. */
function extractProducts(html: string): RawProduct[] {
  const text = pagePayload(html);
  const key = '"products":[';
  const at = text.indexOf(key);
  if (at === -1) return [];
  const start = at + key.length - 1;
  let depth = 0, inString = false, escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") {
      if (--depth === 0) return JSON.parse(text.slice(start, i + 1)) as RawProduct[];
    }
  }
  return [];
}

async function fetchPage(page: number): Promise<RawProduct[]> {
  try {
    const res = await fetch(`${HEVELSTORE_URL}/shop-with-sidebar?page=${page}`, {
      signal: AbortSignal.timeout(PAGE_TIMEOUT_MS),
      next: { revalidate: CACHE_SECONDS },
    });
    return res.ok ? extractProducts(await res.text()) : [];
  } catch (err) {
    console.warn(`[ChoixPC hevelstore] Page ${page} illisible :`, err instanceof Error ? err.message : err);
    return [];
  }
}

function firstImage(p: RawProduct): string | undefined {
  const list = [p.imgs?.thumbnails, p.imgs?.previews].find(Array.isArray) as unknown[] | undefined;
  const url = list?.[0];
  return typeof url === "string" && url.startsWith("https://") ? url : undefined;
}

/** Équipements en stock, sans doublons (une copie du même article garde un nom identique). */
export async function getStoreAccessories(): Promise<StoreProduct[]> {
  const pages = await Promise.all(Array.from({ length: MAX_PAGES }, (_, i) => fetchPage(i + 1)));
  const byTitle = new Map<string, StoreProduct>();
  for (const p of pages.flat()) {
    const price = p.discountedPrice || p.price;
    const key = p.title?.trim().toLowerCase();
    if (!key || !p.slug || !price || !p.inStock || byTitle.has(key) || EXCLUDED_CATEGORIES.has(p.categorySlug ?? "")) continue;
    byTitle.set(key, { title: p.title.trim(), slug: p.slug, category: p.category ?? "", price, image: firstImage(p) });
  }
  return Array.from(byTitle.values());
}

/** Transforme les choix du modèle (numéros de la liste) en vrais articles. Un numéro inconnu est ignoré. */
export function pickStoreItems(picks: unknown, catalog: StoreProduct[]): StoreItem[] {
  if (!Array.isArray(picks)) return [];
  const items = new Map<number, StoreItem>();
  for (const pick of picks as { ref?: unknown; reason?: unknown }[]) {
    const ref = Number(pick?.ref);
    const product = catalog[ref - 1];
    if (!product || items.has(ref)) continue;
    const { title, price, image, slug } = product;
    items.set(ref, { title, price, image, url: `${HEVELSTORE_URL}/product/${slug}`, reason: typeof pick.reason === "string" ? pick.reason : "" });
  }
  return Array.from(items.values()).slice(0, MAX_SUGGESTIONS);
}
