# خط الأساس ومصفوفة القدرات

تاريخ الفحص: 14 أكتوبر 2026. قراءة فقط؛ لم يتغير التطبيق أو إعدادات Vercel أو قاعدة البيانات.

## الإنتاج والمستودع

main: 49f4627ec934bba066294cb0740ad6ea0f21a80a.
Vercel: compute-the-platform-to-build، project prj_LUbU8bZzcOxnEZf9B9Nq8Xm2OJMf.
الإنتاج: dpl_GYcBvXN46QTLTjgnB62uqkfynDKM، READY، main مطابق، iad1.
الرابط: https://compute-the-platform-to-build-six-fawn.vercel.app/.

المعاينة الأحدث قبل هذه الحزمة dpl_FFkSy1e6BsjV8mCyPVnQUYBf6tj8 كانت ERROR ومن commit وثيقة ضبط النطاق 6473a5d. لا تثبت تطبيق المحتوى الجديد، ولم تنشئ هذه الجولة نشرًا يدويًا.

## التطبيق العام

الأرشيف السابق Agentnexos_Original_Content_Archive.md والتدقيق Agentnexos_Production_Audit_AR.md يغطيان 11 مسارًا في اللغتين، بتاريخ 13 أكتوبر. قُرئت وثيقة التدقيق بالكامل، وأعيد فتح about وplatform على الإنتاج في هذه الجولة ومراجعة النص والمظهر على سطح المكتب. لا ننسب فحص 22 صفحة جديدًا أو اختبار هاتف إلى هذه الجولة.

مصادر النص الحالية: lib/content/cyber-home.ts، product-pages.ts، public-pages.ts، agent-workspace.ts، project-brief.ts. المسارات: /ar و/en، about، platform، solutions، industries، security، resources، privacy، terms، start، agentnexos.

## Runtime المقروء

app/api/agentnexos/route.ts، lib/agents/prompts.ts، workflow.ts، policy.ts، tools.ts.
المساعد product-advisor-v2 للتصميم العام، ذو توجيه حتمي وأدوات قراءة/تصميم محددة. workflow يستخدم Mastra وToolLoopAgent من AI SDK. توجد ميزانيات وtimeout وإلغاء وأحداث مراحل؛ هذا لا يثبت تشغيلًا مؤسسيًا أو نجاح النموذج في كل حالة.

الأدوات الفعلية المعرّفة: review_workflow_design، estimate_workload، read_technical_reference. المراجع قائمة ثابتة؛ لا بحث عام ولا متصفح ولا تنفيذ كود ولا CRM/ERP/دفع/بريد. السياق المرسل محدود؛ ليس ذاكرة مؤسسة مستمرة.

## قاعدة البيانات الحية

المشروع yhjyaytbrsuwaefkqkqg، supabase-teal-mountain، ACTIVE_HEALTHY، us-east-1، Postgres 17.6 بحسب metadata.
قُرئ schema public وأسماء الأعمدة والمفاتيح وسياسات RLS؛ لم تُقرأ محادثات أو بيانات مستخدمين.

الجداول:
- agentnexos_demo_requests: حجز وتشغيل الحالة ومراحلها.
- agentnexos_demo_limits: تعريف حدود الاستخدام.
- agentnexos_profiles: ملف مستخدم مرتبط auth.users.
- agentnexos_conversations: محادثة مملوكة user_id.
- agentnexos_messages: رسائل مربوطة بالمحادثة والمستخدم.

RLS مفعّل على الخمسة. السياسات المقروءة للملفات/المحادثات/الرسائل تقيد user_id بـauth.uid(). هذا ليس إثبات عزل مؤسسات متعددة: لا organization_id في هذا الجرد، ولم يُختبر الفصل عمليًا بجلسات مختلفة. الدوال agentnexos_demo_ready وreserve_agentnexos_demo_v3 موجودة وSECURITY INVOKER وفق metadata.

لا تظهر في public جداول موافقات مؤسسة أو موصلات أو ذاكرة معرفية أو سجل تنفيذ دائم متعدد المؤسسات. لا نستنتج اكتمال الخاص من غيابها؛ يلزم فحص schemas الخاصة والدوال وربط Auth في الكود أثناء مرحلة مساحة العميل.

## قرارات على أساس الأدلة

| الطبقة | المتاح المثبت بهذه القراءة | ما يحتاج تنفيذًا أو اختبارًا |
|---|---|---|
| الموقع | قالب Cyber Serif ومحتوى عام | النصوص الجديدة والصفحات التفصيلية |
| المساعد | كود تصميم/حساب/مراجع محدودة | اختبار مزود حي وevals |
| الموجز | نموذج محلي بحسب التدقيق السابق | معاينة كاملة ونسخ وفتح رسالة |
| بيانات المستخدم | schema وسياسات user-owned | اختبار Auth والملكية عمليًا |
| مساحة المؤسسة | مواصفات في هذه الحزمة | مؤسسات/صلاحيات/موافقات/أدوات/ذاكرة/سجل محمي |
| الأصول | أربع صور إضافية مولدة وفحصها | مواءمة الحاوية في التطبيق وفحص المقاسات |

مطلوب Codex: قراءة الحالة الحديثة قبل التنفيذ، وعدم تعديل قاعدة البيانات لتناسب نصًا تسويقيًا.
