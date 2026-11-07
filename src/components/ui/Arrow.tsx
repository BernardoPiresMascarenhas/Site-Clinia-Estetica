import { cn } from "@/lib/cn";

/** Seta desenhada à mão para o sistema (traço fino, coerente com a tipografia). */
export function Arrow({ className, dir = "right" }: { className?: string; dir?: "right" | "up-right" | "left" | "down" }) {
  const rot = { right: 0, "up-right": -45, left: 180, down: 90 }[dir];
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("h-3.5 w-3.5", className)} style={{ transform: `rotate(${rot}deg)` }} fill="none">
      <path d="M1.5 8h12.5M9.5 3.5 14 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
