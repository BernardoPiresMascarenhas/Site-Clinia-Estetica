"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Img } from "@/data/site";

/**
 * LENTE VÉLIA — efeito autoral.
 * A fotografia é exibida em tom contido (dessaturada e mais escura). Uma lente
 * circular revela a mesma imagem em cor plena e ampliada, como um olhar atento
 * aos detalhes. Segue o cursor/dedo; quando ninguém interage, a lente passeia
 * sozinha por uma trajetória suave. Atualizações via CSS custom properties em
 * requestAnimationFrame — nenhum re-render do React a cada movimento.
 */
export function DetailLens({ image, hint, hintTouch }: { image: Img; hint: string; hintTouch: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
    const el = wrap.current;
    if (!el) return;

    let raf = 0;
    let visible = false;
    const pos = { x: 0.62, y: 0.42 };
    const target = { x: 0.62, y: 0.42 };
    let lastInteract = -Infinity;
    let t0 = performance.now();

    const tick = (now: number) => {
      if (!reduce && now - lastInteract > 2600) {
        const t = (now - t0) / 1000;
        target.x = 0.5 + Math.sin(t * 0.42) * 0.24;
        target.y = 0.45 + Math.sin(t * 0.31 + 1.2) * 0.2;
      }
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      el.style.setProperty("--lx", `${(pos.x * 100).toFixed(2)}%`);
      el.style.setProperty("--ly", `${(pos.y * 100).toFixed(2)}%`);
      if (visible) raf = requestAnimationFrame(tick);
    };

    const setFromEvent = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      target.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      lastInteract = performance.now();
    };

    el.addEventListener("pointermove", setFromEvent);
    el.addEventListener("pointerdown", setFromEvent);

    // Só anima enquanto visível.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        t0 = performance.now() - 4000;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", setFromEvent);
      el.removeEventListener("pointerdown", setFromEvent);
    };
  }, [reduce]);

  return (
    <figure className="relative">
      <div
        ref={wrap}
        className="lens group relative aspect-[4/3.1] cursor-crosshair touch-pan-y select-none overflow-hidden rounded-[2rem] bg-graphite-deep sm:aspect-[16/11]"
        style={{ ["--lx" as string]: "62%", ["--ly" as string]: "42%", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
      >
        {/* Camada contida */}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 52vw, 92vw"
          quality={86}
          className="object-cover opacity-55 [filter:grayscale(0.85)_contrast(1.05)]"
          style={{ objectPosition: image.pos }}
        />
        {/* Camada revelada pela lente */}
        <div aria-hidden className="lens-reveal absolute inset-0">
          <div className="absolute inset-0 origin-[var(--lx)_var(--ly)] scale-[1.55]">
            <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 52vw, 92vw" quality={86} className="object-cover" style={{ objectPosition: image.pos }} />
          </div>
        </div>
        {/* Anel e retículo */}
        <div aria-hidden className="lens-ring pointer-events-none absolute">
          <span className="absolute inset-0 rounded-full ring-1 ring-ivory/70" />
          <span className="absolute left-1/2 top-[-0.9rem] h-3 w-px bg-ivory/60" />
          <span className="absolute bottom-[-0.9rem] left-1/2 h-3 w-px bg-ivory/60" />
          <span className="absolute left-[-0.9rem] top-1/2 h-px w-3 bg-ivory/60" />
          <span className="absolute right-[-0.9rem] top-1/2 h-px w-3 bg-ivory/60" />
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-between gap-4 text-xs text-ivory/55">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-nude" />
          {touch ? hintTouch : hint}
        </span>
        <span className="hidden sm:inline">Imagem ilustrativa</span>
      </figcaption>
    </figure>
  );
}
