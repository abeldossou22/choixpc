"use client";
import { useState, useEffect, useRef } from "react";
import Reveal from "./Reveal";
import { useT } from "./I18nProvider";

const PHOTOS = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces",
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const t = useT().testimonials;
  const TESTIMONIALS = t.items.map((item, i) => ({ ...item, photo: PHOTOS[i], rating: 5 }));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % PHOTOS.length), 4800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (ref.current) {
      const card = ref.current.children[active] as HTMLElement;
      if (card) ref.current.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
    }
  }, [active]);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-10">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="text-sm font-semibold mb-4" style={{ color: "var(--fg)" }}>{t.label}</div>
            <h2 className="font-display font-bold tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "var(--fg)" }}>
              {t.title1} <span className="text-gradient">{t.titleHi}</span>
            </h2>
          </div>
          <p className="text-base max-w-sm md:text-right" style={{ color: "var(--fg-mute)" }}>
            {t.sub}
          </p>
        </Reveal>

        <div ref={ref}
          className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory -mx-5 px-5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {TESTIMONIALS.map((item, i) => {
            const on = active === i;
            return (
              <div key={item.name} onClick={() => setActive(i)}
                className="flex-shrink-0 w-[290px] sm:w-[360px] rounded-[28px] p-7 snap-center cursor-pointer transition-[background-color,color,box-shadow,transform] duration-700 ease-smooth flex flex-col"
                style={{
                  background: on ? "var(--strong)" : "var(--bg-card)",
                  color: on ? "var(--on-strong)" : "var(--fg)",
                  border: on ? "1px solid transparent" : "1px solid var(--border)",
                  boxShadow: on ? "var(--shadow)" : "none",
                }}>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#F5A623">
                      <path d="M12 2l2.9 6.5L22 9.3l-5 4.9 1.2 7.1L12 17.8l-6.2 3.5L7 14.2 2 9.3l7.1-.8L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[15px] leading-relaxed mb-8 flex-1" style={{ opacity: on ? 0.92 : 0.75 }}>
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                    style={{ boxShadow: on ? "0 0 0 2px #5B67F0" : "0 0 0 1px var(--border)" }}>
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{item.name}</div>
                    <div className="text-xs" style={{ opacity: 0.55 }}>{item.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`${t.aria} ${i + 1}`}
              className="h-2 rounded-full transition-all duration-700 ease-smooth"
              style={{
                width: active === i ? "28px" : "8px",
                background: active === i ? "var(--blue)" : "var(--border)",
              }} />
          ))}
        </div>
      </div>
    </section>
  );
}
