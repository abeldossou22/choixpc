"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "var(--bg)" : "transparent",
        opacity: scrolled ? 0.92 : 1,
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-soft)" : "none",
      }}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
              <rect x="2" y="3" width="32" height="22" rx="5" style={{ fill: "var(--text)", fillOpacity: 0.08 }}/>
              <rect x="5" y="6" width="26" height="16" rx="3" style={{ fill: "var(--text)", fillOpacity: 0.05 }}/>
              <path d="M11 14.5L15.5 19.5L25 10.5" stroke="#2EC97A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="15" y="25" width="6" height="4" rx="1.5" style={{ fill: "var(--text)", fillOpacity: 0.15 }}/>
              <rect x="10" y="29" width="16" height="2.5" rx="1.25" style={{ fill: "var(--text)", fillOpacity: 0.15 }}/>
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-tight" style={{ color: "var(--text)" }}>
            Choix<span className="text-[#2EC97A]">PC</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {["#how", "#features", "#shoda"].map((href, i) => (
            <Link key={href} href={href}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-100"
              style={{ color: "var(--text-faint)" }}>
              {["Comment ça marche", "Fonctionnalités", "Vérifier son PC"][i]}
            </Link>
          ))}
          <Link href="/register"
            className="ml-4 px-5 py-2.5 text-sm font-semibold text-white rounded-full transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2EC97A, #22a866)", boxShadow: "0 4px 20px rgba(46,201,122,0.35)" }}>
            Commencer gratuitement
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 transition-colors" style={{ color: "var(--text-soft)" }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-5 py-5 flex flex-col gap-2"
          style={{ background: "var(--bg)", borderTop: "1px solid var(--border-soft)" }}>
          {["#how", "#features", "#shoda"].map((href, i) => (
            <Link key={href} href={href}
              className="py-2.5 px-3 text-sm font-medium rounded-lg"
              style={{ color: "var(--text-soft)" }}
              onClick={() => setMenuOpen(false)}>
              {["Comment ça marche", "Fonctionnalités", "Vérifier son PC"][i]}
            </Link>
          ))}
          <Link href="/register"
            className="mt-2 py-3 text-center text-sm font-semibold text-white rounded-full"
            style={{ background: "linear-gradient(135deg, #2EC97A, #22a866)" }}
            onClick={() => setMenuOpen(false)}>
            Commencer gratuitement
          </Link>
        </div>
      )}
    </header>
  );
}
