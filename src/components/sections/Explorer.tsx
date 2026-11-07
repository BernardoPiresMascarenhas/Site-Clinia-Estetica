"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { explorer, treatments } from "@/data/site";
import { useTreatmentDrawer } from "@/components/interactive/TreatmentDrawer";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";

const SHAPES: Record<string, string> = {
  arch: "50% 50% 3% 3% / 38% 38% 3% 3%",
  circle: "50% 50% 50% 50% / 50% 50% 50% 50%",
  seed: "62% 38% 55% 45% / 48% 52% 48% 52%",
  pill: "50% 50% 50% 50% / 30% 30% 30% 30%",
  idle: "46% 54% 50% 50% / 40% 40% 60% 60%",
};

/**
 * EXPLORADOR DE CUIDADOS — navegação por temas (não é diagnóstico).
 * A fotografia vive dentro de uma forma que se transforma a cada escolha
 * (arco → lente → semente → cápsula), com um halo de sálvia que gira em
 * contraponto. O resultado aponta categorias de atendimento e abre o painel
 * de detalhes do tratamento.
 */
export function Explorer() {
  const [selected, setSelected] = useState<number | null>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { openTreatment } = useTreatmentDrawer();
  const opt = selected === null ? null : explorer.options[selected];
  const count = explorer.options.length;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const map: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (i + map[e.key] + count) % count;
    setSelected(next);
    optionsRef.current[next]?.focus();
  };

  return (
    <section id="explorar" aria-labelledby="explorer-title" className="relative overflow-hidden bg-linen py-24 sm:py-32 lg:py-40">
      {/* Halo orgânico de fundo */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[38rem] w-[38rem] rounded-full bg-sage-100/70 lg:right-[-10rem] lg:top-24" style={{ borderRadius: SHAPES.seed }} />

      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-8">
        {/* ─── Seleção ─── */}
        <div className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-4 text-sage-700">
            <span aria-hidden className="h-px w-10 bg-sage-500/60" />
            {explorer.eyebrow}
          </p>
          <h2 id="explorer-title" className="font-display mt-6 text-[clamp(2.7rem,10vw,3.6rem)] leading-[0.98] text-ink sm:text-6xl lg:text-[4.6rem]">
            O que você <em className="text-sage-600">deseja</em> cuidar?
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-graphite/75 text-pretty">{explorer.lede}</p>

          <div role="radiogroup" aria-labelledby="explorer-title" className="mt-10 flex flex-wrap gap-2.5 lg:flex-col lg:items-start lg:gap-3">
            {explorer.options.map((o, i) => {
              const checked = selected === i;
              return (
                <button
                  key={o.id}
                  ref={(el) => {
                    optionsRef.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked || (selected === null && i === 0) ? 0 : -1}
                  onClick={() => setSelected(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "group relative flex min-h-12 items-center gap-3 overflow-hidden rounded-full py-2 pl-2 pr-5 text-left text-[0.95rem] transition-[background-color,color,box-shadow] duration-500 [transition-timing-function:var(--ease-velia)]",
                    checked ? "bg-graphite text-ivory shadow-[0_14px_30px_-16px_rgba(35,43,40,0.6)]" : "bg-ivory/70 text-graphite ring-1 ring-graphite/12 hover:bg-ivory",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[1rem] transition-all duration-500",
                      checked ? "rotate-180 bg-sage-500 text-ivory" : "bg-sage-100 text-sage-700 group-hover:rotate-45",
                    )}
                  >
                    {o.glyph}
                  </span>
                  {o.label}
                </button>
              );
            })}
          </div>
          <p className="mt-8 max-w-sm text-xs leading-relaxed text-graphite/55">{explorer.disclaimer}</p>
        </div>

        {/* ─── Composição de resultado ─── */}
        <div className="relative lg:col-span-6 lg:col-start-7" aria-live="polite">
          <div className="relative mx-auto grid max-w-xl gap-8 sm:grid-cols-[1fr_1fr] sm:items-end lg:max-w-none">
            <div className="relative">
              {/* Halo que gira em contraponto */}
              <motion.div
                aria-hidden
                className="absolute -inset-4 border border-sage-500/40"
                animate={{ borderRadius: SHAPES[opt?.shape ?? "idle"], rotate: selected === null ? 0 : selected * 24 - 12 }}
                transition={{ duration: 1.2, ease }}
              />
              <motion.div
                className="relative aspect-[4/5] overflow-hidden bg-sage-100"
                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                animate={{ borderRadius: SHAPES[opt?.shape ?? "idle"] }}
                transition={{ duration: 1.1, ease }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={opt?.id ?? "idle"}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.12 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease }}
                  >
                    <Image
                      src={opt?.image.src ?? "/images/gallery-fabric.jpg"}
                      alt={opt?.image.alt ?? ""}
                      fill
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 80vw"
                      quality={86}
                      className="object-cover"
                      style={{ objectPosition: opt?.image.pos ?? "50% 50%" }}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <span className="tabular absolute -bottom-9 left-0 text-xs text-graphite/50">
                {selected === null ? "—" : `Tema 0${selected + 1} / 0${count}`}
              </span>
            </div>

            <div className="relative min-h-[17rem] pt-6 sm:pt-0">
              <AnimatePresence mode="wait">
                {opt ? (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <p className="eyebrow text-[0.62rem] text-sage-700">{opt.label}</p>
                    <h3 className="font-display mt-4 text-[2rem] leading-[1.05] text-ink lg:text-[2.35rem]">{opt.headline}</h3>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-graphite/75 text-pretty">{opt.text}</p>
                    <p className="mt-7 text-xs uppercase tracking-[0.18em] text-graphite/50">Categorias para explorar</p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {opt.related.map((id) => {
                        const t = treatments.find((x) => x.id === id)!;
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              onClick={() => openTreatment(id)}
                              className="group flex w-full items-center justify-between gap-4 border-b border-graphite/15 py-3 text-left text-[0.95rem] text-ink transition-colors hover:text-sage-700"
                            >
                              <span>
                                <span className="tabular mr-3 text-xs text-graphite/40">{t.index}</span>
                                {t.name}
                              </span>
                              <Arrow dir="up-right" className="shrink-0 transition-transform duration-500 group-hover:rotate-45" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <p className="font-display text-[2rem] leading-[1.08] text-ink/80 lg:text-[2.35rem]">
                      Escolha um tema e veja a composição <em className="text-sage-600">ganhar forma.</em>
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-graphite/60">
                      Cada tema revela informações gerais e as categorias de atendimento relacionadas — sem perguntas pessoais.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
