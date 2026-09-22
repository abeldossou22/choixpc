import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-deep)", borderTop: "1px solid var(--border-soft)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
            <rect x="2" y="3" width="32" height="22" rx="5" style={{ fill: "var(--text)", fillOpacity: 0.06 }}/>
            <rect x="5" y="6" width="26" height="16" rx="3" style={{ fill: "var(--text)", fillOpacity: 0.04 }}/>
            <path d="M11 14.5L15.5 19.5L25 10.5" stroke="#2EC97A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="15" y="25" width="6" height="4" rx="1.5" style={{ fill: "var(--text)", fillOpacity: 0.1 }}/>
            <rect x="10" y="29" width="16" height="2.5" rx="1.25" style={{ fill: "var(--text)", fillOpacity: 0.1 }}/>
          </svg>
          <span className="font-display font-bold text-base" style={{ color: "var(--text)" }}>Choix<span className="text-[#2EC97A]">PC</span></span>
        </Link>
        <p className="text-sm text-center" style={{ color: "var(--text-faint)" }}>
          Un service{" "}
          <a href="https://hevelcare.com" className="text-[#2EC97A] hover:underline font-medium">HevelCare</a>
          {" "}· Conseil informatique pour tous
        </p>
        <p className="text-xs" style={{ color: "var(--text-faint)", opacity: 0.6 }}>© 2026 HevelCare</p>
      </div>
    </footer>
  );
}
