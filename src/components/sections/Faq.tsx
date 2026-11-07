"use client";

import { useState } from "react";
import { faq } from "@/data/site";
import { cn } from "@/lib/cn";

/** FAQ — acordeão com abertura por grid-rows (sem medir alturas em JS). */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="duvidas" aria-labelledby="faq-title" className="relative bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--safe-top)+3rem)]">
            <p className="eyebrow flex items-center gap-4 text-sage-700">
              <span aria-hidden className="h-px w-10 bg-sage-500/60" />
              Dúvidas frequentes
            </p>
            <h2 id="faq-title" className="font-display mt-6 text-[clamp(2.7rem,10vw,3.6rem)] leading-[0.98] text-ink sm:text-6xl lg:text-[4.4rem]">
              Perguntas, <em className="text-sage-600">com calma.</em>
            </h2>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-graphite/65">
              Respostas coerentes com a natureza conceitual do projeto. Nenhuma orientação aqui substitui avaliação profissional.
            </p>
          </div>
        </div>

        <ul className="lg:col-span-7 lg:col-start-6">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-t border-graphite/15 last:border-b">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-start gap-5 py-6 text-left sm:gap-8 sm:py-7"
                  >
                    <span className="tabular mt-2 w-6 shrink-0 text-xs text-graphite/40">0{i + 1}</span>
                    <span
                      className={cn(
                        "font-display flex-1 text-[1.55rem] leading-[1.15] transition-colors duration-500 sm:text-[1.95rem]",
                        isOpen ? "text-ink" : "text-graphite/70 group-hover:text-ink",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "relative mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-500",
                        isOpen ? "bg-graphite text-ivory" : "ring-1 ring-graphite/20 group-hover:bg-sage-100",
                      )}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span className={cn("absolute h-3.5 w-px bg-current transition-transform duration-500 [transition-timing-function:var(--ease-velia)]", isOpen && "rotate-90 scale-y-0")} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={cn("grid transition-[grid-template-rows] duration-700 [transition-timing-function:var(--ease-velia)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p
                      className={cn(
                        "max-w-xl pb-8 pl-11 pr-4 leading-relaxed text-graphite/75 transition-all duration-700 sm:pl-14 sm:pr-16",
                        isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                      )}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
