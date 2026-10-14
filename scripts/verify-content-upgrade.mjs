import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const base=process.argv[2] || 'http://localhost:3014';
const packagePath='docs/content-upgrade/2026-10-13/revision-2026-10-14';
const content=JSON.parse(await readFile('lib/content/revision-20261014.json','utf8'));
const manifest=JSON.parse(await readFile(`${packagePath}/route_manifest.json`,'utf8'));
const normalize=text=>text.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\*\*/g,'').replace(/^###? /gm,'').replace(/^- /gm,'').replace(/\s+/g,' ').trim();
const report={base,checkedAt:new Date().toISOString(),pages:[],downloads:[],failures:[],legalExceptions:['privacy','terms']};
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 for(const locale of ['ar','en']) for(const [key,entry] of Object.entries(content[locale])) {
  if(report.legalExceptions.includes(key)) continue;
  const path=`/${locale}${key==='home'?'':'/'+key}`;
  await page.goto(base+path); await page.locator('main').waitFor();
  const text=normalize(await page.locator('main').evaluate(main=>{const clone=main.cloneNode(true);clone.querySelectorAll('p,h1,h2,h3,summary,li').forEach(node=>node.append(' '));return clone.textContent;}));
  const missing=[];
  for(const block of [entry.title,entry.intro,...entry.sections.flatMap(s=>[s.heading,s.body])]) {
   if(!text.includes(normalize(block))) missing.push(normalize(block).slice(0,90));
  }
  // Heading/body pairs may be separated by markup but all text must remain in order.
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(node=>node.id));
  const missingIds=entry.sections.filter(s=>!ids.includes(s.id)).map(s=>s.id);
  const row={path,missing,missingIds};report.pages.push(row);
  if(missing.length||missingIds.length) report.failures.push(row);
 }
 for(const download of manifest.downloadRoutes) {
  const response=await page.request.get(base+download.route);
  const actual=await response.body();const expected=await readFile(`${packagePath}/${download.source}`);
  const ok=response.status()===200 && createHash('sha256').update(actual).digest('hex')===createHash('sha256').update(expected).digest('hex');
  report.downloads.push({route:download.route,status:response.status(),exactMatch:ok});if(!ok)report.failures.push({download:download.route});
 }
} finally {await browser.close();}
await writeFile('output/content-upgrade-baseline/content-parity.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(report.failures.length) process.exitCode=1;
