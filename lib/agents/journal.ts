import type { RuntimeEvent } from "./policy";

/** Ordered, bounded metadata snapshots. Not an immutable event log or resume engine. */
export function createRunJournal(persist: (events: RuntimeEvent[]) => Promise<void>) {
  const events: RuntimeEvent[] = [];
  let pending: Promise<void> = Promise.resolve();
  return {
    append(event: RuntimeEvent) {
      pending = pending.then(async () => {
        if (events.length >= 64) throw new Error("TRACE_BUDGET_EXCEEDED");
        events.push(event);
        await persist([...events]);
      });
      return pending;
    },
    snapshot: () => [...events],
  };
}
