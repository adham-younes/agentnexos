import { productPages } from "./product-pages";

export const publicPages = {
  ...productPages,
  "solutions": {
    "ar": {
      "eyebrow": "عمليات يمكن البناء حولها",
      "title": "ابدأ بعملية واضحة. وابنِ حولها نظامًا وكيلًا.",
      "intro": "نحدد أين يتعطل العمل، وما البيانات المطلوبة، ومن يملك القرار. ثم نصمم تجربة محدودة قبل ربطها بأنظمة المؤسسة.",
      "notice": "حالات استخدام مقترحة للدراسة والتطوير. التكاملات والتنفيذ الخارجي غير متاحين في المثال الحالي.",
      "cards": [
        [
          "المشتريات ومراجعة الطلبات",
          "اجمع تفاصيل الطلب والمورد والمستندات، وحدد المعلومات الناقصة قبل وصول الطلب إلى المسؤول.",
          "البيانات: طلب شراء، عروض موردين، وسياسة اعتماد المؤسسة.",
          "القرار: مراجعة المسؤول قبل إنشاء أمر شراء.",
          "النتيجة: ملف طلب منظم وملاحظات واضحة للمراجعة."
        ],
        [
          "المالية ومتابعة المستحقات",
          "رتب الفواتير المستحقة وحدد الاستثناءات، وجهز مسودة متابعة تستند إلى بيانات معتمدة.",
          "البيانات: سجل الفواتير، تواريخ الاستحقاق، وبيانات التواصل المصرح بها.",
          "القرار: اعتماد المسودة قبل إرسالها.",
          "النتيجة: قائمة متابعة ومسودات قابلة للمراجعة."
        ],
        [
          "خدمة العملاء والعمليات الداخلية",
          "اربط السؤال بمعرفة المؤسسة، واقترح الخطوة التالية، وصعّد الحالات التي تحتاج قرارًا.",
          "البيانات: مصادر معرفة معتمدة وسجل الحالة وصلاحيات الفريق.",
          "القرار: تصعيد الاستثناءات وعدم تعديل السجلات دون تفويض.",
          "النتيجة: رد مرتبط بمصدر وخطوة متابعة واضحة."
        ]
      ]
    },
    "en": {
      "eyebrow": "Workflows to build around",
      "title": "Start with a clear workflow. Build an agent system around it.",
      "intro": "Identify where work stalls, which data is needed, and who owns each decision. Validate a focused pilot before connecting enterprise systems.",
      "notice": "Proposed use cases for discovery and development. Integrations and external actions are not available in the current example.",
      "cards": [
        [
          "Procurement and request review",
          "Collect request details, supplier information, and supporting documents. Surface missing information before the owner reviews it.",
          "Data: purchase request, supplier quotes, and the organization's approval policy.",
          "Decision: owner review before creating a purchase order.",
          "Outcome: an organized request with clear review notes."
        ],
        [
          "Finance and receivables follow-up",
          "Organize outstanding invoices, identify exceptions, and prepare a follow-up draft using approved records.",
          "Data: invoice ledger, due dates, and authorized contact details.",
          "Decision: approve the draft before sending.",
          "Outcome: a prioritized follow-up list and reviewable drafts."
        ],
        [
          "Customer service and internal operations",
          "Connect a question to enterprise knowledge, propose the next step, and escalate cases requiring a decision.",
          "Data: approved knowledge sources, case history, and team permissions.",
          "Decision: escalate exceptions; change records only with authorization.",
          "Outcome: a sourced answer and an explicit follow-up step."
        ]
      ]
    }
  },
  "security": {
    "ar": {
      "eyebrow": "الأمان والحوكمة",
      "title": "حدود واضحة للبيانات والقرارات والتنفيذ.",
      "intro": "نحدد ضوابط التشغيل مع المؤسسة قبل توصيل بياناتها أو منح أدواتها صلاحية التنفيذ. هذه متطلبات التصميم والتحقق، وليست شهادة امتثال.",
      "notice": "التجربة العامة تصمم العمليات ببيانات افتراضية وأدوات قراءة محدودة. تنفيذ إجراءات المؤسسة يحتاج هوية موثقة وصلاحيات وعزلًا وموافقات محفوظة؛ هذه القدرات غير مفعلة هنا.",
      "cards": [
        [
          "هوية المستخدم وصلاحيات المؤسسة",
          "يجب أن تُستمد الصلاحية من جلسة موثوقة وعضوية فعلية، لا من معرّف يرسله المتصفح. ويجب اختبار عزل المؤسسات على قاعدة البيانات."
        ],
        [
          "الموافقة قبل الأفعال الحساسة",
          "تحدد المؤسسة الأفعال التي تتطلب موافقة. ترتبط الموافقة بالفعل ومعلماته وصاحب القرار ووقت انتهائها، وتُراجع قبل التنفيذ."
        ],
        [
          "سجل النتيجة ودليلها",
          "نسجل الطلب والخطوات والقرارات ونتيجة النظام المتصل. بصمة التجزئة تساعد في مقارنة المحتوى؛ وحدها لا تشفر البيانات ولا تمنع تعديل السجل."
        ],
        [
          "بيانات مناسبة لكل خطوة",
          "نقلل البيانات المرسلة ونحدد الموردين ومدة الاحتفاظ وموقع الاستضافة لكل نشر. لا ننشر ضمان سيادة أو امتثال دون تحقق خاص بالمشروع."
        ],
        [
          "أدوات بصلاحيات محدودة",
          "أدوات التجربة تتحقق من المدخلات عند التنفيذ وتلتزم بميزانية مشتركة للطلب. جلب المراجع مقصور على روابط رسمية محددة دون تحويلات. لا يوجد تنفيذ كود أو وصول لبيانات المؤسسة."
        ],
        [
          "اختبار الفشل والتعافي",
          "نختبر رفض الأدوات غير المصرح بها والحدود والإلغاء وفشل المصادر والتسجيل. التشغيل المؤسسي يحتاج أيضًا إثبات الاستئناف ومنع تكرار الأثر على النظام الفعلي."
        ]
      ]
    },
    "en": {
      "eyebrow": "Security and governance",
      "title": "Clear boundaries for data, decisions, and execution.",
      "intro": "Define operating controls with the organization before connecting its data or granting execution permissions. These are design and verification requirements, not a compliance certification.",
      "notice": "The public preview designs workflows with fictional data and bounded read tools. Enterprise actions require verified identity, scoped permissions, isolation, and persisted approvals; those capabilities are not enabled here.",
      "cards": [
        [
          "Identity and organization permissions",
          "Authorization must come from a trusted session and verified membership, not an identifier supplied by the browser. Tenant isolation must be tested on the database."
        ],
        [
          "Approval before sensitive actions",
          "The organization defines which actions need approval. Approval binds the action, parameters, decision owner, and expiry and is checked before execution."
        ],
        [
          "Result records and evidence",
          "Record the request, steps, decisions, and connected-system result. A hash helps compare content; it does not encrypt data or independently prevent record changes."
        ],
        [
          "Appropriate data for each step",
          "Minimize transmitted data and specify providers, retention, and hosting location for each deployment. Residency or compliance claims require project-specific verification."
        ],
        [
          "Tools with limited permissions",
          "Preview tools validate inputs at execution and share a per-request budget. Reference retrieval uses fixed official URLs without redirects. There is no code execution or enterprise-data access."
        ],
        [
          "Failure and recovery testing",
          "Test capability denial, limits, cancellation, source outages, and recording failures. Enterprise rollout also requires proven resumption and duplicate-effect prevention against the actual target system."
        ]
      ]
    }
  },
  "privacy": {
    "ar": {
      "eyebrow": "بياناتك أثناء الاستخدام",
      "title": "الخصوصية ومعالجة البيانات",
      "intro": "يوضح هذا الإشعار نطاق التجربة الحالية. ستُنشر تفاصيل معالجة البيانات الخاصة بالتشغيل المؤسسي قبل إتاحته.",
      "notice": "لا تدخل مستندات حقيقية أو بيانات شخصية أو مفاتيح وصول في المثال.",
      "cards": [
        ["حساب المستخدم", "تدير Supabase بريد الحساب وكلمة المرور المشفرة وجلسات الدخول وتأكيد البريد. يحفظ التطبيق ملف حساب معزولًا بمعرف المستخدم وتاريخ الإنشاء؛ لا يستخدمه لمنح صلاحيات مؤسسية."],
        ["موجز المشروع المحلي", "إجابات نموذج موجز المشروع تبقى في ذاكرة صفحة المتصفح. لا ترسل إلى خادم أو فريق؛ يمكنك تنزيل ملف ومراجعته قبل مشاركته. إغلاق الصفحة أو مسحها يزيل حالتها المحلية."],
        [
          "المثال الحالي",
          "عند تشغيل الاتصال الحي، يرسل طلبك وسياق المحادثة إلى خادم Vercel ثم نماذج Groq للتحليل والتخطيط والمراجعة. استخدم بيانات افتراضية فقط. المحادثة في ذاكرة التبويب ولا تحفظ في قاعدة بيانات التطبيق."
        ],
        [
          "استضافة الموقع",
          "يستضيف Vercel الموقع، وقد يعالج بيانات الاتصال الفنية اللازمة لتقديم الصفحات. توجد حزمة Vercel Analytics في الموقع؛ لا يعني عدم حفظ بيانات المثال عدم وجود بيانات استخدام تقنية."
        ],
        [
          "قبل ربط بيانات المؤسسة",
          "يجب تحديد البيانات والغرض والموردين ومواقع المعالجة ومدة الاحتفاظ والحذف وجهة التواصل المسؤولة. لا يوجد ضمان عام بأن كل نشر سيبقى داخل بلد محدد."
        ],
        [
          "النماذج ومورّدو الخدمات",
          "Groq مزود معالجة نماذج التجربة. شروط المعالجة والاحتفاظ لديه تعتمد على الخطة والإعدادات والعقد؛ لا نقدّم وعدًا عامًا بعدم التدريب أو الاحتفاظ. جلب المراجع التقنية يتصل بمواقع رسمية محددة فقط."
        ],
        ["حدود الاستخدام وسجل التشغيل", "يحفظ Supabase بصمة HMAC لمعرف الحساب ووقت الطلب وحالته وأدوار النماذج واستهلاك الرموز وقرارات سياسة الأدوات وتوقيت مراحل الطلب، دون نص الطلب أو الرد أو محتوى المراجع. يستخدم ذلك لمنع الإساءة. تنظف سجلات أقدم من 48 ساعة عند حجز طلب جديد؛ لا يوجد حاليًا حذف مجدول يضمن موعدًا أقصى."],
        [
          "حدود هذا الإشعار",
          "هذا وصف للحالة الحالية وليس بديلًا عن اتفاق معالجة بيانات خاص بمشروع مؤسسي. قناة طلبات الخصوصية وبيانات الجهة المسؤولة تحتاج اعتماد المالك قبل استقبال بيانات العملاء."
        ]
      ]
    },
    "en": {
      "eyebrow": "Data during use",
      "title": "Privacy and data handling",
      "intro": "This notice describes the current example. Enterprise data-processing details must be published before enterprise access is enabled.",
      "notice": "Do not enter real documents, personal data, or credentials into the example.",
      "cards": [
        ["User account", "Supabase manages account email, password hashes, sessions, and email confirmation. The app stores an isolated profile with a user identifier and creation time; it grants no enterprise permissions."],
        ["Local project brief", "Project brief answers stay in the browser page memory. They are not sent to a server or team; you may download and review a file before sharing. Closing or clearing the page removes local state."],
        [
          "Current example",
          "When the live connection is enabled, your request and conversation context go to the Vercel server and then Groq models for analysis, planning, and review. Use fictional data only. Conversation state lives in the browser tab and is not stored in the application's database."
        ],
        [
          "Website hosting",
          "Vercel hosts the site and may process technical connection data needed to deliver pages. Vercel Analytics is included; local example state does not imply an absence of technical usage data."
        ],
        [
          "Before connecting enterprise data",
          "Specify the data, purpose, providers, processing locations, retention, deletion, and responsible contact. No universal in-country hosting guarantee is made."
        ],
        [
          "Models and service providers",
          "Groq processes the demo's model requests. Its processing and retention terms depend on the plan, configuration, and contract; no universal no-training or no-retention promise is made. Technical reference retrieval connects only to selected official sites."
        ],
        ["Usage limits and execution records", "Supabase stores an HMAC fingerprint of the account identifier, request time and status, model roles, token usage, tool-policy decisions, and stage timing—not prompt or response text or reference content—to prevent abuse. Records older than 48 hours are cleaned when a new request is reserved; there is currently no scheduled deletion guaranteeing a maximum retention deadline."],
        [
          "Scope of this notice",
          "This describes the current state and does not replace a project-specific data-processing agreement. Privacy contacts and controller details require owner approval before accepting customer data."
        ]
      ]
    }
  },
  "terms": {
    "ar": {
      "eyebrow": "نطاق الاستخدام الحالي",
      "title": "شروط استخدام التجربة",
      "intro": "الموقع يقدم تعريفًا بالمشروع ومساعدًا لتصميم العمليات ببيانات افتراضية. التشغيل المؤسسي والتكاملات يخضعان لنطاق واتفاق مستقلين.",
      "notice": "الاقتراحات ليست تفويضًا أو تنفيذًا خارجيًا. لا توجد أدوات دفع أو شراء أو إرسال بريد في هذه التجربة.",
      "cards": [
        [
          "طبيعة المثال",
          "الأمثلة تعليمية ببيانات افتراضية. لا تعتمد عليها لاتخاذ قرار مالي أو قانوني أو لإصدار أمر شراء."
        ],
        [
          "مسؤولية المراجعة",
          "تحتاج المخرجات والقرارات إلى مراجعة الشخص المسؤول. عرض مسودة أو حالة اعتماد في المثال لا يثبت صحة عملية حقيقية."
        ],
        [
          "قبل التشغيل المؤسسي",
          "يُحدد نطاق العمل ومصادر البيانات والصلاحيات والموافقات ومعايير القبول ومسؤولية الدعم في اتفاق المشروع."
        ],
        [
          "الحدود الفنية",
          "لا نضمن توفر تكامل أو استمرارية سجل أو منع تكرار إجراء خارجي قبل تنفيذ تلك القدرات واختبارها على النظام المتصل."
        ],
        [
          "الاستخدام المقبول",
          "لا تستخدم الموقع لإرسال أسرار أو بيانات لا تملك صلاحية معالجتها، أو محاولة الوصول إلى بيانات الغير. هذه الشروط تحتاج مراجعة قانونية قبل إطلاق الخدمة التجارية."
        ]
      ]
    },
    "en": {
      "eyebrow": "Current usage scope",
      "title": "Example usage terms",
      "intro": "The site introduces the project and a workflow-design assistant using fictional data. Enterprise operation and integrations require a separate agreed scope.",
      "notice": "Suggestions are not authorization or external execution. This preview has no payment, purchasing, or email-sending tools.",
      "cards": [
        [
          "Nature of the example",
          "Examples are educational and use fictional data. Do not rely on them for financial or legal decisions or purchase orders."
        ],
        [
          "Review responsibility",
          "Outputs and decisions require the responsible person's review. A draft or example approval status does not establish a valid real-world transaction."
        ],
        [
          "Before enterprise operation",
          "Agree on scope, data sources, permissions, approvals, acceptance criteria, and support responsibilities in the project agreement."
        ],
        [
          "Technical limits",
          "Integration availability, durable records, and duplicate-action prevention are not guaranteed until implemented and tested against the connected system."
        ],
        [
          "Acceptable use",
          "Do not submit secrets or data you are not authorized to process, or attempt to access another party's data. These terms require legal review before commercial launch."
        ]
      ]
    }
  }
} as const;
export type PublicPageKey = keyof typeof publicPages;
