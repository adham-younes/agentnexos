import { chromium } from '@playwright/test';
import { mkdirSync,writeFileSync } from 'node:fs';
const base=process.env.SITE_URL||'http://localhost:3000';
const output=process.env.VERIFY_DIR||'docs/verification/redesign-01/local';
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
const routes=['','platform','solutions','industries','services','resources','security','privacy','terms','about','start','demo-policy','login','agentnexos'];
try {
for(const locale of ['ar','en']) for(const width of [390,768,1440]) {
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();
 for(const route of routes){
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const response=await page.goto(`${base}/${locale}/${route}`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const state=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth+1,dir:document.documentElement.dir,links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))}));
  const gated=route==='agentnexos';
  const ok=response?.status()===200&&state.h1===1&&!state.overflow&&state.dir===(locale==='ar'?'rtl':'ltr')&&(!gated||new URL(page.url()).pathname===`/${locale}/login`)&&!errors.length;
  results.push({locale,width,route,status:response?.status(),ok,overflow:state.overflow,errors,gated});
  if(route===''||route==='login')await page.screenshot({path:`${output}/${locale}-${route||'home'}-${width}.png`,fullPage:true});
  page.removeAllListeners('pageerror');
 }
 if(width===390){await page.goto(`${base}/${locale}`);const button=page.locator('button[aria-expanded]').first();await button.click();await page.keyboard.press('Escape');if(await button.getAttribute('aria-expanded')!=='false')throw Error('Menu Escape failed');}
 await context.close();
}
const api=await fetch(`${base}/api/agentnexos`,{method:'POST',headers:{origin:base,'content-type':'application/json'},body:JSON.stringify({locale:'en',messages:[{role:'user',parts:[{type:'text',text:'Hello'}]}]})});
results.push({route:'anonymous-agent-api',status:api.status,ok:api.status===401});
writeFileSync(`${output}/checks.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({checks:results.length,failed:results.filter(r=>!r.ok)}));
if(results.some(r=>!r.ok))process.exitCode=1;
}finally{await browser.close();}
