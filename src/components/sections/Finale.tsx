"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { finale } from "@/data/site";
import { Arrow } from "@/components/ui/Arrow";

/**
 * CTA FINAL — "a lente se abre".
 * Em contraste com o arco do Hero, aqui a forma é o círculo: a fotografia
 * começa como uma pequena lente e se expande com a rolagem, enquanto o nome
 * VÉLIA atravessa a composição em escala monumental.
 */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const radius = useTransform(scrollYProgress, [0, 1], reduce ? [72, 72] : [16, 72]);
  const clipPath = useTransform(radius, (r) => `circle(${r}% at 50% 50%)`);
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.3, 1]);
  const wordX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-4%"]);

  return (
    <section ref={ref} aria-labelledby="finale-title" className="on-dark relative overflow-hidden bg-graphite-deep text-ivory">
      <div className="shell relative grid gap-12 pb-16 pt-24 sm:pt-32 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-24 lg:pt-40">
        <div className="relative z-10 order-2 lg:order-1 lg:col-span-6">
          <p className="eyebrow flex items-center gap-4 text-sage-300">
            <span aria-hidden className="h-px w-10 bg-sage-300/50" />
            {finale.eyebrow}
          </p>
          <h2 id="finale-title" className="font-display mt-6 text-[clamp(3rem,12vw,4.2rem)] leading-[0.95] sm:text-7xl lg:text-[6.2rem]">
            <span className="line-mask">
              <span className="reveal-up block">{finale.title[0]}</span>
            </span>
            <span className="line-mask">
              <em className="reveal-up block text-nude" style={{ ["--d" as string]: "0.1s" }}>
                {finale.title[1]}
              </em>
            </span>
            <span className="line-mask">
              <span className="reveal-up block" style={{ ["--d" as string]: "0.2s" }}>
                {finale.title[2]}
              </span>
            </span>
          </h2>
          <p className="mt-8 max-w-md leading-relaxed text-ivory/70 text-pretty">{finale.text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href="#agendar" className="btn btn-light">
              Simular agendamento
              <span className="btn-dot">
                <Arrow />
              </span>
            </a>
            <a href="#explorar" className="link-draw text-[0.92rem] text-ivory/85">
              Explorar cuidados
            </a>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-ivory/15" />
            <span aria-hidden className="absolute inset-[7%] rounded-full ring-1 ring-ivory/10" />
            <motion.div className="absolute inset-[3%] overflow-hidden rounded-full" style={{ clipPath, WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}>
              <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
                <Image
                  src={finale.image.src}
                  alt={finale.image.alt}
                  fill
                  sizes="(min-width: 1024px) 34rem, 92vw"
                  quality={90}
                  className="object-cover"
                  style={{ objectPosition: finale.image.pos }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Assinatura monumental */}
      <motion.p
        aria-hidden
        style={{ x: wordX }}
        className="font-display pointer-events-none -mb-[0.2em] select-none whitespace-nowrap text-center text-[34vw] leading-[0.8] tracking-[0.04em] text-transparent [-webkit-text-stroke:1px_rgba(246,243,238,0.18)] lg:text-[26vw]"
      >
        VÉLIA
      </motion.p>
    </section>
  );
}
