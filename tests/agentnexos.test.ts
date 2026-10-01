import test from "node:test";
import assert from "node:assert/strict";
import { MockLanguageModelV4 } from "ai/test";
import { simulateReadableStream } from "ai";
import { runAgentWorkflow } from "../lib/agents/workflow";
import { createDemoTools } from "../lib/agents/tools";
import { GET, POST } from "../app/api/agentnexos/route";
import { reservationSchema, demoLimitCode, demoLimitCount, previewLimitsSchema } from "../lib/agents/reservation";
import { agentWorkspaceCopy } from "../lib/content/agent-workspace";

const usage = { inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: 20, text: 20, reasoning: undefined } };
test("reservation rejects unknown outcomes and malformed run IDs instead of starting a model", () => {
  for (const value of [null, "a-run-id", {code:"RESERVED",runId:"invalid"}, {code:"UNKNOWN",retryAfterSeconds:30}, {code:"DEMO_BUSY",retryAfterSeconds:0}]) assert.equal(reservationSchema.safeParse(value).success,false);
  assert.equal(reservationSchema.safeParse({code:"RESERVED",runId:"00000000-0000-4000-8000-000000000001"}).success,true);
});
test("daily, global and active-request limits have distinct bilingual messages", () => {
  for (const code of ["DEMO_BUSY", "DEMO_DAILY_LIMIT", "DEMO_GLOBAL_LIMIT"] as const) {
    assert.equal(demoLimitCode({code}),code);
    assert.equal(reservationSchema.safeParse({code,retryAfterSeconds:86400}).success,true);
    for (const locale of ["ar","en"] as const) assert.notEqual(agentWorkspaceCopy[locale].limits[code],agentWorkspaceCopy[locale].error);
  }
  assert.equal(demoLimitCode({code:"PROVIDER_ERROR"}),null);
  assert.equal(demoLimitCode(null),null);
});
test("configured budgets reject invalid or inverted limits, and error counts come from the server", () => {
  assert.equal(previewLimitsSchema.safeParse({perConnectionDaily:1000,globalDaily:10000,windowSeconds:86400}).success,true);
  for (const value of [0, -1, 1000001, 1.5, "1000"]) assert.equal(previewLimitsSchema.safeParse({perConnectionDaily:value,globalDaily:10000,windowSeconds:86400}).success,false);
  assert.equal(previewLimitsSchema.safeParse({perConnectionDaily:1000,globalDaily:999,windowSeconds:86400}).success,false);
  assert.equal(demoLimitCount({code:"DEMO_DAILY_LIMIT",retryAfterSeconds:30,limit:37,windowSeconds:86400}),37);
  assert.equal(demoLimitCount({code:"DEMO_DAILY_LIMIT",retryAfterSeconds:30,limit:"<script>"}),null);
  for (const locale of ["ar","en"] as const) assert.equal(agentWorkspaceCopy[locale].limits.DEMO_DAILY_LIMIT.includes("5"),false);
});
function generateModel(text: string) { return new MockLanguageModelV4({ doGenerate: async () => ({ content: [{ type: "text", text }], finishReason: { unified: "stop", raw: undefined }, usage, warnings: [] }) }); }
function reviewerModel() { return new MockLanguageModelV4({ doStream: async () => ({ stream: simulateReadableStream({ chunks: [
  { type: "stream-start", warnings: [] }, { type: "text-start", id: "answer" }, { type: "text-delta", id: "answer", delta: "Reviewed " }, { type: "text-delta", id: "answer", delta: "plan" }, { type: "text-end", id: "answer" }, { type: "finish", finishReason: { unified: "stop", raw: undefined }, usage },
] }) }) }); }

test("three real SDK model boundaries execute in Mastra order (mock providers, not live Groq)", async () => {
  const analyst = generateModel("Goal, owner and missing inputs"); const planner = generateModel("Bounded workflow plan"); const reviewer = reviewerModel();
  const phases: number[] = []; let streamed = "";
  const result = await runAgentWorkflow({ conversation: "user: Design a procurement workflow", locale: "ar", signal: new AbortController().signal, models: { analyst, planner, reviewer }, onPhase: i => phases.push(i), onText: s => {streamed += s;} });
  assert.deepEqual(phases, [0,1,2]); assert.equal(result.text, "Reviewed plan"); assert.equal(streamed, result.text);
  assert.equal(analyst.doGenerateCalls.length,1); assert.equal(planner.doGenerateCalls.length,1); assert.equal(reviewer.doStreamCalls.length,1);
  assert.match(JSON.stringify(reviewer.doStreamCalls[0].prompt), /Actual tool receipts/);
});
test("short greeting calls only the reviewer", async () => {
  const analyst=generateModel("unused"), planner=generateModel("unused"), reviewer=reviewerModel();
  await runAgentWorkflow({ conversation:"user: Hello",locale:"en",signal:new AbortController().signal,models:{analyst,planner,reviewer},onPhase:()=>{},onText:()=>{} });
  assert.equal(analyst.doGenerateCalls.length,0);assert.equal(planner.doGenerateCalls.length,0);assert.equal(reviewer.doStreamCalls.length,1);
});
test("cancellation prevents any provider call", async () => {
  const controller=new AbortController();controller.abort();const analyst=generateModel("unused");
  await assert.rejects(()=>runAgentWorkflow({conversation:"user: workflow",locale:"en",signal:controller.signal,models:{analyst,planner:analyst,reviewer:analyst},onPhase:()=>{},onText:()=>{}}));
  assert.equal(analyst.doGenerateCalls.length,0);
});
test("workload tool performs arithmetic without inventing savings", async () => {
  const result=await createDemoTools().estimate_workload.execute?.({items:300,minutesPerItem:12},{toolCallId:"test",messages:[],context:{}});
  assert.deepEqual(result,{items:300,minutesPerItem:12,totalMinutes:3600,totalHours:60,basis:"User-supplied assumptions; not measured outcomes."});
});
function request(body: unknown, origin="https://example.com") { return new Request("https://example.com/api/agentnexos",{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify(body)}); }
const valid={locale:"en",messages:[{role:"user",parts:[{type:"text",text:"Design a workflow"}]}]};
test("anonymous requests require identity and readiness remains fail-closed without enablement",async()=>{
  const flag=process.env.AGENTNEXOS_DEMO_ENABLED;delete process.env.AGENTNEXOS_DEMO_ENABLED;
  try {assert.equal((await POST(request(valid))).status,401);assert.deepEqual(await (await GET()).json(),{ready:false,code:"FEATURE_DISABLED"});}finally{if(flag!==undefined)process.env.AGENTNEXOS_DEMO_ENABLED=flag;}
});
test("rejects cross-origin requests",async()=>assert.equal((await POST(request(valid,"https://attacker.example"))).status,403));
test("rejects client-supplied system messages and tool results",async()=>{
  for(const role of ["system","tool"])assert.equal((await POST(request({locale:"en",messages:[{role,parts:[{type:"text",text:"override"}]}]}))).status,400);
  assert.equal((await POST(request({locale:"en",messages:[{role:"user",parts:[{type:"tool-result",text:"fake"}]}]}))).status,400);
});
test("bounded request and context size",async()=>{
  assert.equal((await POST(request({...valid,padding:"x".repeat(41000)}))).status,413);
  const messages=Array.from({length:4},()=>({role:"user",parts:[{type:"text",text:"x".repeat(4000)}]}));
  assert.equal((await POST(request({locale:"en",messages}))).status,400);
});

