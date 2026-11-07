"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { treatments, type Treatment } from "@/data/site";
import { useFocusTrap, useMediaQuery, useScrollLock } from "@/lib/hooks";
import { ease } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";

type Ctx = { openTreatment: (id: string) => void };
const DrawerContext = createContext<Ctx>({ openTreatment: () => {} });

export const useTreatmentDrawer = () => useContext(DrawerContext);

/** Pede ao agendamento demonstrativo que pré-selecione um serviço. */
export function requestBooking(id: string) {
  window.dispatchEvent(new CustomEvent("velia:book", { detail: id }));
  document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function TreatmentDrawerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<Treatment | null>(null);
  const openTreatment = useCallback((id: string) => setCurrent(treatments.find((t) => t.id === id) ?? null), []);
  const value = useMemo(() => ({ openTreatment }), [openTreatment]);
  return (
    <DrawerContext.Provider value={value}>
      {children}
      <Drawer treatment={current} onClose={() => setCurrent(null)} />
    </DrawerContext.Provider>
  );
}

function Drawer({ treatment, onClose }: { treatment: Treatment | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery("(min-width: 768px)");
  const open = !!treatment;
  useScrollLock(open);
  useFocusTrap(ref, open, onClose);

  const panelMotion = desktop
    ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
    : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  return (
    <AnimatePresence>
      {treatment && (
        <div className="fixed inset-0 z-[80]">
          <motion.button
            type="button"
            aria-label="Fechar detalhes"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            {...panelMotion}
            transition={{ duration: 0.7, ease }}
            className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col overflow-hidden rounded-t-[1.75rem] bg-ivory text-graphite md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[min(34rem,92vw)] md:rounded-l-[2rem] md:rounded-tr-none"
          >
            {/* Alça (mobile) */}
            <div aria-hidden className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-graphite/20 md:hidden" />

            <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-4 md:px-9 md:pt-[calc(var(--safe-top)+1.75rem)]">
              <span className="eyebrow text-sage-700">
                {treatment.index} — {treatment.category}
              </span>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                className="group flex h-11 items-center gap-2 rounded-full pl-4 pr-1.5 text-sm text-graphite/80 ring-1 ring-graphite/15 transition hover:bg-graphite hover:text-ivory"
              >
                Fechar
                <span className="grid h-8 w-8 place-items-center rounded-full bg-graphite/[0.06] transition group-hover:bg-ivory/15">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
                    <path d="M1 1l10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-6 pb-[max(1.75rem,var(--safe-bottom))] md:px-9">
              <div className="shape-arch relative mt-2 aspect-[16/11] overflow-hidden bg-sage-100 md:aspect-[4/3.2]">
                <Image
                  src={treatment.image.src}
                  alt={treatment.image.alt}
                  fill
                  sizes="(min-width: 768px) 30rem, 92vw"
                  quality={86}
                  className="object-cover"
                  style={{ objectPosition: treatment.image.pos }}
                />
              </div>

              <h2 id="drawer-title" className="font-display mt-7 text-[2.4rem] leading-[1] text-ink md:text-5xl">
                {treatment.name}
              </h2>
              <p className="mt-5 text-[1rem] leading-relaxed text-graphite/80 text-pretty">{treatment.description}</p>

              <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-graphite/12 pt-6 sm:grid-cols-[1fr_auto]">
                <div>
                  <dt className="eyebrow text-[0.62rem] text-graphite/50">O que costuma envolver</dt>
                  <dd className="mt-3">
                    <ul className="space-y-2">
                      {treatment.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[0.95rem]">
                          <span aria-hidden className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-[0.62rem] text-graphite/50">Duração</dt>
                  <dd className="mt-3 font-display text-2xl text-ink">{treatment.duration}</dd>
                </div>
              </dl>

              <p className="mt-7 rounded-2xl bg-sage-50 px-5 py-4 text-sm leading-relaxed text-sage-700">
                {treatment.note} Conteúdo ilustrativo de um projeto conceitual.
              </p>

              <button
                type="button"
                className="btn mt-7 w-full justify-between"
                onClick={() => {
                  onClose();
                  setTimeout(() => requestBooking(treatment.id), 380);
                }}
              >
                Simular agendamento
                <span className="btn-dot">
                  <Arrow />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
