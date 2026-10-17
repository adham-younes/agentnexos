import { productPages } from "./product-pages";

export const publicPages = {
  ...productPages,
  "solutions": {
    "ar": {
      "eyebrow": "AGYNEXA",
      "title": "اختر المهمة التي تحتاج خطوة أفضل.",
      "intro": "حلول تُصمّم حول معرفة المؤسسة وطلبات الشراء والمستحقات وعمليات العملاء. لكل نطاق مدخل واضح، ومخرج يفيد الفريق، وقرار يبقى لدى صاحبه.",
      "notice": "هذه نطاقات لتصميم مشروعات مخصصة. تُحدد المصادر والتكاملات والبيانات المسموح بها وفق متطلبات كل مؤسسة.",
      "cards": [
        [
          "المعرفة الداخلية",
          "تتوزع السياسات والإجراءات والملفات بين مصادر مختلفة. نصمّم وصولًا إلى الإجابة ومصدرها، مع وضوح ما يستطيع كل مستخدم الاطلاع عليه وما يحتاج مراجعة."
        ],
        [
          "المشتريات",
          "يتأخر الطلب عندما تنقص مواصفة أو يصعب مقارنة عروض الموردين. نصمّم مسارًا يجمع المعلومات ويظهر الفروق والأسئلة أمام المسؤول قبل قرار الشراء."
        ],
        [
          "متابعة المستحقات",
          "تحتاج المتابعة إلى معرفة السداد وآخر تواصل وأي نزاع أو اتفاق قائم. نصمّم مسارًا يجمع هذا السياق في ملخص عملي، ويجهز خطوة يراجعها المسؤول."
        ],
        [
          "عمليات العملاء",
          "بعض الطلبات تحتاج إجابة، وبعضها يحتاج معلومة أو إجراءً أو فريقًا آخر. نصمّم مسارًا يميز هذه الحالات ويجهز ما يحتاجه الشخص المسؤول للمتابعة."
        ]
      ]
    },
    "en": {
      "eyebrow": "AGYNEXA",
      "title": "Choose the work that needs a better next step.",
      "intro": "Solutions designed around organizational knowledge, procurement, receivables and customer operations. Each scope starts with a clear input, a useful output and an accountable decision owner.",
      "notice": "These are scopes for custom projects. Sources, integrations and permitted data are defined around each organization’s requirements.",
      "cards": [
        [
          "Internal knowledge",
          "Policies, procedures and files sit across different sources. Design a way to find an answer and inspect its source, with clear access boundaries and review points."
        ],
        [
          "Procurement",
          "Requests slow down when specifications are missing or supplier quotes are hard to compare. Design a workflow that brings information, differences and questions together before the purchasing decision."
        ],
        [
          "Receivables follow-up",
          "Useful follow-up depends on payments, recent communication and any dispute or existing agreement. Design a workflow that brings the context into a practical summary and prepares a next step for review."
        ],
        [
          "Customer operations",
          "Some requests need an answer. Others need information, an action or another team. Design a workflow that distinguishes those cases and prepares what the responsible person needs to continue."
        ]
      ]
    }
  },
  "security": {
    "ar": {
      "eyebrow": "AGYNEXA",
      "title": "الأمان يبدأ بتحديد ما يستطيع النظام فعله.",
      "intro": "نعالج الصلاحيات ومصادر البيانات والمراجعة والتعافي ضمن تصميم المشروع. ويظل استخدام المساعد العام منفصلًا عن تشغيل نظام متصل ببيانات المؤسسة.",
      "notice": "استخدم بيانات افتراضية في المساعد العام.",
      "cards": [
        [
          "حدود المساعد العام",
          "استخدم بيانات افتراضية فقط. يمكن للمساعد التحليل والتخطيط والحساب واستخدام مراجع تقنية محددة؛ البريد وCRM وERP وتنفيذ الكود غير متصلة به."
        ],
        [
          "الحساب والمحادثات المحفوظة",
          "الحساب اختياري. تُحفظ المحادثة التي تختار حفظها في سجل خاص بحسابك، ويمكنك فتحها أو إعادة تسميتها أو حذفها. لا يمنح الحساب صلاحيات مؤسسة أو أدواتها."
        ],
        [
          "قبل ربط نظام المؤسسة",
          "نحدد مصادر البيانات وأصحابها وحدود القراءة والتعديل ومزودي المعالجة والاحتفاظ بالسجلات. الإجراءات ذات الأثر تحتاج صاحب صلاحية ونقطة اعتماد، وطريقة لفحص النتيجة والتعافي من الفشل."
        ],
        [
          "مناقشة المتطلبات",
          "أرسل وصفًا عامًا لمتطلباتك إلى adham@agynexa.si. لا تُرسل كلمات مرور أو مفاتيح أو مستندات حساسة. يوضح [إشعار الخصوصية](/privacy) معالجة المساعد والحساب وسجل الاستخدام."
        ]
      ]
    },
    "en": {
      "eyebrow": "AGYNEXA",
      "title": "Security starts with what the system is allowed to do.",
      "intro": "Permissions, data sources, review and recovery belong in the project design. Using the public assistant remains separate from operating a system connected to organizational data.",
      "notice": "Use fictional data in the public assistant.",
      "cards": [
        [
          "Public assistant boundaries",
          "Use fictional data only. The assistant can support analysis, planning, calculations and selected technical references; email, CRM, ERP and code execution are not connected to it."
        ],
        [
          "Accounts and saved conversations",
          "An account is optional. Conversations you choose to save go into your private account history, where you can reopen, rename or delete them. An account does not grant access to enterprise systems or tools."
        ],
        [
          "Before connecting business systems",
          "Define data sources and owners, read/write boundaries, processing providers and record retention. Actions with consequences need an authorized owner, an approval point and a way to check the outcome and recover from failure."
        ],
        [
          "Discuss the requirements",
          "Send a general description of your requirements to adham@agynexa.si. Do not send passwords, keys or sensitive documents. The [privacy notice](/privacy) explains assistant, account and usage-record processing."
        ]
      ]
    }
  },
  "privacy": {
    "ar": {
      "eyebrow": "البيانات أثناء الاستخدام",
      "title": "الخصوصية واستخدام البيانات",
      "intro": "يوضح هذا الإشعار الفرق بين الموجز المحلي، والمحادثة مع المساعد، والحساب والمحادثات التي تختار حفظها. استخدم بيانات افتراضية عند استكشاف المساعد، ولا تشارك أسرارًا أو بيانات عملاء.",
      "notice": "الحفظ في الحساب اختياري. معالجة الرسالة لتوليد الرد تختلف عن إضافتها إلى سجل المحادثات.",
      "cards": [
        [
          "الموجز المحلي",
          "تبقى إجابات نموذج موجز المشروع في ذاكرة صفحة المتصفح. لا ترسل الصفحة الموجز إلى خادم أو فريق. يمكنك تنزيله أو فتح مسودة بريد ومراجعتها قبل الإرسال بنفسك. إغلاق الصفحة أو مسحها يزيل حالتها المحلية."
        ],
        [
          "المحادثة دون حفظ",
          "تُحفظ حالة المحادثة الجارية في ذاكرة التبويب. تُرسل رسالتك والسياق اللازم إلى خادم Vercel ثم إلى Groq لتوليد الرد، سواء كنت ضيفًا أو مسجل الدخول. لا تعني بقاء المحادثة في التبويب أن الرسالة لا تُعالج لدى مزود النموذج."
        ],
        [
          "الحساب والجلسة",
          "يدير Supabase بيانات المصادقة، ومنها البريد الإلكتروني وكلمة المرور والجلسة. يُستخدم الحساب للتحقق من هويتك وإتاحة سجلك الخاص. إنشاء الحساب لا يمنحك صلاحية أنظمة مؤسسة أو أدواتها."
        ],
        [
          "المحادثات التي تختار حفظها",
          "تُضاف المحادثة إلى حسابك عندما تختار الحفظ بعد تسجيل الدخول. لا تُرفع محادثة الضيف تلقائيًا عند الدخول. يشمل الحفظ النص الظاهر من رسائل المستخدم وردود المساعد، ولا يشمل الاستدلال الداخلي أو بيانات الأدوات المخفية. يرتبط الوصول بصاحب الحساب، ويمكنه فتح محادثاته وإعادة تسميتها أو حذفها."
        ],
        [
          "الاحتفاظ والحذف",
          "تبقى المحادثات التي تحفظها حتى تحذفها. حذف محادثة من حسابك يحذف سجلها ورسائلها المرتبطة من قاعدة بيانات التطبيق. هذا لا يعني حذف النسخ الاحتياطية فورًا أو تغيير مدد الاحتفاظ لدى مزودي المعالجة. للاستفسار عن الحساب أو البيانات، راسل adham@agynexa.si دون إرسال كلمات مرور أو مفاتيح."
        ],
        [
          "معالجة النموذج والمراجع",
          "Groq مزود معالجة نماذج المساعد. تعتمد شروط المعالجة والاحتفاظ لديه على الخطة والإعدادات والعقد؛ لا نقدم وعدًا عامًا بعدم التدريب أو الاحتفاظ. يتصل جلب المراجع التقنية بمواقع رسمية محددة، ولا يمنح وصولًا إلى مصادر مؤسستك الخاصة."
        ],
        [
          "الاستضافة وبيانات الاستخدام",
          "يستضيف Vercel الموقع وقد يعالج بيانات الاتصال الفنية اللازمة لتقديم الخدمة. توجد حزمة Vercel Analytics في الموقع؛ عدم حفظ الموجز أو محادثة الضيف في قاعدة بيانات التطبيق لا يعني غياب بيانات استخدام تقنية."
        ],
        [
          "حدود الاستخدام وسجل التشغيل",
          "يحفظ Supabase بصمة HMAC لعنوان الاتصال ووقت الطلب وحالته وأدوار النماذج واستهلاك الرموز وقرارات سياسة الأدوات وتوقيت مراحل الطلب لمنع الإساءة. لا يتضمن هذا السجل نص الطلب أو الرد أو محتوى المراجع، وهو منفصل عن المحادثات التي تختار حفظها. تنظف سجلات أقدم من 48 ساعة عند حجز طلب جديد؛ لا يوجد حذف مجدول يضمن موعدًا أقصى للاحتفاظ."
        ],
        [
          "قبل معالجة بيانات المؤسسة",
          "يتطلب المشروع المتصل ببيانات المؤسسة تحديد الغرض والمصادر والصلاحيات والموردين ومواقع المعالجة ومدد الاحتفاظ والحذف والمسؤوليات في اتفاق مستقل. لا يقدم هذا الإشعار ضمانًا عامًا بإقامة البيانات في بلد معين أو شهادة امتثال. بيانات الجهة القانونية المسؤولة وتفاصيل معالجة المشروع تُحسم قبل استقبال بيانات مؤسسية."
        ]
      ]
    },
    "en": {
      "eyebrow": "Data during use",
      "title": "Privacy and data use",
      "intro": "This notice distinguishes the local brief, assistant processing, your account and conversations you choose to save. Use fictional data when exploring the assistant. Do not share secrets or customer data.",
      "notice": "Account saving is optional. Processing a message to generate a response is different from adding it to conversation history.",
      "cards": [
        [
          "Local project brief",
          "Project brief answers stay in the browser page’s memory. The page does not send the brief to a server or team. You can download it or open an email draft and review it before sending it yourself. Closing or clearing the page removes its local state."
        ],
        [
          "Conversation without saving",
          "The active conversation is held in tab memory. Your message and relevant context are sent to the Vercel server and then Groq to generate a response, whether you are a guest or signed in. Holding a conversation in the tab does not mean the model provider does not process the message."
        ],
        [
          "Account and session",
          "Supabase manages authentication data, including your email address, password and session. The account verifies your identity and provides access to your private history. Creating an account does not grant access to an organization’s systems or tools."
        ],
        [
          "Conversations you choose to save",
          "A conversation enters your account history when you choose to save it after signing in. Signing in does not automatically upload a guest conversation. Saved content includes visible user and assistant text, excluding internal reasoning and hidden tool payloads. Access is tied to the account owner, who can reopen, rename or delete their conversations."
        ],
        [
          "Retention and deletion",
          "Saved conversations remain until you delete them. Deleting a conversation from your account removes its record and related messages from the application database. This does not promise immediate backup removal or change processing providers’ retention periods. For account or data questions, email adham@agynexa.si without passwords or keys."
        ],
        [
          "Model and reference processing",
          "Groq processes assistant model requests. Its processing and retention terms depend on the plan, settings and contract; no universal no-training or no-retention promise is made. Technical reference retrieval connects to selected official sites and does not provide access to your organization’s private sources."
        ],
        [
          "Hosting and technical usage data",
          "Vercel hosts the site and may process technical connection data needed to provide it. Vercel Analytics is included. The absence of a saved brief or guest conversation in the application database does not imply an absence of technical usage data."
        ],
        [
          "Usage limits and execution records",
          "To prevent abuse, Supabase stores an HMAC fingerprint of the connection address, request time and status, model roles, token usage, tool-policy decisions and request-stage timing. These records exclude prompt, response and reference text and are separate from conversations you choose to save. Records older than 48 hours are cleaned when a new request is reserved; there is no scheduled deletion guaranteeing a maximum retention deadline."
        ],
        [
          "Before processing enterprise data",
          "A connected project requires an agreed purpose, sources, permissions, providers, processing locations, retention, deletion and responsibilities. This notice does not provide a universal in-country residency guarantee or compliance certification. Legal-controller details and project-specific processing arrangements must be established before enterprise data is accepted."
        ]
      ]
    }
  },
  "terms": {
    "ar": {
      "eyebrow": "نطاق الاستخدام",
      "title": "شروط استخدام المنصة والمساعد",
      "intro": "يعرّف الموقع بخدمات AGYNEXA ويتيح مساعدًا عامًا وحسابًا اختياريًا للمحادثات المحفوظة. يخضع بناء الأنظمة المتصلة والتشغيل المؤسسي لنطاق واتفاق مستقلين.",
      "notice": "المقترحات والمسودات تحتاج مراجعة. لا توفر هذه التجربة أدوات دفع أو شراء أو إرسال بريد إلى أطراف خارجية.",
      "cards": [
        [
          "استخدام المساعد",
          "استخدم بيانات افتراضية ومعلومات تملك صلاحية مشاركتها. لا تدخل أسرارًا أو بيانات عملاء أو مفاتيح وصول، ولا تحاول الوصول إلى حساب أو بيانات تخص غيرك أو تعطيل الخدمة."
        ],
        [
          "المخرجات والمراجعة",
          "قد تكون الإجابة ناقصة أو غير دقيقة. راجع المعلومات والمصادر والافتراضات قبل الاعتماد عليها. المخرجات ليست قرارًا ماليًا أو قانونيًا أو تفويضًا بالشراء أو تنفيذ إجراء على أنظمة المؤسسة."
        ],
        [
          "الحساب والمحادثات",
          "الحساب اختياري، ويتيح حفظ المحادثات التي تختارها وفتحها وإعادة تسميتها وحذفها. حافظ على بيانات الدخول، وراجع محتوى المحادثة قبل حفظه. إنشاء الحساب لا يمنح صلاحيات مؤسسة أو اتصالًا بأدواتها. يوضح [إشعار الخصوصية](/privacy) معالجة البيانات والاحتفاظ والحذف."
        ],
        [
          "الموجز والتواصل",
          "إعداد الموجز أو تنزيله لا يعني وصول طلب إلى AGYNEXA. يفتح رابط البريد مسودة تراجعها وترسلها بنفسك. تبدأ مناقشة المشروع بعد مشاركة وصفه، ولا يحل محتوى الموقع أو المحادثة محل اتفاق عمل."
        ],
        [
          "اتفاق المشروع",
          "تُحدد التسليمات والتكاليف والملكية والترخيص ومعالجة البيانات والصلاحيات ومعايير القبول والدعم والمسؤوليات في اتفاق مستقل قبل بدء العمل المدفوع. يحتاج التوسع في البيانات أو التكاملات أو الإجراءات إلى مراجعة النطاق."
        ],
        [
          "الحدود الفنية",
          "قد تتأثر الخدمة بتوفر المزودين وحدود الاستخدام. لا يُفترض وجود تكامل أو تنفيذ إجراء أو منع تكرار أثر خارجي قبل تصميم هذه القدرات والتحقق منها على النظام المتصل. تُراجع المتطلبات القانونية والتشغيلية الخاصة بالمشروع قبل إتاحته."
        ]
      ]
    },
    "en": {
      "eyebrow": "Scope of use",
      "title": "Platform and assistant terms",
      "intro": "The site introduces AGYNEXA’s services and provides a public assistant with an optional account for saved conversations. Connected systems and enterprise operation require a separate scope and agreement.",
      "notice": "Proposals and drafts need review. This experience does not provide payment, purchasing or external email-sending tools.",
      "cards": [
        [
          "Using the assistant",
          "Use fictional data and information you are authorized to share. Do not enter secrets, customer data or access keys, attempt to access another person’s account or data, or disrupt the service."
        ],
        [
          "Outputs and review",
          "Responses may be incomplete or inaccurate. Review information, sources and assumptions before relying on them. Outputs are not financial or legal decisions, purchase authorization or permission to act in organizational systems."
        ],
        [
          "Accounts and conversations",
          "An account is optional and lets you save conversations you choose, reopen, rename and delete them. Protect your credentials and review conversation content before saving. Creating an account does not provide enterprise permissions or tool connections. The [privacy notice](/privacy) explains processing, retention and deletion."
        ],
        [
          "Briefs and contact",
          "Preparing or downloading a brief does not submit a request to AGYNEXA. An email link opens a draft for you to review and send yourself. Project discussion begins after you share a description; website and conversation content do not replace a work agreement."
        ],
        [
          "Project agreement",
          "Deliverables, cost, ownership, licensing, data processing, permissions, acceptance criteria, support and responsibilities are set in a separate agreement before paid work begins. Expanded data, connections or actions require a scope review."
        ],
        [
          "Technical boundaries",
          "Provider availability and usage limits may affect service. Do not assume an integration, an executed action or duplicate-action prevention before those capabilities are designed and verified on the connected system. Project-specific legal and operating requirements are reviewed before access is enabled."
        ]
      ]
    }
  }
} as const;
export type PublicPageKey = keyof typeof publicPages;
