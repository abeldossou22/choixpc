export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex items-center justify-center rounded-[10px] flex-shrink-0"
        style={{ width: size, height: size, background: "linear-gradient(135deg, #5B67F0 0%, #2EC97A 100%)", boxShadow: "0 6px 16px -6px rgba(91,103,240,0.6)" }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4.5" width="18" height="12" rx="2.5" stroke="#fff" strokeWidth="1.8" />
          <path d="M8.5 10.5l2.3 2.3 4.7-4.6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 20h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display font-semibold leading-[1.02] text-[15px] tracking-tight" style={{ color: "var(--fg)" }}>
        Choix<br />PC
      </span>
    </span>
  );
}
