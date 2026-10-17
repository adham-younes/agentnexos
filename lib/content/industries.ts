import type { Locale } from '@/lib/i18n/config';

export const industrySlugs = [
    'logistics', 'oil-gas', 'foreign-trade', 'energy', 'trade-distribution', 'professional-services',
] as const;
export type IndustrySlug = typeof industrySlugs[number];

type IndustryScenario = {
    title: string;
    situation: string;
    output: string;
    decision: string;
};
export type IndustryContent = {
    name: string;
    title: string;
    intro: string;
    summary: string;
    focus: string;
    deliverable: string;
    inputs: readonly string[];
    scenarios: readonly IndustryScenario[];
    acceptance: readonly string[];
    responsibility: string;
    boundary: string;
    related: { path: string; title: string; body: string };
};
export type Industry = IndustryContent & { slug: IndustrySlug };

const content = {
    en: {
        logistics: {
            name: 'Logistics and supply chain',
            title: 'See the exception. Prepare the next move.',
            intro: 'Shipment updates, delivery commitments and supporting documents rarely arrive together. We design a reviewable path from scattered updates to a clear operational handover.',
            summary: 'Bring shipment updates, missing documents and follow-up responsibilities into one reviewable view.',
            focus: 'Shipment visibility · exception review · operational handover',
            deliverable: 'A shipment brief and follow-up list for the operations owner.',
            inputs: ['A small, anonymized set of shipment records and status updates.', 'Your milestone definitions, delivery commitments and exception rules.', 'A document checklist and the roles allowed to see each source.', 'The escalation owner and the point at which a person must decide.'],
            scenarios: [
                { title: 'A shipment has several versions of the truth', situation: 'Carrier updates, internal notes and the delivery plan disagree about a milestone.', output: 'A dated status summary with the source of each update and the conflict left visible.', decision: 'The operations owner confirms the status and authorizes any change to the delivery plan.' },
                { title: 'A handover is missing a document', situation: 'A delivery file is moving between teams before its required documents are complete.', output: 'A missing-document checklist assigned to the relevant role, with a proposed follow-up.', decision: 'The responsible team checks the original documents before releasing the handover.' },
                { title: 'An exception needs a clear escalation', situation: 'A delay or quantity discrepancy needs attention, but its next owner is unclear.', output: 'An exception brief linking the affected shipment, unresolved question and proposed next step.', decision: 'A person chooses the response and approves communication or an external action.' },
            ],
            acceptance: ['Every reported milestone points to its source and update time.', 'Missing information stays explicitly unknown rather than becoming an estimated status.', 'Each exception identifies the person responsible for the next decision.'],
            responsibility: 'Operations retains control over dispatch, routing, commitments and external communication.',
            boundary: 'Any connection to a transport, warehouse or carrier system requires an agreed project scope, approved access and a verified data contract. These examples do not operate a shipment or change a live record.',
            related: { path: '/solutions/customer-operations', title: 'Customer operations', body: 'Connect an operational exception to a reviewed customer response, without losing its context.' },
        },
        'oil-gas': {
            name: 'Oil and gas',
            title: 'Make operational reviews easier to trace.',
            intro: 'Maintenance requests and supplier files carry technical detail, document revisions and approval responsibilities. We design the review process around those responsibilities, with clear evidence for the people who decide.',
            summary: 'Organize maintenance requests and supplier documents before technical and commercial review.',
            focus: 'Maintenance files · supplier documentation · approval handoffs',
            deliverable: 'A review file showing missing evidence, open questions and the approval owner.',
            inputs: ['An anonymized maintenance request or supplier submission.', 'The approved document register, revision rules and completeness checklist.', 'Read access boundaries for technical and commercial information.', 'The named technical, procurement and safety decision owners.'],
            scenarios: [
                { title: 'A maintenance request is incomplete', situation: 'A request arrives without the asset reference, supporting evidence or required review information.', output: 'A completeness review that separates supplied facts from missing fields and questions.', decision: 'The maintenance lead validates the requirement and determines urgency and work authorization.' },
                { title: 'Supplier documents need reconciliation', situation: 'A submission includes several revisions and unanswered technical clarifications.', output: 'A document register with revision references, missing items and questions for the supplier.', decision: 'The technical reviewer accepts the documents; procurement controls any commercial commitment.' },
                { title: 'An approval file crosses several teams', situation: 'An open item moves between engineering, procurement and site operations.', output: 'A handover brief showing the latest approved reference and the remaining decision.', decision: 'The assigned approver confirms acceptance before a purchase, work order or release.' },
            ],
            acceptance: ['Document revisions and source references remain visible.', 'Technical findings, commercial questions and approval decisions are kept distinct.', 'No item is marked approved merely because its checklist is complete.'],
            responsibility: 'Qualified people retain engineering, safety, maintenance and procurement decisions.',
            boundary: 'This is a design scope for document and workflow review. It is not plant control, safety advice, predictive-maintenance assurance or authority to issue a permit or work order.',
            related: { path: '/solutions/procurement', title: 'Procurement workflows', body: 'Prepare the requirements, supplier evidence and approval path before any purchasing action.' },
        },
        'foreign-trade': {
            name: 'Foreign trade',
            title: 'A clearer file before a shipment moves.',
            intro: 'A small mismatch between an invoice, packing list and shipment record can create a long chain of questions. We design document review that makes differences visible and prepares the file for a qualified specialist.',
            summary: 'Compare shipment documents and gather discrepancies before specialist review.',
            focus: 'Trade documents · cross-document checks · specialist review',
            deliverable: 'A discrepancy list and document pack for the responsible trade specialist.',
            inputs: ['Anonymized invoice, packing-list and shipment examples.', 'The exact fields to compare, including units, currencies and identifiers.', 'The document requirements supplied by your trade or customs specialist.', 'The responsible reviewer and the limits of any external submission.'],
            scenarios: [
                { title: 'Invoice and packing-list details differ', situation: 'Quantities, item references or weights are written differently across the file.', output: 'A field-by-field discrepancy list that links each value to its original document.', decision: 'The trade specialist decides whether a correction or clarification is needed.' },
                { title: 'A shipment file has an open requirement', situation: 'A required certificate or supporting document is missing or has an unclear version.', output: 'A document checklist with the missing item, its source and the role expected to supply it.', decision: 'The specialist confirms the applicable requirement and accepts the completed file.' },
                { title: 'Several parties need the same clarification', situation: 'A supplier, freight partner and internal team are reviewing different versions of an issue.', output: 'A shared review brief containing the open question, supporting references and proposed response.', decision: 'An authorized person approves the response and any submission to an outside party.' },
            ],
            acceptance: ['Compared fields retain their original units, currencies and document references.', 'Unclear text is flagged for inspection instead of silently corrected.', 'The output distinguishes a document discrepancy from a legal or customs determination.'],
            responsibility: 'Your trade or customs specialist confirms requirements, classification, declarations and release decisions.',
            boundary: 'The workflow does not provide a legal determination, calculate an authoritative customs liability or submit a declaration. Applicable rules and access must be agreed for each project and jurisdiction.',
            related: { path: '/solutions/knowledge', title: 'Source-linked internal knowledge', body: 'Help reviewers find the approved procedure and document requirement behind a question.' },
        },
        energy: {
            name: 'Energy',
            title: 'Keep project information ready for a decision.',
            intro: 'Energy projects depend on coordinated documentation, supply decisions and follow-up across specialist teams. We design information workflows that clarify the current position and the next decision without taking over engineering judgment.',
            summary: 'Bring project documents, supply requests and outstanding decisions into a clear project brief.',
            focus: 'Project documentation · supply review · decision follow-up',
            deliverable: 'A project-status brief with the items requiring a decision or further evidence.',
            inputs: ['An anonymized project register and representative document set.', 'Your milestone definitions, document owners and accepted revision rules.', 'A sample supply request with its technical and commercial requirements.', 'The review roles and the boundary between information and operational control.'],
            scenarios: [
                { title: 'A project update lacks its supporting record', situation: 'A milestone appears in a report while its required document is missing or unconfirmed.', output: 'A status brief pairing each reported milestone with its evidence and open questions.', decision: 'The project owner confirms the milestone and chooses the next follow-up.' },
                { title: 'A supply request needs cross-team review', situation: 'A request combines equipment requirements, delivery timing and technical clarifications.', output: 'A review pack grouping requirements, missing evidence and proposed questions.', decision: 'Engineering accepts the specification and procurement authorizes commercial steps.' },
                { title: 'A decision remains buried in correspondence', situation: 'Teams need to distinguish an agreed change from an unanswered suggestion.', output: 'A decision log that separates confirmed instructions, proposals and unresolved items.', decision: 'The designated owner confirms a change before it affects schedule, scope or operation.' },
            ],
            acceptance: ['Reported project state can be traced to an approved source.', 'A proposal never appears as an accepted change.', 'Each unresolved item carries a clear review responsibility.'],
            responsibility: 'Engineering, project and operational owners retain technical acceptance, scheduling and control decisions.',
            boundary: 'The scope covers information and document workflows. It does not control generation assets, optimize grid dispatch, certify equipment or make autonomous safety decisions.',
            related: { path: '/solutions/procurement', title: 'Procurement workflows', body: 'Turn supply requests into a reviewable set of requirements and approval responsibilities.' },
        },
        'trade-distribution': {
            name: 'Trade and distribution',
            title: 'Connect the order, the delivery and the follow-up.',
            intro: 'Purchase requests, availability updates and invoices often sit in separate conversations. We design a path that brings the relevant records together and gives the responsible person a clear next step.',
            summary: 'Review purchasing, fulfillment and invoice follow-up with a visible decision owner.',
            focus: 'Order review · supply exceptions · invoice follow-up',
            deliverable: 'A prioritized follow-up list and a proposed next step for the responsible owner.',
            inputs: ['Anonymized order, fulfillment and invoice examples.', 'Your matching rules, units, payment terms and exception definitions.', 'The roles allowed to inspect pricing, stock and customer information.', 'The owners of purchasing, delivery commitments and collection decisions.'],
            scenarios: [
                { title: 'A purchase request needs clarification', situation: 'An item, quantity or required date is missing before a supplier request can be prepared.', output: 'A completeness check and a short clarification draft for review.', decision: 'The buyer confirms the request and approves any supplier contact or order.' },
                { title: 'The order and fulfillment record disagree', situation: 'A partial delivery, changed date or quantity discrepancy needs a coordinated response.', output: 'An exception list linking the order, supply update and unresolved delivery question.', decision: 'The operations owner approves the allocation, promise or escalation.' },
                { title: 'An invoice needs a considered follow-up', situation: 'A payment query may depend on a delivery issue or an unresolved document.', output: 'An invoice follow-up brief with the relevant references and a proposed message.', decision: 'Finance verifies the account and authorizes contact, terms or any adjustment.' },
            ],
            acceptance: ['Orders, deliveries and invoices are matched using agreed identifiers.', 'Disputed items remain visible and are not treated as undisputed debt.', 'A suggested message is clearly separated from a message that has been sent.'],
            responsibility: 'Your teams retain pricing, stock allocation, payment, credit and customer-commitment decisions.',
            boundary: 'No inventory, ERP, payment or messaging connection is active by virtue of this example. A custom project defines access, matching rules and approval requirements before live actions.',
            related: { path: '/solutions/receivables', title: 'Receivables follow-up', body: 'Prepare a source-linked follow-up while keeping disputes and financial decisions under review.' },
        },
        'professional-services': {
            name: 'Professional services',
            title: 'Turn scattered knowledge into a reviewed first draft.',
            intro: 'Professional work depends on the right procedure, the right context and a person willing to stand behind the result. We design assistance that prepares a useful draft and makes its references and open questions easy to inspect.',
            summary: 'Find approved knowledge and prepare source-linked project briefs or response drafts.',
            focus: 'Internal knowledge · project briefs · reviewed responses',
            deliverable: 'A source-linked draft with assumptions and points requiring confirmation.',
            inputs: ['A small set of approved procedures, templates and example briefs.', 'Source owners, publication dates and document access rules.', 'The intended audience, required structure and confidentiality limits.', 'The reviewer responsible for accepting the finished work.'],
            scenarios: [
                { title: 'A colleague needs the approved procedure', situation: 'Several documents mention the same topic, but their scope or status differs.', output: 'A concise answer linked to the relevant approved sources, with conflicting guidance identified.', decision: 'The process owner confirms the applicable procedure when the sources do not settle it.' },
                { title: 'A project needs a clear starting brief', situation: 'A request arrives as notes with incomplete scope, responsibilities or acceptance criteria.', output: 'A structured draft separating confirmed requirements, assumptions and questions.', decision: 'The engagement owner agrees the scope, deliverables and commercial commitment.' },
                { title: 'A client response needs a careful first draft', situation: 'A team needs to combine project context with permitted internal knowledge.', output: 'A response draft with supporting references and details that need human confirmation.', decision: 'An authorized reviewer checks confidentiality and substance before sending.' },
            ],
            acceptance: ['Every factual recommendation can be traced to permitted source material.', 'Unknowns and conflicting guidance remain explicit.', 'The draft is marked for review and does not impersonate professional approval.'],
            responsibility: 'Qualified reviewers retain professional judgment, client commitments and final publication decisions.',
            boundary: 'The assistant does not replace legal, financial, engineering or other regulated professional judgment. Client records and restricted documents require approved access within a separately scoped project.',
            related: { path: '/solutions/knowledge', title: 'Source-linked internal knowledge', body: 'Build a useful answer around approved sources, permissions and a clear path for unresolved questions.' },
        },
    },
    ar: {
        logistics: {
            name: 'اللوجستيات وسلاسل الإمداد',
            title: 'استثناء واضح. وخطوة تالية يعرفها المسؤول.',
            intro: 'لا تصل تحديثات الشحن والتزامات التسليم والمستندات الداعمة في الوقت نفسه. نصمم مسارًا يجمع المعلومات المتفرقة في موجز يمكن مراجعته وتسليمه لمسؤول العمليات.',
            summary: 'تجميع تحديثات الشحن والمستندات الناقصة ومسؤوليات المتابعة في رؤية قابلة للمراجعة.',
            focus: 'حالة الشحنات · مراجعة الاستثناءات · تسليم العمل',
            deliverable: 'موجز شحنة وقائمة متابعة يراجعها مسؤول العمليات.',
            inputs: ['عينة صغيرة مجهّلة من سجلات الشحن وتحديثات الحالة.', 'تعريف مراحل الشحنة والتزامات التسليم وقواعد الاستثناءات.', 'قائمة المستندات المطلوبة وصلاحيات الاطلاع على كل مصدر.', 'مسؤول التصعيد والنقطة التي تتطلب قرارًا بشريًا.'],
            scenarios: [
                { title: 'للشحنة أكثر من رواية', situation: 'تختلف تحديثات الناقل والملاحظات الداخلية وخطة التسليم بشأن إحدى المراحل.', output: 'ملخص حالة مؤرخ يوضح مصدر كل تحديث ويُبقي التعارض ظاهرًا.', decision: 'يؤكد مسؤول العمليات الحالة ويعتمد أي تعديل لخطة التسليم.' },
                { title: 'ملف التسليم ينقصه مستند', situation: 'ينتقل ملف بين الفرق قبل اكتمال المستندات اللازمة.', output: 'قائمة نواقص مرتبطة بالمسؤول المناسب، مع اقتراح للمتابعة.', decision: 'يراجع الفريق المختص المستندات الأصلية قبل اعتماد التسليم.' },
                { title: 'استثناء ينتظر جهة تصعيد واضحة', situation: 'يحتاج تأخير أو اختلاف في الكمية إلى متابعة، لكن المسؤول عن الخطوة التالية غير محدد.', output: 'موجز استثناء يربط الشحنة بالسؤال المفتوح والخطوة المقترحة.', decision: 'يختار المسؤول الاستجابة ويعتمد أي تواصل أو إجراء خارجي.' },
            ],
            acceptance: ['كل مرحلة مذكورة مرتبطة بمصدرها ووقت تحديثها.', 'تظل المعلومة الناقصة غير معروفة بدل تحويلها إلى حالة تقديرية.', 'لكل استثناء مسؤول واضح عن القرار التالي.'],
            responsibility: 'تبقى قرارات الإرسال والمسارات والالتزامات والتواصل الخارجي بيد فريق العمليات.',
            boundary: 'يتطلب ربط أنظمة النقل أو المخازن أو الناقلين نطاق مشروع متفقًا عليه ووصولًا معتمدًا وعقد بيانات متحققًا منه. لا تشغّل هذه الأمثلة شحنة ولا تعدّل سجلًا حيًا.',
            related: { path: '/solutions/customer-operations', title: 'عمليات العملاء', body: 'اربط الاستثناء التشغيلي بمسودة رد يراجعها المسؤول مع الاحتفاظ بسياقه.' },
        },
        'oil-gas': {
            name: 'البترول والغاز',
            title: 'مراجعة تشغيلية تستند إلى أثر واضح.',
            intro: 'تحمل طلبات الصيانة وملفات الموردين تفاصيل فنية وإصدارات متعددة ومسؤوليات اعتماد. نصمم مسار المراجعة حول هذه المسؤوليات، بمراجع واضحة لمن يتخذ القرار.',
            summary: 'تنظيم طلبات الصيانة ومستندات الموردين قبل المراجعة الفنية والتجارية.',
            focus: 'ملفات الصيانة · مستندات الموردين · مسارات الاعتماد',
            deliverable: 'ملف مراجعة يبين النواقص والأسئلة المفتوحة والمسؤول عن الاعتماد.',
            inputs: ['طلب صيانة أو ملف مورد بعد إزالة البيانات الحساسة.', 'سجل المستندات المعتمد وقواعد الإصدارات وقائمة الاكتمال.', 'حدود الاطلاع على المعلومات الفنية والتجارية.', 'المسؤولون عن القرارات الفنية والمشتريات والسلامة.'],
            scenarios: [
                { title: 'طلب صيانة غير مكتمل', situation: 'يصل الطلب دون مرجع الأصل أو الأدلة الداعمة أو معلومات المراجعة المطلوبة.', output: 'مراجعة اكتمال تفصل الحقائق المتاحة عن الحقول الناقصة والأسئلة.', decision: 'يتحقق مسؤول الصيانة من الاحتياج ويحدد الأولوية وتصريح العمل.' },
                { title: 'مستندات مورد تحتاج إلى مطابقة', situation: 'يضم الملف إصدارات متعددة واستفسارات فنية لم تُحسم.', output: 'سجل مستندات يوضح الإصدارات والنواقص والأسئلة المطلوب توجيهها للمورد.', decision: 'يعتمد المراجع الفني المستندات وتبقى الالتزامات التجارية بيد المشتريات.' },
                { title: 'ملف اعتماد ينتقل بين فرق متعددة', situation: 'يتنقل بند مفتوح بين الهندسة والمشتريات وعمليات الموقع.', output: 'موجز تسليم يوضح أحدث مرجع معتمد والقرار المتبقي.', decision: 'يؤكد صاحب الصلاحية القبول قبل أي شراء أو أمر عمل أو إفراج.' },
            ],
            acceptance: ['تظل إصدارات المستندات ومراجعها ظاهرة.', 'تُفصل الملاحظات الفنية عن الأسئلة التجارية وقرارات الاعتماد.', 'لا يُعد البند معتمدًا لمجرد اكتمال قائمة مراجعته.'],
            responsibility: 'تبقى قرارات الهندسة والسلامة والصيانة والمشتريات بيد المختصين المخولين.',
            boundary: 'النطاق المقترح لمراجعة المستندات وسير العمل؛ لا يشمل التحكم بالمنشآت أو إرشاد السلامة أو ضمانات الصيانة التنبؤية أو إصدار تصاريح وأوامر عمل.',
            related: { path: '/solutions/procurement', title: 'مسارات المشتريات', body: 'جهّز المتطلبات وأدلة المورد ومسار الاعتماد قبل أي إجراء شراء.' },
        },
        'foreign-trade': {
            name: 'التجارة الخارجية',
            title: 'ملف أوضح قبل أن تتحرك الشحنة.',
            intro: 'قد يفتح اختلاف صغير بين الفاتورة وقائمة التعبئة وسجل الشحنة سلسلة طويلة من الأسئلة. نصمم مراجعة للمستندات تُظهر الاختلافات وتجهز الملف للمختص المسؤول.',
            summary: 'مقارنة مستندات الشحنة وتجميع الاختلافات قبل مراجعة المختص.',
            focus: 'مستندات التجارة · مطابقة البيانات · مراجعة المختص',
            deliverable: 'قائمة اختلافات وملف مستندات يراجعه مختص التجارة الخارجية.',
            inputs: ['أمثلة مجهّلة لفاتورة وقائمة تعبئة وبيانات شحنة.', 'الحقول المطلوب مقارنتها، بما فيها الوحدات والعملات والمعرّفات.', 'متطلبات المستندات التي يحددها مختص التجارة أو الجمارك لديك.', 'المراجع المسؤول وحدود أي تقديم لجهة خارجية.'],
            scenarios: [
                { title: 'اختلاف بين الفاتورة وقائمة التعبئة', situation: 'تظهر الكميات أو مراجع الأصناف أو الأوزان بصيغ مختلفة داخل الملف.', output: 'قائمة اختلافات حقلًا بحقل، تربط كل قيمة بمستندها الأصلي.', decision: 'يحدد المختص ما يحتاج إلى تصحيح أو استيضاح.' },
                { title: 'متطلب مفتوح في ملف الشحنة', situation: 'تنقص شهادة أو وثيقة داعمة، أو لا يتضح الإصدار المطلوب.', output: 'قائمة مستندات تبين الناقص ومصدره والجهة المسؤولة عن توفيره.', decision: 'يؤكد المختص المتطلب المنطبق ويقبل الملف بعد اكتماله.' },
                { title: 'استفسار واحد لدى أطراف متعددة', situation: 'يراجع المورد وشريك الشحن والفريق الداخلي نسخًا مختلفة من المسألة نفسها.', output: 'موجز مراجعة يجمع السؤال المفتوح ومراجعه ومسودة الرد المقترح.', decision: 'يعتمد شخص مخول الرد وأي تقديم إلى جهة خارجية.' },
            ],
            acceptance: ['تحتفظ المقارنة بالوحدات والعملات ومراجع المستندات الأصلية.', 'يُحال النص غير الواضح للفحص بدل تصحيحه ضمنيًا.', 'يفصل الناتج بين اختلاف المستندات والحكم القانوني أو الجمركي.'],
            responsibility: 'يؤكد مختص التجارة أو الجمارك المتطلبات والتصنيف والإقرارات وقرارات الإفراج.',
            boundary: 'لا يقدم المسار حكمًا قانونيًا أو تقديرًا جمركيًا معتمدًا ولا يودع إقرارًا. تُحدد القواعد المنطبقة والصلاحيات لكل مشروع وولاية مختصة.',
            related: { path: '/solutions/knowledge', title: 'المعرفة الداخلية المرتبطة بمصادرها', body: 'ساعد المراجع في الوصول إلى الإجراء المعتمد ومتطلب المستند الذي يستند إليه السؤال.' },
        },
        energy: {
            name: 'الطاقة',
            title: 'معلومات المشروع جاهزة لحظة القرار.',
            intro: 'تعتمد مشروعات الطاقة على تنسيق المستندات والتوريد والمتابعة بين فرق متخصصة. نصمم مسار معلومات يوضح الموقف الحالي والقرار التالي دون أن يحل محل الحكم الهندسي.',
            summary: 'تجميع مستندات المشروع وطلبات التوريد والقرارات المعلقة في موجز واضح.',
            focus: 'مستندات المشروعات · مراجعة التوريد · متابعة القرارات',
            deliverable: 'موجز حالة مشروع يبين البنود التي تحتاج قرارًا أو دليلًا إضافيًا.',
            inputs: ['سجل مشروع وعينة مستندات بعد إزالة البيانات الحساسة.', 'تعريف المراحل ومالكي المستندات وقواعد الإصدارات المعتمدة.', 'طلب توريد تمثيلي بمتطلباته الفنية والتجارية.', 'أدوار المراجعة والحد الفاصل بين المعلومات والتحكم التشغيلي.'],
            scenarios: [
                { title: 'تحديث مشروع دون مستنده الداعم', situation: 'تظهر مرحلة في التقرير بينما مستندها المطلوب مفقود أو غير مؤكد.', output: 'موجز حالة يربط كل مرحلة مذكورة بدليلها وأسئلتها المفتوحة.', decision: 'يؤكد مسؤول المشروع المرحلة ويحدد المتابعة التالية.' },
                { title: 'طلب توريد يحتاج مراجعة مشتركة', situation: 'يجمع الطلب مواصفات معدات وتوقيت تسليم واستفسارات فنية.', output: 'ملف مراجعة يجمع المتطلبات والأدلة الناقصة والأسئلة المقترحة.', decision: 'تعتمد الهندسة المواصفة وتجيز المشتريات الخطوات التجارية.' },
                { title: 'قرار مدفون في المراسلات', situation: 'تحتاج الفرق إلى تمييز التغيير المتفق عليه عن اقتراح لم يُحسم.', output: 'سجل قرارات يفصل التعليمات المؤكدة عن المقترحات والبنود المفتوحة.', decision: 'يؤكد المسؤول التغيير قبل أن يؤثر في الجدول أو النطاق أو التشغيل.' },
            ],
            acceptance: ['يمكن إرجاع حالة المشروع المعلنة إلى مصدر معتمد.', 'لا يظهر المقترح بوصفه تغييرًا مقبولًا.', 'لكل بند غير محسوم جهة مراجعة واضحة.'],
            responsibility: 'تبقى قرارات القبول الفني والجدولة والتحكم بيد مسؤولي الهندسة والمشروع والتشغيل.',
            boundary: 'يشمل النطاق مسارات المعلومات والمستندات؛ لا يتحكم بأصول التوليد أو توزيع أحمال الشبكة، ولا يعتمد المعدات أو يتخذ قرارات سلامة مستقلة.',
            related: { path: '/solutions/procurement', title: 'مسارات المشتريات', body: 'حوّل طلبات التوريد إلى متطلبات ومسؤوليات اعتماد يمكن مراجعتها.' },
        },
        'trade-distribution': {
            name: 'التجارة والتوزيع',
            title: 'اربط الطلب والتسليم والمتابعة.',
            intro: 'غالبًا ما تتوزع طلبات الشراء وتحديثات التوفر والفواتير بين محادثات منفصلة. نصمم مسارًا يجمع السجلات ذات الصلة ويضع أمام المسؤول خطوة تالية واضحة.',
            summary: 'مراجعة الشراء والتوريد ومتابعة الفواتير مع تحديد صاحب القرار.',
            focus: 'مراجعة الطلبات · استثناءات التوريد · متابعة الفواتير',
            deliverable: 'قائمة متابعة مرتبة وخطوة تالية مقترحة للمسؤول المختص.',
            inputs: ['أمثلة مجهّلة لطلبات وتوريدات وفواتير.', 'قواعد المطابقة والوحدات وشروط السداد وتعريف الاستثناءات.', 'صلاحيات الاطلاع على الأسعار والمخزون ومعلومات العملاء.', 'أصحاب قرارات الشراء والتزامات التسليم والتحصيل.'],
            scenarios: [
                { title: 'طلب شراء يحتاج إلى استيضاح', situation: 'ينقص الصنف أو الكمية أو الموعد المطلوب قبل تجهيز طلب المورد.', output: 'فحص اكتمال ومسودة استفسار قصيرة للمراجعة.', decision: 'يؤكد المشتري الطلب ويعتمد التواصل مع المورد أو إصدار الأمر.' },
                { title: 'تعارض بين الطلب وسجل التوريد', situation: 'تحتاج شحنة جزئية أو موعد متغير أو كمية مختلفة إلى استجابة منسقة.', output: 'قائمة استثناءات تربط الطلب بتحديث التوريد وسؤال التسليم المفتوح.', decision: 'يعتمد مسؤول العمليات التخصيص أو الوعد أو التصعيد.' },
                { title: 'فاتورة تحتاج متابعة مدروسة', situation: 'قد يرتبط استفسار السداد بمشكلة تسليم أو مستند لم يكتمل.', output: 'موجز متابعة فاتورة بمراجعها ومسودة رسالة مقترحة.', decision: 'تتحقق المالية من الحساب وتعتمد التواصل أو الشروط أو أي تسوية.' },
            ],
            acceptance: ['تُطابق الطلبات والتوريدات والفواتير بمعرّفات متفق عليها.', 'تبقى البنود المتنازع عليها ظاهرة ولا تُعامل كديون غير متنازع عليها.', 'تتميز الرسالة المقترحة بوضوح عن الرسالة المرسلة.'],
            responsibility: 'تحتفظ فرقك بقرارات التسعير وتخصيص المخزون والسداد والائتمان والتزامات العملاء.',
            boundary: 'لا يفعّل هذا المثال اتصالًا بالمخزون أو نظام تخطيط الموارد أو الدفع أو الرسائل. يحدد المشروع المخصص الوصول وقواعد المطابقة ومتطلبات الاعتماد قبل أي إجراء حي.',
            related: { path: '/solutions/receivables', title: 'متابعة المستحقات', body: 'جهّز متابعة مرتبطة بمصادرها مع إبقاء النزاعات والقرارات المالية للمراجعة.' },
        },
        'professional-services': {
            name: 'الخدمات المهنية',
            title: 'من معرفة متفرقة إلى مسودة تستحق المراجعة.',
            intro: 'يعتمد العمل المهني على الإجراء الصحيح والسياق المناسب وشخص مسؤول عن النتيجة. نصمم مساعدة تُعد مسودة مفيدة وتُظهر مراجعها وأسئلتها المفتوحة بوضوح.',
            summary: 'الوصول إلى المعرفة المعتمدة وتجهيز موجز مشروع أو مسودة رد مرتبط بمصادره.',
            focus: 'المعرفة الداخلية · موجزات المشروعات · مراجعة الردود',
            deliverable: 'مسودة مرتبطة بمصادرها، مع افتراضات ونقاط تحتاج تأكيدًا.',
            inputs: ['إجراءات وقوالب معتمدة وعينة من موجزات المشروعات.', 'مالكو المصادر وتواريخها وقواعد الاطلاع على المستندات.', 'الجمهور المقصود وبنية الناتج وحدود السرية.', 'المراجع المسؤول عن قبول العمل النهائي.'],
            scenarios: [
                { title: 'زميل يبحث عن الإجراء المعتمد', situation: 'تتناول مستندات متعددة الموضوع نفسه لكن يختلف نطاقها أو وضع اعتمادها.', output: 'إجابة موجزة مرتبطة بالمصادر المعتمدة مع إظهار الإرشادات المتعارضة.', decision: 'يؤكد مالك العملية الإجراء المنطبق عندما لا تحسم المصادر السؤال.' },
                { title: 'مشروع يحتاج موجز بداية واضحًا', situation: 'يصل الطلب كملاحظات لا تستكمل النطاق أو المسؤوليات أو معايير القبول.', output: 'مسودة منظمة تفصل المتطلبات المؤكدة عن الافتراضات والأسئلة.', decision: 'يتفق مسؤول التعاقد على النطاق والتسليمات والالتزام التجاري.' },
                { title: 'رد عميل يحتاج مسودة أولى متأنية', situation: 'يحتاج الفريق إلى الجمع بين سياق المشروع والمعرفة الداخلية المسموح بها.', output: 'مسودة رد بمراجعها وتفاصيلها التي تحتاج تأكيدًا بشريًا.', decision: 'يفحص مراجع مخول السرية والمضمون قبل الإرسال.' },
            ],
            acceptance: ['يمكن إرجاع كل توصية واقعية إلى مادة مصدر مسموحة.', 'تظل المعلومات الناقصة والإرشادات المتعارضة صريحة.', 'تُعرض المسودة للمراجعة ولا تنتحل اعتمادًا مهنيًا.'],
            responsibility: 'يبقى الحكم المهني والتزام العميل وقرار النشر النهائي بيد المراجعين المؤهلين.',
            boundary: 'لا يحل المساعد محل الحكم القانوني أو المالي أو الهندسي أو غيره من الأحكام المهنية المنظمة. تتطلب سجلات العملاء والمستندات المقيدة وصولًا معتمدًا ضمن مشروع محدد النطاق.',
            related: { path: '/solutions/knowledge', title: 'المعرفة الداخلية المرتبطة بمصادرها', body: 'ابنِ إجابة مفيدة حول مصادر معتمدة وصلاحيات واضحة ومسار للأسئلة غير المحسومة.' },
        },
    },
} satisfies Record<Locale, Record<IndustrySlug, IndustryContent>>;

