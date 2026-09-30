const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE,args:['--no-sandbox']});
 const rows=[];
 for (const locale of ['ar','en']) {
  const context=await browser.newContext({viewport:{width:390,height:900}});
  const page=await context.newPage();const posts=[];const errors=[];
  page.on('request',r=>{if(r.method()==='POST'&&/\/api\/(chat|approvals)/.test(r.url())) posts.push(r.url())});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3000/'+locale+'/agentnexos',{waitUntil:'networkidle'});
  const labels=locale==='ar'?{start:'استكشف مسار المراجعة',approve:'اعتماد المسودة في المثال',reject:'إعادة للمراجعة',reset:'ابدأ المثال من جديد',other:'متابعة المستحقات',review:'بانتظار قرارك في المثال',approved:'اعتمدت المسودة في المثال',rejected:'أعدت الطلب للمراجعة',idle:'جاهز للاستكشاف'}:{start:'Explore the review process',approve:'Approve the example draft',reject:'Return for review',reset:'Restart the example',other:'Receivables follow-up',review:'Waiting for your example decision',approved:'You approved the example draft',rejected:'You returned the request for review',idle:'Ready to explore'};
  for(const scenario of [0,1]) {
   if(scenario===1) await page.getByRole('button',{name:new RegExp(labels.other)}).click();
   await page.getByRole('button',{name:labels.start,exact:true}).click();
   assert.equal(await page.getByRole('status').innerText(),labels.review);
   await page.getByRole('button',{name:labels.reject,exact:true}).click();
   assert.equal(await page.getByRole('status').innerText(),labels.rejected);
   assert.equal(await page.getByRole('button',{name:labels.approve,exact:true}).count(),0);
   await page.getByRole('button',{name:labels.reset,exact:true}).click();
   assert.equal(await page.getByRole('status').innerText(),labels.idle);
   await page.getByRole('button',{name:labels.start,exact:true}).click();
   await page.getByRole('button',{name:labels.approve,exact:true}).click();
   assert.equal(await page.getByRole('status').innerText(),labels.approved);
   assert.equal(await page.getByRole('button',{name:labels.approve,exact:true}).count(),0);
   await page.getByRole('button',{name:labels.reset,exact:true}).click();
   rows.push({locale,scenario,review:true,reject:true,approve:true,reset:true});
  }
  const visible=await page.locator('body').innerText();
  assert(!/Qwen|GPT-OSS|Groq|Supabase|Thread ID|Run ID|SSE|SHA-256/.test(visible));
  assert.equal(posts.length,0);assert.equal(errors.length,0);
  await page.reload({waitUntil:'networkidle'});
  await page.keyboard.press('Tab');
  const focused=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent}));
  assert.equal(focused.tag,'A');
  const next=locale==='ar'?'en':'ar';
  await page.getByRole('link',{name:next==='ar'?'العربية':'English',exact:true}).click();
  await page.waitForURL('**/'+next+'/agentnexos');
  assert.equal(await page.locator('html').getAttribute('dir'),next==='ar'?'rtl':'ltr');
  rows.push({locale,noRuntimePosts:true,noInternalIdentifiers:true,noPageErrors:true,keyboardFocus:true,localePathPreserved:true});
  await context.close();
 }
 fs.writeFileSync('docs/verification/repair-01/flow-results.json',JSON.stringify(rows,null,2));
 console.log(JSON.stringify(rows,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
