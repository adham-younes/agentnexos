import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import content from '../lib/content/revision-20261014.json' with {type:'json'};
const base=process.argv[2]||'http://localhost:3018',label=process.argv[3]||'local';
const report={base,checkedAt:new Date().toISOString(),viewports:[],routes:[],failures:[]};
await mkdir('output/agynexa-reference',{recursive:true});
const browser=await chromium.launch();
try{
 for(const locale of ['en','ar'])for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  try{
   const r=await page.goto(`${base}/${locale}`);await page.locator('[data-effects-ready="true"]').waitFor();await page.evaluate(()=>document.fonts.ready);
   const h1=(await page.locator('h1').innerText()).replace(/\s+/g,' ').trim();
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,font:getComputedStyle(document.querySelector('h1')).fontFamily,dir:document.documentElement.dir,background:getComputedStyle(document.body).backgroundColor,accent:getComputedStyle(document.querySelector('h1 em')).color}));
   if(r.status()!==200||h1!==content[locale].home.title||layout.overflow||layout.background!=='rgb(5, 5, 5)'||layout.accent!=='rgb(16, 185, 129)'||!layout.font.includes(locale==='en'?'Newsreader':'Noto Naskh Arabic')||layout.dir!==(locale==='en'?'ltr':'rtl'))throw Error('Brand/template/headline/layout mismatch');
   if(!await page.locator('header').innerText().then(t=>t.includes('AGYNEXA')))throw Error('Old wordmark');
   await page.screenshot({path:`output/agynexa-reference/${label}-${locale}-${width}.png`});report.viewports.push({locale,width,headline:h1,...layout});
  }catch(e){report.failures.push({locale,width,error:e.message});}finally{await page.close();}
 }
 const redirect=await fetch(base+'/',{redirect:'manual'});report.defaultLocale={status:redirect.status,location:redirect.headers.get('location')};if(!report.defaultLocale.location?.endsWith('/en'))throw Error('English is not default');
 for(const locale of ['en','ar'])for(const key of Object.keys(content[locale])){
  const path=`/${locale}${key==='home'?'':'/'+key}`,r=await fetch(base+path),html=await r.text();
  if(r.status!==200||!html.includes('AGYNEXA')||(html.includes('Agentnexos')||html.includes('FIELD GUIDE / AGENTNEXOS')))report.failures.push({path,error:'HTTP or display-brand mismatch'});
  report.routes.push({path,status:r.status});
 }
}catch(e){report.failures.push({global:e.message});}finally{await browser.close();}
await writeFile(`output/agynexa-reference/${label}-brand.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({viewports:report.viewports.length,routes:report.routes.length,defaultLocale:report.defaultLocale,failures:report.failures}));if(report.failures.length)process.exitCode=1;
