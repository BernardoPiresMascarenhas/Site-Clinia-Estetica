"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero } from "@/data/site";
import { ease } from "@/lib/motion";
import { Arrow } from "@/components/ui/Arrow";
import { RotatingSeal } from "@/components/ui/RotatingSeal";

/**
 * HERO — "o arco que se abre".
 * A fotografia nasce como uma pequena cápsula no centro do arco e se abre até a
 * forma completa (clip-path), enquanto o título sobe em linhas mascaradas.
 * Na primeira rolagem, o arco se transforma suavemente em uma "semente"
 * (raio inferior cresce) e a imagem desliza em paralaxe discreta.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const radiusBottom = useTransform(scrollYProgress, [0, 0.7], ["8px", "48%"]);
  const archRadius = useTransform(radiusBottom, (b) => `999px 999px ${b} ${b}`);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const sealY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-60%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-8%"]);

  const base = 0.35; // atraso inicial para a abertura do arco

  return (
    <section
      ref={ref}
      id="topo"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-ivory"
      style={{ paddingTop: "calc(var(--safe-top) + var(--header-h))" }}
    >
      {/* Linha-guia e grade sutil: arquitetura da página */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="shell relative h-full">
          <div className="absolute bottom-0 left-[58%] top-0 hidden w-px bg-graphite/[0.07] lg:block" />
        </div>
      </div>

      <div className="shell relative grid min-h-[calc(100svh-var(--header-h)-var(--safe-top))] grid-cols-1 gap-y-8 pb-10 pt-6 lg:grid-cols-12 lg:gap-x-8 lg:pb-14 lg:pt-10">
        {/* ─── Texto ─── */}
        <motion.div style={{ y: textY }} className="relative z-10 flex flex-col lg:col-span-7 lg:justify-between lg:py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: base + 0.2, duration: 1 }}
            className="flex items-center gap-4 text-sage-700"
          >
            <span className="eyebrow">{hero.kicker}</span>
            <span aria-hidden className="h-px w-10 bg-sage-500/60" />
            <span className="hidden text-[0.72rem] text-graphite/60 xs:inline">Projeto conceitual</span>
          </motion.div>

          <div>
            <h1
              id="hero-title"
              className="font-display mt-6 text-[clamp(3.05rem,13.6vw,4.4rem)] leading-[0.94] text-ink md:text-[clamp(4.6rem,8.6vw,6.2rem)] lg:mt-0 lg:text-[clamp(5rem,7.4vw,8.75rem)] lg:leading-[0.9]"
            >
              {hero.titleLines.map((line, i) => (
                <span key={i} className="line-mask">
                  <motion.span
                    className={line.italic ? "block italic text-sage-600 lg:pl-[0.9em]" : "block"}
                    initial={{ y: "108%" }}
                    animate={{ y: "0%" }}
                    transition={{ delay: base + 0.25 + i * 0.09, duration: 1.15, ease }}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.div
            className="mt-10 hidden max-w-2xl flex-col items-start gap-7 lg:flex"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: base + 0.85, duration: 1, ease }}
          >
            <HeroCopy />
          </motion.div>
        </motion.div>

        {/* ─── Fotografia em arco ─── */}
        <div className="relative lg:col-span-5 lg:col-start-8">
          <div className="relative mx-auto w-full max-w-[34rem] lg:ml-auto lg:mr-0">
            <motion.div
              className="relative aspect-[4/4.6] w-full overflow-hidden bg-sage-100 sm:aspect-[4/4.4] lg:aspect-[4/5.35]"
              style={{ borderRadius: archRadius, WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ clipPath: "inset(34% 32% 34% 32% round 999px)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
                transition={{ delay: base, duration: 1.6, ease }}
              >
                <motion.div className="absolute inset-[-6%_0]" style={{ y: imgY }}>
                  <motion.div
                    className="relative h-full w-full"
                    initial={{ scale: 1.22 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: base, duration: 2.2, ease }}
                  >
                    <Image
                      src={hero.image.src}
                      alt={hero.image.alt}
                      fill
                      priority
                      quality={90}
                      sizes="(min-width: 1024px) 40vw, (min-width: 640px) 34rem, 92vw"
                      className="object-cover"
                      style={{ objectPosition: hero.image.pos }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Semente com textura + selo giratório */}
            <motion.div
              style={{ y: sealY }}
              className="absolute -bottom-8 right-3 z-10 sm:-left-10 sm:right-auto lg:-left-20 lg:bottom-[12%]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: base + 1.1, duration: 1.1, ease }}
            >
              <div className="relative grid h-28 w-28 place-items-center sm:h-36 sm:w-36 lg:h-44 lg:w-44">
                <RotatingSeal text="Beleza natural · Cuidado individual · Escuta atenta · " className="absolute inset-0 text-graphite" />
                <div className="relative h-[58%] w-[58%] overflow-hidden rounded-full ring-1 ring-ivory">
                  <Image src={hero.detail.src} alt="" fill sizes="110px" quality={80} className="object-cover" />
                </div>
              </div>
            </motion.div>

            {/* Notas laterais (desktop) */}
            <motion.ul
              aria-label="Pilares"
              className="absolute -right-1 top-8 hidden flex-col gap-3 text-right text-[0.7rem] uppercase tracking-[0.2em] text-graphite/55 xl:flex"
              style={{ writingMode: "vertical-rl" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: base + 1.3, duration: 1 }}
            >
              <li className="translate-x-10">N° 01 — Rosto, pele, tempo</li>
            </motion.ul>
          </div>
        </div>

        {/* Texto complementar no mobile/tablet (após a fotografia) */}
        <motion.div
          className="flex flex-col gap-8 pt-4 lg:hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + 0.9, duration: 1, ease }}
        >
          <HeroCopy />
        </motion.div>
      </div>

      {/* Indicador de rolagem */}
      <div className="shell relative hidden pb-8 lg:block">
        <div className="flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.22em] text-graphite/55">
          <span className="relative block h-10 w-px overflow-hidden bg-graphite/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[velia-scrollcue_2.4s_var(--ease-soft)_infinite] bg-graphite/70" />
          </span>
          Role para descobrir
        </div>
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <>
      <p className="max-w-[23rem] text-[1.02rem] leading-relaxed text-graphite/80 text-pretty">{hero.lede}</p>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <a href="#tratamentos" className="btn">
          Conhecer tratamentos
          <span className="btn-dot">
            <Arrow />
          </span>
        </a>
        <a href="#explorar" className="link-draw text-[0.92rem] font-medium text-graphite">
          O que você deseja cuidar?
        </a>
      </div>
    </>
  );
}
