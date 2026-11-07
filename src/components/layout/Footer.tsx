import { nav, site, treatments } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Arrow } from "@/components/ui/Arrow";

export function Footer() {
  return (
    <footer className="on-dark relative bg-graphite-deep text-ivory" style={{ paddingBottom: "max(1.5rem, var(--safe-bottom))" }}>
      <div className="shell border-t border-ivory/10 pt-16 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo withSignature className="text-ivory" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/60">
              Uma marca conceitual sobre estética contemporânea, escuta e bem-estar — criada para demonstrar o que um site sob medida pode fazer por uma clínica.
            </p>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-2 lg:col-start-5">
            <p className="eyebrow text-[0.62rem] text-sage-300">Navegação</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-ivory/75 transition-colors hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#agendar" className="text-ivory/75 transition-colors hover:text-ivory">
                  Agendamento
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="eyebrow text-[0.62rem] text-sage-300">Cuidados (ilustrativos)</p>
            <ul className="mt-5 space-y-2.5 text-sm text-ivory/75">
              {treatments.map((t) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="eyebrow text-[0.62rem] text-sage-300">Sobre este projeto</p>
            <p className="mt-5 text-sm leading-relaxed text-ivory/60">{site.demoNotice}</p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60">
              Sem endereço, telefone ou redes sociais: a VÉLIA existe apenas como demonstração de portfólio.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-ivory/10 pt-8 text-xs text-ivory/50 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} VÉLIA — projeto conceitual. Fotografias:{" "}
            <a href="https://unsplash.com/license" target="_blank" rel="noreferrer" className="underline decoration-ivory/25 underline-offset-4 hover:text-ivory">
              Unsplash (licença Unsplash)
            </a>
            .
          </p>
          <a
            href={site.author.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 text-sm text-ivory/85 hover:text-ivory"
          >
            <span>
              Design &amp; Development — <span className="font-display text-lg italic">Bernardo Pires</span>
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-ivory/25 transition-transform duration-500 group-hover:rotate-45">
              <Arrow dir="up-right" />
            </span>
          </a>
          <a href="#topo" className="link-draw self-start text-ivory/70 hover:text-ivory lg:self-auto">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
