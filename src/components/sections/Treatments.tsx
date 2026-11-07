"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { treatments } from "@/data/site";
import { useTreatmentDrawer } from "@/components/interactive/TreatmentDrawer";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";

/**
 * TRATAMENTOS — índice editorial + "palco" fotográfico.
 * Desktop: passar o cursor, focar ou clicar em um item troca a fotografia por
 * uma abertura circular (lente), atualiza o número em grande escala e a
 * categoria. Mobile: cada item se abre como um capítulo, com sua própria imagem.
 */
export function Treatments() {
  const [active, setActive] = useState(0);
  const { openTreatment } = useTreatmentDrawer();
  const current = treatments[active];

  return (
    <section id="tratamentos" aria-labelledby="treat-title" className="relative bg-sage-50 py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4 text-sage-700">
              <span aria-hidden className="h-px w-10 bg-sage-500/60" />
              Tratamentos
            </p>
            <h2 id="treat-title" className="font-display mt-6 text-[clamp(2.7rem,10vw,3.6rem)] leading-[0.98] text-ink sm:text-6xl lg:text-[5.4rem]">
              Cuidados com <em className="text-sage-600">nome</em>,<br className="hidden sm:block" /> tempo e propósito.
            </h2>
          </div>
          <p className="max-w-md text-[1rem] leading-relaxed text-graphite/75 lg:col-span-4 lg:col-start-9 lg:pb-3">
            Serviços ilustrativos para demonstrar como uma clínica pode apresentar seu cardápio de cuidados. A indicação de cada um depende de avaliação profissional.
          </p>
        </header>

        <div className="mt-14 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* ─── Lista ─── */}
          <ol className="lg:col-span-6" aria-label="Lista de tratamentos">
            {treatments.map((t, i) => {
              const isActive = i === active;
              return (
                <li key={t.id} className="border-t border-graphite/15 last:border-b">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`treat-panel-${t.id}`}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => window.matchMedia("(hover: hover) and (min-width: 1024px)").matches && setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex w-full items-center gap-4 py-5 text-left sm:gap-6 lg:py-6"
                  >
                    <span className={cn("tabular w-7 shrink-0 text-xs transition-colors duration-500", isActive ? "text-sage-600" : "text-graphite/40")}>
                      {t.index}
                    </span>
                    <span
                      className={cn(
                        "font-display flex-1 text-[1.65rem] leading-[1.08] transition-all duration-700 [transition-timing-function:var(--ease-velia)] sm:text-[2.1rem] lg:text-[2.35rem]",
                        isActive ? "text-ink lg:translate-x-3" : "text-graphite/55 group-hover:text-graphite/85",
                      )}
                    >
                      {isActive && <em className="mr-2 hidden text-sage-600 lg:inline">—</em>}
                      {t.name}
                    </span>
                    <span
                      className={cn(
                        "hidden shrink-0 rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] transition-colors duration-500 sm:inline",
                        isActive ? "bg-graphite text-ivory" : "text-graphite/45 ring-1 ring-graphite/15",
                      )}
                    >
                      {t.category}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 lg:hidden",
                        isActive ? "rotate-45 bg-graphite text-ivory" : "ring-1 ring-graphite/20",
                      )}
                    >
                      <svg viewBox="0 0 12 12" className="h-3 w-3">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </span>
                  </button>

                  {/* Painel: abre em todos os tamanhos; imagem só no mobile */}
                  <div
                    id={`treat-panel-${t.id}`}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-700 [transition-timing-function:var(--ease-velia)]",
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden" inert={!isActive}>
                      <div className="pb-7 pl-11 sm:pl-[3.25rem] lg:pl-[3.25rem]">
                        <div className="shape-arch relative mb-5 aspect-[5/4] overflow-hidden bg-sage-100 lg:hidden">
                          <Image
                            src={t.image.src}
                            alt={t.image.alt}
                            fill
                            sizes="(min-width: 640px) 80vw, 85vw"
                            quality={80}
                            className="object-cover"
                            style={{ objectPosition: t.image.pos }}
                          />
                        </div>
                        <p className="max-w-md text-[0.98rem] leading-relaxed text-graphite/75 text-pretty">{t.short}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                          <button type="button" onClick={() => openTreatment(t.id)} className="btn btn-ghost !min-h-11 !text-[0.84rem]">
                            Ver detalhes
                            <span className="btn-dot">
                              <Arrow dir="up-right" />
                            </span>
                          </button>
                          <span className="text-xs uppercase tracking-[0.16em] text-graphite/50">{t.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ─── Palco (desktop) ─── */}
          <div className="relative hidden lg:col-span-5 lg:col-start-8 lg:block">
            <div className="sticky top-[calc(var(--header-h)+var(--safe-top)+2rem)]">
              <div className="relative aspect-[4/5] w-full">
                <div className="shape-arch absolute inset-0 overflow-hidden bg-sage-100" style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}>
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={current.id}
                      className="absolute inset-0"
                      initial={{ clipPath: "circle(0% at 50% 58%)" }}
                      animate={{ clipPath: "circle(78% at 50% 58%)" }}
                      exit={{ opacity: 1 }}
                      transition={{ duration: 1.05, ease }}
                    >
                      <motion.div className="absolute inset-0" initial={{ scale: 1.14 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease }}>
                        <Image
                          src={current.image.src}
                          alt={current.image.alt}
                          fill
                          sizes="(min-width: 1024px) 38vw, 1px"
                          quality={86}
                          className="object-cover"
                          style={{ objectPosition: current.image.pos }}
                        />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Número monumental vazado */}
                <div aria-hidden className="pointer-events-none absolute -left-16 -top-10 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={current.index}
                      className="font-display block text-[9rem] leading-none text-transparent [-webkit-text-stroke:1px_var(--color-sage-600)]"
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.8, ease }}
                    >
                      {current.index}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Legenda */}
                <div className="absolute -bottom-5 right-6 left-6 flex items-center justify-between gap-4 rounded-full bg-ivory px-5 py-3 shadow-[0_10px_40px_-18px_rgba(35,43,40,0.4)]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={current.id}
                      className="truncate text-sm text-graphite"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                    >
                      <span className="text-sage-600">{current.category}</span> · {current.duration}
                    </motion.span>
                  </AnimatePresence>
                  <span className="tabular shrink-0 text-xs text-graphite/50">
                    {current.index} / {String(treatments.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <p className="mt-12 text-xs text-graphite/45">Imagens ilustrativas. Não representam resultados de procedimentos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
