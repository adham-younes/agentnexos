Latest redesign source handoff: read `docs/REDESIGN-HANDOFF-2026-10-01.md`. Source/Preview completion is not production completion. Keep staged production publication blocked until real authentication configuration and account-flow evidence pass; the owner already authorized sequential deployments. Do not request that deployment authorization again.

Current owner-approved redesign: read `docs/COMPREHENSIVE-REDESIGN-2026-10-01.md` and the latest REDESIGN phase report. The owner explicitly approved replacing the old visual template, provided new institutional copy, and authorized all staged releases plus Supabase users/auth/private workspace persistence. Matte black and calm green supersede the former palette/image-preservation rules. Public marketing stays open; only the agent/account surfaces require verified login. This does not authorize fabricated capabilities, secret export, unscoped external writes, or protection bypass.

Latest release handoff: read `docs/UPGRADE-HANDOFF-2026-10-01.md` and its production evidence before continuing. Historical pending statuses are not current deployment state.

Current comprehensive upgrade: read `docs/COMPREHENSIVE-UPGRADE-2026-09-30.md` and current UPGRADE reports first. The owner's latest request explicitly authorizes successive automated whole-app stages, preserving the template, images and colors, with independent verified production publication per stage. This supersedes earlier one-stage-per-request restrictions. It does not authorize fabricating runtime capabilities, secret export, unrelated databases or bypassing branch protections.

# Agentnexos — Project Rules

Current repair: read `docs/REPAIR-PLAN-2026-09-30.md` and `docs/phases/REPAIR-01-2026-09-30.md` before continuing. They record the owner-requested repair scope and observed state. Historical phase completion claims are not evidence of live capabilities.

Current upgrade: `docs/phases/UPGRADE-03-2026-09-30.md` records the later owner-authorized visual/content/chat scope. Its current-state evidence supersedes the historical audit below. `/api/agentnexos` is an independently bounded read-only public design demo, not an exception reopening `/api/chat`, `/api/approvals` or `/api/telemetry`. Never apply the old enterprise migrations blindly to production or describe the quota table as enterprise memory. Qwen is Preview; do not claim production-grade availability or an implemented fallback without tests.

1. Before editing, read docs/MASTER-PLAN-AND-HANDOFF-2026-09-29.md and docs/GUARDRAILS.md.
2. Follow the user's current request; the master plan overrides older conflicting project documents.
3. Work on one requested phase only; list its scope and acceptance criteria before editing.
4. Preserve the approved template, images, animations, fonts, section order, and proportions.
5. Inspect existing code and reuse its patterns before adding files, dependencies, or abstractions.
6. Make small, focused changes; preserve unrelated work and review the diff before committing.
7. Use documentation matching installed versions; verify uncertain APIs with official sources.
8. Keep Arabic and English equivalent; verify RTL/LTR and all changed user-facing states.
9. Never invent implemented features, customers, metrics, integrations, or successful test results.
10. Keep secrets server-side and out of source code, logs, screenshots, and documentation.
11. For defects: reproduce, identify the cause, apply a focused fix, and verify the original symptom.
12. Run pnpm typecheck, pnpm i18n:check, pnpm build, and relevant tests; report failures honestly.
13. For UI changes, compare before/after at 390, 768, and 1440px in Arabic and English.
14. Finish with changed files, verification evidence, remaining issues, and the next planned step.

---

# AGENTS.md — تعليمات إلزامية لأي وكيل يعمل على Agentnexos

هذه التعليمات حاكمة على Codex وGemini وGoogle Antigravity وv0 وأي وكيل آخر. اقرأ بالترتيب:

1. `AGENTS.md`
2. `docs/MASTER-PLAN-AND-HANDOFF-2026-09-29.md`
3. `docs/ANTIGRAVITY-HANDOFF.md`
4. `docs/GUARDRAILS.md`
5. سجل المرحلة الجاري تنفيذها في `docs/phases/`

عند تعارض وثيقة قديمة مع الخطة الرئيسية المؤرخة 2026-09-29، تكون الخطة الرئيسية هي المرجع. ملفات الخطط الأقدم سجل تاريخي وليست تصريحًا بإعادة تعريف المنتج.

## تعريف المنتج الثابت

Agentnexos منصة عربية أولًا لبناء وتشغيل أنظمة وكلاء مؤسسية مخصصة لمصر والخليج والشرق الأوسط. تربط بيانات المؤسسة وأنظمتها وأدواتها بسير عمل قابل للتتبع، بصلاحيات محددة، وموافقات بشرية قبل الأفعال الحساسة، ودليل نتيجة قابل للمراجعة. ليست روبوت دردشة عامًا، وليست منصة لمعالجة المستندات فقط.

## قواعد عدم الاختراع

