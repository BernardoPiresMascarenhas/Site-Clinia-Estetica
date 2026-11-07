"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { journey } from "@/data/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * JORNADA — scroll storytelling.
 * Desktop: um palco fixo (sticky, sem sequestrar a rolagem) onde um anel de
 * progresso se completa, as fotografias se sobrepõem em arcos e o texto troca
 * de capítulo. Mobile: a mesma narrativa em sequência vertical, com um fio
 * condutor que se desenha.
 */
export function Journey() {
  return (
    <section id="jornada" aria-labelledby="journey-title" className="relative bg-ivory">
      <div className="shell pt-24 sm:pt-32 lg:pt-40">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="eyebrow flex items-center gap-4 text-sage-700 lg:col-span-12">
            <span aria-hidden className="h-px w-10 bg-sage-500/60" />
            {journey.eyebrow}
          </p>
          <h2 id="journey-title" className="font-display text-[clamp(2.7rem,10vw,3.6rem)] leading-[0.98] text-ink sm:text-6xl lg:col-span-9 lg:text-[5.4rem]">
            {journey.title[0]} <em className="text-sage-600">{journey.title[1]}</em> {journey.title[2]}
          </h2>
        </div>
      </div>
      <DesktopStory />
      <MobileStory />
    </section>
  );
}

function DesktopStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [step, setStep] = useState(0);
  const n = journey.steps.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const s = Math.min(n - 1, Math.floor(v * n * 0.999));
    setStep((prev) => (prev === s ? prev : s));
  });

  const C = 2 * Math.PI * 46;
  const dash = useTransform(smooth, [0, 1], [C, 0]);
  const current = journey.steps[step];

  return (
    <div ref={ref} className="relative hidden h-[300vh] lg:block">
      <div className="sticky top-[calc(var(--header-h)+var(--safe-top))] h-[calc(100svh-var(--header-h)-var(--safe-top))] overflow-hidden">
        <div className="shell grid h-full grid-cols-12 items-center gap-8 py-10">
          {/* Anel + capítulos */}
          <div className="col-span-2 flex h-full flex-col justify-center gap-10">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-graphite/10" strokeWidth="1" />
                <motion.circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-sage-600" strokeWidth="1.4" strokeDasharray={C} style={{ strokeDashoffset: dash }} />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display tabular text-3xl text-ink">
                  {current.n}
                  <span className="text-base text-graphite/40">/0{n}</span>
                </span>
              </div>
            </div>
            <ol className="flex flex-col gap-3" aria-label="Etapas">
              {journey.steps.map((s, i) => (
                <li key={s.n} className={cn("flex items-center gap-3 text-sm transition-colors duration-500", i === step ? "text-ink" : "text-graphite/40")}>
                  <span className={cn("h-px transition-all duration-700", i === step ? "w-8 bg-sage-600" : "w-3 bg-graphite/30")} />
                  {s.verb}
                </li>
              ))}
            </ol>
          </div>

          {/* Texto do capítulo */}
          <div className="col-span-4 col-start-3 pl-6" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.n}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease }}
              >
                <p className="font-display text-[clamp(4.5rem,7vw,7rem)] italic leading-none text-sage-600">{current.verb}</p>
                <h3 className="mt-6 text-2xl font-medium tracking-[-0.015em] text-ink">{current.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-graphite/75 text-pretty">{current.text}</p>
                <ul className="mt-8 space-y-0 border-t border-graphite/12">
                  {current.points.map((p, i) => (
                    <motion.li
                      key={p}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease }}
                      className="flex items-center justify-between border-b border-graphite/12 py-3 text-[0.95rem]"
                    >
                      {p}
                      <span className="tabular text-xs text-graphite/40">0{i + 1}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fotografias em arcos sobrepostos */}
          <div className="relative col-span-5 col-start-8 h-[min(78%,40rem)]">
            {journey.steps.map((s, i) => (
              <motion.div
                key={s.n}
                className="shape-arch absolute overflow-hidden bg-sage-100 shadow-[0_30px_60px_-30px_rgba(35,43,40,0.45)]"
                style={{
                  width: "72%",
                  height: "88%",
                  left: `${i * 14}%`,
                  top: `${i * 6}%`,
                  zIndex: i,
                  WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                }}
                initial={false}
                animate={{
                  clipPath: i <= step ? "inset(0% 0% 0% 0% round 999px 999px 6px 6px)" : "inset(100% 0% 0% 0% round 999px 999px 6px 6px)",
                  opacity: i < step ? 0.55 : 1,
                }}
                transition={{ duration: 1.1, ease }}
              >
                <Image src={s.image.src} alt={s.image.alt} fill sizes="30vw" quality={86} className="object-cover" style={{ objectPosition: s.image.pos }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileStory() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <div className="shell pb-24 pt-14 sm:pb-32 lg:hidden">
      <ol ref={ref} className="relative pl-10 sm:pl-14">
        {/* Fio condutor */}
        <span aria-hidden className="absolute bottom-0 left-[0.6rem] top-2 w-px bg-graphite/12 sm:left-4" />
        <motion.span aria-hidden className="absolute bottom-0 left-[0.6rem] top-2 w-px origin-top bg-sage-600 sm:left-4" style={{ scaleY }} />
        {journey.steps.map((s, i) => (
          <li key={s.n} className={cn("relative", i > 0 && "mt-16")}>
            <span aria-hidden className="absolute -left-10 top-2 grid h-[1.3rem] w-[1.3rem] place-items-center rounded-full bg-ivory ring-1 ring-sage-600 sm:-left-14 sm:ml-[0.35rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />
            </span>
            <p className="tabular text-xs uppercase tracking-[0.2em] text-graphite/50">Etapa {s.n}</p>
            <p className="font-display mt-2 text-[3.1rem] italic leading-none text-sage-600 sm:text-6xl">{s.verb}</p>
            <div className="reveal-up shape-arch relative mt-6 aspect-[4/4.4] overflow-hidden bg-sage-100 sm:aspect-[4/3]">
              <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 640px) 80vw, 85vw" quality={80} className="object-cover" style={{ objectPosition: s.image.pos }} />
            </div>
            <h3 className="mt-6 text-xl font-medium text-ink">{s.title}</h3>
            <p className="mt-3 leading-relaxed text-graphite/75 text-pretty">{s.text}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.points.map((p) => (
                <li key={p} className="rounded-full px-3.5 py-1.5 text-[0.8rem] text-graphite/75 ring-1 ring-graphite/15">
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
