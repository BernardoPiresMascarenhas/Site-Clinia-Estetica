"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gallery, type GalleryItem } from "@/data/site";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";

const SHAPE: Record<GalleryItem["shape"], { box: string; radius: string; align: string }> = {
  arch: { box: "w-[15rem] h-[20rem] sm:w-[20rem] sm:h-[27rem] lg:w-[23rem] lg:h-[31rem]", radius: "shape-arch", align: "self-start" },
  wide: { box: "w-[19rem] h-[13rem] sm:w-[27rem] sm:h-[18rem] lg:w-[32rem] lg:h-[21rem]", radius: "rounded-[0.5rem]", align: "self-end" },
  tall: { box: "w-[12.5rem] h-[19rem] sm:w-[16rem] sm:h-[25rem] lg:w-[18rem] lg:h-[28rem]", radius: "rounded-[0.5rem]", align: "self-center" },
  circle: { box: "w-[13rem] h-[13rem] sm:w-[17rem] sm:h-[17rem] lg:w-[20rem] lg:h-[20rem]", radius: "rounded-full", align: "self-start mt-10" },
  rect: { box: "w-[14rem] h-[18rem] sm:w-[19rem] sm:h-[24rem] lg:w-[21rem] lg:h-[27rem]", radius: "rounded-[0.5rem]", align: "self-end" },
  seed: { box: "w-[15rem] h-[18rem] sm:w-[19rem] sm:h-[23rem] lg:w-[22rem] lg:h-[26rem]", radius: "shape-seed", align: "self-center" },
};

/**
 * GALERIA EDITORIAL — uma tira de campanha com formas e alturas alternadas.
 * Arrasta com o mouse, desliza no toque (rolagem nativa), navega por botões ou
 * teclado. Cada imagem abre em um lightbox com abertura circular.
 */
export function Gallery() {
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const drag = useRef({ active: false, x: 0, left: 0, moved: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  // Arrastar com mouse (toque usa a rolagem nativa).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { active: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
  };

  return (
    <section id="galeria" aria-labelledby="gallery-title" className="relative overflow-hidden bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow flex items-center gap-4 text-sage-700">
            <span aria-hidden className="h-px w-10 bg-sage-500/60" />
            Galeria editorial
          </p>
          <h2 id="gallery-title" className="font-display mt-6 text-[clamp(2.7rem,10vw,3.6rem)] leading-[0.98] text-ink sm:text-6xl lg:text-[5.4rem]">
            Uma estética de <em className="text-sage-600">luz,</em>
            <br /> textura e calma.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Imagens anteriores" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-graphite/20 transition hover:bg-graphite hover:text-ivory disabled:opacity-30" disabled={progress <= 0.001}>
            <Arrow dir="left" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Próximas imagens" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-graphite/20 transition hover:bg-graphite hover:text-ivory disabled:opacity-30" disabled={progress >= 0.999}>
            <Arrow />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        aria-label="Galeria de imagens — role horizontalmente"
        className="no-scrollbar mt-14 flex h-[24rem] cursor-grab items-stretch gap-4 overflow-x-auto overscroll-x-contain px-[max(var(--gutter),var(--safe-left))] active:cursor-grabbing sm:h-[31rem] sm:gap-6 lg:mt-20 lg:h-[36rem] lg:gap-8"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {gallery.map((item, i) => {
          const s = SHAPE[item.shape];
          return (
            <li key={item.src} className={cn("flex shrink-0 flex-col gap-3", s.align)}>
              <button
                type="button"
                onClick={() => {
                  if (drag.current.moved) {
                    drag.current.moved = false;
                    return;
                  }
                  setLightbox(i);
                }}
                onDragStart={(e) => e.preventDefault()}
                className={cn("group relative block overflow-hidden bg-sage-100", s.box, s.radius)}
                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                aria-label={`Ampliar imagem: ${item.caption}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 32rem, (min-width: 640px) 27rem, 19rem"
                  quality={80}
                  draggable={false}
                  className="object-cover transition-transform duration-[1.4s] [transition-timing-function:var(--ease-velia)] group-hover:scale-[1.05]"
                  style={{ objectPosition: item.pos }}
                />
                <span aria-hidden className="absolute bottom-3 right-3 grid h-9 w-9 scale-75 place-items-center rounded-full bg-ivory/90 text-graphite opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
              </button>
              <p className="flex items-baseline gap-2 text-xs text-graphite/55">
                <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-base italic text-graphite/80">{item.caption}</span>
              </p>
            </li>
          );
        })}
        <li aria-hidden className="w-px shrink-0" />
      </ul>

      <div className="shell mt-10 flex items-center gap-6">
        <div className="relative h-px flex-1 bg-graphite/12">
          <span className="absolute inset-y-0 left-0 bg-graphite transition-[width] duration-150" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <p className="max-w-[16rem] text-right text-[0.7rem] leading-snug text-graphite/50 sm:max-w-none">
          Imagens ilustrativas (Unsplash). Não representam resultados de procedimentos.
        </p>
      </div>

      <Lightbox index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
    </section>
  );
}

function Lightbox({ index, onClose, onChange }: { index: number | null; onClose: () => void; onChange: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const open = index !== null;
  useScrollLock(open);
  useFocusTrap(ref, open, onClose);

  const go = useCallback((dir: number) => index !== null && onChange((index + dir + gallery.length) % gallery.length), [index, onChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  // Swipe no toque
  const startX = useRef<number | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada"
          className="on-dark fixed inset-0 z-[90] flex flex-col bg-ink text-ivory"
          style={{ paddingTop: "var(--safe-top)", paddingBottom: "var(--safe-bottom)" }}
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(110% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.75, ease }}
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (startX.current === null) return;
            const dx = e.changedTouches[0].clientX - startX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            startX.current = null;
          }}
        >
          <div className="shell flex h-16 shrink-0 items-center justify-between">
            <span className="tabular text-sm text-ivory/60">
              {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={onClose} data-autofocus className="flex h-11 items-center gap-3 rounded-full pl-4 pr-1.5 text-sm ring-1 ring-ivory/25 transition hover:bg-ivory hover:text-ink">
              Fechar
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ivory/10">
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
                  <path d="M1 1l10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </span>
            </button>
          </div>

          <div className="relative flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-4 sm:px-20"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease }}
              >
                <div className="relative h-full w-full">
                  <Image src={gallery[index].src} alt={gallery[index].alt} fill sizes="100vw" quality={90} className="object-contain" />
                </div>
                <figcaption className="mt-4 text-center">
                  <span className="font-display text-2xl italic">{gallery[index].caption}</span>
                  <span className="mt-1 block text-xs text-ivory/50">{gallery[index].alt}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior" className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full ring-1 ring-ivory/25 transition hover:bg-ivory hover:text-ink sm:grid">
              <Arrow dir="left" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Próxima imagem" className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full ring-1 ring-ivory/25 transition hover:bg-ivory hover:text-ink sm:grid">
              <Arrow />
            </button>
          </div>
          <div className="flex justify-center gap-3 pb-4 sm:hidden">
            <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-ivory/25">
              <Arrow dir="left" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Próxima imagem" className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-ivory/25">
              <Arrow />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
