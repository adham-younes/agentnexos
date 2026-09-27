# خط الأساس البصري — Visual Baseline

> **الغرض:** مرجع دقيق للقالب الحالي قبل أي تعديل. أي تغيير في المرحلة 2 أو 3
> يُقارَن بهذا الملف. أي انحراف غير مقصود = **تراجع** (راجع `GUARDRAILS.md` §4).
>
> **مصدر الحقيقة:** `git show main:<path>` — فرع `main` هو مرجع التصميم الصحيح.

---

## 1. الهوية البصرية الحالية

| العنصر | القيمة |
|---|---|
| **الاسم المعروض** | `COMPUTE - AI Agents for Distributed Computing` |
| **النمط العام** | داكن (Dark) — خلفية شبه سوداء، نص فاتح |
| **الوصف** | «Deploy autonomous AI agents on distributed infrastructure...» |
| **الحالة** | قالب — أسماء وهويات ومحتوى جميعها مؤقتة |

---

## 2. الرموز اللونية (`app/globals.css`)

**لا تُعدَّل.** دي القيم الحاكمة الحالية:

| الرمز | القيمة | الاستخدام |
|---|---|---|
| `--background` | `oklch(0.06 0.008 260)` | الخلفية |
| `--foreground` | `oklch(0.94 0.005 90)` | النص |
| `--card` | `oklch(0.09 0.008 260)` | البطاقات |
| `--primary` | `oklch(0.94 0.005 90)` | اللون الأساسي |
| `--secondary` | `oklch(0.12 0.008 260)` | الثانوي |
| `--muted-foreground` | `oklch(0.55 0.015 90)` | نص خافت |
| `--border` | `oklch(0.18 0.008 260)` | الحدود |
| `--radius` | `0.25rem` | نصف قطر **حاد** (زوايا شبه قائمة) |

**ملاحظة مهمة:** نصف القطر `0.25rem` = زوايا حادة، ودي **بصمة تصميمية** مميزة.
`--ring` = اللون الفاتح. لا تُغيَّر أي قيمة من دول.

---

## 3. الخطوط (`app/layout.tsx`)

| المتغيّر | الخط | الدور |
|---|---|---|
| `--font-instrument` | **Instrument Sans** | النص الأساسي |
| `--font-instrument-serif` | **Instrument Serif** | العناوين الكبيرة (Display) |
| `--font-jetbrains` | **JetBrains Mono** | الكود والأرقام |

**بصمة:** استخدام `Serif` للعناوين + `Sans` للنص = **طابع تحريري (editorial)**.
**قيد المرحلة 2:** إضافة خط **عربي** مكمّل **بجانب** هذه الخطوط — **لا استبدال**.
الخط العربي المقترح: **IBM Plex Sans Arabic** كمتغيّر رابع (`--font-arabic`).

---

## 4. الأقسام الـ13 (ترتيب `app/page.tsx`)

| # | المكوّن | العنوان الرئيسي | محتوى ملاحظ |
|---|---|---|---|
| 1 | `navigation.tsx` | — | روابط: Capabilities · Integrations |
| 2 | `hero-section.tsx` | «Distributed compute, ...» | + `ascii-scene.tsx` |
| 3 | `features-section.tsx` | 4 ميزات | Autonomous Execution · Distributed Computing · Multi-Agent Orchestration · Secure Sandboxing |
| 4 | `how-it-works-section.tsx` | «Define. Deploy. Scale.» | 3 خطوات |
| 5 | `infrastructure-section.tsx` | «Global network sphere» | North America · Asia Pacific · South America |
| 6 | `metrics-section.tsx` | «Tasks completed today» · «Availability» · «Average execution» | ⚠️ أرقام + مزوّدو نماذج (GPT-4 Turbo · Claude 3 · Mistral Large) |
| 7 | `integrations-section.tsx` | «Connect everything.» | ⚠️ ادّعاءات تكاملات |
| 8 | `security-section.tsx` | Isolated execution · Encrypted memory · Full audit trails · Permission boundaries | ⚠️ «Security incidents this year» |
| 9 | `developers-section.tsx` | «Or let them code.» | — |
| 10 | `testimonials-section.tsx` | «Trusted by teams worldwide.» | ⚠️ **شهادات مفبركة** (Sarah Chen/Meridian Labs · Marcus Webb) |
| 11 | `pricing-section.tsx` | «Pay for results.» | ⚠️ أسعار `$/month` و«Custom» |
| 12 | `cta-section.tsx` | «Ready to delegate to AI agents?» | — |
| 13 | `footer-section.tsx` | — | + `Bioluminescent landscape` |

