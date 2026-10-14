import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const base=process.argv[2]||'http://localhost:3014';
const report={base,checkedAt:new Date().toISOString(),pages:[],failures:[]};
const manifest=JSON.parse(await readFile('docs/content-upgrade/2026-10-13/revision-2026-10-14/assets/manifest.json','utf8'));
const selected=manifest.assets.find(asset=>asset.file.endsWith('computational-graph-4.png'));
const browser=await chromium.launch();
try {
 for(const locale of ['ar','en']) for(const width of [390,768,1440]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try {
   const response=await page.goto(`${base}/${locale}/platform`);await page.locator('[data-effects-ready="true"]').waitFor();await page.evaluate(()=>document.fonts.ready);
   const svg=page.locator('svg.ax-computational');await svg.scrollIntoViewIfNeeded();
   if(await svg.count()!==1 || !await svg.locator('title').textContent()) throw Error('Missing labelled graph');
   if(await svg.locator('.ax-computational-pulse').evaluate(node=>getComputedStyle(node).animationName)!=='none') throw Error('Motion ignores preference');
   const img=page.locator('img[src*="computational-graph-4"]');await img.scrollIntoViewIfNeeded();await img.evaluate(node=>node.decode());
   const state=await img.evaluate(node=>({width:node.naturalWidth,height:node.naturalHeight,lazy:node.loading,displayedWidth:node.getBoundingClientRect().width}));
   if(state.width!==1280||state.height!==720||state.lazy!=='lazy') throw Error('Wrong image/loading contract');
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,dir:document.documentElement.dir,font:getComputedStyle(document.querySelector('h1')).fontFamily,background:getComputedStyle(document.body).backgroundColor,hero:!!document.querySelector('.nexus-page-hero .nexus-console')}));
   if(response.status()!==200||layout.overflow||errors.length||!layout.hero||layout.dir!==(locale==='ar'?'rtl':'ltr')||!layout.font.includes(locale==='ar'?'Noto Naskh Arabic':'Newsreader')) throw Error('Page/template/layout failure');
   await page.locator('h1').scrollIntoViewIfNeeded();await mkdir('output/visual-upgrade',{recursive:true});await page.screenshot({path:`output/visual-upgrade/${locale}-platform-${width}.png`,fullPage:true});
   report.pages.push({locale,width,status:response.status(),state,layout,errors});
  }catch(error){report.failures.push({locale,width,error:error.message});}finally{await page.close();}
 }
 const response=await fetch(`${base}/images/agentnexos/computational-graph-4.png`);const hash=createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
 report.asset={status:response.status,sha256:hash,expected:selected.sha256};if(hash!==selected.sha256||response.status!==200)report.failures.push({asset:'hash mismatch'});
}finally{await browser.close();}
await mkdir('output/visual-upgrade',{recursive:true});await writeFile('output/visual-upgrade/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.failures.length)process.exitCode=1;
