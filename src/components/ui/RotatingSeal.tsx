import { useId } from "react";
import { cn } from "@/lib/cn";

/** Selo circular com texto em órbita — gira lentamente (pausado com movimento reduzido). */
export function RotatingSeal({ text, className }: { text: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={cn("spin-slow", className)}>
      <defs>
        <path id={`seal-${id}`} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
      </defs>
      <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeOpacity="0.16" />
      <text fill="currentColor" style={{ fontSize: 13.2, letterSpacing: "0.24em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
        <textPath href={`#seal-${id}`} textLength="500">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
