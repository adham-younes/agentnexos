export const publicPages = {
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
      "notice": "مساحة المثال تستخدم بيانات افتراضية ولا تتصل بأنظمة المؤسسة. إتاحة التشغيل الفعلي تتطلب التحقق من الهوية والصلاحيات وحفظ القرارات.",
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
          "لكل أداة نطاق ومدخلات مسموحة ومهلة وحدود استخدام. تنفيذ الكود يحتاج بيئة معزولة، والوصول للشبكة يحتاج سياسة محددة."
        ],
        [
          "اختبار الفشل والتعافي",
          "نختبر انقطاع الخدمات وتكرار الطلبات والاستئناف ومحاولات الوصول غير المصرح به قبل اعتبار التشغيل جاهزًا."
        ]
      ]
    },
    "en": {
      "eyebrow": "Security and governance",
      "title": "Clear boundaries for data, decisions, and execution.",
      "intro": "Define operating controls with the organization before connecting its data or granting execution permissions. These are design and verification requirements, not a compliance certification.",
      "notice": "The example uses fictional data and does not connect to enterprise systems. Live operation requires verified identity, permissions, and durable decision records.",
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
          "Each tool needs a defined scope, validated inputs, timeout, and usage limits. Code execution requires isolation; network access requires an explicit policy."
        ],
        [
          "Failure and recovery testing",
          "Test outages, duplicate requests, resumption, and unauthorized access before declaring the runtime ready."
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
        [
          "المثال الحالي",
          "تستخدم مساحة التجربة بيانات افتراضية داخل الصفحة. قرارات المثال لا ترسل رسائل ولا تعدل سجلات خارجية."
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
          "شروط معالجة بيانات النماذج تعتمد على المورّد والخطة والإعدادات والعقد. لا نقدّم وعدًا عامًا بعدم التدريب قبل التحقق من هذه الشروط."
        ],
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
        [
          "Current example",
          "The workspace uses fictional data within the page. Example decisions do not send messages or modify external records."
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
          "Model data handling depends on the provider, plan, configuration, and contract. A no-training commitment requires verification of those terms."
        ],
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
      "intro": "الموقع يقدم تعريفًا بالمشروع وأمثلة محلية توضح طريقة العمل. التشغيل المؤسسي والتكاملات يخضعان لنطاق واتفاق مستقلين.",
      "notice": "الموافقة داخل المثال تغير حالة العرض فقط، ولا تمنح تفويضًا لتنفيذ خارجي.",
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
      "intro": "The site introduces the project and provides local workflow examples. Enterprise operation and integrations require a separate agreed scope.",
      "notice": "Approval within the example changes the display only and does not authorize external execution.",
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
