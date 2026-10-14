"use client";
import { useId, useState, type FormEvent } from "react";

export type WorkspaceView = {
  authenticated: boolean;
  projectName: string;
  activeTab: "tasks" | "knowledge" | "tools" | "approvals" | "outputs" | "activity" | "settings";
  task?: { id: string; title: string; status: string; version: number; steps: { id: string; label: string; state: string }[] };
  sources: { id: string; title: string; version: string }[];
  tools: { id: string; name: string; connected: boolean; allowed: boolean; scope: "read" | "draft" | "write" }[];
  approvals: { id: string; title: string; version: number; eligible: boolean; expiresAt: string }[];
  outputs: { id: string; title: string; evidence: string; verified: boolean }[];
  activity: { id: string; label: string; time: string }[];
};
type Props = {
  locale: "ar" | "en"; copy: Record<string,string>; view: WorkspaceView;
  onSelect: (tab: WorkspaceView["activeTab"]) => void;
  onSubmit?: (text: string) => Promise<boolean>;
  onDecision?: (id: string,version: number,decision: "approve" | "reject") => Promise<void>;
  onCancel?: (id: string,version: number) => Promise<void>;
};
export function WorkspaceShell({locale,copy:c,view:v,onSelect,onSubmit,onDecision,onCancel}: Props) {
  const [draft,setDraft]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  const inputId=useId();
  async function submit(e: FormEvent) {
    e.preventDefault(); if(!onSubmit || !draft.trim() || busy) return;
    setBusy(true); setError("");
    try { if(await onSubmit(draft.trim())) setDraft(""); else setError(c.failure); }
    catch { setError(c.failure); } finally { setBusy(false); }
  }
  async function action(fn?:()=>Promise<void>) {
    if(!fn || busy) return; setBusy(true); setError("");
    try { await fn(); } catch { setError(c.failure); } finally { setBusy(false); }
  }
  const tabs: WorkspaceView["activeTab"][]=["tasks","knowledge","tools","approvals","outputs","activity","settings"];
  const terminal=["completed","failed","cancelled"].includes(v.task?.status || "");
  return <section className="agent-workspace ax-workspace" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
    <header><a href={`/${locale}`}>Agentnexos</a><span>{v.projectName}</span><a href={`/${locale}`}>{c.back}</a></header>
    {!v.authenticated ? <p role="status">{c.notSignedIn}</p> : <div className="ax-workspace-grid">
      <aside><nav aria-label={c.workspace}>{tabs.map(tab=><button key={tab} aria-current={v.activeTab===tab?"page":undefined} onClick={()=>onSelect(tab)}>{c[tab]}</button>)}</nav></aside>
      <main>
        <h1>{c[v.activeTab]}</h1>
        {v.activeTab==="tasks" && <>
          {!v.task ? <p>{c.emptyTasks}</p> : <article className="nexus-glass ax-task">
            <div><h2>{v.task.title}</h2><span role="status">{c[v.task.status] || c.unavailable}</span></div>
            <ol>{v.task.steps.map(step=><li key={step.id}><span>{step.label}</span><span>{c[step.state] || c.unavailable}</span></li>)}</ol>
            {onCancel && !terminal && <button disabled={busy} onClick={()=>action(()=>onCancel(v.task!.id,v.task!.version))}>{c.cancel}</button>}
          </article>}
          <form onSubmit={submit}><label htmlFor={inputId}>{c.prompt}</label>
            <textarea id={inputId} value={draft} onChange={e=>setDraft(e.target.value)} maxLength={4000} rows={4}/>
            <button disabled={!onSubmit || !draft.trim() || busy}>{busy?c.saving:c.submit}</button>
            {!onSubmit && <p>{c.unavailable}</p>}
          </form>
        </>}
        {v.activeTab==="knowledge" && (v.sources.length?<ul>{v.sources.map(s=><li key={s.id}>{s.title} <small>{c.sourceVersion}: {s.version}</small></li>)}</ul>:<p>{c.emptySources}</p>)}
        {v.activeTab==="tools" && (v.tools.length?<ul>{v.tools.map(t=><li key={t.id}>{t.name} <small>{!t.connected?c.disconnected:!t.allowed?c.denied:t.scope==="read"?c.scopeRead:t.scope==="draft"?c.scopeDraft:c.scopeWrite}</small></li>)}</ul>:<p>{c.emptyTools}</p>)}
        {v.activeTab==="approvals" && (v.approvals.length?<div>{v.approvals.map(a=><article key={a.id} className="nexus-glass ax-task"><h2>{a.title}</h2><p>{c.pending}</p><button disabled={busy || !a.eligible || !onDecision} onClick={()=>action(()=>onDecision!(a.id,a.version,"approve"))}>{c.approve}</button><button disabled={busy || !a.eligible || !onDecision} onClick={()=>action(()=>onDecision!(a.id,a.version,"reject"))}>{c.reject}</button></article>)}</div>:<p>{c.emptyApprovals}</p>)}
        {v.activeTab==="outputs" && (v.outputs.length?<ul>{v.outputs.map(o=><li key={o.id}><h2>{o.title}</h2><p>{o.verified?c.verifiedOutput:c.draft}</p><p>{o.evidence}</p></li>)}</ul>:<p>{c.emptyOutputs}</p>)}
        {v.activeTab==="activity" && (v.activity.length?<ol>{v.activity.map(e=><li key={e.id}><time>{e.time}</time> {e.label}</li>)}</ol>:<p>{c.emptyActivity}</p>)}
        {v.activeTab==="settings" && <p>{c.unavailable}</p>}
        {error && <p role="alert">{error}</p>}
      </main>
      <aside><h2>{c.context}</h2><p>{v.task?.title || c.emptyTasks}</p><h3>{c.sources}</h3><p>{v.sources.length?String(v.sources.length):c.emptySources}</p><h3>{c.permissions}</h3><p>{v.tools.length?v.tools.map(t=>t.name).join(", "):c.emptyTools}</p></aside>
    </div>}
  </section>;
}