**⚠️ = عنصر يحتاج قرارًا في المرحلة 3** (تعطيل عرض خلف علم — لا حذف).

---

## 5. ملاحظة مفرحة: الميزات الأربع متوافقة مع هويتنا

| القالب | وعودنا الأربعة |
|---|---|
| Autonomous Execution | Practical task automation |
| Distributed Computing | Leverage distributed computing |
| Multi-Agent Orchestration | Orchestrate multi-agent collaboration |
| Secure Sandboxing | Securely manage agent execution in sandboxes |

**النتيجة:** **بنية الأقسام سليمة لهويتنا** — تحتاج فقط: عربي/RTL، اسم Agentnexos،
ومحتوى أمين. **لا حاجة لإعادة تصميم.** ده يقلّل خطر المساس بالتصميم كثيرًا.

---

## 6. قائمة المقارنة (تُملأ في المرحلة 2 و3)

| القسم | قبل (لقطة) | بعد (لقطة) | الفرق | الحكم |
|---|---|---|---|---|
| Navigation | ⬜ | `docs/baseline/en-desktop.png` · `ar-desktop.png` | لا إعادة تصميم — نص فقط | ✅ |
| Hero | ⬜ | نفس اللقطات الكاملة | لا تغيير بنيوي | ✅ |
| Features | ⬜ | نفس اللقطات الكاملة | لا تغيير بنيوي | ✅ |
| How it works | ⬜ | نفس اللقطات الكاملة | لا تغيير بنيوي | ✅ |
| Infrastructure | ⬜ | نفس اللقطات الكاملة | تعريب وسوم المناطق + سطر توضيحي | ✅ |
| Metrics | ⬜ | نفس اللقطات الكاملة | تعريب + تحييد أرقام غير موثّقة | ✅ |
| Integrations | ⬜ | نفس اللقطات الكاملة | تعريب فئات | ✅ |
| Security | ⬜ | نفس اللقطات الكاملة | تعريب + وسم خارطة الطريق | ✅ |
| Developers | ⬜ | نفس اللقطات الكاملة | تعريب | ✅ |
| Testimonials | ⬜ | `NEXT_PUBLIC_SHOW_PLACEHOLDER_SECTIONS=true` | معطّل افتراضيًا — البنية محفوظة | ✅ |
| Pricing | ⬜ | `NEXT_PUBLIC_SHOW_PLACEHOLDER_SECTIONS=true` | معطّل افتراضيًا — البنية محفوظة | ✅ |
| CTA | ⬜ | نفس اللقطات الكاملة | تعريب + مرايا RTL للصورة | ✅ |
| Footer | ⬜ | نفس اللقطات الكاملة | تعريب + إزالة صورة مُعرَّفة بحرف | ✅ |

**أحجام المقارنة المطلوبة:** سطح مكتب (1440px) + جوال (390px).

**اللقطات المُلتقطة (مرحلة 2):** `docs/baseline/en-desktop.png` · `en-mobile.png` ·
`ar-desktop.png` · `ar-mobile.png` — من البناء الإنتاجي عبر `next start`.

---

## 7. مقاييس تقنية مثبّتة

| المقياس | القيمة |
|---|---|
| Next.js | `16.2.0` (Turbopack) |
| React | `^19` |
| Tailwind | `^4.1.9` |
| مدير الحزم | pnpm (`pnpm-lock.yaml`) |
| المسارات المولَّدة | `/` فقط + `/_not-found` |
| نتيجة البناء | ✅ ناجح |
| ملفات الأقسام | 13 في `components/landing/` |
| مكتبة UI | shadcn/ui كاملة في `components/ui/` |
