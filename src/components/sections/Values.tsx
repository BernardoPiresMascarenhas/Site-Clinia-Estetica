"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { values } from "@/data/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * PRINCÍPIOS — painéis que se expandem (no lugar de depoimentos).
 * Desktop: cinco faixas verticais; a escolhida se abre e revela uma palavra-
 * -síntese em grande escala. Mobile: as mesmas faixas empilhadas.
 */
export function Values() {
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="values-title" className="relative bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4 text-sage-700">
              <span aria-hidden className="h-px w-10 bg-sage-500/60" />
              {values.eyebrow}
            </p>
            <h2 id="values-title" className="font-display mt-6 text-[clamp(2.7rem,10vw,3.6rem)] leading-[0.98] text-ink sm:text-6xl lg:text-[4.8rem]">
              Confiança se constrói <em className="text-sage-600">em cada detalhe.</em>
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-graphite/70 text-pretty lg:col-span-4 lg:col-start-9 lg:pb-2">{values.lede}</p>
        </div>

        <ul className="mt-14 flex flex-col gap-2 lg:mt-20 lg:h-[32rem] lg:flex-row lg:gap-3">
          {values.items.map((v, i) => {
            const isActive = i === active;
            return (
              <li
                key={v.k}
                className={cn(
                  "relative overflow-hidden rounded-[1.25rem] transition-[flex-grow,background-color] duration-[900ms] [transition-timing-function:var(--ease-velia)] lg:min-w-0",
                  isActive ? "bg-graphite text-ivory lg:flex-[3.4]" : "bg-sage-50 text-graphite hover:bg-sage-100 lg:flex-1",
                )}
                onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`value-${i}`}
                  onClick={() => setActive(i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:h-full lg:flex-col lg:items-start lg:justify-start lg:gap-3 lg:py-7"
                >
                  <span className="tabular text-xs opacity-60">0{i + 1}</span>
                  <span
                    className={cn(
                      "flex-1 text-[1.05rem] font-medium tracking-[-0.01em] lg:flex-none lg:origin-bottom-left lg:whitespace-nowrap",
                      !isActive && "lg:absolute lg:bottom-7 lg:left-[calc(50%+0.5rem)] lg:-rotate-90",
                    )}
                  >
                    {v.k}
                  </span>
                  <span aria-hidden className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-500 lg:hidden", isActive ? "rotate-45 bg-ivory/10" : "ring-1 ring-graphite/20")}>
                    <svg viewBox="0 0 12 12" className="h-3 w-3">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </span>
                </button>

                <div id={`value-${i}`} className={cn("grid transition-[grid-template-rows] duration-700 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block", isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden" inert={!isActive}>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          className="px-6 pb-7 lg:px-7 lg:pb-8"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: 0.15, duration: 0.6, ease }}
                        >
                          <p aria-hidden className="font-display text-[3.4rem] italic leading-none text-nude sm:text-6xl lg:text-[5.6rem]">
                            {v.word}
                          </p>
                          <p className="mt-5 max-w-sm text-[0.98rem] leading-relaxed text-ivory/75 text-pretty">{v.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 flex items-center gap-3 text-xs text-graphite/50">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-nude" />
          Espaço preparado para depoimentos reais, publicados somente com autorização.
        </p>
      </div>
    </section>
  );
}
