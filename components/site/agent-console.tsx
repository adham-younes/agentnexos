"use client";
import { FormEvent, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, CircleStop, LoaderCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export function AgentConsole({ locale }: { locale: Locale }) {
  const ar=locale==="ar"; const [input,setInput]=useState("");
  const {messages,sendMessage,status,stop,error}=useChat({transport:new DefaultChatTransport({api:"/api/agent"})});
  const busy=status==="submitted"||status==="streaming";
  function submit(e:FormEvent){e.preventDefault();const text=input.trim();if(!text||busy)return;void sendMessage({text},{body:{locale}});setInput("");}
  return <div className="console"><div className="console-bar"><span><i/>AGENTNEXOS / PROCESS ARCHITECT</span><b>{busy?(ar?"يحلل الآن":"ANALYSING"):(ar?"جاهز":"READY")}</b></div><div className="messages" aria-live="polite">
    {messages.length===0&&<div className="empty-message"><span>01</span><p>{ar?"مثال: نريد أتمتة استقبال طلبات عروض الأسعار من البريد، مطابقة المنتجات مع ERP، ثم إرسال المسودة للمدير للموافقة.":"Example: Automate incoming quote requests from email, match products against our ERP, then route a draft to a manager for approval."}</p></div>}
    {messages.map(message=><div key={message.id} className={`message ${message.role}`}><small>{message.role==="user"?(ar?"أنت":"YOU"):"AGENTNEXOS"}</small>{message.parts.map((part,i)=>part.type==="text"?<p key={i}>{part.text}</p>:null)}</div>)}
    {busy&&<div className="working"><LoaderCircle size={16}/>{ar?"يبني مخطط العملية...":"Building the process blueprint..."}</div>}{error&&<div className="console-error">{ar?"تعذر تشغيل النموذج الآن. قناة التنفيذ جاهزة، وتحتاج بيئة الإنتاج إلى اعتماد AI Gateway.":"The model is temporarily unavailable. The execution route is ready; production requires AI Gateway credentials."}</div>}</div>
    <form onSubmit={submit}><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={ar?"صف العملية، الأنظمة الحالية، والنتيجة المطلوبة...":"Describe the process, current systems, and desired outcome..."} rows={3}/><div><span>{ar?"لا تنفيذ خارجي في الإصدار التجريبي":"No external execution in this release"}</span>{busy?<button type="button" onClick={()=>void stop()} aria-label="Stop"><CircleStop/></button>:<button type="submit" disabled={!input.trim()} aria-label="Send"><ArrowUp/></button>}</div></form>
  </div>;
}