- لا تغيّر الرؤية أو النصوص المعتمدة أو ترتيب المراحل من عندك.
- لا تعِد بعميل أو رقم أداء أو شهادة أو امتثال أو تكامل أو سعر غير منفذ وقابل للتحقق.
- لا تعتبر واجهة وهمية، زرًا، أو متغير بيئة دليلًا على أن الميزة تعمل.
- لا تضف مكتبة أو إطارًا أو خدمة لمجرد أنها شائعة؛ اكتب سبب الحاجة والتكلفة والبديل.
- لا تستخدم أسرارًا في الكود أو التوثيق أو السجلات. يُسمح بأسماء المتغيرات فقط.
- لا تنفذ أدوات كتابة خارجية من دون صلاحيات ضيقة، idempotency، سجل تدقيق، وموافقة عند الخطر.
- إذا كانت معلومة ناقصة وتغيّر القرار، اكتب `BLOCKED: requires owner decision` وتوقف في هذا الجزء بدل التخمين.

## حماية القالب

- القالب الحالي وصوره وحركته ونظامه البصري أساس ملزم، وليس مادة لإعادة التصميم.
- أي تغيير بصري يكون موضعيًا وله سبب ومقارنة قبل/بعد.
- لا تستبدل الصور، Hero، ترتيب الأقسام، الخطوط، أو نسب الشبكة إلا بطلب صريح من المالك.
- افحص العربية والإنجليزية عند 390 و768 و1440 بكسل، وRTL/LTR، والتمرير والقائمة والحالات التفاعلية.
- إذا شوّه التعديل القالب أو سبّب قصًا أو تمددًا أو عدم تماثل، ألغِ التعديل قبل أي عمل آخر.

## حدود المرحلة

- نفّذ مرحلة واحدة فقط في كل دفعة.
- لا تبدأ المرحلة التالية لأن الوقت متاح أو لأن الوكيل يراها أفضل.
- كل مرحلة: فرع واضح، تغييرات محدودة، اختبارات، Preview، فحص بصري، دمج إلى `main`، انتظار إنتاج `READY`، ثم فحص الرابط الإنتاجي وتوثيق SHA.
- لا تقل «تم النشر» بسبب نجاح `build` محليًا أو Preview. الإنتاج وحده هو `main` مع تحقق حي.

## أوامر تحقق إلزامية

```bash
pnpm typecheck
pnpm i18n:check
pnpm build
```

ESLint مثبت. افحص الملفات المتأثرة وسجل ديون الفحص العام. لا تخفِ التحذيرات ولا تغيّر إعدادات TypeScript لتجاوز الفشل.

## التعريب والاتجاه

- كل معنى ظاهر للمستخدم موجود بالعربية والإنجليزية.
- كل `t("x.y", "Fallback")` له مفتاح فعلي في `lib/i18n/dictionaries.ts`.
- راجع `translate-x` و`left/right` و`ml/mr` والتدرجات في RTL؛ المتصفح لا يعكس النية البصرية تلقائيًا.
- الخط العربي مربوط عبر `--font-arabic` داخل `:lang(ar)`؛ لا تغيّر خط الإنجليزية ضمن إصلاح عربي.

## حالة التنفيذ الحالية — تدقيق 2026-09-30

- خط أساس الإنتاج المفحوص: commit `5889dce`؛ توجد ملفات Runtime وAPI ومخطط Supabase وتبعيات AI SDK. لا يوجد Mastra في package.json.
- الـcoordinator الحالي يصوغ نصًا ثابتًا، ولا يثبت استدعاء النماذج بوجود إعداداتها. نتائج enterprise-lookup معرفة ثابتة داخل الكود.
- الموافقات والتدقيق والذاكرة تعتمد مخازن في الذاكرة. وجود migrations لا يثبت تطبيقها أو عزل المؤسسات في قاعدة إنتاجية.
- أدوات الإجراءات تولد إيصالات محلية دون إرسال خارجي. لا يوصف ذلك كتصدير حقيقي أو سجل غير قابل للتعديل.
- مساحة الوكيل مثال محلي معلن. دفعة REPAIR-02 توقف chat وapprovals وtelemetry برد 503 حتى اكتمال الهوية والحفظ والتحقق. لا تضف علم بيئة يتجاوز هذا الحظر بلا تنفيذ الصلاحيات.
- فرع المرحلة التاسعة المحلي محفوظ في `preserved/local-phase-9-2026-09-30`، ولم يُدمج في الإصلاح.
- أسماء مفاتيح Groq المبلغ عنها: `GROQ_API_KEY`, `GROQ_API_KEY1`, `GROQ_API_KEY2`. الوجود لا يثبت تنفيذ API؛ لا تُطبع القيم.

## النشر

- GitHub: `https://github.com/adham-younes/agentnexos`
- مشروع Vercel: `compute-the-platform-to-build`
- الإنتاج من فرع `main` فقط.
- رابط الإنتاج الحالي: `https://compute-the-platform-to-build-six-fawn.vercel.app/`
- بعد كل نشر، اختبر `/ar` و`/en` والرحلة التي غيّرتها وسجّل commit ووقت التحقق.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
