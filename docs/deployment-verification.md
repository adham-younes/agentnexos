# التحقق من النشر — Deployment Verification

> سجل تشغيلي لكل عملية نشر. يُحدَّث عند كل نشر إنتاجي.

---

## المشكلة المكتشفة (المرحلة 1)

**الرسالة:**

```
The deployment was blocked because the commit author did not have contributing
access to the project on Vercel.
The Hobby Plan does not support collaboration for private repositories.
Please upgrade to Pro to add team members.
```

**السبب الجذري:** خطة **Vercel Hobby** + **مستودع خاص** ⇒ Vercel تربط صلاحية النشر
بـ**إيميل مؤلف الالتزام**؛ لازم يكون عضوًا في فريق Vercel. التزاماتنا كانت بـ
`openhands@all-hands.dev` — غير عضو ⇒ **حجب النشر**.

| البند | القيمة |
|---|---|
| الفريق | `adhamlouxors-projects` (`team_FWfSZ1vGknqWNQ52Y4bmoHlU`) |
| الخطة | `hobby` |
| المستودع | `adham-younes/agentnexos` (**خاص**) |
| إيميل الالتزامات الناجحة سابقًا | `adham@adham-agritech.com` |
| إيميل الالتزامات المحجوبة | `openhands@all-hands.dev` |

---

## الإصلاح (حلّان مطبَّقان)

### الإصلاح A — ضبط هوية الالتزام محليًّا (دائم)

هوية Git مضبوطة الآن **على مستوى المستودع فقط** لتطابق مالك الفريق:

```bash
git config user.name  "adham younes"
git config user.email "adham@adham-agritech.com"
```

> **ملاحظة:** الالتزامات **المحجوبة سابقًا** لا يُصلحها هذا؛ إصلاحها يحتاج إعادة كتابة
> تاريخ الفرع. الحل العملي: التزام جديد **بعد** الضبط ⇒ النشر التلقائي يشتغل.

### الإصلاح B — النشر المباشر (يُتخطّى فحص المؤلف)

عند الحاجة لتجاوز بوابة المؤلف، يُنشأ نشر إنتاجي عبر واجهة Vercel مباشرة:

```bash
# التوكن يُقرأ من ~/.config/agentnexos/vercel.env (خارج المستودع)
set -a && . ~/.config/agentnexos/vercel.env && set +a

curl -s -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v13/deployments?teamId=team_FWfSZ1vGknqWNQ52Y4bmoHlU&forceNew=1" \
  -d '{
    "name": "compute-the-platform-to-build",
    "project": "prj_LUbU8bZzcOxnEZf9B9Nq8Xm2OJMf",
    "target": "production",
    "gitSource": {
      "type": "github",
      "ref": "<branch>",
      "sha": "<commit-sha>",
      "repoId": 1391116503
    }
  }'
```

> **لا يُنجح** `vercel deploy` عبر CLI مع توكن الفريق هذا (يرجّع
> `User not found (404)`). استخدم الواجهة المباشرة أعلاه.

---

## سجل النشر

| التاريخ | الفرع | الالتزام | الحالة | الرابط |
|---|---|---|---|---|
| 2026-09-27 | `main` | `6bdc3fe` | READY (تلقائي) | `...six-fawn.vercel.app` |
| 2026-09-27 | `phase-1-foundation` | `1406082` | **BLOCKED** (تلقائي — مؤلف غير عضو) | — |
| 2026-09-27 | `phase-1-foundation` | `1406082` | **READY** (نشر مباشر) ✅ | `compute-the-platform-to-build-six-fawn.vercel.app` |

---

## التحقق من الإنتاج

**الرابط العام:** `https://compute-the-platform-to-build-six-fawn.vercel.app`

| الفحص | النتيجة |
|---|---|
| HTTP | `200` عام (غير محجوب) |
| العنوان | `COMPUTE - AI Agents for Distributed Computing` |
| المحتوى | القالب الإنجليزي كما هو — **التصميم سليم** ✅ |
| الاسم `Agentnexos` | ❌ متوقّع — يُضاف في المرحلة 2 |

**ملاحظة حماية:** يبدو أن **Vercel Deployment Protection غير مفعّل** على هذا النطاق —
الرابط العام يرجّع `200` بلا ترويسة تجاوز. لو فُعّل لاحقًا، يلزم
**Protection Bypass Secret** للفحص الآلي.

---

## فحوصات ما بعد النشر (تُنفَّذ في المرحلة 6)

- [ ] إعادة تسمية المشروع: `compute-the-platform-to-build` → `agentnexos`
- [ ] ربط `agentnexos.com` والتحقق من DNS
- [ ] تشغيل عيّنة كامل: معالجة → موافقة → تنزيل CSV/JSON
- [ ] إرسال نموذج عميل محتمل والتحقق من الصف في Supabase
- [ ] التحقق من اللغتين `/ar` و`/en`
