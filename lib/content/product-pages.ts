export const productPages = {
  integrations:{ar:{eyebrow:"ربط وفق نطاق محدد",title:"أضف قدرات إلى أنظمتك الحالية.",intro:"نحدد مصدر الحقيقة ونطاق الأدوات والتفويض قبل ربط أنظمة المؤسسة.",notice:"تكاملات مقترحة حسب المشروع؛ ليست موصلات عامة مفعلة في التجربة.",cards:[]},en:{eyebrow:"Scoped integration",title:"Add capabilities to your existing systems.",intro:"Define systems of record, tool scope and authorization before enterprise connections.",notice:"Project-specific integration scopes; no public enterprise connectors are enabled.",cards:[]}},
  process:{ar:{eyebrow:"تسليم على مراحل",title:"من اكتشاف العملية إلى قبول موثق.",intro:"منهج عملي للتصميم والتجربة والتسليم وقياس الأثر.",notice:"يحدد نطاق المشروع وتسليمه باتفاق مستقل.",cards:[]},en:{eyebrow:"Phased delivery",title:"From process discovery to documented acceptance.",intro:"A practical approach to design, pilots, delivery and impact measurement.",notice:"Project scope and delivery require a separate agreement.",cards:[]}},
  services: {
    ar: {eyebrow:"منهج تسليم واضح",title:"من تشخيص العملية إلى تشغيل يمكن مراجعته.",intro:"نصمم أنظمة وكيلة حول مشكلة تشغيلية محددة. يبدأ نطاق المشروع باكتشاف العملية وبياناتها، ويتدرج إلى تجربة واختبار وتسليم وفق معايير يتفق عليها الفريق.",notice:"نطاقات خدمات مقترحة تُحدد لكل مشروع. الموجز الحالي يُنزّل إلى جهازك ولا يرسل طلب حجز أو عقدًا.",cards:[
      ["اكتشاف وتصميم","نراجع المدخلات والاستثناءات ومالك القرار، ثم نضع حدود العملية وخط الأساس.","التسليم: خريطة عملية، متطلبات بيانات، ومعايير قبول."],
      ["تجربة محدودة","نختبر فرضية واحدة ببيانات مصرح بها وصلاحيات محددة، مع مراجعة النتائج والحالات الفاشلة.","التسليم: نموذج تجريبي ونتائج اختبار وخطة تحسين."],
      ["تكامل وتشغيل","يُحدد الربط بعد مراجعة هوية المستخدمين وصلاحيات الأدوات وأثر كل فعل، مع إجراءات إيقاف واستعادة.","التسليم: تكاملات متفق عليها وتوثيق تشغيل وتدريب."],
      ["تقييم وتطوير","نقارن النتائج بخط أساس واقعي ونراجع جودة المصادر والكلفة وتدخل المسؤول.","التسليم: تقييم موثق وأولويات تطوير ضمن نطاق متفق عليه."]]},
    en: {eyebrow:"A clear delivery approach",title:"From process discovery to accountable operation.",intro:"We design agent systems around a specific operating problem. Define the process and data first, then move through a bounded pilot, validation, and handover against agreed acceptance criteria.",notice:"Proposed service scopes are defined per project. The current brief downloads to your device; it does not book a meeting or create a contract.",cards:[
      ["Discover and design","Review inputs, exceptions, and decision ownership, then define boundaries and a baseline.","Deliverables: process map, data requirements, and acceptance criteria."],
      ["Run a bounded pilot","Test one hypothesis using authorized data and scoped permissions. Review both successful and failed cases.","Deliverables: pilot, test results, and an improvement plan."],
      ["Integrate and operate","Define connections after reviewing identity, tool permissions, and action effects, with stop and recovery procedures.","Deliverables: agreed integrations, operating documentation, and training."],
      ["Evaluate and improve","Compare results with a real baseline; review source quality, cost, and human intervention.","Deliverables: documented evaluation and development priorities within the agreed scope."]]}
  },
  "demo-policy": {
    ar:{eyebrow:"سياسة مساحة الوكيل",title:"تجربة تصميم بحساب شخصي وحدود واضحة.",intro:"الموقع العام مفتوح للجميع. مساحة الوكيل تتطلب بريدًا مؤكدًا وحسابًا؛ تقدم مسودات ومراجعات للعمليات، ولا تنفذ إجراءات في أنظمة خارجية.",notice:"استخدم بيانات افتراضية فقط. لا تضف بيانات عملاء أو أسرارًا أو مستندات سرية.",cards:[
      ["حسابك وبياناته","تدير Supabase تسجيل الدخول وتأكيد البريد. ملفات الحساب معزولة بصلاحيات صفوف قاعدة البيانات.","لا تمنح بيانات المستخدم أو نص المحادثة صلاحيات إضافية."],
      ["معالجة الطلب","يُرسل محتوى طلبك وسياق المحادثة المحدود إلى مزود النموذج لإنتاج الرد، مع تسجيل بيانات تشغيل مختصرة.","راجع سياسة الخصوصية قبل استخدام المساحة."],
      ["القرار تحت المراجعة","المخرجات مسودات قد تخطئ. راجع المصادر والحسابات والافتراضات قبل استخدامها.","لا دفع ولا إرسال رسائل ولا تعديل أنظمة مؤسسة من المساحة."],
      ["حدود الاستخدام","تخضع الطلبات لميزانية استخدام وحدود تزامن، إضافة إلى حدود مزود النموذج.","اشتراكك لدى مزود مستقل لا يغيّر حدود هذه التجربة تلقائيًا."]] },
    en:{eyebrow:"Workspace policy",title:"A personal account. A bounded design preview.",intro:"The public website is open to everyone. The agent workspace requires a confirmed email and account. It prepares workflow drafts and reviews without executing actions in external systems.",notice:"Use fictional data only. Do not enter customer records, secrets, or confidential documents.",cards:[
      ["Account and access","Supabase manages sign-in and email confirmation. Database row policies isolate account profiles.","User metadata and conversation text cannot grant additional permissions."],
      ["Request processing","Your request and bounded conversation context are sent to the model provider to generate a response. Limited operating metadata is recorded.","Read the privacy notice before using the workspace."],
      ["Review decisions","Outputs are drafts and may be wrong. Check sources, calculations, and assumptions before relying on them.","The workspace cannot make payments, send messages, or modify enterprise systems."],
      ["Usage limits","Requests are subject to a usage budget and concurrency controls, alongside provider limits.","An independent provider subscription does not automatically change this preview's limits."]] }
  },
  about: {
    ar: { eyebrow: "منهج Agentnexos", title: "نبني حول العملية والمسؤول عنها.", intro: "Agentnexos مشروع لتصميم أنظمة وكيلة مخصصة لعمليات المؤسسات في مصر والخليج. نبدأ بمشكلة قابلة للقياس، ثم نختار المعرفة والأدوات والضوابط التي تحتاجها العملية.", notice: "الموقع يعرض منهج العمل وتجربة تصميم محدودة. لا يقدم شهادات امتثال أو نتائج عملاء أو تكاملات جاهزة غير مثبتة.", cards: [
      ["اكتشاف مسؤول", "حدد مالك العملية ومصدر الحقيقة والحجم الحالي والاستثناءات. المخرج موجز يمكن لفريق الأعمال والهندسة مراجعته.", "القبول: هدف واحد ومخرج واضح ومعيار نجاح قابل للتحقق."],
      ["تجربة محدودة", "ابدأ ببيانات افتراضية وصلاحيات قراءة ومسودات. اختبر الفشل ونقص المعلومات وطلبات تجاوز الصلاحية قبل إضافة أي فعل خارجي.", "القبول: حالات اختبار ونتائج موثقة؛ رأي النموذج لا يمنح سلطة."],
      ["تشغيل بإثبات", "قبل الربط المؤسسي يلزم تفويض وعزل وحفظ حالة واستئناف وتتبع كلفة ومراجعة أثر الأفعال. لا نستبدل هذه المتطلبات بتعليمات داخل محادثة.", "القبول: أدلة من الأنظمة المتصلة وخطة إيقاف واستعادة موثقة."],
      ["توسع تدريجي", "قارن وقت الإنجاز وجودة المخرجات وتدخل المسؤول بخط أساس مقاس. وسّع نطاق العملية بعد تحقق القبول والأمن.", "القبول: نتائج قابلة للمراجعة وحدود واضحة لكل مرحلة."],
    ] },
    en: { eyebrow: "The Agentnexos approach", title: "Build around the process and its owner.", intro: "Agentnexos is a project for custom enterprise agent workflows in Egypt and the Gulf. Start with a measurable problem, then choose the knowledge, tools, and controls the process needs.", notice: "The site presents an approach and a limited design preview. It does not claim unverified certifications, customer results, or ready-made integrations.", cards: [
      ["Accountable discovery", "Identify the process owner, source of truth, current volume, and exceptions. Produce a brief operations and engineering can review.", "Acceptance: one goal, a clear output, and verifiable success criteria."],
      ["A bounded pilot", "Start with fictional data, read permissions, and drafts. Test failure, missing information, and unauthorized requests before adding external actions.", "Acceptance: documented cases and results; model opinion grants no authority."],
      ["Evidence before operation", "Enterprise connections require authorization, isolation, saved state, recovery, cost traces, and effect verification. Conversation instructions do not replace these requirements.", "Acceptance: evidence from connected systems and a documented stop and recovery plan."],
      ["Gradual expansion", "Compare cycle time, output quality, and owner intervention against a measured baseline. Expand after acceptance and security checks.", "Acceptance: reviewable results and explicit boundaries for each stage."],
    ] },
  },
  platform: {
    ar: {
      eyebrow: "من المشكلة إلى نظام قابل للتشغيل", title: "المعرفة والأدوات والقرارات، في سير عمل واحد.",
      intro: "النظام الوكيل ليس نموذجًا واحدًا يعرف كل شيء. إنه مسار يبدأ بهدف ومالك للعملية، ويستدعي التحليل والتخطيط والمراجعة بقدر الحاجة. يحدد النظام صلاحيات الأدوات، بينما يبقى اعتماد القرارات للمسؤول عنها.",
      notice: "مساحة الوكيل مخصصة لاستكشاف تصميم العمليات. ربط أنظمة المؤسسة وحفظ التشغيل والموافقات يحتاج إعدادًا واختبارات خاصة بكل مشروع؛ لا نقدمه كقدرة عامة جاهزة.",
      cards: [
        ["01 · فهم العملية", "حدد الطلب الذي يبدأ العمل، ومالك العملية، ومصدر الحقيقة، وما الذي يعنيه النجاح. نميز المشكلة التشغيلية عن الرغبة في إضافة ذكاء اصطناعي.", "المخرج: وصف عملية وحدود واضحة وأسئلة للبيانات الناقصة."],
        ["02 · توزيع الأدوار", "تُختار الأدوار حسب الطلب: رد مباشر للسؤال البسيط، وتخطيط ومراجعة للحساب، وتحليل إضافي لتصميم العملية. الحالة والصلاحيات يملكها النظام، لا رأي النموذج.", "المخرج: خطة عمل قابلة للمراجعة، لا محادثة مفتوحة بلا مسؤولية."],
        ["03 · معرفة مصرح بها", "اختر المستندات والسياسات والسجلات المسموح باسترجاعها. تربط الإجابة بالمصدر وتوضح عندما تكون المعلومات غير كافية.", "المطلوب: ملكية المصادر وسياسة تحديث وصلاحيات وصول قبل الربط."],
        ["04 · أدوات بحدود", "لكل أداة مدخلات ومخرجات ونطاق اتصال وحد زمني. تبدأ الأدوات بالقراءة، وتبقى الكتابة مغلقة حتى يثبت التفويض والتحقق من الأثر.", "المطلوب: حساب خدمة محدود الصلاحية واختبارات فشل وتكرار."],
        ["05 · قرارات بشرية", "الموافقة تربط الفعل بمعلماته وصاحب القرار وانتهاء الصلاحية. التعديل على الطلب يلغي الموافقة القديمة بدل استخدامها لعمل مختلف.", "المطلوب: حفظ دائم واستئناف موثق قبل تنفيذ أي فعل حساس."],
        ["06 · إثبات القيمة", "اختبر العملية مقابل خط أساس: وقت الإنجاز، جودة النتيجة، الاستثناءات، وتدخل المسؤول. لا نستنتج التوفير من جودة نص الرد.", "المخرج: حالات قبول ودليل من النظام النهائي وخطة توسع تدريجي."],
      ],
    },
    en: {
      eyebrow: "From operating problem to deployable system", title: "Knowledge, tools, and decisions. One workflow.",
      intro: "An agent system is not one model that knows everything. It starts with a goal and an accountable process owner, then uses analysis, planning, and review as needed. The system controls tool permissions while accountable people approve decisions.",
      notice: "The workspace explores workflow design. Enterprise connections, durable execution, and approvals require project-specific setup and tests; they are not advertised as generally available capabilities.",
      cards: [
        ["01 · Understand the process", "Define the triggering request, process owner, source of truth, and success criteria. Separate an operating problem from the desire to add AI.", "Output: a bounded process description and questions about missing data."],
        ["02 · Assign clear roles", "Select roles by request: a direct response for a simple question, planning and review for calculations, and additional analysis for workflow design. The system owns state and permissions, not the model's opinion.", "Output: a reviewable workflow, not an unbounded conversation."],
        ["03 · Permission-aware knowledge", "Select the documents, policies, and records permitted for retrieval. Connect answers to sources and disclose insufficient information.", "Requires: source ownership, refresh policy, and access boundaries before connection."],
        ["04 · Bounded tools", "Each tool has inputs, outputs, network scope, and a timeout. Start with reading; keep writing closed until authorization and effect verification are proven.", "Requires: scoped service accounts and failure and duplicate-action tests."],
        ["05 · Human decisions", "Approval binds an action to its parameters, decision owner, and expiry. Changing a request invalidates the old approval rather than reusing it for another action.", "Requires: durable storage and authenticated resumption before sensitive execution."],
        ["06 · Demonstrate value", "Compare with a baseline: cycle time, result quality, exceptions, and owner intervention. A good-looking response does not establish savings.", "Output: acceptance cases, evidence from the target system, and gradual expansion."],
      ],
    },
  },
  industries: {
    ar: {
      eyebrow: "مصر والخليج والشرق الأوسط", title: "نفس منهج البناء. حدود مختلفة لكل قطاع.",
      intro: "اللغة والبيانات وسلطة القرار تختلف بين فريق مالي وشركة لوجستية ومقدم خدمات. لذلك نبدأ من العملية وبيئتها، لا من قالب قطاعي يدعي حل كل شيء.",
      notice: "هذه نطاقات مقترحة للاكتشاف والتطوير، وليست قائمة عملاء أو حلول قطاعية مكتملة أو إقرار امتثال.",
      cards: [
        ["التجارة والتوزيع", "دراسة تصنيف طلبات العملاء، جمع معلومات المنتجات، وتجهيز مسودة العرض.", "مصدر الحقيقة: الكتالوج والأسعار والمخزون المعتمد.", "الحد: لا تعديل سعر أو تأكيد طلب دون مراجعة المسؤول."],
        ["الخدمات المهنية", "تنظيم طلبات الخدمة، تجميع المتطلبات، وصياغة ملخص تسليم بين الفرق.", "مصدر الحقيقة: نطاق الخدمة وسجل العميل والملفات المصرح بها.", "الحد: لا تعهد تعاقدي أو مشاركة مستند دون تفويض."],
        ["اللوجستيات والعمليات", "ترتيب استثناءات الشحنات، تلخيص الحالة، واقتراح التصعيد للفريق الصحيح.", "مصدر الحقيقة: نظام تتبع فعلي وبيانات حالة حديثة.", "الحد: لا تغيير موعد أو حجز أو إصدار تعليمات تشغيلية دون اعتماد."],
        ["المالية والإدارة", "تحضير مراجعة الفواتير وطلبات الشراء وتجميع الأسئلة الناقصة للمسؤول.", "مصدر الحقيقة: السجلات المالية وسياسات الشركة المعتمدة.", "الحد: لا دفع أو اعتماد أو توصية قانونية؛ القرار للمخولين."],
      ],
    },
    en: {
      eyebrow: "Egypt, the Gulf, and the Middle East", title: "One engineering approach. Sector-specific boundaries.",
      intro: "Language, data, and decision authority differ across finance, logistics, and professional services. Start with the actual process and its environment, not a sector template claiming to solve everything.",
      notice: "These are proposed discovery and development scopes, not customer references, completed vertical products, or compliance endorsements.",
      cards: [
        ["Commerce and distribution", "Explore customer-request classification, product information collection, and quotation drafts.", "Source of truth: approved catalog, prices, and inventory.", "Boundary: no price changes or order confirmation without owner review."],
        ["Professional services", "Organize service requests, collect requirements, and draft handover summaries.", "Source of truth: service scope, customer record, and permitted files.", "Boundary: no contractual commitments or document sharing without authorization."],
        ["Logistics and operations", "Organize shipment exceptions, summarize status, and propose escalation to the right team.", "Source of truth: a connected tracking system with current status data.", "Boundary: no schedule changes, bookings, or operational instructions without approval."],
        ["Finance and administration", "Prepare invoice and purchase-request reviews and collect missing questions for the owner.", "Source of truth: financial records and approved organizational policies.", "Boundary: no payments, approvals, or legal advice; authorized people own the decisions."],
      ],
    },
  },
  resources: {
    ar: {
      eyebrow: "أدلة عملية قبل البناء", title: "اسأل الأسئلة الصحيحة قبل أن تمنح الوكيل أداة.",
      intro: "أدلة مختصرة تساعد فريق العمليات والتقنية على اختيار أول عملية، تحديد حدود التكامل، وتجهيز اختبار قبول له معنى تجاري.",
      notice: "هذه إرشادات تصميم عامة. ليست بديلًا عن سياسة المؤسسة أو مراجعة الأمان أو التحقق القانوني الخاص بالمشروع.",
      cards: [
        ["اختيار أول عملية", "اختر مهمة متكررة لها مدخلات واضحة ومالك محدد ونتيجة يمكن فحصها. ابدأ بحجم صغير من حالات افتراضية، ثم بيانات مصرح بها.", "اسأل: أين يضيع الوقت؟ كم مرة تتكرر المهمة؟ ما الاستثناء الذي يتطلب مسؤولًا؟", "تجنب البداية بعملية مالية نهائية أو صلاحيات واسعة يصعب التراجع عنها."],
        ["قائمة تجهيز التكامل", "سجل النظام المسؤول عن الحقيقة، وما يسمح بقراءته، ومن يملك حساب الخدمة، وكيف نثبت أن الفعل وصل للنظام النهائي.", "اسأل: هل توجد API؟ ما حدود المعدل؟ كيف نحفظ المعرفات ونتجنب تنفيذ الطلب مرتين؟", "موافقة الإنسان لا تعوض حساب خدمة واسع الصلاحيات أو أداة غير محدودة."],
        ["اختبار القبول", "اكتب حالات نجاح وفشل وبيانات ناقصة وانقطاع اتصال وطلب غير مصرح به. عيّن النتيجة المتوقعة لكل حالة قبل اختبار النموذج.", "قِس: اكتمال المهمة وصحة الأدلة وتدخل المسؤول وزمن الإنجاز، لا جمال الرد فقط.", "لا توسع التشغيل قبل نجاح الحالات وتوثيق طريقة التعافي."],
        ["درّج صلاحية التنفيذ", "ابدأ بالقراءة وتجهيز المسودات. افصل اقتراح النموذج عن الإذن باستخدام الأداة، وحدد من يعتمد الرسائل والمدفوعات والحذف.", "اسأل: ما أقل صلاحية لازمة؟ هل تتغير الموافقة عند تغيير المعلمات؟ وكيف نوقف تشغيلًا تجاوز حدوده؟", "التجربة العامة للقراءة والتصميم فقط؛ صلاحيات المؤسسة لا تُستمد من نص المحادثة."],
        ["خطط للتعافي قبل الإطلاق", "ميّز بين تاريخ المحادثة وحالة التنفيذ ودليل النتيجة. قبل كتابة خارجية، حدد كيف تعرف ما تم بالفعل عند انقطاع الاتصال.", "اسأل: هل للفعل معرّف ثابت؟ كيف نكشف التكرار؟ ومتى نتحقق من النظام المتصل بدل إعادة المحاولة؟", "الاستئناف والذاكرة المؤسسية والعزل متطلبات لنشر المؤسسة، وليست قدرات مفعلة في التجربة."],
      ],
    },
    en: {
      eyebrow: "Practical guides before building", title: "Ask the right questions before giving an agent a tool.",
      intro: "Concise guides help operations and engineering choose the first workflow, define integration boundaries, and prepare acceptance tests with business meaning.",
      notice: "General design guidance, not a substitute for organizational policy, security review, or project-specific legal verification.",
      cards: [
        ["Choose the first workflow", "Pick a recurring task with clear inputs, an accountable owner, and a verifiable result. Start with a small fictional test set, then authorized data.", "Ask: where does time go, how often does the task recur, and which exceptions need an owner?", "Avoid starting with final financial actions or broad permissions that are difficult to reverse."],
        ["Prepare the integration", "Record the system of truth, permitted reads, service-account owner, and how to verify the action reached the target system.", "Ask: is an API available, what are its rate limits, and how do we preserve identifiers and prevent duplicate execution?", "Human approval does not compensate for an overpowered service account or an unbounded tool."],
        ["Define acceptance", "Write success, failure, missing-data, outage, and unauthorized-request cases. Set expected results before testing the model.", "Measure completion, evidence accuracy, owner intervention, and cycle time—not just response quality.", "Do not expand operation before these cases pass and recovery is documented."],
        ["Graduate execution permissions", "Start with reading and drafts. Separate the model's proposal from tool authorization and identify who approves messages, payments, and deletion.", "Ask: what is the minimum permission, does a parameter change invalidate approval, and how do we stop a run that exceeds its limits?", "The public preview only reads and designs; enterprise permissions never come from conversation text."],
        ["Plan recovery before launch", "Separate conversation history, execution state, and result evidence. Before external writes, define how to determine what committed when a connection fails.", "Ask: does the action have a stable identifier, how do we detect duplicates, and when do we reconcile with the target system instead of retrying?", "Resumption, enterprise memory, and isolation are deployment requirements, not enabled preview capabilities."],
      ],
    },
  },
} as const;
