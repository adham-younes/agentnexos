import { useState, type ReactNode, type MouseEvent } from "react";
import { content, workspaceCopy, resources } from "./ContentData";
import { ComputationalGraph } from "./ComputationalGraph";
import { WorkspaceShell, type WorkspaceView } from "./WorkspaceShell";
import "./ContentAndTemplateReview.css";
const nav=["platform","solutions","methodology","industries","security"];
const names={ar:{home:"الرئيسية",platform:"المنصة",solutions:"الحلول",methodology:"كيف يعمل",industries:"القطاعات",security:"الأمان",services:"الخدمات",resources:"الموارد",about:"عن Agentnexos",agentnexos:"مساعد التصميم",start:"حدد مشروعك",privacy:"البيانات",terms:"الشروط"},en:{home:"Home",platform:"Platform",solutions:"Solutions",methodology:"Process",industries:"Industries",security:"Security",services:"Services",resources:"Resources",about:"About",agentnexos:"Design assistant",start:"Define your project",privacy:"Data",terms:"Terms"}};
type Locale="ar"|"en";
export const ContentAndTemplateReview=()=>{
 const [locale,setLocale]=useState<Locale>("ar"); const [page,setPage]=useState("home");
 const [surface,setSurface]=useState<"site"|"workspace">("site");
 const [tab,setTab]=useState<WorkspaceView["activeTab"]>("tasks"); const [motion,setMotion]=useState(true);
 const ar=locale==="ar"; const labels=names[locale]; const copy=workspaceCopy[locale];
 const markdown=content[locale][page] || content[locale].home;
 const blocks=markdown.trim().split(/\n\n+/); const title=blocks[0].replace(/^# /,"");
 function jump(key:string){setPage(key);setSurface("site");}
 function linkClick(e:MouseEvent<HTMLAnchorElement>,url:string){
   if(url.startsWith("/downloads/")){e.preventDefault();const key=url.split("/").pop()!;const data=resources[key];if(!data)return;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"text/markdown;charset=utf-8"}));a.download=key;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),0);return;}
   if(!url.startsWith("/ar")&&!url.startsWith("/en"))return;
   e.preventDefault(); const pieces=url.split("/").filter(Boolean);setLocale(pieces[0] as Locale);jump(pieces.slice(1).join("/") || "home");
 }
 function inline(text:string):ReactNode{
   return text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part,i)=>{
     const link=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
     if(link)return <a key={i} href={link[2]} onClick={e=>linkClick(e,link[2])}>{link[1]}</a>;
     if(part.startsWith("**"))return <strong key={i}>{part.slice(2,-2)}</strong>;
     return part;
   });
 }
 function render(block:string,i:number){
   if(block.startsWith("### ")||block.startsWith("## ")){
     const [heading,...rest]=block.split("\n");
     return <div key={i}>{heading.startsWith("### ")?<h3>{inline(heading.slice(4))}</h3>:<h2>{inline(heading.slice(3))}</h2>}{rest.length>0&&<p>{inline(rest.join("\n"))}</p>}</div>;
   }
   if(block.startsWith("- "))return <ul key={i}>{block.split("\n").map((line,j)=><li key={j}>{inline(line.replace(/^- /,""))}</li>)}</ul>;
   return <p key={i}>{inline(block)}</p>;
 }
 const view:WorkspaceView={authenticated:true,projectName:ar?"مشروع توضيحي":"Illustrative project",activeTab:tab,sources:[],tools:[],approvals:[],outputs:[],activity:[]};
 return <div className="ax-review-root nexus" dir={ar?"rtl":"ltr"} lang={locale}>
  <div className="ax-review-bar" dir="ltr"><span>{ar?"مراجعة المحتوى والتصميم":"Content and design review"}</span>
   <button onClick={()=>setSurface("site")} aria-pressed={surface==="site"}>{ar?"الموقع":"Website"}</button>
   <button onClick={()=>setSurface("workspace")} aria-pressed={surface==="workspace"}>{ar?"مساحة العميل":"Customer workspace"}</button>
   <select aria-label={ar?"صفحة المراجعة":"Review page"} value={page} onChange={e=>jump(e.target.value)}>{Object.keys(content[locale]).map(k=><option key={k} value={k}>{(labels as Record<string,string>)[k] || content[locale][k].split("\n")[0].replace("# ","")}</option>)}</select>
   <button onClick={()=>setLocale(ar?"en":"ar")}>{ar?"English":"العربية"}</button>
   <button aria-pressed={motion} onClick={()=>setMotion(!motion)}>{ar?(motion?"أوقف الحركة":"شغّل الحركة"):(motion?"Pause motion":"Play motion")}</button>
  </div>
  {surface==="workspace" ? <><div className="ax-review-disclosure">{ar?"تصور مساحة العميل. لا يتصل بأنظمة أو ينفذ أدوات.":"Customer workspace concept. No system connections or tool execution."}</div><WorkspaceShell locale={locale} copy={copy} view={view} onSelect={setTab}/></> : <>
  <header className="nexus-nav ax-review-nav"><div className="nexus-nav-inner"><div className="ax-review-navrow">
   <button className="ax-review-brand" onClick={()=>jump("home")}><span className="nexus-command">⌘</span><b>Agentnexos</b><small>AI</small></button>
   <nav aria-label={ar?"التنقل الرئيسي":"Main navigation"}>{nav.map(k=><button key={k} onClick={()=>jump(k)}>{(labels as Record<string,string>)[k]}</button>)}<button onClick={()=>jump("agentnexos")}>{labels.agentnexos}</button></nav>
   <button className="cyber-button" onClick={()=>jump("start")}>{labels.start}</button>
  </div></div></header>
  <main>
   <section className={page==="home"?"cyber-hero":"nexus-wrap nexus-page-hero"}>
    <div className={page==="home"?"cyber-container cyber-hero-grid":"ax-review-hero-copy"}>
      {page==="home"?<><div className="cyber-hero-copy"><p className="cyber-eyebrow">AGENTNEXOS</p><h1>{title}</h1><p className="cyber-hero-intro">{inline(blocks[1])}</p><div className="cyber-actions"><a className="cyber-button" href={`/${locale}/start`} onClick={e=>linkClick(e,`/${locale}/start`)}>{labels.start}</a><button className="ax-review-textlink" onClick={()=>jump("platform")}>{labels.platform} ↗</button></div></div>
      <div className="nexus-console"><div className="nexus-console-window"><div className="nexus-console-bar"><span>workflow / procurement</span><span>•••</span></div><div className="nexus-console-body"><p>{ar?"تصوّر المسار قبل بنائه":"Define the workflow before building"}</p><div className="ax-review-request"><h3>{ar?"طلب شراء أجهزة للفريق":"Equipment request for the team"}</h3><small>{ar?"بيانات توضيحية":"Illustrative data"} · REQ—024</small></div><div className="ax-review-checks"><p>{ar?"الكمية والمواصفات":"Quantity and specifications"} <span>✓</span></p><p>{ar?"عروض الموردين":"Supplier offers"} <span>—</span></p><p>{ar?"صاحب صلاحية الاعتماد":"Authorized reviewer"} <span>✓</span></p></div><div className="ax-review-approval">{ar?"مراجعة عند مسؤول المشتريات":"Review with the procurement owner"}<small>{ar?"مسودة منظمة. لا أمر شراء دون اعتماد.":"Structured draft. No purchase order without authorization."}</small></div></div><div className="nexus-console-bottom">{ar?"مثال تصميمي، ليس تنفيذًا حيًا":"Design example, not live execution"}</div></div><div className="ax-review-graph-small"><ComputationalGraph label={ar?"شبكة حسابية مجردة":"Abstract computational graph"} animated={motion}/></div></div>
      </>:<><p className="cyber-eyebrow">AGENTNEXOS</p><h1>{title}</h1><p className="nexus-page-intro">{inline(blocks[1])}</p><a className="ax-review-textlink" href={`/${locale}/start`} onClick={e=>linkClick(e,`/${locale}/start`)}>{labels.start} ↗</a></>}
    </div>
    {page!=="home"&&<div className="nexus-page-art" aria-hidden="true"><div className="nexus-art-rings"/><div className="nexus-art-core">⌘</div><div className="nexus-art-node node-1">{ar?"المعرفة":"Knowledge"}</div><div className="nexus-art-node node-2">{ar?"الأدوات":"Tools"}</div><div className="nexus-art-node node-3">{ar?"التحكم":"Control"}</div></div>}
   </section>
   <div className="nexus-wrap ax-review-content">{blocks.slice(2).map(render)}</div>
   {["platform","services"].includes(page)&&<figure className="nexus-wrap ax-review-art"><img src="/assets/computational-graph-4.png" width="1280" height="720" alt={ar?"رسم حسابي مجرد للمصادر والأدوات والتنسيق":"Abstract computational illustration of sources, tools and orchestration"} loading="lazy"/><figcaption>{ar?"تمثيل بصري للمفهوم، وليس سجل تشغيل":"Conceptual illustration, not an execution record"}</figcaption></figure>}
   <section className="nexus-wrap ax-review-motion"><ComputationalGraph label={ar?"رسم هندسي لشبكة حسابية":"Geometric computational network"} animated={motion}/></section>
  </main>
  <footer className="nexus-footer"><div className="nexus-wrap"><div className="nexus-footer-main"><div><b>Agentnexos</b><p>{ar?"هندسة الأنظمة الوكيلة للمؤسسات":"Enterprise agent systems engineering"}</p></div><nav>{["platform","solutions","services","industries","methodology","security","resources","about","privacy","terms"].map(k=><button key={k} onClick={()=>jump(k)}>{(labels as Record<string,string>)[k]}</button>)}</nav></div><div className="nexus-footer-bottom">© 2026 Agentnexos <a href="mailto:adham@adham-agritech.com">adham@adham-agritech.com</a></div></div></footer>
  </>}
 </div>;
};
