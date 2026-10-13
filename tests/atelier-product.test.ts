import test from "node:test";
import assert from "node:assert/strict";
import {industryDossiers,dossier} from "../lib/content/industry-dossiers";
import {evaluateValue,demonstration} from "../components/site/value-lab";

test("bilingual real-world dossier corpus preserves sector IDs and structural evidence",()=>{
 const ar=industryDossiers.ar,en=industryDossiers.en;
 assert.equal(ar.length,8);assert.deepEqual(ar.map(v=>v.slug),en.map(v=>v.slug));
 assert.equal(new Set(ar.map(v=>v.slug)).size,8);
 for(const lang of [ar,en])for(const v of lang) {
  assert.ok(v.situation.length>60&&v.failure.length>28&&v.decision.length>28&&v.metric.length>30,v.slug);
  assert.equal(v.signals.length,4);assert.equal(v.architecture.length,4);
  assert.ok(v.deliverables.length>=3);
 }
 assert.equal(dossier("en","__invalid__"),undefined);
});
test("business value lab never implies all cases are automatable",()=>{
 const r=evaluateValue(demonstration);
 assert.ok(r);assert.equal(r?.eligibleCases,360);assert.equal(r?.minutesPerCase,6);
 assert.equal(r?.hours,36);assert.equal(r?.gross,288);assert.equal(r?.net,138);
});
test("value math includes review and negative scenario without clipping",()=>{
 const r=evaluateValue({...demonstration,review:10,operation:150});
 assert.ok(r);assert.equal(r?.net,-198);
 assert.equal(evaluateValue({...demonstration,eligible:105}),null);
 assert.equal(evaluateValue({...demonstration,manual:-10}),null);
 assert.equal(evaluateValue({...demonstration,cost:Infinity}),null);
 assert.equal(evaluateValue({...demonstration,cases:100000000}),null);
});
