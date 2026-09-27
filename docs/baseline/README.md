# لقطات المرحلة 2 (قبل/بعد)

كل اللقطات مُلتقطة من **بناء إنتاجي** (`next build` + `next start`) عبر Chromium headless.

## الافتراضي (العلم `false`) — الواجهة المنشورة

| الملف | الوصف |
|---|---|
| `en-desktop.png` · `en-mobile.png` | الصفحة الإنجليزية، 1440px و390px |
| `ar-desktop.png` · `ar-mobile.png` | الصفحة العربية RTL، 1440px و390px |

`testimonials` و`pricing` **معطّلان** هنا (لأن محتواهما مؤقّت)، وباقي الأقسام الـ11 كاملة.

## العلم `true` — لإثبات أن البنية محفوظة

| الملف | الوصف |
|---|---|
| `full/en-full-desktop.png` · `full/ar-full-desktop.png` | نفس الصفحة مع إظهار قسمي الشهادات والأسعار |

عند تفعيل `NEXT_PUBLIC_SHOW_PLACEHOLDER_SECTIONS=true` يعود القسمان بتصميمهما الكامل —
لم يُحذف أي ملف.
