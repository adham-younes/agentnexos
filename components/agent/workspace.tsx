"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, ArrowUpRight, Check, Command, Copy, Download, Layers3, LoaderCircle, Plus, ShieldCheck, Square, Workflow, Menu, X } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton, messagesToMarkdown } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { useLocale } from "@/lib/i18n/use-t";
import { projectConversation } from "@/lib/agents/context";
import { masterPage, masterValue } from "@/lib/content/master";
import { revision } from "@/lib/content/revision";
import { ContentSections } from "@/components/site/content-body";
import { AccountStatus } from "@/components/auth/account-status";
import { agentWorkspaceCopy } from "@/lib/content/agent-workspace";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import "./workspace.css";
import { demoLimitCode, demoLimitCount, previewLimitsSchema, type DemoLimitCode } from "@/lib/agents/reservation";
export function AgentWorkspace() {
    const locale = useLocale();
    const c = agentWorkspaceCopy[locale];
    const reviewed = revision[locale].agentnexos;
    const approved = masterPage(locale, 'agentnexos');
    const promptLabel = masterValue(approved.sections, 'تسمية الإدخال', 'حقل الإدخال', 'حقل الرسالة', 'نص الإدخال', 'Input label');
    const approvedSuggestions = masterValue(approved.sections, 'الأمثلة الجاهزة', 'Example prompts').split('\n').filter(Boolean).map(text => text.replace(/^- /, ''));
    const [input, setInput] = useState("");
    const [ready, setReady] = useState<boolean | null>(null);
    const [phase, setPhase] = useState(-1);
    const [limitCode, setLimitCode] = useState<DemoLimitCode | null>(null);
    const [limitCount, setLimitCount] = useState<number | null>(null);
    const [dailyBudget, setDailyBudget] = useState<number | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [notice, setNotice] = useState<"cancelled" | "copyError" | null>(null);
    const [readinessAttempt, setReadinessAttempt] = useState(0);
    const composer = useRef<HTMLTextAreaElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const focusComposerOnClose = useRef(false);
    const transport = useMemo(() => new DefaultChatTransport({
        api: "/api/agentnexos",
        fetch: async (input, init) => {
            const response = await fetch(input, init);
            if (response.status === 429) {
                const body = await response.clone().json().catch(() => null);
                setLimitCode(demoLimitCode(body));
                setLimitCount(demoLimitCount(body));
            }
            return response;
        },
        prepareSendMessagesRequest: ({ messages }) => ({ body: { locale, messages: projectConversation(messages) } }),
    }), [locale]);
    const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat({
        transport,
        onData: (part) => {
            if (part.type === "data-phase") {
                const index = (part.data as {
                    index?: unknown;
                })?.index;
                if (typeof index === "number" && Number.isInteger(index) && index >= 0 && index < c.roles.length)
                    setPhase(index);
            }
        },
    });
    const busy = status === "submitted" || status === "streaming";
    useEffect(() => {
        const controller = new AbortController();
        const deadline = AbortSignal.timeout(10000);
        fetch("/api/agentnexos", { signal: AbortSignal.any([controller.signal, deadline]), cache: "no-store" }).then(r => { if (!r.ok)
            throw new Error("READINESS_FAILED"); return r.json(); }).then(data => { setReady(data.ready === true); const limits = previewLimitsSchema.safeParse(data.limits); setDailyBudget(limits.success ? limits.data.perConnectionDaily : null); }).catch(() => { if (!controller.signal.aborted) {
            setReady(false);
            setDailyBudget(null);
        } });
        return () => controller.abort();
    }, [readinessAttempt]);
    function submit(text = input) {
        if (!text.trim() || busy || ready !== true)
            return;
        clearError();
        setLimitCode(null);
        setLimitCount(null);
        setNotice(null);
        setPhase(-1);
        setInput("");
        void sendMessage({ text: text.trim() }).catch(() => setInput(text));
    }
    function download() {
        const url = URL.createObjectURL(new Blob([messagesToMarkdown(messages)], { type: "text/markdown;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "agentnexos-conversation.md";
        link.click();
        URL.revokeObjectURL(url);
    }
    function newConversation(fromDrawer = false) {
        setMessages([]);
        clearError();
        setNotice(null);
        setCopied(null);
        setInput("");
        setPhase(-1);
        if (fromDrawer) {
            focusComposerOnClose.current = true;
            setDrawerOpen(false);
        }
        else
            composer.current?.focus();
    }
    function railContent(inDrawer = false) {
        return <>
      <div className="workspace-brand-row">
        <Link href={`/${locale}`} className="workspace-brand" aria-label={c.home}><Command size={23} aria-hidden="true"/><span dir="ltr">AGYNEXA</span></Link>
        {inDrawer && <SheetClose asChild><Button variant="ghost" size="icon" aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}><X size={18}/></Button></SheetClose>}
      </div>
      <Button variant="outline" disabled={busy} onClick={() => newConversation(inDrawer)} className="workspace-new"><Plus size={15} aria-hidden="true"/><span>{c.newChat}</span></Button>
      <div className="workspace-rail-content">
        <h2>{c.team}</h2>
        <ol className="workspace-stages">{c.roles.map((role, i) => <li key={role} data-active={busy && phase === i}><span className="workspace-stage-number">{busy && phase === i ? <LoaderCircle size={14} className="animate-spin"/> : `0${i + 1}`}</span><div><p>{role}</p><p>{c.roleDescriptions[i]}</p></div></li>)}</ol>
        <section className="workspace-capability"><h2>{c.capability}</h2><ul>{c.tools.map(tool => <li key={tool}><Workflow size={13} aria-hidden="true"/>{tool}</li>)}</ul></section>
        <section className="workspace-boundary"><ShieldCheck size={16} aria-hidden="true"/><h2>{c.boundary}</h2><p>{c.boundaryText}</p></section>
      </div>
      <div className="workspace-account"><AccountStatus locale={locale}/><LocaleSwitcher /></div>
    </>;
    }
    return (<div className="agent-workspace nexus-workspace" lang={locale}>
      <div className="workspace-shell">
        <aside className="workspace-rail" aria-label={locale === "ar" ? "تنقل المساعد" : "Assistant navigation"}>{railContent()}</aside>
        <main id="main-content" tabIndex={-1} className="workspace-main">
          <div className="workspace-toolbar">
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="workspace-menu" aria-label={locale === "ar" ? "فتح قائمة المساعد" : "Open assistant menu"}><Menu size={19}/></Button></SheetTrigger>
              <SheetContent lang={locale} side={locale === "ar" ? "right" : "left"} dir={locale === "ar" ? "rtl" : "ltr"} className="workspace-sheet" onCloseAutoFocus={event => { if (focusComposerOnClose.current) {
        event.preventDefault();
        focusComposerOnClose.current = false;
        composer.current?.focus();
    } }}>
                <SheetTitle className="sr-only">{locale === "ar" ? "قائمة المساعد" : "Assistant menu"}</SheetTitle>
                <SheetDescription className="sr-only">{locale === "ar" ? "مراحل الطلب ونطاق المساعد وخيارات الحساب" : "Request stages, assistant scope and account options"}</SheetDescription>
                {railContent(true)}
              </SheetContent>
            </Sheet>
            <p className="workspace-label"><span aria-hidden="true"/>{c.label}</p>
            <Button variant="ghost" size="icon" disabled={!messages.length || busy} onClick={download} aria-label={c.download} className="workspace-download"><Download size={16}/></Button>
          </div>
          <Conversation key={messages.length ? "conversation" : "welcome"} className="min-h-0" initial={messages.length ? "smooth" : false} resize="smooth" aria-label={c.label}>
            <ConversationContent className="workspace-message-list">
              {messages.length === 0 ? <div className="workspace-welcome">
                <div className="workspace-emblem"><Layers3 className="size-7"/></div>
                <h1 className="workspace-title">{reviewed.title}</h1>
                <p className="workspace-intro">{reviewed.intro}</p><details className="workspace-scope"><summary>{locale === "ar" ? "نطاق المساعد وقبل الإرسال" : "Assistant scope and before sending"}</summary><p className="workspace-scope-intro">{reviewed.intro}</p><ContentSections sections={reviewed.sections}/></details>
                <div className="workspace-suggestions">{approvedSuggestions.map((title, i) => <button key={title} onClick={() => { setInput(title); composer.current?.focus(); }} className="workspace-suggestion"><div className="flex items-center justify-between gap-3"><span className="workspace-suggestion-number">0{i + 1}</span><ArrowUpRight className="size-4 text-muted-foreground rtl:-scale-x-100"/></div><h2 className="workspace-suggestion-title">{title}</h2></button>)}</div>
              </div> : messages.map(message => <Message key={message.id} from={message.role} className="max-w-full">
                <div className="mb-1 text-xs font-medium text-muted-foreground">{message.role === "user" ? (locale === "ar" ? "أنت" : "You") : "AGYNEXA"}</div>
                <MessageContent className="w-full text-sm leading-8 group-[.is-user]:bg-secondary group-[.is-user]:text-foreground">
                  {message.parts.map((part, i) => part.type === "text" ? <MessageResponse key={i} dir={locale === "ar" ? "rtl" : "ltr"} components={{ img: () => null }}>{part.text}</MessageResponse> : null)}
                </MessageContent>
                {message.role === "assistant" && !busy && <button className="flex w-fit items-center gap-2 rounded-lg p-2 text-xs text-muted-foreground hover:bg-secondary" onClick={async () => { try {
            await navigator.clipboard.writeText(message.parts.filter(p => p.type === "text").map(p => p.text).join("\n"));
            setCopied(message.id);
            setNotice(null);
        }
        catch {
            setNotice("copyError");
        } }}>{copied === message.id ? <Check className="size-3.5"/> : <Copy className="size-3.5"/>}{copied === message.id ? c.copied : c.copy}</button>}
              </Message>)}
              {busy && <div role="status" className="flex items-center gap-3 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin"/>{phase >= 0 ? c.roles[phase] : c.preparing}</div>}
              {error && <div role="alert" className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-7"><p>{ready === false ? c.offline : limitCode ? c.limits[limitCode] : c.error}</p>{limitCount !== null && <p>{c.budgetLabel} {limitCount} {c.dailyUnit}</p>}<button onClick={() => { const last = [...messages].reverse().find(m => m.role === "user"); const text = last?.parts.filter(p => p.type === "text").map(p => p.text).join("\n"); if (text) {
        setInput(text);
        clearError();
        setLimitCode(null);
        setLimitCount(null);
        composer.current?.focus();
    } }} className="mt-3 underline underline-offset-4">{c.retry}</button></div>}
              {notice && <p role="status" className="rounded-xl border border-border bg-secondary p-4 text-sm leading-7">{c[notice]}</p>}
            </ConversationContent>
            {messages.length > 0 && <ConversationScrollButton aria-label={locale === "ar" ? "آخر رسالة" : "Latest message"}/>}
          </Conversation>
          <div className="workspace-composer">
            <div className="workspace-composer-inner">
              <div className="workspace-readiness"><p role="status" className="text-xs leading-6 text-muted-foreground">{ready === null ? c.checking : ready ? c.ready : c.offline}{ready === true && dailyBudget !== null && <span className="block">{c.budgetLabel} {dailyBudget} {c.dailyUnit}</span>}</p>{ready === false && <button type="button" onClick={() => { setReady(null); setReadinessAttempt(value => value + 1); }} className="text-xs underline underline-offset-4">{c.checkConnection}</button>}</div>
              <form onSubmit={e => { e.preventDefault(); submit(); }} className="workspace-composer-form">
                <textarea ref={composer} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        submit();
    } }} maxLength={4000} rows={2} aria-label={promptLabel || c.placeholder} placeholder={promptLabel || c.placeholder} className="workspace-textarea"/>
                <div className="flex items-center justify-between gap-3 px-2"><span className="text-[11px] text-muted-foreground">{input.length}/4000</span>{busy ? <Button type="button" variant="outline" size="icon" onClick={() => { void stop(); setNotice("cancelled"); setPhase(-1); }} aria-label={c.stop} className="workspace-send"><Square className="size-4"/></Button> : <Button type="submit" variant="outline" size="icon" disabled={!input.trim() || ready !== true} aria-label={c.send} className="workspace-send"><ArrowUp className="size-5"/></Button>}</div>
              </form>
              <p className="workspace-context">{c.contextNotice}</p>
              <p className="workspace-privacy">{masterValue(approved.sections, 'تنبيه ملاصق لحقل الإدخال', 'Notice beside the input')} <Link href={`/${locale}/privacy`} className="underline underline-offset-4">{locale === "ar" ? "الخصوصية" : "Privacy"}</Link></p>
            </div>
          </div>
        </main>
      </div>
    </div>);
}
