import test from "node:test";
import assert from "node:assert/strict";
import {industryDossiers,dossier} from "../lib/content/industry-dossiers";
import {evaluateValue,demonstration,withScenario} from "../lib/value-economics";
test("bilingual eight-sector atlas contains reviewable evidence and safe boundaries",()=>{
 const ar=industryDossiers.ar,en=industryDossiers.en;
 assert.equal(ar.length,8);assert.deepEqual(ar.map(x=>x.slug),en.map(x=>x.slug));
 for(const lang of [ar,en])for(const item of lang){
 assert.ok(item.situation.length>60&&item.decision.length>28&&item.metric.length>30,item.slug);
 assert.equal(item.signals.length,4);assert.equal(item.architecture.length,4);assert.ok(item.deliverables.length>=3);
 }
 assert.equal(dossier("ar","nonexistent"),undefined);
});
test("economics reproduces user research reference sample without rounding away costs",()=>{
 const r=evaluateValue(demonstration);
 assert.ok(r);
 assert.equal(r?.eligibleCases,780);
 assert.ok(Math.abs((r?.completedCases||0)-561.6)<.00001);
 assert.equal(r?.manualBaseline,5040);
 assert.ok(Math.abs((r?.remainingManual||0)-2681.28)<.00001);
 assert.ok(Math.abs((r?.reviewCost||0)-280.8)<.00001);
 assert.ok(Math.abs((r?.recoveryCost||0)-175.5)<.00001);
 assert.equal(r?.aiCost,156);
 assert.ok(Math.abs((r?.afterCost||0)-4193.58)<.00001);
 assert.ok(Math.abs((r?.net||0)-846.42)<.00001);
 assert.ok(Math.abs((r?.netPerYear||0)+4842.96)<.00001);
 assert.ok(Math.abs((r?.paybackMonths||0)-15000/846.42)<.00001);
});
test("negative ROI, unrealizable labor, input bounds and scenario changes",()=>{
 const r=evaluateValue({...demonstration,realizable:0});
 assert.ok(r);assert.ok((r?.net||0)<0);
 assert.equal(evaluateValue({...demonstration,eligible:101}),null);
 assert.equal(evaluateValue({...demonstration,reviewShare:101}),null);
 assert.equal(evaluateValue({...demonstration,success:-1}),null);
 assert.equal(evaluateValue({...demonstration,cost:Infinity}),null);
 assert.equal(evaluateValue({...demonstration,cases:100000000}),null);
 assert.equal(evaluateValue({...demonstration,success:0})?.paybackMonths,null);
 assert.equal(withScenario(demonstration,"conservative").success,60);
 assert.equal(withScenario(demonstration,"optimistic").failureShare,3);
 assert.equal(withScenario(demonstration,"conservative").operation,900);
});
