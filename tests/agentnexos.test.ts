import test from "node:test";
import assert from "node:assert/strict";
import { MockLanguageModelV4 } from "ai/test";
import { simulateReadableStream } from "ai";
import { runAgentWorkflow } from "../lib/agents/workflow";
import { demoTools } from "../lib/agents/tools";
import { GET, POST } from "../app/api/agentnexos/route";

const usage = { inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: 20, text: 20, reasoning: undefined } };
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
  const result=await demoTools.estimate_workload.execute?.({items:300,minutesPerItem:12},{toolCallId:"test",messages:[],context:{}});
  assert.deepEqual(result,{items:300,minutesPerItem:12,totalMinutes:3600,totalHours:60,basis:"User-supplied assumptions; not measured outcomes."});
});
function request(body: unknown, origin="https://example.com") { return new Request("https://example.com/api/agentnexos",{method:"POST",headers:{origin,"content-type":"application/json"},body:JSON.stringify(body)}); }
const valid={locale:"en",messages:[{role:"user",parts:[{type:"text",text:"Design a workflow"}]}]};
test("demo remains fail-closed without explicit enablement",async()=>{
  const flag=process.env.AGENTNEXOS_DEMO_ENABLED;delete process.env.AGENTNEXOS_DEMO_ENABLED;
  try {assert.equal((await POST(request(valid))).status,503);assert.deepEqual(await (await GET()).json(),{ready:false,code:"FEATURE_DISABLED"});}finally{if(flag!==undefined)process.env.AGENTNEXOS_DEMO_ENABLED=flag;}
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
