export const agentWorkspaceCopy = {
  ar: {
    label: "مساحة الوكيل", newChat: "محادثة جديدة", home: "العودة للمنصة", title: "ما العملية التي تريد تحسينها؟",
    intro: "ابدأ بالمشكلة، لا بالتقنية. يساعدك Agentnexos على فهم العملية، تصميم خطواتها، ومراجعة البيانات والصلاحيات اللازمة لتنفيذها.",
    badge: "مساعد تصميم العمليات", placeholder: "صف العملية، أين تتعطل، وما النتيجة التي تحتاجها…", send: "إرسال الطلب", stop: "إيقاف", download: "تحميل المحادثة", copy: "نسخ الرد", copied: "تم النسخ", retry: "إعادة المحاولة",
    privacy: "استخدم بيانات افتراضية فقط. عند الإرسال تُعالج المحادثة لدى Groq. لا ترسل أسرارًا أو بيانات عملاء، ولا تُنفذ كتابة في أنظمة مؤسستك.",
    checking: "فحص الاتصال…", checkConnection: "إعادة فحص الاتصال", copyError: "تعذر النسخ. يمكنك تحديد النص ونسخه يدويًا.", cancelled: "تم إيقاف الطلب. قد تكون الإجابة الظاهرة غير مكتملة.", contextNotice: "يرسل آخر جزء مناسب من المحادثة؛ أعد ذكر القرارات المهمة عند الحاجة.", preparing: "يجري إعداد اتصال التشغيل", offline: "الخدمة غير متاحة حاليًا. جهّز وصف العملية، ثم أعد فحص الاتصال قبل الإرسال.", ready: "تجربة حية محدودة · قراءة وتخطيط فقط", error: "تعذر إكمال الطلب. لم يتم تنفيذ أي إجراء خارجي. جرّب لاحقًا أو عدّل طلبك.",
    team: "مراحل معالجة الطلب", roles: ["فهم العملية", "تصميم الخطوات", "مراجعة النتيجة"], roleDescriptions: ["يحدد الهدف والمعلومات الناقصة", "يربط البيانات والقرارات والأدوات", "يراجع الافتراضات وحدود التنفيذ"],
    capability: "ما يمكنك استكشافه", tools: ["تحديد متطلبات الربط", "حساب عبء العمل من مدخلاتك", "قراءة مراجع تقنية محددة"], boundary: "التنفيذ المؤسسي", boundaryText: "البريد وCRM وERP وتنفيذ الكود غير متصلة في هذه التجربة. تفعيلها يحتاج هوية موثقة وصلاحيات وموافقات محفوظة.",
    suggestions: [
      { title: "رتّب مراجعة المشتريات", detail: "طلب → بيانات ناقصة → مراجعة مسؤول", prompt: "صمم سير عمل لمراجعة طلبات المشتريات في شركة مصرية. حدد المدخلات والبيانات الناقصة وصلاحيات الموظف ومتى يلزم اعتماد المسؤول، دون تنفيذ أي شراء." },
      { title: "نظّم متابعة المستحقات", detail: "فواتير → استثناءات → مسودة متابعة", prompt: "نستقبل 300 فاتورة شهريًا وتستغرق المراجعة اليدوية 12 دقيقة لكل فاتورة. احسب عبء العمل الحالي ثم صمم خطة متابعة المستحقات مع مراجعة بشرية قبل إرسال الرسائل." },
      { title: "ابنِ مساعد معرفة داخليًا", detail: "سؤال → مصدر موثوق → تصعيد", prompt: "نريد مساعدًا عربيًا وإنجليزيًا يجيب عن أسئلة الموظفين من سياسات الشركة. ضع خطة للمصادر والصلاحيات والتعامل مع الإجابة غير المؤكدة ومقاييس الاختبار." },
      { title: "ابدأ من أنظمتك الحالية", detail: "أنظمة → صلاحيات → خطة تكامل", prompt: "لدينا CRM وجداول Excel وبريد عمل. كيف نحول متابعة طلبات العملاء إلى سير عمل وكيل تدريجي؟ اذكر متطلبات الربط وحدود القراءة والكتابة والموافقات وخطة التجربة." },
    ],
  },
  en: {
    label: "Agent workspace", newChat: "New conversation", home: "Back to the platform", title: "Which workflow would you improve?",
    intro: "Start with the problem, not the technology. Agentnexos helps you understand the process, design its steps, and review the data and permissions needed to implement it.",
    badge: "Workflow design assistant", placeholder: "Describe the process, where it stalls, and the outcome you need…", send: "Send request", stop: "Stop", download: "Download conversation", copy: "Copy response", copied: "Copied", retry: "Try again",
    privacy: "Use fictional data only. Sending processes the conversation with Groq. Do not share secrets or customer data; no writes to your organization's systems are performed.",
    checking: "Checking connection…", checkConnection: "Check connection again", copyError: "Copy failed. Select the response and copy it manually.", cancelled: "Request stopped. The visible response may be incomplete.", contextNotice: "Only recent context is sent; restate important decisions when needed.", preparing: "Checking the runtime connection", offline: "The service is currently unavailable. Prepare your workflow description, then check the connection before sending.", ready: "Limited live preview · read and plan only", error: "The request could not complete. No external action was executed. Try later or revise your request.",
    team: "Request stages", roles: ["Process analysis", "Workflow design", "Result review"], roleDescriptions: ["Defines the goal and missing information", "Connects data, decisions, and tools", "Checks assumptions and execution boundaries"],
    capability: "What you can explore", tools: ["Integration requirements", "Baseline workload calculations", "Selected technical references"], boundary: "Enterprise execution", boundaryText: "Email, CRM, ERP, and code execution are not connected in this preview. They require verified identity, scoped permissions, and persisted approvals.",
    suggestions: [
      { title: "Organize purchase reviews", detail: "Request → missing data → owner review", prompt: "Design a purchase-request review workflow for an Egyptian company. Define inputs, missing information, employee permissions, and when owner approval is needed. Do not execute any purchase." },
      { title: "Structure receivables follow-up", detail: "Invoices → exceptions → draft follow-up", prompt: "We receive 300 invoices per month and manual review takes 12 minutes per invoice. Calculate the current workload, then design a receivables follow-up workflow with human review before messages are sent." },
      { title: "Build an internal knowledge assistant", detail: "Question → trusted source → escalation", prompt: "We need an Arabic and English assistant answering employee questions from company policies. Plan sources, permissions, uncertain-answer handling, and evaluation criteria." },
      { title: "Start with your existing systems", detail: "Systems → permissions → integration plan", prompt: "We use a CRM, Excel sheets, and business email. How can customer-request follow-up become a gradual agent workflow? Include integration requirements, read/write boundaries, approvals, and a pilot plan." },
    ],
  },
} as const;
