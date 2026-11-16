import { sitePath } from '../utils/paths';
export const categories = [
  { id: 'form', name: '条件与形式', description: '先看结构：前提都真时，结论仍可能为假吗？', kind: '形式谬误', color: 'red' },
  { id: 'relevance', name: '相关与对话', description: '理由回应了原来的主张吗？信息来源与结论有什么关系？', kind: '非形式谬误', color: 'green' },
  { id: 'evidence', name: '证据与因果', description: '证据有多强？还有哪些解释和被遗漏的情况？', kind: '非形式谬误', color: 'amber' },
  { id: 'premise', name: '前提与语言', description: '选项穷尽了吗？词义和待证的前提是否悄悄改变？', kind: '非形式谬误', color: 'red' },
] as const;

export const sources = {
  iep: { title: 'Internet Encyclopedia of Philosophy：Fallacies', url: 'https://iep.utm.edu/fallacy/', note: '核对各条常见名称、定义、例外和分类争议。重点参阅引言、分类与条目列表。' },
  sep: { title: 'Stanford Encyclopedia of Philosophy：Fallacies', url: 'https://plato.stanford.edu/entries/fallacies/', note: '核对形式与非形式的区分、核心谬误及其争议。重点参阅 §1、§3.3。' },
};
export type Entry = {
  slug: string; title: string; alias: string; category: typeof categories[number]['id'];
  question: string; summary: string; definition: string; structure: string[]; explanation: string;
  conditions: string[]; example: string; diagnosis: string; counterexample: string; boundary: string;
  avoid: string[]; sourceAnchor: string; sourceSection: string; related: string[];
};
export const entries: Entry[] = [
  {
    slug: 'affirming-consequent', title: '肯定后件', alias: '由结果倒推唯一原因', category: 'form',
    question: '出现了结果，就一定是这个原因吗？', summary: '“如果 P，那么 Q”不等于“只有 P，才会 Q”。',
    definition: '从条件命题“如果 P，那么 Q”和 Q 已成立，直接断定 P 必然成立。这把一个充分条件当成了必要条件。在经典命题逻辑的解释下，该结构不能保证从真前提得到真结论。',
    structure: ['如果 P，那么 Q。', 'Q。', '所以，P。'], explanation: 'P 表示前件，Q 表示后件。P 为假、Q 为真时，两个前提仍真，结论却假：这就是检验无效形式的反赋值。它并没有证明某个具体的 P 实际为假。',
    conditions: ['原话提出的是必然的演绎结论，而不是待验证的可能解释。', '只有 P→Q，没有另外证成 Q→P 或 P↔Q。'],
    example: '图书馆管理员说：“若有人预约了这间研讨室，门口会亮灯。现在灯亮了，所以一定有人预约。”但测试照明时，灯也会亮。',
    diagnosis: '“有人预约”能解释亮灯，却不是亮灯的唯一解释。测试模式给出了前提为真、结论为假的可能情况。',
    counterexample: '“系统规定且已核实：这盏灯当且仅当房间有有效预约才亮。灯亮了，所以有有效预约。”', boundary: '这里增加了反向条件 Q→P。若规则可靠且没有故障，推理形式有效；规则是否真实仍需另外核查。',
    avoid: ['把“如果”与“只有”分别写出来，检查有无把方向倒置。', '若只是提出解释，改说“预约是一种可能”，再查系统日志及其他原因。'],
    sourceAnchor: 'AffirmingtheConsequent', sourceSection: 'Affirming the Consequent', related: ['denying-antecedent', 'false-cause'],
  },
  {
    slug: 'denying-antecedent', title: '否定前件', alias: '把一条路当成唯一的路', category: 'form',
    question: '没有这个条件，就没有这个结果吗？', summary: '否定充分条件，不能直接否定它所带来的结果。',
    definition: '从“如果 P，那么 Q”和“并非 P”，直接得出“并非 Q”。P 可以是 Q 的一种充分条件，却未必是 Q 的必要条件。',
    structure: ['如果 P，那么 Q。', '并非 P。', '所以，并非 Q。'], explanation: '令 P 为假、Q 为真：条件命题与“并非 P”均真，而“并非 Q”为假。有效的否定后件式是 P→Q、¬Q，所以 ¬P；它与这里的结构不同。',
    conditions: ['论证声称结果必然不成立，而非仅降低其概率。', '没有另外证明 Q 只能由 P 获得。'],
    example: '“完成在线课程就能获得入门证明。小林没有完成在线课程，因此小林不可能获得入门证明。”但线下考核也是获取途径。', diagnosis: '缺少在线课程这个充分条件，没有排除线下考核。',
    counterexample: '“只有通过身份核验，才能进入这个账户。没有通过身份核验，所以不能进入。”', boundary: '“只有 P 才 Q”写成 Q→P。结合 ¬P 推出 ¬Q，是有效的否定后件式。实际系统是否确实没有其他通道，是事实问题。',
    avoid: ['列出结果的其他取得方式。', '把必要条件和充分条件标注清楚；遇到“只有”先重写方向。'], sourceAnchor: 'DenyingtheAntecedent', sourceSection: 'Denying the Antecedent', related: ['affirming-consequent', 'false-dilemma'],
  },
  {
    slug: 'ad-hominem', title: '人身攻击', alias: '用无关的人格代替回应', category: 'relevance',
    question: '你反驳的是理由，还是提出理由的人？', summary: '个人缺点不能自动推翻一个可独立检查的论证。',
    definition: '把说话者的人格、处境或行为中的负面信息，当成否定其主张的决定性理由，而没有说明该信息如何影响相关证据或推理。批评人的行为本身并不自动属于这种谬误。',
    structure: ['甲提出主张 C，并给出理由 R。', '甲有负面特点 T。', '所以 C 为假，或 R 无须检查。'], explanation: '这是相关性问题。即使 T 为真，也需要一条说明它如何削弱证据的连接；对行为的道德评价和对命题的真假判断可以分别进行。',
    conditions: ['个人信息被用来替代对主张的检查。', '该信息与证词可靠性、专业能力或待讨论的职责没有已说明的实质联系。'],
    example: '“她提议给旧教学楼加装坡道，但她总是迟交会议记录，所以坡道方案一定不合理。”', diagnosis: '迟交记录并没有回应坡度、预算或通行需求。方案仍应按这些理由评估。',
    counterexample: '“这份独家目击证词的提供者已承认当时不在现场，因此我们不能仅凭这份证词认定事故经过。”', boundary: '在评估证词时，能否实际观察到事件直接相关。这削弱的是证词的支撑力，仍不等于相反事件已经获证。',
    avoid: ['先复述对方的理由，再判断个人信息与哪个前提有关。', '利益冲突可触发核查；把核查结果和对动机的猜测分开。'], sourceAnchor: 'AdHominem', sourceSection: 'Ad Hominem', related: ['straw-man', 'authority'],
  },
  {
    slug: 'straw-man', title: '稻草人', alias: '把对方说法换成容易反驳的版本', category: 'relevance',
    question: '你击倒的，是对方真正主张的吗？', summary: '反驳弱化或夸大的替代说法，不能直接反驳原说法。',
    definition: '把对方的主张歪曲成更容易攻击的版本，反驳这个版本后，声称已反驳原主张。判断时要比较范围、限定词和语境，而不能只凭对方不喜欢你的转述。',
    structure: ['甲主张 C（带有限定条件）。', '乙把 C 换成更强、极端或不同的 C′。', '乙反驳 C′，于是宣布 C 不成立。'], explanation: '如果没有证明 C 蕴含 C′，C′ 被推翻不构成对 C 的推翻。摘要可以简化措辞，却应保留对论证有影响的限定。',
    conditions: ['原主张和被攻击版本存在实质差异。', '批评者把替代版本的失败算作原主张的失败。'],
    example: '甲说：“考试周可否把图书馆周五闭馆时间延后一小时？”乙答：“你要所有职员全年通宵工作，这显然不可行，所以不能改。”', diagnosis: '全年通宵与考试周每周延长一次一小时，是成本完全不同的主张。',
    counterexample: '“你建议考试周周五延后一小时。我担心那一小时的值班安排目前没有预算；能否给出排班和经费来源？”', boundary: '这里保留了时间范围，并对原建议的实际条件提出问题。批评是否最终成立，还要看预算与排班证据。',
    avoid: ['尽可能引用原文，保留“部分、可能、在某条件下”等限定。', '先询问“这样复述是否准确”，再针对最有根据的版本回应。'], sourceAnchor: 'StrawMan', sourceSection: 'Straw Man', related: ['ad-hominem', 'equivocation'],
  },
  {
    slug: 'authority', title: '不当诉诸权威', alias: '声望与相关专长不是一回事', category: 'relevance',
    question: '这个人的专业，能支持这个具体判断吗？', summary: '专家意见可以是证据；关键在于专业、依据、共识与可修正性。',
    definition: '仅凭某人的身份或声望，便把其断言当成充分甚至不可推翻的依据，而相关专长、判断范围或证据并不足以支持该结论。借助合格专家是合理分工，不应一概判为谬误。',
    structure: ['甲在某领域有声望。', '甲说 C。', '所以 C 必定为真，无需查看相关证据或异议。'], explanation: '专家证词通常提供可被新证据推翻的支持，而非演绎保证。核查专家是否谈论本专业、是否有可靠依据、是否准确反映领域内的证据分布。',
    conditions: ['权威身份承担了超出其能力或证据的证明作用。', '明显的领域错配、重大证据缺口或相关专家分歧没有得到说明。'],
    example: '“这位知名建筑师说这种营养补充剂能治好失眠，所以不需要任何临床证据了。”', diagnosis: '建筑方面的成就不提供药物疗效专长，“不需要证据”又把意见升级成了定论。',
    counterexample: '“多位有相关资质的结构工程师依据现场检测和计算，建议暂时关闭受损楼梯；在复检前，我们按这一建议绕行。”', boundary: '这是与领域匹配、有依据且可复核的专业建议。采取谨慎行动还包含对风险的价值判断，不能据此宣称每个相关事实都已确定。',
    avoid: ['问清专业范围、原话、依据、利益关系和同行证据。', '按证据强度表达置信度，避免用单一名人盖过可靠的专业共识。'], sourceAnchor: 'AppealtoAuthority', sourceSection: 'Appeal to Authority / Appeal to Unqualified Authority', related: ['ad-hominem', 'ignorance'],
  },
  {
    slug: 'hasty-generalization', title: '以偏概全', alias: '把有限样本放大成总体', category: 'evidence',
    question: '你看到的几例，能代表你谈论的范围吗？', summary: '样本量、抽样方法与结论强度要匹配。',
    definition: '根据数量过少、选择有偏或范围不匹配的样本，作出超出证据支持程度的总体判断。归纳本来就容许不确定性，错误在于夸大了代表性或确定性。',
    structure: ['观察到选中的样本 S 具有性质 F。', '未经充分论证，假定 S 代表总体 G。', '所以 G 全部、普遍或几乎必然具有 F。'], explanation: '需要检查如何抽样、遗漏了谁、样本量是否足以支持目标精度。更多同来源的样本不一定消除偏差。',
    conditions: ['结论的目标总体大于实际观察范围。', '没有充分的代表性说明，却使用很强的总体断言。'],
    example: '校园食堂在辣菜窗口旁问了十位排队者，十人都爱吃辣，于是宣布“全校学生都希望增加辣菜、减少清淡菜”。', diagnosis: '位置已经筛选了偏好，十人的一致意见并不能覆盖不来该窗口的学生。',
    counterexample: '“十位受访者都支持增辣。它说明这十人有此需求；若要估计全校比例，还需更广泛抽样。”', boundary: '这个结论限定在已观察样本，没有把小调查包装成全校共识。规范抽样也能合理支持带误差范围的总体估计。',
    avoid: ['明确总体、抽样框与未响应情况。', '让“全部”“通常”“可能”与证据强度相称，主动寻找反例。'], sourceAnchor: 'HastyGeneralization', sourceSection: 'Hasty Generalization / Unrepresentative Sample', related: ['false-cause', 'cherry-picking'],
  },
  {
    slug: 'false-cause', title: '虚假因果', alias: '先后或相关，尚不足以证明因果', category: 'evidence',
    question: '两件事一起变化，是什么把它们联系起来？', summary: '顺序、相关性提供线索；因果判断需要更强的识别。',
    definition: '在因果依据不足时，把时间先后、共同变化或偶然共现直接当作一事导致另一事的充分证明。本条关注“在此之后，所以由此导致”以及忽略共同原因的情形。',
    structure: ['A 在 B 之前出现，或 A 与 B 同时变化。', '没有充分排查其他解释。', '所以 A 导致了 B。'], explanation: '可能存在共同原因、反向因果、选择效应或随机波动。不能只用“相关不等于因果”结束讨论，也不能把任何相关都视为毫无信息。',
    conditions: ['结论明确声称因果，而证据只到先后或相关。', '相关替代解释尚未合理排除，却作出确定断言。'],
    example: '自习室换了绿色墙面后，某周到访者成绩提高，管理者便说“绿色墙面提高了成绩”。但这一周恰好只有备考最投入的学生到访。', diagnosis: '学习投入可能同时影响到访和成绩。装修前后的比较还混合了人群与时间差异。',
    counterexample: '“把愿意参加的学生随机分到两种墙色、其余条件相同的教室，预先规定测量方法；结果提示墙色可能影响短期表现，还需复现。”', boundary: '随机分配和控制条件增强因果识别，有限且可复现的表述保留了不确定性。实验仍需检查执行、误差与适用范围。',
    avoid: ['画出共同原因和反向路径，问“没有 A 会怎样”。', '寻找对照、自然实验或可靠机制，并说明仍无法排除的解释。'], sourceAnchor: 'FalseCause', sourceSection: 'False Cause / Post Hoc / Common Cause', related: ['affirming-consequent', 'hasty-generalization'],
  },
  {
    slug: 'ignorance', title: '诉诸无知', alias: '把尚未证实变成已经证伪', category: 'evidence',
    question: '没有找到证据，真的等于事情不存在吗？', summary: '缺席的证据有多大分量，取决于本来是否找得到。',
    definition: '仅凭某主张没有被证明为真，就认定它为假；或仅凭没有被证明为假，就认定它为真。调查能力、举证责任与决策规则会影响“未发现”的合理用法。',
    structure: ['尚无人证明 C 为假（或真）。', '所以 C 为真（或假）。'], explanation: '没有证明某事与证明其反面不同。但若在 C 为真时几乎必定能发现证据，高质量调查中的未发现就能成为反对 C 的证据。',
    conditions: ['“不知道”是主要甚至唯一的证明。', '没有说明调查的检出能力，或把行动规则直接当成事实结论。'],
    example: '“没有人能证明这块没有测试记录的石头不发出治病能量，所以它确实能治病。”', diagnosis: '提出疗效的人仍需提供积极证据。反对者未完成排除，不为疗效提供证据。',
    counterexample: '“清点封闭储物柜全部格子后，没有发现投影仪；在检查无遗漏的条件下，投影仪不在柜内。”', boundary: '若投影仪在柜中，完整清点应能发现。另一个边界是“证据不足不予定罪”：这是举证规则，不是证明被告绝未实施该行为。',
    avoid: ['区分“尚不确定”“不足以采取某行动”和“已经证明不存在”。', '问调查若面对真实的 C，有多大机会发现它，并明确谁承担当前主张的举证责任。'], sourceAnchor: 'AppealtoIgnorance', sourceSection: 'Appeal to Ignorance', related: ['authority', 'cherry-picking'],
  },
  {
    slug: 'cherry-picking', title: '选择性证据', alias: '只留下支持结论的那一部分', category: 'evidence',
    question: '如果把遗漏的信息放回来，结论还站得住吗？', summary: '真实的单条证据，也可能组成误导的整体。',
    definition: '把支持结论的证据挑出来呈现，却遗漏足以明显改变判断的相关反证或背景。证据可以每条都真，而证据集合仍然失衡。本条评价呈现与推理，不据此推断作者故意欺骗。',
    structure: ['完整的相关证据包含支持 S 与反对 T。', '只呈现 S，未说明选择依据。', '据此宣称整体证据充分支持 C。'], explanation: '筛选本身不可避免；问题是选择标准是否与研究目标匹配，是否系统排除了不利结果。确认偏误是可能的心理原因，与可检查的证据遗漏并不相同。',
    conditions: ['被遗漏信息与结论实质相关，而非无关细节。', '呈现给读者的结论强度依赖于这种遗漏。'],
    example: '阅读课程试行八周，报告只展示进步最大的两周，便宣布“每周都稳定提高”；其余六周成绩持平或下降。', diagnosis: '被展示的两周可能真实，却不能代表八周趋势，“每周”还直接与遗漏记录冲突。',
    counterexample: '“这里专门研究表现最好的两周，以寻找改进线索；完整八周数据附后，暂不据此估计平均效果。”', boundary: '说明选择目的、公开完整数据并限制结论，可以合理研究特殊案例。篇幅有限也可以摘要，但摘要应保留会改变判断的事实。',
    avoid: ['在看结果前规定纳入和排除标准。', '报告总体、反向结果及选择依据，主动问哪一条遗漏会改变结论。'], sourceAnchor: 'SuppressedEvidence', sourceSection: 'Suppressed Evidence / Cherry-Picking', related: ['hasty-generalization', 'ignorance'],
  },
  {
    slug: 'false-dilemma', title: '虚假两难', alias: '把选项缩成非此即彼', category: 'premise',
    question: '真的只有这两种选择吗？', summary: '选项少并不必然有错；遗漏可行选项才是关键。',
    definition: '未经合理说明，便把不穷尽的选项当成所有可能，再利用其中一项的缺点迫使接受另一项。“两难”也可以包含两个以上被不当缩减的选项。',
    structure: ['只有 A 或 B。', '不能接受 A。', '所以必须接受 B。'], explanation: '推理可在形式上有效，问题却藏在第一前提：是否确实穷尽了相关选择？还需区分互斥与穷尽，两者不是一回事。',
    conditions: ['排除其他选择的前提未经支持。', '至少存在一个与当下目标和约束相关、被遗漏的可行选项。'],
    example: '“要么立即购买全套昂贵学习设备，要么就是完全不重视学习。”但借用设备、先买必需品或使用公共设施都可能可行。', diagnosis: '购买这一套与重视学习不是逻辑上的互补项。对动机的二分掩盖了其他行动选择。',
    counterexample: '“对于这份已提交的申请，系统在截止时记录的状态要么是已收到，要么是未收到；现在确认不是已收到。”', boundary: '在状态定义清楚且记录可信时，“收到 / 未收到”是互补的穷尽划分。实际行动中也可能确实只有两个可行方案，但需交代约束。',
    avoid: ['分别检查选项是否穷尽、是否能同时成立。', '补问“还有折中、延期、试点或不采取行动吗”，再核实可行性。'], sourceAnchor: 'FalseDilemma', sourceSection: 'False Dilemma / Black-or-White', related: ['denying-antecedent', 'begging-question'],
  },
  {
    slug: 'begging-question', title: '循环论证', alias: '把待证的结论藏进理由', category: 'premise',
    question: '不先相信结论，你还会接受这个前提吗？', summary: '理由若只依靠结论获得支持，就没有提供独立根据。',
    definition: '在论证中预先接受正在争议的结论，或让关键前提的唯一支持绕一圈回到结论。本条包含预期理由的一种常见形式；其问题在证明的独立性，不一定在演绎有效性。',
    structure: ['C 成立，因为 R。', 'R 成立的唯一理由又是 C。', '所以 C 已得到独立证明。'], explanation: '有效论证不自动循环。关键是前提能否独立于当前结论得到支持，而不是结论是否在逻辑意义上包含于前提。',
    conditions: ['目标是为当前有争议的主张提供支持。', '核心前提重复结论，或必须先接受结论才能接受。'],
    example: '“这份评选榜是公正的，因为它只选了最值得入选的人。怎么知道这些人最值得？因为这份公正的榜单选了他们。”', diagnosis: '“公正”与“最值得”互相担保，却没有公开评选标准或独立证据。',
    counterexample: '“规则规定所有符合已公开分数线者入选；小周的可复核成绩达到分数线，所以小周入选。”', boundary: '规则与成绩可在不知道小周是否入选时独立核验。演绎结论受到前提蕴含，不等于前提的证据依赖结论。',
    avoid: ['为每个关键前提追问独立依据，画出支持箭头。', '若只是定义约定，明确说是约定，不把它当作争议主张的证据。'], sourceAnchor: 'BeggingtheQuestion', sourceSection: 'Begging the Question / Circular Reasoning', related: ['false-dilemma', 'equivocation'],
  },
  {
    slug: 'equivocation', title: '偷换概念', alias: '同一个词，悄悄换了意思', category: 'premise',
    question: '推理两端说的，还是同一件事吗？', summary: '字面相同不保证含义相同，连接推理需要词义一致。',
    definition: '在论证中使用同一词语的不同含义，却像始终使用同一概念那样连接前提和结论。日常用语本来可以多义，只有当含义转换承担了错误的推理作用时，才构成本条所说的问题。',
    structure: ['关于词语 X 的含义 X₁，前提成立。', '后一步把 X 当作另一含义 X₂。', '忽略 X₁ 与 X₂ 的差异，推出结论。'], explanation: '可把每种含义替换成不同的词，再检查前提是否仍能连起来。不要仅凭术语不合自己的习惯就判定偷换。',
    conditions: ['能指出同一关键词在两处的实质不同含义。', '结论依靠把这两个含义混为一谈才能得到。'],
    example: '“轻的物品容易搬动。这份研究报告的论证很轻，所以这份报告一定容易搬动。”前一个“轻”是重量，后一个是论证分量。', diagnosis: '把“重量小”与“证据薄弱”分别替换进去，推理便不再连通。',
    counterexample: '“这本书作为物品重量很轻，但内容并不浅。我用‘轻’只描述重量，因此可以方便携带。”', boundary: '这里明确区分物理重量与内容深浅，没有让词义变化承担推理。比喻、双关或对概念的公开修订也不自动是谬误。',
    avoid: ['给关键词写下可操作的解释，逐次检查所指。', '遇到争议先请对方澄清定义，再用双方认可的不同术语重写论证。'], sourceAnchor: 'Equivocation', sourceSection: 'Equivocation', related: ['straw-man', 'begging-question'],
  },
];
export const entryUrl = (entry: Pick<Entry, 'slug'>) => sitePath(`/entries/${entry.slug}/`);
export const getCategory = (id: Entry['category']) => categories.find((category) => category.id === id)!;
export const learningPaths = [
  { title: '先拆结构', description: '分清充分与必要，再检查选项和前提。', slugs: ['affirming-consequent', 'denying-antecedent', 'false-dilemma', 'begging-question'] },
  { title: '再看讨论', description: '还原主张，辨认相关理由与词义变化。', slugs: ['straw-man', 'ad-hominem', 'authority', 'equivocation'] },
  { title: '最后评估证据', description: '从样本、因果、未发现与遗漏入手。', slugs: ['hasty-generalization', 'false-cause', 'ignorance', 'cherry-picking'] },
];
