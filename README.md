# VÉLIA — Estética & Bem-Estar

Projeto **conceitual de portfólio**: site premium para uma clínica de estética fictícia.
Não há clínica real, profissionais reais, agenda ou atendimento.

**Design & Development — [Bernardo Pires](https://www.bernardopiresdev.com.br/)**

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion 12 · fontes locais (Instrument Serif + Instrument Sans, SIL OFL).
Sem backend, sem envio de dados.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

Deploy: importe o repositório na Vercel (preset Next.js, sem variáveis de ambiente).
Atualize `site.url` em `src/data/site.ts` com o domínio final (usado no Open Graph).

## Estrutura

```
src/app/                 layout (metadata, viewport, fontes), página, OG image, favicon
src/components/layout/   Header, Footer, Providers, RevealObserver
src/components/sections/ Hero, Manifesto, Treatments, Journey, Explorer, Technology,
                         Gallery, Team, Values, Booking, Faq, Finale
src/components/interactive/ TreatmentDrawer (painel de detalhes), DetailLens (lente)
src/components/ui/       Logo, Arrow, RotatingSeal
src/data/site.ts         TODO o conteúdo editável (textos, serviços, imagens, FAQ…)
src/lib/                 hooks (focus trap, scroll lock, media query), easing, cn
scripts/                 capturas e testes de interação com Playwright
```

## Adaptar para uma clínica real

Comece por `src/data/site.ts`. Antes de publicar: validar conteúdo técnico com os
profissionais responsáveis, incluir registros profissionais reais quando exigidos,
revisar regras publicitárias aplicáveis, substituir as imagens por fotos próprias e
conectar o agendamento a uma agenda real (com política de privacidade e consentimento).

## Fotografias — Unsplash (Unsplash License)

| Arquivo | Fotógrafo(a) | Fonte |
|---|---|---|
| hero-portrait | see plus | https://unsplash.com/photos/k8AWNNCry-0 |
| manifesto-portrait | Diana Simumpande | https://unsplash.com/photos/xZgkFQ4Hijc |
| cta-portrait | see plus | https://unsplash.com/photos/FMmHd82FuMA |
| treat-avaliacao | kimia kazemi | https://unsplash.com/photos/u93nTfWqR9w |
| treat-limpeza | kimia kazemi | https://unsplash.com/photos/J6Hg_YH2tFk |
| treat-hidratacao | Leighann Blackwood | https://unsplash.com/photos/zoYLGk2oULA |
| treat-corporal | Stephen Olmo | https://unsplash.com/photos/YBfzGCJjLuI |
| treat-massagem | engin akyurt | https://unsplash.com/photos/SMwCQZWayj0 |
| treat-bemestar | Dominik Neuner | https://unsplash.com/photos/9qYFu1NzpS8 |
| step-conhecer | Ernesto Samaniego | https://unsplash.com/photos/91dmB8SHiWc |
| step-personalizar | ibnu ihza | https://unsplash.com/photos/QbHwPe1HE84 |
| step-acompanhar | Anna Keibalo | https://unsplash.com/photos/BJ7i-96glwM |
| explore-luminosidade | Fleur Kaan | https://unsplash.com/photos/e7jpGYe7OtU |
| explore-hidratacao | ibnu ihza | https://unsplash.com/photos/GeG4U-lAF10 |
| explore-relaxamento | Sunny Ng | https://unsplash.com/photos/KVIlNRoGwxk |
| explore-corporal | engin akyurt | https://unsplash.com/photos/ZbzYDboN7fg |
| explore-rotina | Mathilde Langevin | https://unsplash.com/photos/FDRaYqiTY1k |
| tech-device | Look Studio | https://unsplash.com/photos/HtXyytr9304 |
| tech-texture | Viktor Forgacs | https://unsplash.com/photos/00vf9MdXbqE |
| tech-cream | Kelsey Curtis | https://unsplash.com/photos/kD9qprR6HBI |
| gallery-freckles | Yoad Shejtman | https://unsplash.com/photos/YhMFYJZgMA0 |
| gallery-leaves | Divine Effiong | https://unsplash.com/photos/h1lA3N5wb8M |
| gallery-fabric | Bharath Kumar | https://unsplash.com/photos/lOs0ZqaLQ1A |
| gallery-serums | ibnu ihza | https://unsplash.com/photos/g6q3lFAe3kA |
| gallery-arch | Alona Gross | https://unsplash.com/photos/qtoMPyiIBPA |
| gallery-touch | Laura Jaeger | https://unsplash.com/photos/MyFdvHRinoI |
| gallery-cream | Jocelyn Morales | https://unsplash.com/photos/JiqTLjzEH18 |
| gallery-room | Mayur Roxan | https://unsplash.com/photos/JnsuyfJrxQw |
| gallery-oil | Christin Hume | https://unsplash.com/photos/0MoF-Fe0w0A |
| team-01 | Andre Styles | https://unsplash.com/photos/pq9npYMirk8 |
| team-02 | Kawê Rodrigues | https://unsplash.com/photos/RhwM8yiGzeo |
| team-03 | Ionela Mat | https://unsplash.com/photos/4S47Hg8DfHg |

Imagens ilustrativas: não representam resultados de procedimentos, instalações reais ou profissionais reais.
