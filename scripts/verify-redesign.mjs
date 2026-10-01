import { chromium } from '@playwright/test';
import { mkdirSync,writeFileSync,readFileSync } from 'node:fs';
const base=process.env.SITE_URL||process.argv[2]||'http://localhost:3000';
const output=process.env.VERIFY_DIR||'docs/verification/redesign-04/local';
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
const routes=['','platform','solutions','industries','services','resources','security','privacy','terms','about','start','demo-policy','login','agentnexos','account','roi','integrations','process'];
for(const kind of ['solutions','industries','articles']) {const data=JSON.parse(readFileSync(new URL(`../lib/content/catalog/${kind}.json`,import.meta.url)));routes.push(...data.map(x=>`${kind==='articles'?'resources':kind}/${x.slug}`));}
try {
for(const locale of ['ar','en']) for(const width of [390,768,1440]) {
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();
 for(const route of routes){
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const response=await page.goto(`${base}/${locale}/${route}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const state=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,dir:document.documentElement.dir,links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))}));
  const gated=route==='agentnexos'||route==='account';
  const known=new Set(['ar','en'].flatMap(l=>routes.map(r=>`/${l}${r?'/'+r:''}`)));
  const missingLinks=state.links.filter(href=>{try{const u=new URL(href,page.url());return u.origin===new URL(base).origin&&!known.has(u.pathname.replace(/\/$/,''));}catch{return true;}});
  const ok=!missingLinks.length&&response?.status()===200&&state.h1===1&&!state.overflow&&state.dir===(locale==='ar'?'rtl':'ltr')&&(!gated||new URL(page.url()).pathname===`/${locale}/login`)&&!errors.length;
  results.push({locale,width,route,status:response?.status(),ok,overflow:state.overflow,errors,gated,missingLinks});
  if(route===''||route==='login')await page.screenshot({path:`${output}/${locale}-${route||'home'}-${width}.png`,fullPage:true});
  page.removeAllListeners('pageerror');
 }
 if(width===390){await page.goto(`${base}/${locale}`);const button=page.locator('button[aria-expanded]').first();await button.click();await page.keyboard.press('Escape');if(await button.getAttribute('aria-expanded')!=='false')throw Error('Menu Escape failed');}
 await context.close();
}
const apiPage=await browser.newPage();await apiPage.goto(`${base}/en/login`);
const status=await apiPage.evaluate(async()=>{const response=await fetch('/api/agentnexos',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({locale:'en',messages:[{role:'user',parts:[{type:'text',text:'Hello'}]}]})});return response.status;});
results.push({route:'anonymous-agent-api',status,ok:status===401});await apiPage.close();
writeFileSync(`${output}/checks.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({checks:results.length,failed:results.filter(r=>!r.ok)}));
if(results.some(r=>!r.ok))process.exitCode=1;
}finally{await browser.close();}
