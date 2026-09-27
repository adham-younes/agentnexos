# Agentnexos

**Where agents connect. / حيث يتواصل الوكلاء.**

منصة عربية-أولًا لمعالجة المستندات بخطوات قابلة للتتبّع: استخراج، وتحقّق، ومراجعة،
ثم تصدير بموافقتك.

An Arabic-first platform for extracting, checking, and reviewing document data,
with your approval before export.

> **حالة المشروع:** قيد التنفيذ على مراحل. راجع [`docs/ROADMAP.md`](./docs/ROADMAP.md)
> للخطة، و [`docs/GUARDRAILS.md`](./docs/GUARDRAILS.md) لقواعد عدم المساس بالتصميم.

---

## This project is linked to v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by
visiting the link below — start new chats to make changes, and v0 will push commits directly to
this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_LUbU8bZzcOxnEZf9B9Nq8Xm2OJMf)

> **ملاحظة:** المراحل المنفَّذة هنا تُبنى على فرعها (`phase-N-*`) ولا تُدفع مباشرة إلى `main`.

---

## الصفحات الحالية | Current pages

المرحلة 1 تثبّت الأساس فقط. الموقع الحالي هو **القالب** (بالإنجليزية) بصفحة هبوط واحدة
تضم 13 قسمًا. الصفحات العربية/الإنجليزية والبقية تُضاف في المرحلة 2 و3.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| الأمر | الوظيفة |
|---|---|
| `pnpm dev` | خادم التطوير |
| `pnpm build` | بناء إنتاجي |
| `pnpm start` | تشغيل البناء |
| `pnpm lint` | فحص ESLint |
| `pnpm typecheck` | فحص TypeScript |

---

## متغيرات البيئة | Environment variables

انسخ `.env.example` إلى `.env.local` واملأ القيم، أو اضبطها من لوحة Vercel.
**لا تُحفظ أي قيم سرية في المستودع.**

| المتغيّر | النطاق | الاستخدام |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | عام | عنوان مشروع Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | عام | مفتاح النشر |
| `SUPABASE_SECRET_KEY` | **سري** | عمليات الخادم |
| `NEXT_PUBLIC_SITE_URL` | عام | العنوان الأساسي |
| `GROQ_API_KEY` / `GROQ_API_KEY1` / `GROQ_API_KEY2` | **سري** | طبقة لغوية اختيارية |
| `NEXT_PUBLIC_SHOW_PLACEHOLDER_SECTIONS` | عام | إظهار/إخفاء أقسام القالب غير المتحقّقة |

**مهم:** المسار الحتمي يعمل **بلا أي مفتاح نموذج**. مفاتيح Groq **اختيارية**
وتُقرأ من بيئة Vercel فقط.

التحقق من الحالة (بلا طباعة قيم) عبر `describeEnv()` في [`lib/env.ts`](./lib/env.ts).

---

## Deployment smoke test

Use a documentation-only change on a dedicated branch to verify GitHub write access and a Vercel
Preview deployment before changing application code.

**ملاحظة تشغيلية:** النشر الإنتاجي الحالي محجوب بـVercel Deployment Protection. الفحص الآلي
يحتاج **Protection Bypass Secret** من Settings → Deployment Protection.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [v0 Documentation](https://v0.app/docs)
