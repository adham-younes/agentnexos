import { Layers3 } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="inline-flex shrink-0 items-center gap-3" dir="ltr">
    <span className="flex size-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary"><Layers3 className="size-5" aria-hidden="true" /></span>
    {!compact && <span className="text-xl font-semibold tracking-tight text-foreground">AgentNexos<span className="text-primary">.</span></span>}
  </span>;
}
