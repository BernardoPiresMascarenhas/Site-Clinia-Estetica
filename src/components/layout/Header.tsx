"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Arrow } from "@/components/ui/Arrow";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Header fixo.
 *
 * Safari iOS: o header é sempre opaco (marfim) e estende o fundo para dentro de
 * `env(safe-area-inset-top)`. Ele nunca se esconde com transform — assim não há
 * momento em que o conteúdo rolando apareça atrás do relógio/bateria. Sem
 * `backdrop-filter`, que no WebKit pode piscar em elementos fixos durante a rolagem.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, open, () => setOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Indica a seção atual na navegação.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 transition-[box-shadow,background-color] duration-500",
          open ? "z-[70] bg-transparent" : "z-50 bg-ivory",
          scrolled && !open && "shadow-[0_1px_0_rgba(48,58,54,0.09)]",
        )}
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href="#topo" className={cn("relative z-10 transition-colors duration-500", open ? "text-ivory" : "text-graphite")} aria-label={`${site.name} — voltar ao início`}>
            <Logo />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {nav.map((item, i) => {
                const isActive = active === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className="group relative flex items-baseline gap-1.5 rounded-full px-3.5 py-2 text-[0.86rem] text-graphite/80 transition-colors hover:text-graphite"
                    >
                      <span className="tabular text-[0.6rem] text-sage-600/80">0{i + 1}</span>
                      <span>{item.label}</span>
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3.5 bottom-1 h-px origin-left bg-sage-500 transition-transform duration-500 [transition-timing-function:var(--ease-velia)]",
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href="#agendar" className={cn("btn hidden !min-h-11 !px-5 !text-[0.82rem] sm:inline-flex", open && "invisible")}>
              Simular agendamento
            </a>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="relative -mr-2 flex h-12 w-12 items-center justify-center rounded-full lg:hidden"
            >
              <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
              <span aria-hidden className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-6 transition-all duration-500 [transition-timing-function:var(--ease-velia)]",
                    open ? "top-1.5 rotate-45 bg-ivory" : "bg-graphite",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-px transition-all duration-500 [transition-timing-function:var(--ease-velia)]",
                    open ? "bottom-1.5 w-6 -rotate-45 bg-ivory" : "w-4 bg-graphite",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-graphite text-ivory lg:hidden"
            style={{
              paddingTop: "calc(var(--safe-top) + var(--header-h) + 1.5rem)",
              paddingBottom: "max(1.5rem, var(--safe-bottom))",
            }}
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.75, ease }}
          >
            <nav aria-label="Menu móvel" className="shell flex-1">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + i * 0.05, duration: 0.7, ease }}
                    className="border-b border-ivory/12"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between py-4 font-display text-[2.35rem] leading-none xs:text-[2.6rem]"
                    >
                      <span>{item.label}</span>
                      <span className="tabular font-sans text-xs tracking-[0.2em] text-sage-300">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="shell mt-10 flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <a href="#agendar" onClick={() => setOpen(false)} className="btn btn-light w-full justify-between">
                Simular agendamento
                <span className="btn-dot">
                  <Arrow />
                </span>
              </a>
              <p className="max-w-xs text-xs leading-relaxed text-ivory/55">{site.demoNotice}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
