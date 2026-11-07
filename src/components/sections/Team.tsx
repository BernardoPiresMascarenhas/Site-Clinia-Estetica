"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { team } from "@/data/site";
import { ease } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";

/**
 * PROFISSIONAIS — um "baralho" de retratos.
 * O retrato da frente pode ser arrastado (ou avançado pelos botões/teclado) e
 * volta para o fundo da pilha; as fichas ao lado trocam em sincronia.
 * Perfis claramente identificados como ilustrativos.
 */
export function Team() {
  const [order, setOrder] = useState(team.members.map((_, i) => i));
  const front = order[0];
  const member = team.members[front];

  const next = () => setOrder((o) => [...o.slice(1), o[0]]);
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) next();
  };

  return (
    <section id="equipe" aria-labelledby="team-title" className="relative overflow-hidden bg-sage-100/60 py-24 sm:py-32 lg:py-40">
      <div className="shell grid lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Deck */}
        <div className="relative order-3 mx-auto mt-7 w-full max-w-[18.5rem] xs:max-w-[19.5rem] sm:max-w-[24rem] lg:order-1 lg:col-span-5 lg:mt-0 lg:max-w-[27rem]">
          <div className="relative aspect-[4/5] lg:aspect-[3/4]">
            {order
              .slice()
              .reverse()
              .map((idx) => {
                const depth = order.indexOf(idx);
                const m = team.members[idx];
                const isFront = depth === 0;
                return (
                  <motion.div
                    key={m.name}
                    className="absolute inset-0 touch-pan-y overflow-hidden rounded-[1.25rem] bg-ivory shadow-[0_30px_60px_-35px_rgba(35,43,40,0.55)]"
                    style={{ zIndex: 10 - depth, WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                    animate={{
                      rotate: depth === 0 ? 0 : depth === 1 ? -5 : 6,
                      x: depth === 0 ? 0 : depth === 1 ? -22 : 24,
                      y: depth * 12,
                      scale: 1 - depth * 0.05,
                    }}
                    transition={{ duration: 0.8, ease }}
                    drag={isFront ? "x" : false}
                    dragSnapToOrigin
                    dragElastic={0.6}
                    onDragEnd={isFront ? onDragEnd : undefined}
                    whileDrag={{ rotate: 4, cursor: "grabbing" }}
                    aria-hidden={!isFront}
                  >
                    <Image
                      src={m.image.src}
                      alt={isFront ? m.image.alt : ""}
                      fill
                      sizes="(min-width: 1024px) 27rem, 80vw"
                      quality={86}
                      draggable={false}
                      className="pointer-events-none object-cover [filter:saturate(0.85)]"
                      style={{ objectPosition: m.image.pos }}
                    />
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-ivory/92 px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] text-graphite">
                      <span>Perfil ilustrativo</span>
                      <span className="tabular text-graphite/50">0{idx + 1}</span>
                    </div>
                  </motion.div>
                );
              })}
          </div>
          <p className="mt-10 hidden text-xs text-graphite/50 lg:block">Arraste o retrato ou use as setas.</p>
        </div>

        {/* Texto + ficha */}
        <div className="max-lg:contents lg:order-2 lg:col-span-6 lg:col-start-7">
          <div className="order-1">
          <p className="eyebrow flex items-center gap-4 text-sage-700">
            <span aria-hidden className="h-px w-10 bg-sage-500/60" />
            {team.eyebrow}
          </p>
          <h2 id="team-title" className="font-display mt-6 text-[clamp(2.7rem,10vw,3.6rem)] leading-[0.98] text-ink sm:text-6xl lg:text-[4.8rem]">
            Quem cuida, <em className="text-sage-600">cuida com atenção.</em>
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-graphite/75 text-pretty">{team.lede}</p>
          </div>

          <div className="max-lg:contents lg:mt-12 lg:border-t lg:border-graphite/15 lg:pt-8" aria-live="polite">
            {/* Nome + função: no mobile, logo acima do retrato */}
            <div className="order-2 mt-10 border-t border-graphite/15 pt-6 lg:mt-0 lg:border-0 lg:pt-0">
              <AnimatePresence mode="wait">
                <motion.div key={member.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-[2.4rem] leading-none text-ink">{member.name}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-graphite/50">Nome fictício</span>
                </div>
                <p className="mt-3 text-[0.95rem] text-sage-700">{member.role}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Frase + especialidades: no mobile, logo abaixo do retrato */}
            <div className="order-4 mt-10 lg:mt-0">
              <AnimatePresence mode="wait">
                <motion.div key={member.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease }}>
                <blockquote className="font-display lg:mt-6 max-w-md text-[1.45rem] italic leading-snug text-graphite/85">“{member.quote}”</blockquote>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {member.focus.map((f) => (
                    <li key={f} className="rounded-full bg-ivory/80 px-3.5 py-1.5 text-[0.8rem] text-graphite/75">
                      {f}
                    </li>
                  ))}
                </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="order-5 mt-7 flex items-center gap-3 lg:mt-10">
              <button type="button" onClick={prev} aria-label="Perfil anterior" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-graphite/20 transition hover:bg-graphite hover:text-ivory">
                <Arrow dir="left" />
              </button>
              <button type="button" onClick={next} aria-label="Próximo perfil" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-graphite/20 transition hover:bg-graphite hover:text-ivory">
                <Arrow />
              </button>
              <div className="ml-3 flex gap-1.5" aria-hidden>
                {team.members.map((m, i) => (
                  <span key={m.name} className={`h-1 rounded-full transition-all duration-500 ${i === front ? "w-8 bg-graphite" : "w-2 bg-graphite/20"}`} />
                ))}
              </div>
              <span className="ml-auto text-[0.7rem] text-graphite/50 lg:hidden">Arraste o retrato</span>
            </div>
            <p className="order-6 mt-6 max-w-md text-xs leading-relaxed text-graphite/50 lg:mt-8">
              Fotografias de banco de imagens. Os perfis não representam profissionais reais e não indicam formação, registro ou experiência.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
