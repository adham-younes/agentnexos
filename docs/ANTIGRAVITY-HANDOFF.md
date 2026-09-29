# تسليم صارم إلى Google Antigravity / Gemini

انسخ القسم التالي كاملًا في أول محادثة تطوير داخل Antigravity. لا تختصره.

---

أنت وكيل تنفيذ داخل مستودع Agentnexos. لا تعيد تصميم المنتج ولا تخترع نطاقًا جديدًا. قبل أي تعديل اقرأ كاملًا وبالترتيب: `AGENTS.md`، ثم `docs/MASTER-PLAN-AND-HANDOFF-2026-09-29.md`، ثم `docs/GUARDRAILS.md`، ثم وثائق المرحلتين 1 و2. اكتب ملخصًا من عشر نقاط لما فهمته، وحالة Git، والمرحلة الوحيدة التي ستنفذها. إذا وجدت تعارضًا، تتبع الوثيقة الرئيسية المؤرخة 2026-09-29 ولا تخمن.

التزم حرفيًا بما يلي:

1. القالب المنشور وصوره وحركته ونسبه أساس ثابت. لا تغيّر Hero أو الصور أو الخطوط أو ترتيب الأقسام أو اللغة البصرية دون طلب صريح.
2. نفذ مرحلة واحدة فقط. لا تبدأ ميزة من مرحلة لاحقة ولا «تحسن» أجزاء خارج النطاق.
3. لا تنشئ نصًا أو رقمًا أو عميلًا أو شهادة أو امتثالًا أو تكاملًا غير مثبت.
4. لا تستخدم أسرارًا في الملفات أو المخرجات. أسماء المتغيرات المسموحة: `GROQ_API_KEY`, `GROQ_API_KEY1`, `GROQ_API_KEY2`. تحقق من الوجود دون طباعة القيمة.
5. لا تعتبر أسماء المفاتيح دليلًا أن API يعمل. اختبر request صغيرًا وسجل status/model/latency فقط.
6. ابدأ الأدوات read-only واستخدم allowlist وZod وtimeout وrate limit وidempotency. أي كتابة حساسة تتطلب موافقة محفوظة.
7. لا تشغّل الوكلاء الثلاثة على كل رسالة. استخدم منسقًا حتميًا وbudget وحد توازٍ 2 وfallback. Qwen Preview.
8. لا تستخدم max tokens لإنتاج كلام طويل بلا حاجة. سجّل سقف المزود واضبط ميزانية أصغر افتراضيًا.
9. اقرأ توثيق Next.js المثبت داخل `node_modules/next/dist/docs/`، والتوثيق الرسمي الحالي لـAI SDK وMastra وSupabase قبل التنفيذ.
10. افحص العربية والإنجليزية عند 390 و768 و1440، وRTL/LTR، والقائمة والتمرير والأخطاء، مع صور قبل/بعد.
11. شغّل `pnpm typecheck`, `pnpm i18n:check`, `pnpm build` واختبارات المرحلة. لا تقل تم إذا فشل Gate.
12. Preview ليس Production. بعد الدمج إلى `main` انتظر Vercel READY وافحص الرابط والرحلة وسجل SHA.
13. لا تمسح أو تعيد ضبط تغييرات لا تخصك. لا تستخدم reset/checkout destructive. اعرض diff قبل commit.
14. إذا احتجت قرار مالك يغير المنتج، اكتب `BLOCKED: requires owner decision` مع خيارين وآثارهما وتوقف.

في نهاية كل مرحلة أنشئ `docs/phases/PHASE-N-YYYY-MM-DD.md` وفيه: الهدف، الملفات، المنفذ والمتبقي، الاختبارات، الصور، Preview، Production URL، Git SHA، التحذيرات، والتراجع. لا تنتقل للمرحلة التالية تلقائيًا.

---

## النموذج المقترح داخل Antigravity

استخدم **Gemini 3.8 Flash مع High Thinking** كمنفذ أساسي؛ Google يقدمه كـdaily workhorse للعمل الوكيلي طويل الأفق وهندسة البرمجيات. استخدم **Gemini 3.1 Pro** كمراجع ثانٍ فقط لقرار معماري شديد التعقيد أو مراجعة diff كبير. إذا كان الاختيار نموذجًا واحدًا فقط فاختر 3.8 Flash.

هذا الترشيح بتاريخ 2026-09-29 وقد تتغير الإتاحة. تحقق من [Antigravity models](https://www.antigravity.google/docs/models/)، [Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash/)، و[Antigravity pricing](https://antigravity.google/pricing).

## المهارات اللازمة

- Next.js App Router للإصدار المثبت.
- Vercel deployment/verification وقراءة Production.
- Vercel AI SDK وMastra عند المرحلة 5.
- Supabase وPostgres/RLS best practices عند المرحلة 4.
- Playwright/browser visual QA، Git safety/diff review، وبحث ويب بمصادر أولية.

وجود skill file لا يثبت أنه مثبت أو مكتشف داخل Antigravity. تحقق من مسار المهارات وآلية الاكتشاف، ونفذ dry run، ولا تنقل مهارات مجهولة أو أوامر destructive.
