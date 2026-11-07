"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { manifesto } from "@/data/site";
import { cn } from "@/lib/cn";

const INDENT = ["pl-0", "pl-[0.9em]", "pl-[1.8em]"] as const;

/**
 * MANIFESTO — "escada tipográfica".
 * Uma frase curta em quatro linhas com quebras controladas, descendo em
 * degraus. A única fotografia vive no recuo das duas últimas linhas — dentro
 * da composição, mas fora do fluxo das palavras. Com a rolagem, as palavras
 * se acendem uma a uma e o arco fotográfico se abre de baixo para cima.
 */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Termina assim que a frase inteira está visível: o texto nunca fica "apagado" na leitura.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.82"] });

  const words = manifesto.statement.flatMap((line, li) => line.text.split(" ").map((w) => ({ w, li })));
  const total = words.length;
  const rangeOf = (i: number): [number, number] => [(i / total) * 0.85, (i / total) * 0.85 + 0.22];

  const clip = useTransform(scrollYProgress, [0.25, 0.85], [100, 0]);
  const clipPath = useTransform(clip, (v) => `inset(${reduce ? 0 : v}% 0% 0% 0% round 999px 999px 0.06em 0.06em)`);
  const imgScale = useTransform(scrollYProgress, [0.25, 1], reduce ? [1, 1] : [1.25, 1]);

  const lines = manifesto.statement.map((line, li) => ({
    ...line,
    words: words.map((x, i) => ({ ...x, i })).filter((x) => x.li === li),
  }));
  const top = lines.filter((l) => l.indent < 2);
  const stepped = lines.filter((l) => l.indent === 2);

  const renderLine = (line: (typeof lines)[number]) => (
    <span key={line.text} className={cn("block whitespace-nowrap", INDENT[line.indent], line.em && "italic text-sage-600")}>
      {line.words.map(({ w, i }, k) => (
        <Word key={i} progress={scrollYProgress} range={rangeOf(i)} still={!!reduce}>
          {w}
          {k < line.words.length - 1 ? " " : ""}
        </Word>
      ))}
    </span>
  );

  return (
    <section id="essencia" aria-labelledby="manifesto-title" className="relative bg-ivory py-24 sm:py-32 lg:py-44">
      <div className="shell">
        <div className="mb-10 flex items-center gap-4 sm:mb-14 lg:mb-20">
          <span aria-hidden className="h-px w-10 bg-sage-500/60" />
          <p className="eyebrow text-sage-700">{manifesto.eyebrow}</p>
        </div>

        <div className="grid gap-y-12 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <h2
            id="manifesto-title"
            className="font-display text-[clamp(2.5rem,13.4vw,4.4rem)] leading-[0.98] tracking-[-0.015em] text-ink sm:text-[clamp(4rem,10vw,5.8rem)] lg:col-span-9 lg:text-[clamp(5rem,9.4vw,10.5rem)] lg:leading-[0.96]"
          >
            <span className="sr-only">{manifesto.statement.map((l) => l.text).join(" ")}</span>
            <span aria-hidden ref={ref} className="block">
              {top.map(renderLine)}
              <span className="relative block">
                {/* Arco fotográfico no recuo — não interrompe a leitura */}
                <motion.span
                  className="shape-arch absolute bottom-[0.1em] left-0 top-[0.14em] block w-[1.5em] overflow-hidden bg-sage-100"
                  style={{ clipPath, WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                >
                  <motion.span className="absolute inset-0 block" style={{ scale: imgScale }}>
                    <Image
                      src={manifesto.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 15vw, 30vw"
                      quality={86}
                      className="object-cover"
                      style={{ objectPosition: manifesto.image.pos }}
                    />
                  </motion.span>
                </motion.span>
                {stepped.map(renderLine)}
              </span>
            </span>
          </h2>

          <div className="reveal-up max-w-sm lg:col-span-3 lg:pb-[0.9rem]">
            <span aria-hidden className="block h-px w-12 bg-sage-500/70" />
            <p className="mt-6 text-[1.02rem] leading-relaxed text-graphite/80 text-pretty">{manifesto.support}</p>
            <p className="mt-6 text-[0.68rem] uppercase tracking-[0.22em] text-graphite/45">VÉLIA — N° 02 · Essência</p>
          </div>
        </div>

        {/* Três princípios em escada editorial — não em cards */}
        <ol className="mt-20 grid gap-y-12 sm:mt-28 md:grid-cols-12 md:gap-x-8 lg:mt-36">
          {manifesto.columns.map((c, i) => (
            <li
              key={c.n}
              className={[
                "reveal-up border-t border-graphite/15 pt-6 md:col-span-4",
                i === 1 ? "md:mt-20" : "",
                i === 2 ? "md:mt-40" : "",
              ].join(" ")}
              style={{ ["--d" as string]: `${i * 0.12}s` }}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl italic text-sage-600">{c.n}</span>
                <span className="eyebrow text-[0.62rem] text-graphite/45">Princípio</span>
              </div>
              <h3 className="mt-6 text-xl font-medium tracking-[-0.01em] text-ink">{c.title}</h3>
              <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-graphite/75 text-pretty">{c.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="whitespace-pre">
      {children}
    </motion.span>
  );
}
