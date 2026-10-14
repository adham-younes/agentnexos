import { readFile, mkdir, writeFile } from 'node:fs/promises';
const base=new URL(process.argv[2]||'https://compute-the-platform-to-build-six-fawn.vercel.app');
const version=process.argv[3]||'unverified';
const cases=(await readFile('docs/content-upgrade/2026-10-13/revision-2026-10-14/agent/evals.jsonl','utf8')).trim().split('\n').map(JSON.parse);
const report={base:base.origin,version,startedAt:new Date().toISOString(),configuredModels:['qwen/qwen3.8-27b','openai/gpt-oss-120b'],modelEvidence:'IDs from deployed source configuration; provider model ID is not exposed by the public stream.',cases:[],notes:['No model or database secrets downloaded. Actual production API requests with fictional inputs.','Text-only hypothetical tool failure/injection cases are not live external write fault injection.','Customer cases require an authenticated customer runtime and are not executed against the public API.']};
const message=(role,text)=>({role,parts:[{type:'text',text}]});
let initialWorkflow=null;
async function run(locale,messages){
 const started=Date.now();
 const response=await fetch(new URL('/api/agentnexos',base),{method:'POST',headers:{origin:base.origin,'content-type':'application/json'},body:JSON.stringify({locale,messages}),signal:AbortSignal.timeout(180000)});
 const raw=await response.text();let answer='',finished=false;const errors=[],phases=[];
 for(const line of raw.split('\n')){if(!line.startsWith('data: ')||line==='data: [DONE]')continue;try{const event=JSON.parse(line.slice(6));if(event.type==='text-delta')answer+=event.delta;if(event.type==='finish')finished=true;if(event.type==='error')errors.push(event.errorText);if(event.type==='data-phase')phases.push(event.data.index);}catch{}}
 return {httpStatus:response.status,finished,answer,errors,phases,elapsedMs:Date.now()-started,executionStatus:response.ok&&finished&&answer.trim()&&!errors.length?'completed':'failed',semanticVerdict:'pending manual review'};
}
await mkdir('output/agent-evals',{recursive:true});
for(const entry of cases){
 if(entry.mode!=='public'){report.cases.push({...entry,executionStatus:'blocked',reason:'No authenticated customer agent/runtime or verified institutional tools yet.'});continue;}
 const messages=[message('user',entry.input)];
 if(entry.id==='public-followup-en'&&initialWorkflow){messages.unshift(message('user',initialWorkflow.input),message('assistant',initialWorkflow.answer));}
 let result;
 try{result=await run(entry.locale,messages);}catch(error){result={executionStatus:'failed',error:error.name,semanticVerdict:'not evaluated'};}
 if(entry.id==='public-review_scope-en'&&result.executionStatus==='completed')initialWorkflow={input:entry.input,answer:result.answer};
 report.cases.push({...entry,...result,actualConversationTurns:messages.length});
 await writeFile(`output/agent-evals/${version}.json`,JSON.stringify(report,null,2));
 console.log(`${entry.id}: ${result.executionStatus}`);
}
report.completedAt=new Date().toISOString();await writeFile(`output/agent-evals/${version}.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({completed:report.cases.filter(c=>c.executionStatus==='completed').length,failed:report.cases.filter(c=>c.executionStatus==='failed').length,blocked:report.cases.filter(c=>c.executionStatus==='blocked').length,semanticStatus:'pending manual review'}));
if(report.cases.some(c=>c.executionStatus==='failed'))process.exitCode=1;
