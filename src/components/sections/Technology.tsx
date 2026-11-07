"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { technology } from "@/data/site";
import { DetailLens } from "@/components/interactive/DetailLens";

/**
 * TECNOLOGIA & CUIDADO — mudança de ritmo.
 * A superfície escura entra como uma "cúpula": o topo começa em arco amplo e
 * se aplana conforme a seção ocupa a tela (transição entre superfícies).
 */
export function Technology() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const r = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, 0]);
  const h = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [14, 0]);
  const borderRadius = useTransform([r, h], ([rv, hv]: number[]) => `${rv}% ${rv}% 0 0 / ${hv}rem ${hv}rem 0 0`);
  const scaleX = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.92, 1]);

  const { scrollYProgress: inner } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const texY = useTransform(inner, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "10%"]);

  return (
    <section ref={ref} aria-labelledby="tech-title" className="relative bg-ivory">
      <motion.div style={{ borderRadius, scaleX }} className="on-dark relative origin-top overflow-hidden bg-graphite text-ivory">
        {/* Textura sálvia em paralaxe, quase imperceptível */}
        <motion.div aria-hidden style={{ y: texY }} className="pointer-events-none absolute inset-x-0 -top-[10%] h-[120%] opacity-[0.09] mix-blend-screen">
          <Image src={technology.texture.src} alt="" fill sizes="100vw" quality={72} className="object-cover" />
        </motion.div>

        <div className="shell relative py-24 sm:py-32 lg:py-40">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <p className="eyebrow flex items-center gap-4 text-sage-300">
                <span aria-hidden className="h-px w-10 bg-sage-300/50" />
                {technology.eyebrow}
              </p>
              <h2 id="tech-title" className="font-display mt-6 text-[clamp(2.9rem,11vw,3.8rem)] leading-[0.96] sm:text-6xl lg:text-[5.6rem]">
                <span className="line-mask">
                  <span className="reveal-up block">{technology.title[0]}</span>
                </span>
                <span className="line-mask">
                  <em className="reveal-up block text-nude" style={{ ["--d" as string]: "0.1s" }}>
                    {technology.title[1]}
                  </em>
                </span>
                <span className="line-mask">
                  <span className="reveal-up block" style={{ ["--d" as string]: "0.2s" }}>
                    {technology.title[2]}
                  </span>
                </span>
              </h2>
              <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-ivory/70 text-pretty">{technology.lede}</p>
            </div>

            <div className="lg:col-span-7 lg:pt-6">
              <DetailLens image={technology.lens.image} hint={technology.lens.hint} hintTouch={technology.lens.hintTouch} />
            </div>
          </div>

          <dl className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
            {technology.pillars.map((p, i) => (
              <div key={p.k} className="reveal-up border-t border-ivory/15 pt-6" style={{ ["--d" as string]: `${i * 0.1}s` }}>
                <dt className="flex items-baseline justify-between">
                  <span className="font-display text-[2rem] leading-none">{p.k}</span>
                  <span className="tabular text-xs text-sage-300">0{i + 1}</span>
                </dt>
                <dd className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-ivory/65 text-pretty">{p.text}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-16 max-w-xl text-xs leading-relaxed text-ivory/40">{technology.note}</p>
        </div>
      </motion.div>
    </section>
  );
}
