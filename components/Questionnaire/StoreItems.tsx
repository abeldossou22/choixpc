"use client";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useT } from "@/components/I18nProvider";
import { track } from "@/lib/analytics";
import type { StoreItem } from "@/lib/types";

export default function StoreItems({ items }: { items: StoreItem[] }) {
  const t = useT().questionnaire.result.store;
  const locale = useLocale();
  return (
    <div className="rounded-2xl px-5 py-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <h3 className="font-display font-bold text-lg mb-1 tracking-tight" style={{ color: "var(--fg)" }}>{t.title}</h3>
      <p className="text-sm mb-4" style={{ color: "var(--fg-mute)" }}>{t.subtitle}</p>
      <div className="space-y-3">
        {items.map(item => (
          <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => track("store_click", { section: "result" })}
            className="flex gap-3 sm:gap-4 rounded-2xl p-3 transition-all hover:-translate-y-0.5" style={{ border: "1px solid var(--border)" }}>
            {item.image && <img src={item.image} alt={item.title} loading="lazy" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold" style={{ color: "var(--fg)" }}>{item.title}</div>
              {item.reason && <p className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--fg-mute)" }}>{item.reason}</p>}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mt-2">
                <span className="text-sm font-bold" style={{ color: "var(--fg)" }}>{item.price.toLocaleString(locale)} {t.currency}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: "var(--blue-ink)" }}>{t.cta} <ArrowUpRight size={13} /></span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
