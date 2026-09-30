"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Circle, FileText, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/use-t";
import { workspaceCopy } from "@/lib/content/workspace-demo";
import { cn } from "@/lib/utils";

type Stage = "idle" | "reviewing" | "approved" | "rejected";

export default function AgentSpacePage() {
  const locale = useLocale();
  const copy = workspaceCopy[locale];
  const [selectedId, setSelectedId] = useState<"procurement" | "receivables">("procurement");
  const [stage, setStage] = useState<Stage>("idle");
  const example = copy.cases.find((item) => item.id === selectedId)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-medium text-emerald-300">{copy.eyebrow}</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{copy.title}</h1>
          <p className="max-w-2xl text-base leading-8 text-foreground/75">{copy.intro}</p>
        </div>
        <p className="mt-7 max-w-4xl border-s-2 border-emerald-300/50 ps-4 text-sm leading-7 text-foreground/75">{copy.notice}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <aside aria-labelledby="examples-heading" className="min-w-0">
            <h2 id="examples-heading" className="mb-4 text-sm font-medium text-foreground/70">{copy.choose}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {copy.cases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selectedId === item.id}
                  onClick={() => { setSelectedId(item.id); setStage("idle"); }}
                  className={cn("min-h-20 rounded-xl border p-4 text-start text-sm leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4", selectedId === item.id ? "border-emerald-300/50 bg-emerald-300/5 text-foreground" : "border-border/70 text-foreground/70 hover:border-foreground/40")}
                >
                  <span className="block font-semibold">{item.name}</span>
                  <span className="mt-1 block text-xs text-foreground/65">{item.team}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <section aria-labelledby="request-heading" className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="request-heading" className="inline-flex items-center gap-2 text-lg font-semibold"><FileText className="size-5 text-emerald-300" aria-hidden="true" />{copy.request}</h2>
                <span className="text-xs text-foreground/65">{copy.example}</span>
              </div>
              <p className="mt-5 text-lg leading-8">{example.request}</p>
              <p className="mt-3 text-sm leading-7 text-foreground/75">{example.context}</p>
              <dl className="mt-5 border-t border-border/60 pt-4 text-sm">
                <dt className="text-foreground/60">{copy.team}</dt>
                <dd className="mt-1 leading-6">{example.team}</dd>
              </dl>
            </section>

            <section aria-labelledby="sources-heading" className="px-1">
              <h2 id="sources-heading" className="text-base font-semibold">{copy.sources}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground/75">
                {example.sources.map((source) => <li key={source} className="flex items-start gap-3"><Circle className="mt-2 size-2 shrink-0 text-emerald-300" aria-hidden="true" /><span>{source}</span></li>)}
              </ul>
            </section>

            <section aria-labelledby="decision-heading" className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7">
              <div role="status" aria-live="polite" className="mb-5 text-sm font-medium text-emerald-300">{copy[stage]}</div>
              {stage === "idle" ? (
                <div className="space-y-5">
                  <h2 id="decision-heading" className="text-lg font-semibold">{copy.plan}</h2>
                  <p className="text-sm leading-7 text-foreground/75">{copy.idleHint}</p>
                  <Button onClick={() => setStage("reviewing")} className="min-h-11 h-auto whitespace-normal py-3 text-start">{copy.start}<ArrowUpRight className="size-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" /></Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 id="decision-heading" className="text-lg font-semibold">{copy.plan}</h2>
                    <ol className="mt-4 space-y-3 text-sm leading-7 text-foreground/75">
                      {example.checks.map((item, index) => <li key={item} className="flex items-start gap-3"><span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs">{new Intl.NumberFormat(locale).format(index + 1)}</span><span>{item}</span></li>)}
                    </ol>
                  </div>
                  <div className="border-t border-border/60 pt-5">
                    <h3 className="text-base font-semibold">{copy.draft}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground/80">{example.draft}</p>
                  </div>
                  {stage === "reviewing" ? (
                    <div className="space-y-4 border-t border-border/60 pt-5">
                      <h3 className="text-base font-semibold">{copy.review}</h3>
                      <p className="text-sm leading-7">{example.decision}</p>
                      <p className="text-sm leading-7 text-foreground/65">{copy.reviewHint}</p>
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Button onClick={() => setStage("approved")} className="min-h-11 h-auto whitespace-normal py-3"><Check className="size-4" aria-hidden="true" />{copy.approve}</Button>
                        <Button variant="outline" onClick={() => setStage("rejected")} className="min-h-11 h-auto whitespace-normal py-3">{copy.reject}</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="border-t border-border/60 pt-5 text-sm leading-7 text-foreground/75">{stage === "approved" ? copy.resultHint : copy.rejectedHint}</p>
                  )}
                  <Button variant="ghost" onClick={() => setStage("idle")} className="min-h-11 h-auto whitespace-normal py-3"><RotateCcw className="size-4" aria-hidden="true" />{copy.reset}</Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <footer className="mx-auto max-w-6xl border-t border-border/60 px-5 py-8 text-sm leading-7 text-foreground/65 sm:px-8">{copy.footer}</footer>
    </div>
  );
}