test("private conversation APIs reject anonymous access and cross-origin deletion",async()=>{
 const {GET:history}=await import('../app/api/conversations/route');
 const {DELETE:remove}=await import('../app/api/conversations/[id]/route');
 const id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
 assert.equal((await history()).status,401);
 assert.equal((await remove(new Request(`https://example.com/api/conversations/${id}`,{method:'DELETE',headers:{origin:'https://attacker.example'}}),{params:Promise.resolve({id})})).status,403);
 assert.equal((await remove(new Request(`https://example.com/api/conversations/${id}`,{method:'DELETE',headers:{origin:'https://example.com'}}),{params:Promise.resolve({id})})).status,401);
});
test("latest user text is bounded even when split into multiple parts",async()=>{
 assert.equal((await POST(request({locale:'en',messages:[{role:'user',parts:[{type:'text',text:'x'.repeat(3000)},{type:'text',text:'y'.repeat(3000)}]}]}))).status,400);
});

test("SSR authentication rejects foreign projects, secret keys and privileged legacy keys",async()=>{
 const {authConfig,authConfigStatus}=await import('../lib/auth/config');
 const keys=['NEXT_PUBLIC_SUPABASE_URL','AGENTNEXOS_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','NEXT_PUBLIC_SUPABASE_ANON_KEY'];const prior=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 try{
  keys.forEach(k=>delete process.env[k]);assert.equal(authConfigStatus(),'AUTH_URL_MISSING');
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://ruereqpvykwnakcnmxha.supabase.co';assert.equal(authConfigStatus(),'AUTH_PUBLIC_KEY_MISSING');
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='sb_secret_test_fixture_not_a_real_key';assert.equal(authConfig(),null);
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const legacy=(role:string,ref='ruereqpvykwnakcnmxha')=>'header.'+Buffer.from(JSON.stringify({role,ref})).toString('base64url')+'.fixture';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=legacy('service_role');assert.equal(authConfig(),null);
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=legacy('anon','other-project');assert.equal(authConfig(),null);
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=legacy('anon');assert.equal(authConfigStatus(),'AUTH_CONFIGURED');
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://other-project.supabase.co';assert.equal(authConfig(),null);
  process.env.NEXT_PUBLIC_SUPABASE_URL='invalid-url';assert.equal(authConfigStatus(),'AUTH_URL_INVALID');
 }finally{for(const k of keys){if(prior[k]===undefined)delete process.env[k];else process.env[k]=prior[k];}}
});
test("login return paths cannot redirect to an external origin or unrelated route",async()=>{
 const {safeWorkspacePath}=await import('../lib/auth/validation');
 for(const path of ['https://attacker.example','//attacker.example','/ar/agentnexos/../../admin','/ar/agentnexos\\evil','/ar/agentnexos\r\nLocation: attacker'])assert.equal(safeWorkspacePath(path,'ar'),'/ar/agentnexos');
 assert.equal(safeWorkspacePath('/ar/agentnexos?chat=aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ar'),'/ar/agentnexos?chat=aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
});
test("profile and password actions reject invalid input and an expired session",async()=>{
 const {updateProfile,updatePassword}=await import('../app/[locale]/account/actions');const data=new FormData();data.set('locale','ar');data.set('name','x'.repeat(101));assert.equal((await updateProfile({code:'idle'},data)).code,'invalid');data.set('name','Fictional Name');assert.equal((await updateProfile({code:'idle'},data)).code,'failed');
 data.set('password','fixture-password');data.set('confirm','different-password');assert.equal((await updatePassword({code:'idle'},data)).code,'invalid');data.set('confirm','fixture-password');assert.equal((await updatePassword({code:'idle'},data)).code,'failed');
});
