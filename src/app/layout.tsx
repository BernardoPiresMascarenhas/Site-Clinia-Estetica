import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";
import { site } from "@/data/site";
import { RevealObserver } from "@/components/layout/RevealObserver";

const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Iowan Old Style", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

const sans = localFont({
  src: [
    { path: "./fonts/instrument-sans-latin-wght-normal.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/instrument-sans-latin-wght-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-instrument-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "VÉLIA — Estética & Bem-Estar · Projeto conceitual",
    template: "%s · VÉLIA",
  },
  description: site.description,
  applicationName: "VÉLIA",
  authors: [{ name: site.author.name, url: site.author.url }],
  creator: site.author.name,
  keywords: ["site para clínica de estética", "web design premium", "Next.js", "portfólio", "Bernardo Pires"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: "VÉLIA — projeto conceitual",
    title: "VÉLIA — Estética & Bem-Estar",
    description:
      "Projeto conceitual de portfólio: site premium para clínica de estética com direção de arte editorial e interações sob medida. Design & Development — Bernardo Pires.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VÉLIA — Estética & Bem-Estar",
    description: "Projeto conceitual de portfólio por Bernardo Pires.",
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f3ee",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-[calc(var(--safe-top)+0.75rem)] focus:z-[100] focus:rounded-full focus:bg-graphite focus:px-5 focus:py-3 focus:text-ivory"
        >
          Pular para o conteúdo
        </a>
        <Providers>{children}</Providers>
        <RevealObserver />
      </body>
    </html>
  );
}
