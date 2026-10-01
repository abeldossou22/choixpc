"use client";
import { Link, useT } from "./I18nProvider";
import LanguageSwitch from "./LanguageSwitch";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, UserRound } from "lucide-react";
import { useUser } from "@/lib/useUser";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const user = useUser();
  const t = useT();
  const LINKS = [["/#how", t.nav.how], ["/#features", t.nav.features], ["/#shoda", t.nav.shoda]];
  const cta = user ? { href: "/compte", label: t.common.myAccount } : { href: "/register", label: t.common.startFree };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3">
      <nav
        className="max-w-6xl mx-auto h-16 pl-4 pr-2.5 flex items-center justify-between gap-4 rounded-full transition-all duration-500"
        style={{
          background: scrolled || open ? "var(--glass)" : "transparent",
          backdropFilter: scrolled || open ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled || open ? "blur(20px)" : "none",
          border: scrolled || open ? "1px solid var(--glass-b)" : "1px solid transparent",
          boxShadow: scrolled || open ? "var(--shadow)" : "none",
        }}
      >
        <Link href="/" className="flex-shrink-0"><Logo /></Link>

        <div className="hidden xl:flex items-center gap-1">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}
              className="px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors hover:bg-[var(--input-bg)]"
              style={{ color: "var(--fg-soft)" }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
          {user === null && (
            <Link href="/login" className="hidden md:inline-flex px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-colors hover:bg-[var(--input-bg)]" style={{ color: "var(--fg-soft)" }}>
              {t.common.login}
            </Link>
          )}
          <Link href={cta.href}
            className="hidden md:inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-sm font-semibold whitespace-nowrap rounded-full btn-primary">
            {cta.label}
            <span className="w-7 h-7 rounded-full flex items-center justify-center dot-green">
              {user ? <UserRound size={14} strokeWidth={2.5} /> : <ArrowRight size={14} strokeWidth={2.5} />}
            </span>
          </Link>
          <button onClick={() => setOpen(!open)} aria-label={t.common.menu}
            className="xl:hidden w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full"
            style={{ color: "var(--fg)", border: "1px solid var(--border)", background: "var(--bg-card)" }}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="xl:hidden max-w-6xl mx-auto mt-2 p-3 flex flex-col gap-1 rounded-3xl glass" style={{ boxShadow: "var(--shadow)" }}>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}
              className="py-3 px-4 text-sm font-medium rounded-2xl"
              style={{ color: "var(--fg-soft)" }}
              onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          {user === null && (
            <Link href="/login" className="md:hidden py-3 px-4 text-sm font-medium rounded-2xl" style={{ color: "var(--fg-soft)" }} onClick={() => setOpen(false)}>
              {t.common.login}
            </Link>
          )}
          <Link href={cta.href}
            className="md:hidden mt-1 py-3.5 text-center text-sm font-semibold rounded-full btn-primary"
            onClick={() => setOpen(false)}>
            {cta.label}
          </Link>
        </div>
      )}
    </header>
  );
}
