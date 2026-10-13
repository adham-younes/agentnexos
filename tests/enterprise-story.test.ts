import test from "node:test";
import assert from "node:assert/strict";
import { enterpriseStory, casePrompt } from "../lib/content/enterprise-story";

test("six cases remain aligned across locales", () => {
 const ar = enterpriseStory.ar.cases, en = enterpriseStory.en.cases;
 assert.equal(ar.length,6);assert.equal(en.length,6);
 assert.deepEqual(ar.map(c=>c.id),en.map(c=>c.id));
 assert.equal(new Set(ar.map(c=>c.id)).size,6);
 for(const items of [ar,en]) for(const c of items){
  assert.ok(c.audience.trim()&&c.name.trim()&&c.friction.trim()&&c.inputs.trim()&&c.human.trim()&&c.output.trim()&&c.measure.trim());
  assert.equal(c.path.length,4);
  assert.ok(c.path.every(x=>x.trim().length>7));
  assert.ok(c.question.length>50);
 }
});
test("deep-link prompts resolve to the requested sector and reject unknown identifiers",()=>{
 for(const locale of ["ar","en"] as const) for(const c of enterpriseStory[locale].cases){
  assert.equal(casePrompt(locale,c.id),c.question);
 }
 assert.equal(casePrompt("en","__unknown__"),null);
 assert.equal(casePrompt("ar","<script>"),null);
});
test("public industry scenarios explicitly describe design rather than customer results",()=>{
 for(const locale of ["ar","en"] as const){
  assert.ok(enterpriseStory[locale].note.length>35);
  assert.ok(enterpriseStory[locale].cases.every(x=>x.measure.length>25));
 }
});
