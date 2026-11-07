import { cn } from "@/lib/cn";

/** Monograma: um arco (a forma-mãe da identidade) com um ponto — a "semente". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 30" aria-hidden="true" className={cn("h-[1.35em] w-auto", className)} fill="none">
      <path d="M2 29V12C2 6.477 6.477 2 12 2s10 4.477 10 10v17" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="19" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, withSignature = false }: { className?: string; withSignature?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.55rem] tracking-[0.14em]">VÉLIA</span>
        {withSignature && <span className="mt-1 text-[0.58rem] font-medium uppercase tracking-[0.3em] opacity-70">Estética &amp; Bem-Estar</span>}
      </span>
    </span>
  );
}
