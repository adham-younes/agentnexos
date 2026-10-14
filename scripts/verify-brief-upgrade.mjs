import { chromium } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const base=process.argv[2]||'http://localhost:3014';
const report={base,checkedAt:new Date().toISOString(),cases:[],failures:[],emailTest:'Actual mailto anchor activation intercepted before opening an OS mail client; no message sent.'};
const browser=await chromium.launch();
try{
 for(const locale of ['ar','en'])for(const width of [390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},permissions:['clipboard-read','clipboard-write'],acceptDownloads:true,reducedMotion:'reduce'});const page=await context.newPage();const posts=[];page.on('request',r=>{if(r.method()==='POST'&&r.url().includes('/api/'))posts.push(r.url());});
  try{
   await page.goto(`${base}/${locale}/start`);await page.locator('[data-effects-ready="true"]').waitFor();
   await page.getByRole('button',{name:locale==='ar'?'استخدم المثال الافتراضي':'Use the fictional example',exact:true}).click();await page.locator('button[type=submit]').click();
   const preview=page.locator('#brief-preview');const complete=await preview.inputValue();if(complete.length<300)throw Error('Incomplete preview');
   const copy=page.getByRole('button',{name:locale==='ar'?'انسخ الموجز الكامل':'Copy complete brief',exact:true});await copy.click();if(await page.evaluate(()=>navigator.clipboard.readText())!==complete)throw Error('Clipboard differs from preview');
   const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:/نزّل الموجز|Download Markdown/}).click()]);if(await readFile(await download.path(),'utf8')!==complete)throw Error('Download differs from complete preview');
   const mail=page.locator('form a[href^="mailto:"]');const href=await mail.getAttribute('href');if(!href.startsWith('mailto:adham@adham-agritech.com?')||href.length>1800)throw Error('Email target/length failure');
   await mail.evaluate(node=>node.addEventListener('click',event=>{event.preventDefault();window.__briefMailIntent=node.href;},{once:true}));await copy.focus();await page.keyboard.press("Tab");if(!await mail.evaluate(node=>node===document.activeElement))throw Error("Email focus order failed");await page.keyboard.press("Enter");const activated=await page.evaluate(()=>window.__briefMailIntent);if(!activated||new URL(activated).pathname!==new URL(href).pathname||new URL(activated).searchParams.get('body')!==new URL(href).searchParams.get('body'))throw Error('Email action not activated');
   await page.locator('#brief-goal').fill((locale==='ar'?'تفاصيل مشروع طويلة ':'Long project details ').repeat(60).slice(0,1200));await page.locator('button[type=submit]').click();const longText=await preview.inputValue();const longHref=await mail.getAttribute('href');const body=new URL(longHref).searchParams.get('body');if(longHref.length>1800||body.includes(longText)||!body.includes(locale==='ar'?'الموجز الكامل':'complete brief'))throw Error('Long brief silently truncated');
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)||posts.length)throw Error('Overflow or unexpected API POST');
   await preview.scrollIntoViewIfNeeded();await mkdir('output/brief-upgrade',{recursive:true});await page.screenshot({path:`output/brief-upgrade/${locale}-${width}.png`});report.cases.push({locale,width,completePreview:true,clipboardExact:true,downloadExact:true,mailActivated:true,longAttachment:true,apiPosts:posts});
  }catch(error){report.failures.push({locale,width,error:error.message});}finally{await context.close();}
 }
}finally{await browser.close();}
await mkdir('output/brief-upgrade',{recursive:true});await writeFile('output/brief-upgrade/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.failures.length)process.exitCode=1;