export function isIndustrySlug(value: string): value is IndustrySlug {
    return industrySlugs.some(slug => slug === value);
}
export function getIndustry(locale: Locale, slug: IndustrySlug): Industry {
    return { ...content[locale][slug], slug };
}
export function getIndustries(locale: Locale): Industry[] {
    return industrySlugs.map(slug => getIndustry(locale, slug));
}

export const industryUi = {
    en: {
        home: 'Home', industries: 'Industries', breadcrumb: 'Breadcrumb',
        eyebrow: 'Industry perspectives', hubTitle: 'Designed around the work that matters.',
        hubIntro: 'Every industry has its own information, constraints and decisions. Explore how an agent system can be scoped around a specific process, a useful deliverable and the people responsible for it.',
        gridTitle: 'One process. A clearer way forward.', gridIntro: 'Choose a sector to explore concrete starting points and the evidence a responsible pilot needs.',
        explore: 'Explore the industry', outcome: 'Proposed deliverable',
        approachTitle: 'From an industry challenge to a defined scope.',
        approach: [
            { title: 'Choose a real process', body: 'Start with a recurring task, a known owner and a result that can be reviewed.' },
            { title: 'Agree the evidence', body: 'Identify permitted sources, missing information and the checks that define a useful result.' },
            { title: 'Keep the decision clear', body: 'Specify what the system may prepare and what a person must approve before action.' },
        ],
        scopeTitle: 'A starting point for a custom project.',
        scope: 'These are workflow examples we can design around your organization’s data and permissions. They are not claims of existing sector deployments, active connections or customer results.',
        situationsEyebrow: 'Where to begin', situationsTitle: 'Situations worth designing around.',
        situationsIntro: 'Each example pairs a practical information task with an output and a human decision.',
        output: 'Proposed output', decision: 'Human decision',
        inputsEyebrow: 'Define the pilot', inputsTitle: 'What a useful starting scope needs.',
        inputsIntro: 'Begin with a small permitted sample and make the review responsibilities explicit.',
        inputs: 'Required inputs', acceptance: 'Acceptance checks', responsibility: 'Decision ownership',
        boundary: 'Project boundary', related: 'Related solution', relatedAction: 'Explore the solution',
        nextEyebrow: 'Your next step', nextTitle: 'Bring one process into focus.',
        nextBody: 'Prepare a brief with the task, the available sources and the result your team needs to review.',
        brief: 'Prepare a project brief', assistant: 'Open the design assistant', otherIndustries: 'Explore other industries',
    },
    ar: {
        home: 'الرئيسية', industries: 'القطاعات', breadcrumb: 'مسار التصفح',
        eyebrow: 'رؤية حسب القطاع', hubTitle: 'نصمم حول العمل الذي يصنع الفرق.',
        hubIntro: 'لكل قطاع معلوماته وقيوده وقراراته. استكشف كيف يمكن تحديد نطاق نظام وكلاء حول عملية بعينها وتسليم مفيد ومسؤولين واضحين عن مراجعته.',
        gridTitle: 'عملية واحدة. ومسار أوضح.', gridIntro: 'اختر قطاعًا لتتعرف على نقاط بداية ملموسة والأدلة التي تحتاجها تجربة مسؤولة.',
        explore: 'استكشف القطاع', outcome: 'التسليم المقترح',
        approachTitle: 'من تحدي القطاع إلى نطاق محدد.',
        approach: [
            { title: 'اختر عملية فعلية', body: 'ابدأ بمهمة متكررة ومسؤول معروف ونتيجة يمكن مراجعتها.' },
            { title: 'اتفق على الأدلة', body: 'حدد المصادر المسموحة والمعلومات الناقصة وفحوص النتيجة المفيدة.' },
            { title: 'أبقِ القرار واضحًا', body: 'حدد ما يمكن للنظام تجهيزه وما يجب أن يعتمده شخص قبل التنفيذ.' },
        ],
        scopeTitle: 'نقطة بداية لمشروع مخصص.',
        scope: 'هذه أمثلة لمسارات عمل يمكن تصميمها وفق بيانات المؤسسة وصلاحياتها، وليست ادعاءً بوجود تشغيل قطاعي أو تكامل حي أو نتائج لعملاء.',
        situationsEyebrow: 'نقطة البداية', situationsTitle: 'مواقف تستحق تصميم مسار أوضح.',
        situationsIntro: 'يربط كل مثال مهمة معلوماتية عملية بمخرج محدد وقرار بشري.',
        output: 'المخرج المقترح', decision: 'القرار البشري',
        inputsEyebrow: 'تحديد التجربة', inputsTitle: 'ما يحتاجه نطاق بداية مفيد.',
        inputsIntro: 'ابدأ بعينة محدودة ومسموح بها، وحدد مسؤوليات المراجعة صراحة.',
        inputs: 'المدخلات المطلوبة', acceptance: 'معايير القبول', responsibility: 'مسؤولية القرار',
        boundary: 'حدود المشروع', related: 'حل ذو صلة', relatedAction: 'استكشف الحل',
        nextEyebrow: 'الخطوة التالية', nextTitle: 'ضع عملية واحدة في بؤرة العمل.',
        nextBody: 'جهّز موجزًا بالمهمة والمصادر المتاحة والنتيجة التي يحتاج فريقك إلى مراجعتها.',
        brief: 'جهّز موجز مشروع', assistant: 'افتح مساعد التصميم', otherIndustries: 'استكشف قطاعات أخرى',
    },
} as const;
