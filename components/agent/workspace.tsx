"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, ArrowUpRight, Check, Copy, Download, Layers3, LoaderCircle, Plus, ShieldCheck, Square, Workflow } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton, messagesToMarkdown } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { useLocale } from "@/lib/i18n/use-t";
import { projectConversation } from "@/lib/agents/context";
import { agentWorkspaceCopy } from "@/lib/content/agent-workspace";

export function AgentWorkspace() {
  const locale = useLocale();
  const c = agentWorkspaceCopy[locale];
  const [input, setInput] = useState("");
  const [ready, setReady] = useState<boolean | null>(null);
  const [phase, setPhase] = useState(-1);
  const [copied, setCopied] = useState<string | null>(null);
  const [notice, setNotice] = useState<"cancelled" | "copyError" | null>(null);
  const [readinessAttempt, setReadinessAttempt] = useState(0);
  const composer = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/agentnexos",
    prepareSendMessagesRequest: ({ messages }) => ({ body: { locale, messages: projectConversation(messages) } }),
  }), [locale]);
  const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat({
    transport,
    onData: (part) => { if (part.type === "data-phase") {
      const index = (part.data as { index?: unknown })?.index;
      if (typeof index === "number" && Number.isInteger(index) && index >= 0 && index < c.roles.length) setPhase(index);
    } },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    const controller = new AbortController();
    const deadline = AbortSignal.timeout(10000);
    fetch("/api/agentnexos", { signal: AbortSignal.any([controller.signal, deadline]), cache: "no-store" }).then(r => { if (!r.ok) throw new Error("READINESS_FAILED"); return r.json(); }).then(data => setReady(data.ready === true)).catch(() => { if (!controller.signal.aborted) setReady(false); });
    return () => controller.abort();
  }, [readinessAttempt]);
  function submit(text = input) {
    if (!text.trim() || busy || ready !== true) return;
    clearError(); setNotice(null); setPhase(-1); setInput("");
    void sendMessage({ text: text.trim() }).catch(() => setInput(text));
  }
  function download() {
    const url = URL.createObjectURL(new Blob([messagesToMarkdown(messages)], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "agentnexos-conversation.md"; link.click(); URL.revokeObjectURL(url);
  }
  return (
    <div className="agent-workspace min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-20 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link href={`/${locale}`} className="flex shrink-0 items-center gap-3" aria-label={c.home}>
            <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary"><Layers3 className="size-5" aria-hidden="true" /></span>
            <span dir="ltr" className="text-xl font-semibold tracking-tight">Agentnexos</span>
          </Link>
          <LocaleSwitcher />
        </div>
      </header>
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100dvh-81px)] flex-col border-e border-border bg-card p-6 lg:flex">
          <button disabled={busy} onClick={() => {setMessages([]);clearError();setNotice(null);setCopied(null);setInput("");setPhase(-1);composer.current?.focus();}} className="flex min-h-12 items-center justify-between rounded-xl border border-border bg-background px-4 text-sm font-medium hover:bg-secondary disabled:opacity-50"><span>{c.newChat}</span><Plus className="size-4" /></button>
          <h2 className="mb-5 mt-10 text-xs font-medium text-muted-foreground">{c.team}</h2>
          <ol className="space-y-6">
            {c.roles.map((role, i) => <li key={role} className="flex items-start gap-3"><span className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${busy && phase === i ? "border-primary bg-primary/10" : "border-border"}`}>{busy && phase === i ? <LoaderCircle className="size-4 animate-spin" /> : <span className="text-xs">0{i+1}</span>}</span><div><p className="text-sm font-medium">{role}</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{c.roleDescriptions[i]}</p></div></li>)}
          </ol>
          <div className="mt-10 border-t border-border pt-6"><h2 className="text-xs font-medium text-muted-foreground">{c.capability}</h2><ul className="mt-4 space-y-3">{c.tools.map(tool => <li key={tool} className="flex items-center gap-2 text-xs"><Workflow className="size-3.5 text-primary" />{tool}</li>)}</ul></div>
          <div className="mt-auto pt-12"><div className="rounded-xl bg-secondary p-4"><ShieldCheck className="mb-3 size-5 text-primary" /><h2 className="text-sm font-medium">{c.boundary}</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">{c.boundaryText}</p></div></div>
        </aside>
        <main className="flex h-[calc(100dvh-81px)] min-h-0 min-w-0 flex-col">
          <div className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-5 sm:px-9">
            <div className="flex min-w-0 items-center gap-2"><span className="size-1.5 shrink-0 rounded-full bg-primary" /><p className="text-xs leading-5 text-muted-foreground">{c.label}</p></div>
            <div className="flex gap-1"><button onClick={() => {setMessages([]);clearError();setNotice(null);setCopied(null);setInput("");setPhase(-1);composer.current?.focus();}} disabled={busy} aria-label={c.newChat} className="rounded-lg p-3 hover:bg-secondary lg:hidden"><Plus className="size-4" /></button><button disabled={!messages.length || busy} onClick={download} aria-label={c.download} className="rounded-lg p-3 hover:bg-secondary disabled:opacity-30"><Download className="size-4" /></button></div>
          </div>
          <Conversation key={messages.length ? "conversation" : "welcome"} className="min-h-0" initial={messages.length ? "smooth" : false} resize="smooth" aria-label={c.label}>
            <ConversationContent className="mx-auto w-full max-w-4xl gap-8 px-5 py-8 sm:px-9 sm:py-12">
              {messages.length === 0 ? <div className="py-2 sm:py-5">
                <div className="mb-7 flex size-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10"><Layers3 className="size-7 text-primary" /></div>
                <p className="mb-3 text-xs font-medium text-primary">{c.badge}</p>
                <h1 className="max-w-2xl text-3xl font-semibold leading-[1.4] tracking-tight sm:text-4xl">{c.title}</h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">{c.intro}</p>
                <div className="mt-9 grid gap-3 sm:grid-cols-2">{c.suggestions.map((item, i) => <button key={item.title} onClick={() => { setInput(item.prompt); composer.current?.focus(); }} className="group min-w-0 rounded-2xl border border-border bg-card p-5 text-start transition-colors hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-primary"><div className="flex items-center justify-between gap-3"><span className="text-xs text-primary">0{i+1}</span><ArrowUpRight className="size-4 text-muted-foreground rtl:-scale-x-100" /></div><h2 className="mt-4 text-sm font-semibold leading-7">{item.title}</h2><p className="mt-1 text-xs leading-6 text-muted-foreground">{item.detail}</p></button>)}</div>
              </div> : messages.map(message => <Message key={message.id} from={message.role} className="max-w-full">
                <div className="mb-1 text-xs font-medium text-muted-foreground">{message.role === "user" ? (locale === "ar" ? "أنت" : "You") : "Agentnexos"}</div>
                <MessageContent className="w-full text-sm leading-8 group-[.is-user]:bg-secondary group-[.is-user]:text-foreground">
                  {message.parts.map((part, i) => part.type === "text" ? <MessageResponse key={i} dir={locale === "ar" ? "rtl" : "ltr"} components={{ img: () => null }}>{part.text}</MessageResponse> : null)}
                </MessageContent>
                {message.role === "assistant" && !busy && <button className="flex w-fit items-center gap-2 rounded-lg p-2 text-xs text-muted-foreground hover:bg-secondary" onClick={async () => { try { await navigator.clipboard.writeText(message.parts.filter(p => p.type === "text").map(p => p.text).join("\n"));setCopied(message.id);setNotice(null); } catch { setNotice("copyError"); } }}>{copied === message.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied === message.id ? c.copied : c.copy}</button>}
              </Message>)}
              {busy && <div role="status" className="flex items-center gap-3 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />{phase >= 0 ? c.roles[phase] : c.preparing}</div>}
              {error && <div role="alert" className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-7"><p>{ready === false ? c.offline : c.error}</p><button onClick={() => {const last=[...messages].reverse().find(m=>m.role==="user");const text=last?.parts.filter(p=>p.type==="text").map(p=>p.text).join("\n");if(text){setInput(text);clearError();composer.current?.focus();}}} className="mt-3 underline underline-offset-4">{c.retry}</button></div>}
              {notice && <p role="status" className="rounded-xl border border-border bg-secondary p-4 text-sm leading-7">{c[notice]}</p>}
            </ConversationContent>
            <ConversationScrollButton aria-label={locale === "ar" ? "آخر رسالة" : "Latest message"} />
          </Conversation>
          <div className="shrink-0 px-5 pb-5 pt-3 sm:px-9">
            <div className="mx-auto max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1"><p role="status" className="text-xs leading-6 text-muted-foreground">{ready === null ? c.checking : ready ? c.ready : c.offline}</p>{ready === false && <button type="button" onClick={() => {setReady(null);setReadinessAttempt(value => value + 1);}} className="text-xs underline underline-offset-4">{c.checkConnection}</button>}</div>
              <form onSubmit={e => {e.preventDefault();submit();}} className="rounded-2xl border border-border bg-card p-3 shadow-[0_8px_30px_-18px_#000000] focus-within:border-primary/70">
                <textarea ref={composer} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();submit();}}} maxLength={4000} rows={2} aria-label={c.placeholder} placeholder={c.placeholder} className="max-h-40 min-h-16 w-full resize-y bg-transparent px-2 py-2 text-sm leading-7 outline-none placeholder:text-muted-foreground" />
                <div className="flex items-center justify-between gap-3 px-2"><span className="text-[11px] text-muted-foreground">{input.length}/4000</span>{busy ? <button type="button" onClick={()=>{void stop();setNotice("cancelled");setPhase(-1);}} aria-label={c.stop} className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background"><Square className="size-4" /></button> : <button type="submit" disabled={!input.trim() || ready !== true} aria-label={c.send} className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background hover:bg-primary disabled:opacity-30"><ArrowUp className="size-5" /></button>}</div>
              </form>
              <p className="mt-2 text-center text-[11px] leading-6 text-muted-foreground">{c.contextNotice}</p>
              <p className="mt-3 text-center text-[11px] leading-6 text-muted-foreground">{c.privacy} <Link href={`/${locale}/privacy`} className="underline underline-offset-4">{locale === "ar" ? "الخصوصية" : "Privacy"}</Link></p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
