# حالة مشروع Agentnexos عند التسليم

## المواقع

- المستودع المحلي: `/Users/adham/Documents/Codex/2026-09-28/created-adhamlouxor8m-ago-status-ready-latest/work/agentnexos`
- GitHub: `https://github.com/adham-younes/agentnexos`
- Production: `https://compute-the-platform-to-build-six-fawn.vercel.app/`
- اختصار سطح المكتب `Agentnexos` يشير إلى المستودع الحقيقي؛ لا توجد نسختان.

## المنفذ

- المرحلة 1: محتوى الأنظمة الوكيلة مع الحفاظ على القالب.
- المرحلة 2: الهيدر والتنقل والتماثل.
- commit الإنتاج وقت التسليم: `443cf2202249d1608cda1b0993f01fff627feacc`.
- `/ar` و`/en` وi18n guard وTypeScript/build checks.
- baseline وصور تحقق داخل `docs/baseline` و`docs/evidence`.

## غير المنفذ

- أيقونة/علامة أصلية لـAgentnexos.
- مساحة الوكيل والمحادثة وAPI streaming.
- Vercel AI SDK وMastra وGroq runtime.
- Supabase linkage وmigrations وAuth وRLS.
- الأدوات والموافقات والذاكرة والتقييم والمراقبة.
- الصفحات التجارية والقانونية الكاملة.

## متغيرات أبلغ المالك أنها مضافة في Vercel Production

- `GROQ_API_KEY`
- `GROQ_API_KEY1`
- `GROQ_API_KEY2`

هذه إفادة من المالك وليست تحققًا من القيم أو صلاحيتها. لا تطبع أو تنقل القيم. تحقق من الوجود فقط بعد ربط checkout، ثم نفذ health probe صغيرًا يخفي البيانات.

## مشاكل معروفة

- `pnpm lint` موجود لكن ESLint غير موجود في `devDependencies`؛ إصلاحه ضمن المرحلة 3.
- خطط قديمة عرّفت المنتج كمعالجة مستندات؛ أصبحت تاريخية بعد الخطة الرئيسية.
- Qwen المطلوب Preview ويحتاج fallback ومراقبة إتاحة.
- الأيقونات الحالية ليست هوية Agentnexos نهائية.
