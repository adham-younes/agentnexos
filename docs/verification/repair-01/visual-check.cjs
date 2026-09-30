const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const fs=require('node:fs');
(async()=>{
 const stage=process.argv[2];
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE,args:['--no-sandbox']});
 const rows=[];
 const output=process.cwd()+'/docs/verification/repair-01/'+stage;
 fs.mkdirSync(output,{recursive:true});
 for(const locale of ['ar','en']) for(const width of [390,768,1440]) for(const route of ['agentnexos','solutions','security']) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto('http://localhost:3000/'+locale+'/'+route,{waitUntil:'networkidle'});
  const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,lang:document.documentElement.lang,dir:document.documentElement.dir,headerOverflow:[...document.querySelectorAll('header *')].filter(e=>{let r=e.getBoundingClientRect();return r.width>0&&(r.left< -1||r.right>innerWidth+1)}).length,text:document.body.innerText}));
  await page.screenshot({path:output+'/'+route+'-'+locale+'-'+width+'.png',fullPage:route==='agentnexos'});
  rows.push({locale,width,route,status:response.status(),...metrics,errors});
  await page.close();
 }
 fs.writeFileSync(output+'/measurements.json',JSON.stringify(rows,null,2));
 console.log(JSON.stringify(rows.map(({text,...r})=>r),null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
