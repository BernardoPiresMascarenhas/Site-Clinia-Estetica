"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { booking, treatments } from "@/data/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Arrow } from "@/components/ui/Arrow";

type State = {
  service: string | null;
  format: string | null;
  period: string | null;
  date: string | null; // ISO yyyy-mm-dd
  time: string | null;
};

const EMPTY: State = { service: null, format: null, period: null, date: null, time: null };
const STEPS = ["Serviço", "Preferência", "Data", "Horário", "Resumo"] as const;

const WEEK = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Pseudo-aleatório determinístico — a "agenda" fictícia é estável por data. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatLong(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

/**
 * AGENDAMENTO DEMONSTRATIVO — 5 etapas, sem dados pessoais e sem envio.
 * O "bilhete" lateral acompanha cada escolha; ao final, uma confirmação deixa
 * claro que se trata apenas de uma simulação.
 */
export function Booking() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [s, setS] = useState<State>(EMPTY);
  const [done, setDone] = useState(false);
  const [days, setDays] = useState<{ iso: string; d: Date; available: boolean }[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Datas geradas no cliente (evita divergência de hidratação com o servidor).
  useEffect(() => {
    const out: { iso: string; d: Date; available: boolean }[] = [];
    const base = new Date();
    base.setHours(12, 0, 0, 0);
    for (let i = 1; out.length < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      if (d.getDay() === 0) continue; // domingo fechado (fictício)
      const iso = toISO(d);
      out.push({ iso, d, available: hash(iso) > 0.22 });
    }
    setDays(out);
  }, []);

  // Pré-seleção vinda do painel de tratamentos.
  useEffect(() => {
    const onBook = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setDone(false);
      setS({ ...EMPTY, service: id });
      setDir(1);
      setStep(1);
    };
    window.addEventListener("velia:book", onBook);
    return () => window.removeEventListener("velia:book", onBook);
  }, []);

  const slots = useMemo(() => {
    if (!s.period || !s.date) return [];
    return (booking.slots[s.period] ?? []).map((t) => ({ t, available: hash(s.date + t) > 0.3 }));
  }, [s.period, s.date]);

  const valid = [!!s.service, !!s.format && !!s.period, !!s.date, !!s.time, true][step];

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
  };

  const update = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));
  const reset = () => {
    setS(EMPTY);
    setDone(false);
    setDir(-1);
    setStep(0);
  };

  const service = treatments.find((t) => t.id === s.service);
  const format = booking.formats.find((f) => f.id === s.format);
  const period = booking.preferences.find((p) => p.id === s.period);

  const summary = [
    { k: "Serviço", v: service?.name },
    { k: "Preferência", v: format && period ? `${format.label} · ${period.label}` : undefined },
    { k: "Data", v: s.date ? formatLong(s.date) : undefined },
    { k: "Horário", v: s.time ?? undefined },
  ];

  return (
    <section id="agendar" aria-labelledby="booking-title" className="relative bg-sage-50 py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow flex items-center gap-4 text-sage-700">
              <span aria-hidden className="h-px w-10 bg-sage-500/60" />
              {booking.eyebrow}
            </p>
            <h2 id="booking-title" className="font-display mt-6 text-[clamp(2.9rem,11vw,3.8rem)] leading-[0.96] text-ink sm:text-6xl lg:text-[5.4rem]">
              {booking.title[0]} <em className="text-sage-600">{booking.title[1]}</em>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pb-2">
            <p className="leading-relaxed text-graphite/75 text-pretty">{booking.lede}</p>
            <p className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-nude-soft px-4 py-2 text-[0.78rem] font-medium text-graphite">
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-clay/60" />
                <span className="relative h-2 w-2 rounded-full bg-clay" />
              </span>
              Modo demonstração — sem agenda real
            </p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[1.75rem] bg-ivory shadow-[0_40px_80px_-50px_rgba(35,43,40,0.45)] ring-1 ring-graphite/[0.06] lg:mt-16 lg:grid lg:grid-cols-12 lg:rounded-[2.25rem]">
          {/* ─── Bilhete / etapas ─── */}
          <aside className="relative border-b border-dashed border-graphite/15 bg-ivory-deep p-6 sm:p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-[0.62rem] text-graphite/55">Sua simulação</p>
              <p className="tabular text-xs text-graphite/55">
                {done ? "Concluída" : `Etapa ${step + 1} de ${STEPS.length}`}
              </p>
            </div>
            {/* Progresso (mobile) */}
            <div className="mt-4 flex gap-1.5 lg:hidden" aria-hidden>
              {STEPS.map((_, i) => (
                <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= step || done ? "bg-graphite" : "bg-graphite/12")} />
              ))}
            </div>

            <ol className="mt-6 hidden space-y-1 lg:block" aria-label="Etapas">
              {STEPS.map((label, i) => {
                const reachable = i <= step || (i === step + 1 && valid);
                return (
                  <li key={label}>
                    <button
                      type="button"
                      disabled={!reachable || done}
                      onClick={() => go(i)}
                      aria-current={i === step ? "step" : undefined}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors",
                        i === step && !done ? "bg-ivory" : "hover:bg-ivory/60 disabled:hover:bg-transparent",
                      )}
                    >
                      <span
                        className={cn(
                          "tabular grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs transition-colors duration-500",
                          i < step || done ? "bg-sage-500 text-ivory" : i === step ? "bg-graphite text-ivory" : "text-graphite/40 ring-1 ring-graphite/15",
                        )}
                      >
                        {i < step || done ? "✓" : i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-[0.92rem]", i <= step ? "text-ink" : "text-graphite/45")}>{label}</span>
                        {summary[i]?.v && <span className="block truncate text-xs text-graphite/55 first-letter:uppercase">{summary[i].v}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <p className="mt-6 hidden text-xs leading-relaxed text-graphite/50 lg:block">
              Nenhum nome, telefone, e-mail ou informação de saúde é solicitado. Nada sai do seu navegador.
            </p>
          </aside>

          {/* ─── Conteúdo da etapa ─── */}
          <div className="relative flex min-h-[34rem] flex-col p-6 sm:p-8 lg:col-span-8 lg:min-h-[38rem] lg:p-12">
            <div ref={panelRef} tabIndex={-1} className="relative flex-1 outline-none" aria-live="polite">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                {done ? (
                  <Success key="done" summary={summary} onReset={reset} />
                ) : (
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -28 }}
                    transition={{ duration: 0.45, ease }}
                  >
                    {step === 0 && (
                      <Fieldset legend="Qual cuidado você gostaria de simular?">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {treatments.map((t) => (
                            <Choice key={t.id} name="service" checked={s.service === t.id} onChange={() => update({ service: t.id })}>
                              <span className="tabular text-xs text-graphite/45">{t.index}</span>
                              <span className="mt-2 block text-[0.98rem] font-medium leading-snug text-ink">{t.name}</span>
                              <span className="mt-1 block text-xs text-graphite/55">
                                {t.category} · {t.duration}
                              </span>
                            </Choice>
                          ))}
                        </div>
                      </Fieldset>
                    )}

                    {step === 1 && (
                      <div className="space-y-10">
                        <Fieldset legend="Formato da visita">
                          <div className="grid gap-2.5 sm:grid-cols-2">
                            {booking.formats.map((f) => (
                              <Choice key={f.id} name="format" checked={s.format === f.id} onChange={() => update({ format: f.id })}>
                                <span className="block text-[0.98rem] font-medium text-ink">{f.label}</span>
                                <span className="mt-1 block text-xs text-graphite/55">{f.hint}</span>
                              </Choice>
                            ))}
                          </div>
                        </Fieldset>
                        <Fieldset legend="Período de preferência">
                          <div className="grid gap-2.5 sm:grid-cols-3">
                            {booking.preferences.map((p) => (
                              <Choice key={p.id} name="period" checked={s.period === p.id} onChange={() => update({ period: p.id, time: null })}>
                                <span className="block text-[0.98rem] font-medium text-ink">{p.label}</span>
                                <span className="mt-1 block text-xs text-graphite/55">{p.hint}</span>
                              </Choice>
                            ))}
                          </div>
                        </Fieldset>
                      </div>
                    )}

                    {step === 2 && (
                      <Fieldset legend="Escolha uma data ilustrativa">
                        <div className="grid grid-cols-4 gap-2 xs:grid-cols-5 sm:grid-cols-7">
                          {days.map(({ iso, d, available }) => {
                            const checked = s.date === iso;
                            return (
                              <label
                                key={iso}
                                className={cn(
                                  "relative flex cursor-pointer flex-col items-center rounded-[999px_999px_14px_14px] px-1 pb-3 pt-4 text-center transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-[1.5px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sage-600",
                                  checked ? "bg-graphite text-ivory" : available ? "bg-sage-50 text-graphite hover:bg-sage-100" : "cursor-not-allowed text-graphite/30 line-through",
                                )}
                              >
                                <input
                                  type="radio"
                                  name="date"
                                  value={iso}
                                  className="sr-only"
                                  disabled={!available}
                                  checked={checked}
                                  onChange={() => update({ date: iso, time: null })}
                                  aria-label={`${formatLong(iso)}${available ? "" : " — indisponível"}`}
                                />
                                <span className="text-[0.65rem] uppercase tracking-[0.12em] opacity-70">{WEEK[d.getDay()]}</span>
                                <span className="font-display mt-1 text-[1.7rem] leading-none">{d.getDate()}</span>
                                <span className="mt-1 text-[0.65rem] opacity-60">{MONTHS[d.getMonth()]}</span>
                              </label>
                            );
                          })}
                        </div>
                        <p className="mt-5 text-xs text-graphite/50">Datas e disponibilidade fictícias, geradas apenas para demonstração.</p>
                      </Fieldset>
                    )}

                    {step === 3 && (
                      <Fieldset legend={`Horários — ${period?.label.toLowerCase() ?? ""}${s.date ? `, ${formatLong(s.date)}` : ""}`}>
                        <div className="flex flex-wrap gap-2.5">
                          {slots.map(({ t, available }) => {
                            const checked = s.time === t;
                            return (
                              <label
                                key={t}
                                className={cn(
                                  "tabular relative flex min-h-12 min-w-[6.5rem] cursor-pointer items-center justify-center rounded-full px-5 text-[0.95rem] transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-[1.5px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sage-600",
                                  checked ? "bg-graphite text-ivory" : available ? "text-graphite ring-1 ring-graphite/18 hover:bg-sage-50" : "cursor-not-allowed text-graphite/30 line-through ring-1 ring-graphite/8",
                                )}
                              >
                                <input
                                  type="radio"
                                  name="time"
                                  value={t}
                                  className="sr-only"
                                  disabled={!available}
                                  checked={checked}
                                  onChange={() => update({ time: t })}
                                  aria-label={`${t}${available ? "" : " — indisponível"}`}
                                />
                                {t}
                              </label>
                            );
                          })}
                        </div>
                        <button type="button" onClick={() => go(1)} className="link-draw mt-8 text-sm text-graphite/70">
                          Trocar período
                        </button>
                      </Fieldset>
                    )}

                    {step === 4 && (
                      <div>
                        <h3 className="font-display text-[2rem] leading-tight text-ink sm:text-[2.4rem]">Confira a sua simulação</h3>
                        <dl className="mt-8 divide-y divide-graphite/10 border-y border-graphite/10">
                          {summary.map((row, i) => (
                            <div key={row.k} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                              <dt className="text-xs uppercase tracking-[0.16em] text-graphite/50">{row.k}</dt>
                              <dd className="flex items-baseline gap-4 text-[1.02rem] text-ink first-letter:uppercase sm:text-right">
                                <span className="first-letter:uppercase">{row.v}</span>
                                <button type="button" onClick={() => go(i)} className="text-xs text-sage-700 underline decoration-sage-500/40 underline-offset-4 hover:decoration-sage-600">
                                  Alterar
                                </button>
                              </dd>
                            </div>
                          ))}
                        </dl>
                        <p className="mt-6 rounded-2xl bg-nude-soft/70 px-5 py-4 text-sm leading-relaxed text-graphite/80">
                          Esta é uma demonstração de interface. Ao concluir, nenhum agendamento é criado e nenhuma informação é enviada.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!done && (
              <div className="mt-10 flex items-center justify-between gap-4 border-t border-graphite/10 pt-6">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  className="flex min-h-12 items-center gap-2 rounded-full px-4 text-sm text-graphite/70 transition hover:text-graphite disabled:invisible"
                >
                  <Arrow dir="left" /> Voltar
                </button>
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={() => go(step + 1)} disabled={!valid} className="btn disabled:pointer-events-none disabled:opacity-35">
                    Continuar
                    <span className="btn-dot">
                      <Arrow />
                    </span>
                  </button>
                ) : (
                  <button type="button" onClick={() => setDone(true)} className="btn">
                    Concluir simulação
                    <span className="btn-dot">
                      <Arrow />
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-display mb-6 text-[1.75rem] leading-tight text-ink first-letter:uppercase sm:text-[2.1rem]">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Choice({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label
      className={cn(
        "group relative block cursor-pointer rounded-2xl p-4 pr-12 transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-[1.5px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sage-600 sm:p-5 sm:pr-12",
        checked ? "bg-sage-100 ring-1 ring-sage-600" : "ring-1 ring-graphite/12 hover:bg-sage-50 hover:ring-graphite/25",
      )}
    >
      <input type="radio" name={name} className="sr-only" checked={checked} onChange={onChange} />
      {children}
      <span aria-hidden className={cn("absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full transition-all duration-300", checked ? "bg-graphite" : "ring-1 ring-graphite/25")}>
        <span className={cn("h-1.5 w-1.5 rounded-full bg-ivory transition-transform duration-300", checked ? "scale-100" : "scale-0")} />
      </span>
    </label>
  );
}

function Success({ summary, onReset }: { summary: { k: string; v?: string }[]; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col items-start justify-center"
      role="status"
    >
      <svg viewBox="0 0 80 96" className="h-24 w-20 text-sage-600" aria-hidden>
        <motion.path
          d="M4 94V40C4 20.1 20.1 4 40 4s36 16.1 36 36v54"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        <motion.path
          d="M26 54l10 10 20-22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease }}
        />
      </svg>
      <p className="eyebrow mt-8 text-sage-700">Simulação concluída</p>
      <h3 className="font-display mt-4 max-w-lg text-[2.3rem] leading-[1.05] text-ink sm:text-5xl">
        Tudo certo — <em className="text-sage-600">é só uma demonstração.</em>
      </h3>
      <p className="mt-5 max-w-lg leading-relaxed text-graphite/75">
        Nenhum agendamento real foi realizado e nenhum dado foi enviado. Em um site de clínica, este é o momento em que a reserva seria confirmada pela agenda online ou por mensagem.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {summary.map((r) => (
          <li key={r.k} className="rounded-full bg-sage-50 px-3.5 py-1.5 text-[0.8rem] text-graphite/75 first-letter:uppercase">
            {r.v}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onReset} className="btn btn-ghost mt-10">
        Fazer outra simulação
        <span className="btn-dot">
          <Arrow dir="left" />
        </span>
      </button>
    </motion.div>
  );
}
