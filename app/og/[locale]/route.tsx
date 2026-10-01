import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/i18n";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

export const runtime = "edge";

// Image affichée quand le site est partagé (WhatsApp, Facebook, X, LinkedIn…) : /og/fr et /og/en
export async function GET(_req: Request, { params }: { params: { locale: string } }) {
  const t = getDictionary(isLocale(params.locale) ? params.locale : defaultLocale).meta;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#070814", color: "#FFFFFF", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", top: -220, left: -120, width: 760, height: 760, borderRadius: 760, background: "radial-gradient(circle, rgba(91,103,240,0.55) 0%, rgba(91,103,240,0) 70%)" }} />
        <div style={{ position: "absolute", bottom: -300, right: -160, width: 820, height: 820, borderRadius: 820, background: "radial-gradient(circle, rgba(46,201,122,0.45) 0%, rgba(46,201,122,0) 70%)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: "linear-gradient(135deg, #5B67F0, #2EC97A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4.5" width="18" height="12" rx="2.5" stroke="#fff" strokeWidth="1.9" />
              <path d="M8.5 10.5l2.3 2.3 4.7-4.6" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 20h6" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>ChoixPC</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3, maxWidth: 960 }}>{t.ogTagline}</div>
          <div style={{ marginTop: 28, fontSize: 34, color: "rgba(255,255,255,0.72)" }}>{t.ogSub}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          <div style={{ display: "flex" }}>choixpc.hevelcare.com</div>
          <div style={{ display: "flex", padding: "12px 26px", borderRadius: 999, background: "#2EC97A", color: "#0F1026", fontWeight: 700 }}>HevelCare</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
