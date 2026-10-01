Current redesign verification: see [REDESIGN-HANDOFF-2026-10-01](./REDESIGN-HANDOFF-2026-10-01.md). `pnpm verify:site` uses the new public/auth route verifier; historical photographic asset checks below are archived and do not govern the owner-approved redesign.

# بوابة إصدار التطبيق

من مستودع نظيف: pnpm install --frozen-lockfile، ثم pnpm audit --prod وpnpm typecheck وpnpm i18n:check وpnpm test:agentnexos وpnpm lint وpnpm build. ثبّت متصفح الاختبار مرة واحدة بـpnpm exec playwright install chromium (في CI يحتاج --with-deps)، وشغّل pnpm start --port 3000. نفّذ pnpm verify:site http://localhost:3000، ثم نفس الأمر لرابط المعاينة، ثم للرابط الرسمي بعد Production READY. التقرير في output/release-verification/report.json؛ ينتهي الأمر بكود فشل عند إخفاق أي حالة.

السكربت لا يستدعي نموذجًا حيًا ولا يرسل بيانات مؤسسة. نموذج المشروع يختبر ببيانات افتراضية داخل المتصفح، وطلب POST الوحيد إلى واجهة قديمة مغلقة للتحقق من 503. فحص الصور يستثني الطبقات غير الظاهرة التي تؤجل تحميلها، ويتحقق من مصادر وأبعاد صور القالب. لا يساوي نجاح الصفحات نجاح مزود النموذج: readiness وliveAgentVerified يُسجلان بشكل منفصل.

التسلسل: فرع من main المفحوص → فحوص محلية → PR ومعاينة READY وفحص → دمج عادي إلى main → إنتاج READY على SHA مطابق → فحص الرابط الرسمي → توثيق PR/SHA/deployment والنتائج. لا --admin ولا تجاوز حماية أو تعديل فوترة. إن منع شرط مطلوب الدمج، توقفه؛ عطل Actions المالي ليس نتيجة اختبار ناجحة.

قبل تفعيل إجراءات المؤسسة يلزم مشروع البيانات الصحيح، مفاتيح الخادم في مدير أسرار Vercel، RLS وهوية وصلاحيات، event store واستئناف، عزل filesystem/network، مفاتيح idempotency ومصالحة أثر الأفعال، وevals حية مقابل بيانات قبول. هذه متطلبات المرحلة المؤسسية في الخطة الشاملة، لا قدرات يفعّلها نشر صفحات أو كتابة prompt.

لأرشفة صور جميع الصفحات مع التقرير استخدم SAVE_SCREENSHOTS=1 قبل أمر verify:site؛ تحفظ في output/release-verification/screenshots. عند عطل جلب خطوط Google داخل شبكة workspace فقط، يدعم Next16 بناء محليًا بـpnpm build --webpack؛ تُسجل الأداة المستخدمة، ولا يُنسب نجاحها إلى Turbopack. يبقى بناء Vercel الافتراضي وفحص معاينته بوابة مستقلة قبل النشر.
