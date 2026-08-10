// 中文翻译 - 完整65个工具
module.exports = {
  'mortgage-calculator': {
    description: '计算月供、税费、保险、PMI 及摊销计划。',
    keywords: ['房贷计算器', '房屋贷款计算器', '月供计算器', '摊销计算器', '含税费保险的房贷计算', '真实房贷成本'],
    faqs: [
      { question: '如何计算每月房贷还款额？', answer: '每月还款额使用标准摊销公式计算：M = P[r(1+r)^n]/[(1+r)^n – 1]，其中 P 是贷款金额，r 是月利率，n 是总还款期数。' },
      { question: '房产税和保险估算的准确性如何？', answer: '房产税率基于各州的有效税率（来自税务基金会和人口普查局数据）。保险费率来自各州平均年保费（NAIC 数据）。两者均按房价百分比计算，当您更改州或房价时会自动更新。这些是州平均值——您的实际成本可能因县、市、承保范围和房产具体情况而异。您可以手动覆盖任一值。' },
      { question: '什么是 PMI？', answer: '私人抵押贷款保险（PMI）在首付低于房价 20% 时是必需的。它通常每年收取贷款金额的 0.3%–1.5%，在借款人违约时保护贷方。' },
      { question: '为什么各州房产税差异这么大？', answer: '房产税率从夏威夷的 0.28% 到新泽西的 2.47% 不等。这意味着在 35 万美元的房子上，您在夏威夷每年支付 980 美元，或在新泽西每年支付 8,645 美元。没有所得税的州（如德克萨斯州 1.80%）通常有更高的房产税来补偿。' },
      { question: '为什么某些州的房屋保险这么贵？', answer: '易受自然灾害影响的州保险成本明显更高。佛罗里达州因飓风风险，平均每年约为房屋价值的 1.05%。俄克拉荷马州（约 0.96%）和路易斯安那州（约 1.10%）因龙卷风和飓风风险而较高。夏威夷（0.19%）、犹他州（0.26%）和俄勒冈州（0.28%）等州的费率最低。' },
      { question: '这包括税费和保险吗？', answer: '是的。当您选择州时，房产税和房屋保险会根据州平均值和您的房价自动估算。这些会加到您的本金和利息还款中，以显示您的真实每月成本。您也可以手动调整这两个值。' },
      { question: '什么是摊销计划？', answer: '摊销计划显示每月的还款如何在贷款期限内分配到本金和利息。早期还款主要是利息；后期还款主要是本金。' }
    ],
    relatedTools: [
      { name: '房贷承受能力计算器', href: '/tools/mortgage-affordability-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '房屋承受能力计算器', href: '/tools/home-affordability-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是房贷计算器？', body: ['计算每月房贷还款额，含准确的各州房产税和保险估算。包括 PMI、完整摊销计划和还款明细。'] },
      howTo: { title: '如何使用', intro: '使用房贷计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'compound-interest-calculator': {
    description: '查看资金如何随复利和定期投入增长。',
    keywords: ['复利计算器', '投资计算器', '利息计算器', '复利增长计算器', '储蓄计算器'],
    faqs: [
      { question: '什么是复利？', answer: '复利是基于初始本金和之前期间累积利息计算的利息。与单利不同，您的收益会产生自己的收益，随时间呈指数增长。' },
      { question: '复利频率如何影响回报？', answer: '更频繁的复利（每日 vs 每年）会产生略高的回报，因为利息更早开始产生利息。这种差异在高利率和长时间段内最明显。' },
      { question: '什么是 72 法则？', answer: '72 法则估算资金翻倍所需的时间：用 72 除以年利率。在 7% 的年回报率下，您的资金大约每 10.3 年翻倍（72 ÷ 7 = 10.3）。' },
      { question: '结果有保证吗？', answer: '没有。此计算器假设固定利率，适用于储蓄账户和债券。投资回报（股票、基金）每年不同。使用平均历史回报进行长期预测。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '储蓄计算器', href: '/tools/savings-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是复利计算器？', body: ['查看资金如何随复利和定期投入增长。'] },
      howTo: { title: '如何使用', intro: '使用复利计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'loan-calculator': {
    description: '计算月供、总利息并生成完整还款计划。',
    keywords: ['贷款计算器', '贷款月供计算器', '贷款利息计算器', '还款计划计算器', '分期贷款计算器'],
    faqs: [
      { question: '如何计算每月还款额？', answer: '每月还款额使用标准摊销公式计算：M = P[r(1+r)^n]/[(1+r)^n – 1]，其中 P 是贷款金额，r 是月利率，n 是总还款期数。' },
      { question: '什么是摊销计划？', answer: '摊销计划显示每月的还款如何在贷款期限内分配到本金和利息。早期还款主要是利息；后期还款主要是本金。' },
      { question: '提前还款有什么好处？', answer: '提前还款可以减少总利息支出并缩短贷款期限。额外还款通常直接用于减少本金。' },
      { question: '利率如何影响总成本？', answer: '即使是利率的微小差异也会显著影响总成本。例如，4% 利率的 3 万美元贷款 5 年总利息约为 3,148 美元，而 6% 利率则为 4,796 美元。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '汽车贷款计算器', href: '/tools/auto-loan-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是贷款计算器？', body: ['计算每月还款额、总利息并生成完整还款计划。'] },
      howTo: { title: '如何使用', intro: '使用贷款计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'percentage-calculator': {
    description: '计算数值百分比、增减幅度、百分比变化等',
    keywords: ['百分比计算器', '百分比变化计算器', '在线百分比工具', '免费百分比计算', '百分比转换', '百分比增长计算器'],
    faqs: [
      { question: '如何计算百分比？', answer: '要计算 X 的 Y%，使用公式：(X × Y) / 100。例如，100 的 20% = (100 × 20) / 100 = 20。' },
      { question: '如何计算百分比变化？', answer: '百分比变化 = [(新值 - 旧值) / 旧值] × 100。正值表示增加，负值表示减少。' },
      { question: '如何计算一个数是另一个数的百分之几？', answer: '使用公式：(部分 / 整体) × 100。例如，25 是 100 的百分之几？(25 / 100) × 100 = 25%。' }
    ],
    relatedTools: [
      { name: '折扣计算器', href: '/tools/discount-calculator' },
      { name: '利润率计算器', href: '/tools/profit-margin-calculator' },
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是百分比计算器？', body: ['计算数值百分比、增减幅度、百分比变化等。'] },
      howTo: { title: '如何使用', intro: '使用百分比计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'tip-calculator': {
    description: '计算小费金额并按预设或自定义比例分摊账单。',
    keywords: ['小费计算器', '小费计算', '账单分摊计算器', '餐厅小费计算器', '多人账单分摊'],
    faqs: [
      { question: '如何计算小费？', answer: '小费 = 账单金额 × 小费比例。例如，50 美元账单的 15% 小费 = 50 × 0.15 = 7.50 美元。' },
      { question: '美国的标准小费是多少？', answer: '餐厅服务通常为 15-20%。优秀服务可以给 20-25%，一般服务给 15%，差服务给 10% 或更少。' },
      { question: '如何多人分摊账单和小费？', answer: '计算总金额（账单 + 小费），然后除以人数。例如，100 美元账单加 20% 小费 = 120 美元，4 人分摊 = 每人 30 美元。' }
    ],
    relatedTools: [
      { name: '薪资计算器', href: '/tools/salary-calculator' },
      { name: '百分比计算器', href: '/tools/percentage-calculator' },
      { name: '折扣计算器', href: '/tools/discount-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是小费计算器？', body: ['计算小费金额并按预设或自定义比例分摊账单。'] },
      howTo: { title: '如何使用', intro: '使用小费计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'salary-calculator': {
    description: '在年薪与时薪之间转换，估算税费和收入明细。',
    keywords: ['薪资计算器', '年薪转时薪', '时薪转年薪', '工资计算器', '收入计算器', '税后工资计算器'],
    faqs: [
      { question: '如何将年薪转换为时薪？', answer: '时薪 = 年薪 / (每周工作小时数 × 52)。例如，年薪 52,000 美元，每周工作 40 小时，时薪 = 52,000 / (40 × 52) = 25 美元/小时。' },
      { question: '如何将时薪转换为年薪？', answer: '年薪 = 时薪 × 每周工作小时数 × 52。例如，时薪 25 美元，每周工作 40 小时，年薪 = 25 × 40 × 52 = 52,000 美元。' },
      { question: '税后工资如何计算？', answer: '税后工资 = 税前工资 - 联邦税 - 州税 - FICA 税（社会保障 + 医疗保险）- 其他扣除额。实际金额取决于您的收入水平、申报状态和所在州。' }
    ],
    relatedTools: [
      { name: '时薪转年薪计算器', href: '/tools/hourly-to-salary-calculator' },
      { name: '薪资计算器', href: '/tools/paycheck-calculator' },
      { name: '所得税计算器', href: '/tools/income-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是薪资计算器？', body: ['在年薪与时薪之间转换，估算税费和收入明细。'] },
      howTo: { title: '如何使用', intro: '使用薪资计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'auto-loan-calculator': {
    description: '计算车贷月供，含首付、置换、税费和期限对比。',
    keywords: ['汽车贷款计算器', '车贷计算器', '汽车融资计算器', '车贷月供计算器', '汽车贷款还款计划'],
    faqs: [
      { question: '如何计算汽车贷款月供？', answer: '月供使用标准摊销公式计算，考虑贷款金额、利率和期限。首付、置换和价值会降低需要融资的金额。' },
      { question: '我应该首付多少？', answer: '通常建议至少首付 20% 以避免负资产（贷款余额超过车辆价值）。对于新车，至少 10%；对于二手车，至少 20%。' },
      { question: '贷款期限多长合适？', answer: '较短的期限（36-48 个月）月供更高但总利息更少。较长期限（60-72 个月）月供更低但总利息更多。选择您能负担的最短期限。' }
    ],
    relatedTools: [
      { name: '汽车租赁计算器', href: '/tools/car-lease-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '房贷计算器', href: '/tools/mortgage-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是汽车贷款计算器？', body: ['计算车贷月供，含首付、置换、税费和期限对比。'] },
      howTo: { title: '如何使用', intro: '使用汽车贷款计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'retirement-calculator': {
    description: '预测退休金增长，含投入、通胀和支取收入。',
    keywords: ['退休金计算器', '退休规划计算器', '退休储蓄计算器', '401k 计算器', '退休收入计算器'],
    faqs: [
      { question: '我需要多少退休金？', answer: '一般建议退休时需要退休前收入的 70-80%。使用 4% 法则：退休储蓄的 4% 可以作为第一年安全支取，之后根据通胀调整。' },
      { question: '通胀如何影响退休储蓄？', answer: '通胀会随时间降低货币购买力。年均 3% 的通胀意味着 20 年后物价约为现在的 1.8 倍。您的退休储蓄需要跑赢通胀。' },
      { question: '我应该何时开始为退休储蓄？', answer: '越早越好。复利使早期投入增长更多。25 岁开始每月存 200 美元，到 65 岁可能有超过 50 万美元（假设 7% 回报）；35 岁开始则只有约 25 万美元。' }
    ],
    relatedTools: [
      { name: '401k 计算器', href: '/tools/401k-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: 'FIRE 计算器', href: '/tools/fire-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是退休金计算器？', body: ['预测退休金增长，含投入、通胀和支取收入。'] },
      howTo: { title: '如何使用', intro: '使用退休金计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'savings-calculator': {
    description: '计算定期存款与复利下的储蓄增长。',
    keywords: ['储蓄计算器', '储蓄增长计算器', '定期存款计算器', '复利储蓄计算器', '存款计算器'],
    faqs: [
      { question: '复利如何使储蓄增长？', answer: '复利使您的利息产生利息。每月复利比每年复利增长更快，因为利息更频繁地加入本金。' },
      { question: '每月存多少合适？', answer: '这取决于您的目标和时间范围。使用 50/30/20 法则：50% 用于需求，30% 用于想要，20% 用于储蓄和还债。' },
      { question: '储蓄账户的利率重要吗？', answer: '是的，即使是微小的利率差异也会随时间产生显著影响。高收益储蓄账户的利率可能是传统账户的 10 倍以上。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是储蓄计算器？', body: ['计算定期存款与复利下的储蓄增长。'] },
      howTo: { title: '如何使用', intro: '使用储蓄计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'investment-calculator': {
    description: '估算投资回报，含复利、定期投入和风险。',
    keywords: ['投资计算器', '投资回报计算器', '复利投资计算器', '股票投资计算器', '投资组合计算器'],
    faqs: [
      { question: '如何估算投资回报？', answer: '使用复利公式：最终金额 = 本金 × (1 + 利率)^年数 + 每月投入 × [((1 + 利率)^年数 - 1) / 利率]。' },
      { question: '什么是风险与回报的关系？', answer: '通常，潜在回报越高，风险越大。股票长期回报高但波动大；债券回报较低但更稳定。分散投资可以平衡风险。' },
      { question: '我应该投资多少？', answer: '这取决于您的财务目标、时间范围和风险承受能力。一般建议至少存 3-6 个月应急资金后再投资。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: 'ROI 计算器', href: '/tools/roi-calculator' },
      { name: '股票利润计算器', href: '/tools/stock-profit-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是投资计算器？', body: ['估算投资回报，含复利、定期投入和风险。'] },
      howTo: { title: '如何使用', intro: '使用投资计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'profit-margin-calculator': {
    description: '计算利润率、加价和盈亏平衡点。',
    keywords: ['利润率计算器', '毛利率计算器', '加价计算器', '盈亏平衡计算器', '商业利润计算器'],
    faqs: [
      { question: '什么是利润率？', answer: '利润率 = (收入 - 成本) / 收入 × 100%。例如，售价 100 美元，成本 60 美元，利润率 = (100 - 60) / 100 × 100% = 40%。' },
      { question: '利润率和加价有什么区别？', answer: '利润率基于售价计算：(售价 - 成本) / 售价。加价基于成本计算：(售价 - 成本) / 成本。40% 利润率相当于 66.7% 加价。' },
      { question: '什么是盈亏平衡点？', answer: '盈亏平衡点是总收入等于总成本的点。固定成本 / (单价 - 单位变动成本) = 盈亏平衡数量。' }
    ],
    relatedTools: [
      { name: '加价计算器', href: '/tools/markup-calculator' },
      { name: '盈亏平衡计算器', href: '/tools/break-even-calculator' },
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是利润率计算器？', body: ['计算利润率、加价和盈亏平衡点。'] },
      howTo: { title: '如何使用', intro: '使用利润率计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'discount-calculator': {
    description: '计算折扣金额、最终售价和节省金额。',
    keywords: ['折扣计算器', '折扣计算', '促销计算器', '打折计算器', '节省金额计算器'],
    faqs: [
      { question: '如何计算折扣？', answer: '折扣金额 = 原价 × 折扣比例。最终价格 = 原价 - 折扣金额。例如，100 美元商品打 8 折（20% 折扣）：折扣 = 100 × 0.20 = 20 美元，最终价格 = 80 美元。' },
      { question: '如何计算连续折扣？', answer: '连续折扣不是简单相加。例如，先 20% 再 10%：100 × 0.80 × 0.90 = 72 美元，总折扣 28%，不是 30%。' },
      { question: '如何比较不同折扣？', answer: '将每个折扣转换为最终价格进行比较。例如，"买一送一"相当于 50% 折扣；"第二件半价"相当于 25% 折扣（买两件时）。' }
    ],
    relatedTools: [
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' },
      { name: '百分比计算器', href: '/tools/percentage-calculator' },
      { name: '利润率计算器', href: '/tools/profit-margin-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是折扣计算器？', body: ['计算折扣金额、最终售价和节省金额。'] },
      howTo: { title: '如何使用', intro: '使用折扣计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'sales-tax-calculator': {
    description: '计算销售税、税前价格和税后总价。',
    keywords: ['销售税计算器', '消费税计算器', '增值税计算器', '税后价格计算器', '各州销售税计算器'],
    faqs: [
      { question: '如何计算销售税？', answer: '销售税 = 税前价格 × 税率。税后总价 = 税前价格 × (1 + 税率)。例如，100 美元商品，7% 税率：税 = 7 美元，总价 = 107 美元。' },
      { question: '美国各州销售税是多少？', answer: '各州税率从 0%（如俄勒冈州）到 7.25%（加州基础税率）不等。加上地方税，总税率可达 10% 以上。平均约 6-7%。' },
      { question: '如何从税后价格反推税前价格？', answer: '税前价格 = 税后价格 / (1 + 税率)。例如，107 美元税后价格，7% 税率：税前 = 107 / 1.07 = 100 美元。' }
    ],
    relatedTools: [
      { name: 'VAT 计算器', href: '/tools/vat-calculator' },
      { name: '折扣计算器', href: '/tools/discount-calculator' },
      { name: '利润率计算器', href: '/tools/profit-margin-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是销售税计算器？', body: ['计算销售税、税前价格和税后总价。'] },
      howTo: { title: '如何使用', intro: '使用销售税计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'roi-calculator': {
    description: '计算投资回报率（ROI）、年化回报和总收益。',
    keywords: ['ROI 计算器', '投资回报率计算器', '投资收益计算器', '年化回报率计算器', '投资分析计算器'],
    faqs: [
      { question: '如何计算 ROI？', answer: 'ROI = (最终价值 - 初始投资) / 初始投资 × 100%。例如，投资 1000 美元，最终价值 1500 美元：ROI = (1500 - 1000) / 1000 × 100% = 50%。' },
      { question: '什么是年化 ROI？', answer: '年化 ROI 将回报转换为年度比率，便于比较不同期限的投资。公式：年化 ROI = [(最终价值 / 初始投资)^(1/年数) - 1] × 100%。' },
      { question: 'ROI 的局限性是什么？', answer: 'ROI 不考虑时间价值、风险或机会成本。两个投资可能有相同 ROI，但一个需要 1 年，另一个需要 10 年。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' },
      { name: '股票利润计算器', href: '/tools/stock-profit-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 ROI 计算器？', body: ['计算投资回报率（ROI）、年化回报和总收益。'] },
      howTo: { title: '如何使用', intro: '使用 ROI 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'age-calculator': {
    description: '计算年龄、两个日期之间的天数，以及未来/过去的日期。',
    keywords: ['年龄计算器', '日期计算器', '天数计算器', '年龄计算', '生日计算器'],
    faqs: [
      { question: '如何计算年龄？', answer: '年龄 = 当前日期 - 出生日期。考虑年份、月份和日期。如果当前月份/日期在出生月份/日期之前，则减 1 岁。' },
      { question: '如何计算两个日期之间的天数？', answer: '将每个日期转换为儒略日数，然后相减。或使用公式考虑闰年和每月天数。' },
      { question: '什么是闰年？', answer: '闰年每 4 年一次，2 月有 29 天。规则：年份能被 4 整除但不能被 100 整除，或者能被 400 整除。' }
    ],
    relatedTools: [
      { name: '日期计算器', href: '/tools/date-calculator' },
      { name: '时间计算器', href: '/tools/time-calculator' },
      { name: '工作日计算器', href: '/tools/business-days-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是年龄计算器？', body: ['计算年龄、两个日期之间的天数，以及未来/过去的日期。'] },
      howTo: { title: '如何使用', intro: '使用年龄计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'payment-calculator': {
    description: '计算贷款月供、总付款和利息。',
    keywords: ['还款计算器', '月供计算器', '贷款还款计算器', '分期付款计算器', '还款计划计算器'],
    faqs: [
      { question: '如何计算月供？', answer: '月供使用标准摊销公式计算：M = P[r(1+r)^n]/[(1+r)^n – 1]，其中 P 是贷款金额，r 是月利率，n 是总还款期数。' },
      { question: '什么是摊销？', answer: '摊销是将贷款成本分摊到整个期限的过程。每月还款包括本金和利息，早期还款主要是利息，后期主要是本金。' },
      { question: '额外还款如何影响贷款？', answer: '额外还款直接减少本金，减少总利息支出并可能缩短贷款期限。' }
    ],
    relatedTools: [
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '汽车贷款计算器', href: '/tools/auto-loan-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是还款计算器？', body: ['计算贷款月供、总付款和利息。'] },
      howTo: { title: '如何使用', intro: '使用还款计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'paycheck-calculator': {
    description: '计算税后工资、扣款和净收入。',
    keywords: ['薪资计算器', '税后工资计算器', '工资单计算器', '净收入计算器', '薪资扣款计算器'],
    faqs: [
      { question: '如何计算税后工资？', answer: '税后工资 = 税前工资 - 联邦税 - 州税 - FICA 税（社会保障 6.2% + 医疗保险 1.45%）- 其他扣除额（如健康保险、401k 供款）。' },
      { question: '什么是 FICA 税？', answer: 'FICA 税资助社会保障和医疗保险。员工支付 7.65%（社会保障 6.2% + 医疗保险 1.45%），雇主匹配相同金额。高收入者还需缴纳额外 0.9% 医疗保险税。' },
      { question: '预扣税和实际税负有什么区别？', answer: '预扣税是雇主根据您填写的 W-4 表格预估的税额。实际税负在报税时确定，可能导致退税或补税。' }
    ],
    relatedTools: [
      { name: '薪资计算器', href: '/tools/salary-calculator' },
      { name: '所得税计算器', href: '/tools/income-tax-calculator' },
      { name: '时薪转年薪计算器', href: '/tools/hourly-to-salary-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是薪资计算器？', body: ['计算税后工资、扣款和净收入。'] },
      howTo: { title: '如何使用', intro: '使用薪资计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'interest-calculator': {
    description: '计算单利和复利，比较不同投资选项。',
    keywords: ['利息计算器', '单利计算器', '复利计算器', '贷款利息计算器', '存款利息计算器'],
    faqs: [
      { question: '单利和复利有什么区别？', answer: '单利仅基于初始本金计算。复利基于本金和累积利息计算，使资金增长更快。' },
      { question: '如何计算单利？', answer: '单利 = 本金 × 利率 × 时间。例如，1000 美元，5% 利率，3 年：利息 = 1000 × 0.05 × 3 = 150 美元。' },
      { question: '复利频率如何影响回报？', answer: '更频繁的复利（每日 vs 每年）产生更高回报，因为利息更早开始产生利息。差异在高利率和长时间段内最明显。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '单利计算器', href: '/tools/simple-interest-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是利息计算器？', body: ['计算单利和复利，比较不同投资选项。'] },
      howTo: { title: '如何使用', intro: '使用利息计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'inflation-calculator': {
    description: '计算通胀对购买力的影响，比较不同年份的金额。',
    keywords: ['通胀计算器', '通货膨胀计算器', '购买力计算器', 'CPI 计算器', '货币贬值计算器'],
    faqs: [
      { question: '如何计算通胀？', answer: '通胀使用消费者价格指数（CPI）计算：通胀率 = (当前 CPI - 过去 CPI) / 过去 CPI × 100%。' },
      { question: '什么是 CPI？', answer: 'CPI 衡量一篮子消费品和服务的价格变化，包括食品、住房、交通、医疗等。它是衡量通胀的主要指标。' },
      { question: '通胀如何影响储蓄？', answer: '通胀降低货币购买力。如果年通胀率 3%，10 年后 100 美元的购买力仅相当于现在的 74 美元。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是通胀计算器？', body: ['计算通胀对购买力的影响，比较不同年份的金额。'] },
      howTo: { title: '如何使用', intro: '使用通胀计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  '401k-calculator': {
    description: '估算 401k 退休账户的增长，含雇主匹配和税收优惠。',
    keywords: ['401k 计算器', '退休账户计算器', '401k 增长计算器', '雇主匹配计算器', '税前退休计算器'],
    faqs: [
      { question: '什么是 401k？', answer: '401k 是美国雇主提供的退休储蓄计划。员工可以税前收入供款，降低当前应税收入。2024 年供款上限为 23,000 美元（50 岁以上为 30,500 美元）。' },
      { question: '雇主匹配如何工作？', answer: '雇主匹配是雇主根据您的供款额外贡献的金额。例如，"匹配 50% 至 6%"意味着如果您供款 6%，雇主额外贡献 3%。这是免费资金，应充分利用。' },
      { question: '传统 401k 和 Roth 401k 有什么区别？', answer: '传统 401k 使用税前资金，供款时减税，取款时交税。Roth 401k 使用税后资金，供款时不减税，但合格取款时免税。' }
    ],
    relatedTools: [
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '所得税计算器', href: '/tools/income-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 401k 计算器？', body: ['估算 401k 退休账户的增长，含雇主匹配和税收优惠。'] },
      howTo: { title: '如何使用', intro: '使用 401k 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'amortization-calculator': {
    description: '生成完整的贷款摊销计划，显示每期本金和利息分配。',
    keywords: ['摊销计算器', '贷款摊销计算器', '还款计划计算器', '本金利息分配计算器', '分期还款计算器'],
    faqs: [
      { question: '什么是摊销计划？', answer: '摊销计划显示每月的还款如何在贷款期限内分配到本金和利息。早期还款主要是利息；后期还款主要是本金。' },
      { question: '如何计算每月摊销？', answer: '每月利息 = 剩余本金 × 月利率。每月本金 = 月供 - 每月利息。剩余本金 = 上月本金 - 本月本金还款。' },
      { question: '额外还款如何影响摊销？', answer: '额外还款直接减少本金，减少总利息支出并缩短贷款期限。您可以选择保持月供不变缩短期限，或保持期限不变降低月供。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '还款计算器', href: '/tools/payment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是摊销计算器？', body: ['生成完整的贷款摊销计划，显示每期本金和利息分配。'] },
      howTo: { title: '如何使用', intro: '使用摊销计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'income-tax-calculator': {
    description: '估算联邦和州所得税，计算税后收入。',
    keywords: ['所得税计算器', '联邦税计算器', '州税计算器', '税后收入计算器', '税务计算器'],
    faqs: [
      { question: '如何计算联邦所得税？', answer: '联邦所得税使用累进税率计算。2024 年税率从 10% 到 37% 不等，取决于收入和申报状态。每个税率仅适用于该税率范围内的收入部分。' },
      { question: '什么是标准扣除额？', answer: '标准扣除额是您可以从应税收入中扣除的固定金额。2024 年单身申报者为 14,600 美元，联合申报者为 29,200 美元。您可以选择逐项扣除，如果总额更高。' },
      { question: '州税如何计算？', answer: '各州税率差异很大。有些州没有所得税（如德克萨斯州、佛罗里达州），其他州税率从 1% 到 13.3%（加州最高税率）不等。' }
    ],
    relatedTools: [
      { name: '薪资计算器', href: '/tools/salary-calculator' },
      { name: '薪资计算器', href: '/tools/paycheck-calculator' },
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是所得税计算器？', body: ['估算联邦和州所得税，计算税后收入。'] },
      howTo: { title: '如何使用', intro: '使用所得税计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'tax-calculator': {
    description: '计算各种税费，包括所得税、销售税和财产税。',
    keywords: ['税务计算器', '所得税计算器', '销售税计算器', '财产税计算器', '综合税务计算器'],
    faqs: [
      { question: '有哪些类型的税？', answer: '主要税种包括：所得税（基于收入）、销售税（基于购买）、财产税（基于房产价值）、资本利得税（基于投资利润）。' },
      { question: '如何估算总税负？', answer: '将各种税种相加：联邦所得税 + 州所得税 + FICA 税 + 销售税 + 财产税。有效税率 = 总税额 / 总收入。' },
      { question: '什么是累进税制？', answer: '累进税制意味着收入越高，税率越高。美国联邦所得税使用累进税率，从 10% 到 37% 不等。' }
    ],
    relatedTools: [
      { name: '所得税计算器', href: '/tools/income-tax-calculator' },
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' },
      { name: '薪资计算器', href: '/tools/salary-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是税务计算器？', body: ['计算各种税费，包括所得税、销售税和财产税。'] },
      howTo: { title: '如何使用', intro: '使用税务计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'obbba-tax-calculator': {
    description: '计算 OBBBA 税收法案对您的影响。',
    keywords: ['OBBBA 税计算器', '税收法案计算器', 'OBBBA 影响计算器', '新税法计算器'],
    faqs: [
      { question: '什么是 OBBBA？', answer: 'OBBBA 是一项税收法案，影响个人和企业的税收义务。具体条款包括税率变化、扣除额调整和税收抵免。' },
      { question: 'OBBBA 如何影响我？', answer: '影响取决于您的收入水平、申报状态和具体情况。某些条款可能增加或减少您的税负。' },
      { question: '何时生效？', answer: 'OBBBA 条款在不同时间生效。某些条款立即生效，其他条款在下一个纳税年度生效。' }
    ],
    relatedTools: [
      { name: '所得税计算器', href: '/tools/income-tax-calculator' },
      { name: '税务计算器', href: '/tools/tax-calculator' },
      { name: '薪资计算器', href: '/tools/salary-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 OBBBA 税计算器？', body: ['计算 OBBBA 税收法案对您的影响。'] },
      howTo: { title: '如何使用', intro: '使用 OBBBA 税计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'electricity-cost-calculator': {
    description: '计算电器用电成本和电费。',
    keywords: ['电费计算器', '用电成本计算器', '电器能耗计算器', '电费估算器'],
    faqs: [
      { question: '如何计算电费？', answer: '电费 = 功率（千瓦）× 使用时间（小时）× 电价（每千瓦时）。例如，1000 瓦电器使用 3 小时，电价 0.12 美元/千瓦时：1 × 3 × 0.12 = 0.36 美元。' },
      { question: '如何找到电器的功率？', answer: '功率通常标注在电器铭牌上，单位为瓦特（W）。如果没有，可以使用公式：功率 = 电压 × 电流。' },
      { question: '如何降低电费？', answer: '使用节能电器、减少使用时间、在非高峰时段使用高功率电器、定期维护设备。' }
    ],
    relatedTools: [
      { name: '预算计算器', href: '/tools/budget-calculator' },
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '储蓄计算器', href: '/tools/savings-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是电费计算器？', body: ['计算电器用电成本和电费。'] },
      howTo: { title: '如何使用', intro: '使用电费计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'debt-payoff-calculator': {
    description: '制定债务偿还计划，比较不同还款策略。',
    keywords: ['债务偿还计算器', '还款计划计算器', '债务清除计算器', '信用卡还款计算器'],
    faqs: [
      { question: '什么是雪崩法？', answer: '雪崩法优先偿还利率最高的债务，同时支付其他债务的最低还款额。这种方法最小化总利息支出。' },
      { question: '什么是雪球法？', answer: '雪球法优先偿还余额最小的债务，提供快速成就感。这种方法在心理上更有激励作用。' },
      { question: '哪种方法更好？', answer: '数学上，雪崩法节省更多利息。但雪球法在心理上更有效。选择您能坚持的方法。' }
    ],
    relatedTools: [
      { name: '信用卡还款计算器', href: '/tools/credit-card-payoff-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '预算计算器', href: '/tools/budget-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是债务偿还计算器？', body: ['制定债务偿还计划，比较不同还款策略。'] },
      howTo: { title: '如何使用', intro: '使用债务偿还计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'hourly-to-salary-calculator': {
    description: '在时薪和年薪之间转换。',
    keywords: ['时薪转年薪计算器', '年薪转时薪', '工资转换计算器', '收入计算器'],
    faqs: [
      { question: '如何将时薪转换为年薪？', answer: '年薪 = 时薪 × 每周工作小时数 × 52。例如，时薪 25 美元，每周工作 40 小时：25 × 40 × 52 = 52,000 美元。' },
      { question: '如何将年薪转换为时薪？', answer: '时薪 = 年薪 / (每周工作小时数 × 52)。例如，年薪 52,000 美元，每周工作 40 小时：52,000 / (40 × 52) = 25 美元/小时。' },
      { question: '需要考虑带薪假期吗？', answer: '如果您有带薪假期和病假，实际工作小时数会减少。例如，2 周带薪假意味着实际工作 50 周而不是 52 周。' }
    ],
    relatedTools: [
      { name: '薪资计算器', href: '/tools/salary-calculator' },
      { name: '薪资计算器', href: '/tools/paycheck-calculator' },
      { name: '所得税计算器', href: '/tools/income-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是时薪转年薪计算器？', body: ['在时薪和年薪之间转换。'] },
      howTo: { title: '如何使用', intro: '使用时薪转年薪计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'budget-calculator': {
    description: '创建个人预算，跟踪收入和支出。',
    keywords: ['预算计算器', '个人预算计算器', '家庭预算计算器', '收支计算器', '财务规划计算器'],
    faqs: [
      { question: '什么是 50/30/20 法则？', answer: '50% 收入用于需求（房租、食品、水电），30% 用于想要（娱乐、外出就餐），20% 用于储蓄和还债。' },
      { question: '如何开始做预算？', answer: '跟踪一个月的支出，分类记录，设定财务目标，调整支出以符合目标。使用预算应用或电子表格跟踪。' },
      { question: '预算应该包括什么？', answer: '包括所有收入来源、固定支出（房租、贷款）、变动支出（食品、娱乐）、储蓄目标和还债计划。' }
    ],
    relatedTools: [
      { name: '储蓄计算器', href: '/tools/savings-calculator' },
      { name: '债务偿还计算器', href: '/tools/debt-payoff-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是预算计算器？', body: ['创建个人预算，跟踪收入和支出。'] },
      howTo: { title: '如何使用', intro: '使用预算计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'simple-interest-calculator': {
    description: '计算单利，不涉及复利。',
    keywords: ['单利计算器', '简单利息计算器', '贷款利息计算器', '存款利息计算器'],
    faqs: [
      { question: '什么是单利？', answer: '单利仅基于初始本金计算，不考虑累积利息。公式：利息 = 本金 × 利率 × 时间。' },
      { question: '单利和复利有什么区别？', answer: '单利仅基于本金计算，复利基于本金和累积利息计算。复利使资金增长更快。' },
      { question: '单利何时使用？', answer: '单利通常用于短期贷款、汽车贷款和个人借款。大多数长期投资使用复利。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '利息计算器', href: '/tools/interest-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是单利计算器？', body: ['计算单利，不涉及复利。'] },
      howTo: { title: '如何使用', intro: '使用单利计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'net-worth-calculator': {
    description: '计算净资产，资产减去负债。',
    keywords: ['净资产计算器', '个人净资产计算器', '资产负债表计算器', '财务状况计算器'],
    faqs: [
      { question: '什么是净资产？', answer: '净资产 = 总资产 - 总负债。正值表示资产超过负债，负值表示负债超过资产。' },
      { question: '哪些算作资产？', answer: '资产包括：现金、投资账户、房产价值、车辆价值、退休账户、个人财产价值。' },
      { question: '哪些算作负债？', answer: '负债包括：房贷余额、汽车贷款、学生贷款、信用卡债务、个人贷款、其他欠款。' }
    ],
    relatedTools: [
      { name: '预算计算器', href: '/tools/budget-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是净资产计算器？', body: ['计算净资产，资产减去负债。'] },
      howTo: { title: '如何使用', intro: '使用净资产计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'stock-profit-calculator': {
    description: '计算股票投资利润和回报率。',
    keywords: ['股票利润计算器', '投资回报计算器', '股票收益计算器', '交易利润计算器'],
    faqs: [
      { question: '如何计算股票利润？', answer: '利润 = (卖出价格 - 买入价格) × 股数 - 交易费用。回报率 = 利润 / 总投资 × 100%。' },
      { question: '需要考虑交易费用吗？', answer: '是的，交易费用会减少实际利润。包括买入和卖出时的佣金、税费和其他费用。' },
      { question: '如何计算年化回报？', answer: '年化回报 = [(最终价值 / 初始投资)^(1/年数) - 1] × 100%。这便于比较不同持有期的投资。' }
    ],
    relatedTools: [
      { name: '投资计算器', href: '/tools/investment-calculator' },
      { name: 'ROI 计算器', href: '/tools/roi-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是股票利润计算器？', body: ['计算股票投资利润和回报率。'] },
      howTo: { title: '如何使用', intro: '使用股票利润计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'credit-card-payoff-calculator': {
    description: '计算信用卡还款计划和利息支出。',
    keywords: ['信用卡还款计算器', '信用卡债务计算器', '还款计划计算器', '最低还款计算器'],
    faqs: [
      { question: '什么是最低还款额？', answer: '最低还款额通常是余额的 1-3% 或利息加固定金额。只支付最低还款额会导致长期债务和高利息。' },
      { question: '如何快速还清信用卡？', answer: '支付超过最低还款额，使用雪崩法（优先还高利率卡）或雪球法（优先还小额卡）。考虑余额转移到低利率卡。' },
      { question: '信用卡利息如何计算？', answer: '日利率 = 年利率 / 365。每日利息 = 余额 × 日利率。月利息 = 日利息 × 天数。复利计算。' }
    ],
    relatedTools: [
      { name: '债务偿还计算器', href: '/tools/debt-payoff-calculator' },
      { name: '预算计算器', href: '/tools/budget-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是信用卡还款计算器？', body: ['计算信用卡还款计划和利息支出。'] },
      howTo: { title: '如何使用', intro: '使用信用卡还款计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'down-payment-calculator': {
    description: '计算房屋首付金额和比例。',
    keywords: ['首付计算器', '房屋首付计算器', '购房首付计算器', '首付比例计算器'],
    faqs: [
      { question: '我应该付多少首付？', answer: '传统建议是 20%，以避免 PMI 和获得更好利率。但许多贷款允许更低首付：FHA 贷款 3.5%，常规贷款 3-5%。' },
      { question: '首付如何影响贷款？', answer: '更高的首付意味着更低的贷款金额、更低的月供、更少的总利息，可能获得更好的利率，并避免 PMI。' },
      { question: '什么是 PMI？', answer: '私人抵押贷款保险（PMI）在首付低于 20% 时必需，保护贷方。成本通常为贷款金额的 0.3-1.5%/年。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '房贷承受能力计算器', href: '/tools/mortgage-affordability-calculator' },
      { name: '房屋承受能力计算器', href: '/tools/home-affordability-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是首付计算器？', body: ['计算房屋首付金额和比例。'] },
      howTo: { title: '如何使用', intro: '使用首付计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'dividend-calculator': {
    description: '计算股息收入和再投资回报。',
    keywords: ['股息计算器', '股息收入计算器', '股息再投资计算器', '股票分红计算器'],
    faqs: [
      { question: '什么是股息收益率？', answer: '股息收益率 = 年度股息 / 股票价格 × 100%。例如，股票价格 100 美元，年度股息 3 美元，收益率 = 3%。' },
      { question: '什么是 DRIP？', answer: '股息再投资计划（DRIP）自动将股息用于购买更多股票，利用复利效应增加长期回报。' },
      { question: '股息如何纳税？', answer: '合格股息按长期资本利得税率纳税（0%、15% 或 20%）。非合格股息按普通所得税率纳税。' }
    ],
    relatedTools: [
      { name: '投资计算器', href: '/tools/investment-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '股票利润计算器', href: '/tools/stock-profit-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是股息计算器？', body: ['计算股息收入和再投资回报。'] },
      howTo: { title: '如何使用', intro: '使用股息计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'fire-calculator': {
    description: '计算财务独立、提前退休（FIRE）目标。',
    keywords: ['FIRE 计算器', '财务独立计算器', '提前退休计算器', 'FIRE 运动计算器'],
    faqs: [
      { question: '什么是 FIRE 运动？', answer: 'FIRE（Financial Independence, Retire Early）是通过激进储蓄和投资实现财务独立并提前退休的运动。目标是在 30-40 多岁退休。' },
      { question: '我需要多少才能 FIRE？', answer: '使用 4% 法则：FIRE 数字 = 年度支出 × 25。例如，年度支出 40,000 美元，FIRE 数字 = 100 万美元。' },
      { question: '如何计算 FIRE 日期？', answer: '考虑当前储蓄、每月储蓄率、投资回报率。使用复利公式估算达到目标金额的时间。' }
    ],
    relatedTools: [
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '储蓄计算器', href: '/tools/savings-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 FIRE 计算器？', body: ['计算财务独立、提前退休（FIRE）目标。'] },
      howTo: { title: '如何使用', intro: '使用 FIRE 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'vat-calculator': {
    description: '计算增值税（VAT）和含税价格。',
    keywords: ['VAT 计算器', '增值税计算器', '消费税计算器', '含税价格计算器'],
    faqs: [
      { question: '什么是 VAT？', answer: '增值税（VAT）是对商品和服务增值征收的消费税。在欧盟、英国和其他国家广泛使用。美国使用销售税而非 VAT。' },
      { question: '如何计算 VAT？', answer: 'VAT = 税前价格 × VAT 税率。含税价格 = 税前价格 × (1 + VAT 税率)。例如，100 英镑商品，20% VAT：VAT = 20 英镑，总价 = 120 英镑。' },
      { question: '如何从含税价格反推税前价格？', answer: '税前价格 = 含税价格 / (1 + VAT 税率)。例如，120 英镑含税价格，20% VAT：税前 = 120 / 1.20 = 100 英镑。' }
    ],
    relatedTools: [
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' },
      { name: '折扣计算器', href: '/tools/discount-calculator' },
      { name: '利润率计算器', href: '/tools/profit-margin-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 VAT 计算器？', body: ['计算增值税（VAT）和含税价格。'] },
      howTo: { title: '如何使用', intro: '使用 VAT 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'break-even-calculator': {
    description: '计算盈亏平衡点和目标利润销售额。',
    keywords: ['盈亏平衡计算器', '盈亏平衡点计算器', '商业计算器', '目标利润计算器'],
    faqs: [
      { question: '什么是盈亏平衡点？', answer: '盈亏平衡点是总收入等于总成本的点，利润为零。公式：盈亏平衡数量 = 固定成本 / (单价 - 单位变动成本)。' },
      { question: '什么是固定成本和变动成本？', answer: '固定成本不随产量变化（租金、工资、保险）。变动成本随产量变化（原材料、直接人工、运费）。' },
      { question: '如何计算目标利润销售额？', answer: '目标利润数量 = (固定成本 + 目标利润) / (单价 - 单位变动成本)。这显示需要销售多少单位才能达到目标利润。' }
    ],
    relatedTools: [
      { name: '利润率计算器', href: '/tools/profit-margin-calculator' },
      { name: '加价计算器', href: '/tools/markup-calculator' },
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是盈亏平衡计算器？', body: ['计算盈亏平衡点和目标利润销售额。'] },
      howTo: { title: '如何使用', intro: '使用盈亏平衡计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'mortgage-affordability-calculator': {
    description: '计算您可以负担的房屋价格和房贷金额。',
    keywords: ['房贷承受能力计算器', '房屋承受能力计算器', '购房预算计算器', '可负担房价计算器'],
    faqs: [
      { question: '我能负担多少房价？', answer: '一般规则：房价不应超过年收入的 2.5-3 倍。月供（含税费保险）不应超过月收入的 28%。总债务不应超过月收入的 36%。' },
      { question: '28/36 规则是什么？', answer: '28% 规则：住房支出不应超过月收入的 28%。36% 规则：总债务支出（住房 + 其他债务）不应超过月收入的 36%。' },
      { question: '哪些因素影响承受能力？', answer: '收入、债务、信用评分、首付、利率、财产税率、保险成本、HOA 费用都会影响您能负担的房价。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '房屋承受能力计算器', href: '/tools/home-affordability-calculator' },
      { name: '首付计算器', href: '/tools/down-payment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是房贷承受能力计算器？', body: ['计算您可以负担的房屋价格和房贷金额。'] },
      howTo: { title: '如何使用', intro: '使用房贷承受能力计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'apr-calculator': {
    description: '计算年化百分比利率（APR），包括费用和复利。',
    keywords: ['APR 计算器', '年化利率计算器', '有效利率计算器', '贷款真实利率计算器'],
    faqs: [
      { question: '什么是 APR？', answer: '年化百分比利率（APR）是贷款的真实年度成本，包括利率和某些费用。它比名义利率更准确地反映贷款成本。' },
      { question: 'APR 和名义利率有什么区别？', answer: '名义利率是贷款合同上标注的利率。APR 包括利率加上某些费用（如发起费、关闭成本），显示更真实的成本。' },
      { question: '如何计算 APR？', answer: 'APR 计算复杂，需要考虑贷款金额、利率、期限和费用。通常使用公式或金融计算器求解使贷款现金流现值等于贷款金额的利率。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '汽车贷款计算器', href: '/tools/auto-loan-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 APR 计算器？', body: ['计算年化百分比利率（APR），包括费用和复利。'] },
      howTo: { title: '如何使用', intro: '使用 APR 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'student-loan-calculator': {
    description: '计算学生贷款还款计划和总成本。',
    keywords: ['学生贷款计算器', '助学贷款计算器', '学生贷款还款计算器', '教育贷款计算器'],
    faqs: [
      { question: '学生贷款如何计算月供？', answer: '月供使用标准摊销公式计算，考虑贷款金额、利率和期限。联邦学生贷款通常有 10 年标准还款期。' },
      { question: '什么是收入驱动还款计划？', answer: '收入驱动计划将月供限制为可支配收入的 10-20%，根据收入和家庭成员计算。20-25 年后剩余债务可能被免除。' },
      { question: '我应该提前偿还学生贷款吗？', answer: '这取决于利率、其他财务目标和风险承受能力。如果利率高（>6%），提前偿还通常值得。如果有低利率和学生贷款免除计划，可能不值得。' }
    ],
    relatedTools: [
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '债务偿还计算器', href: '/tools/debt-payoff-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是学生贷款计算器？', body: ['计算学生贷款还款计划和总成本。'] },
      howTo: { title: '如何使用', intro: '使用学生贷款计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'capital-gains-tax-calculator': {
    description: '计算投资资产的资本利得税。',
    keywords: ['资本利得税计算器', '投资税计算器', '股票税计算器', '资产增值税计算器'],
    faqs: [
      { question: '什么是资本利得税？', answer: '资本利得税是对投资资产（股票、债券、房地产）利润征收的税。持有超过 1 年的资产按长期资本利得税率纳税，通常低于普通所得税率。' },
      { question: '长期和短期资本利得有什么区别？', answer: '短期资本利得（持有 1 年或以下）按普通所得税率纳税。长期资本利得（持有超过 1 年）按优惠税率纳税：0%、15% 或 20%，取决于收入。' },
      { question: '如何减少资本利得税？', answer: '持有资产超过 1 年以获得长期税率，使用税收优惠账户（如 401k、IRA），亏损抵消收益（税收损失收割），捐赠 appreciated 资产给慈善机构。' }
    ],
    relatedTools: [
      { name: '所得税计算器', href: '/tools/income-tax-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' },
      { name: '股票利润计算器', href: '/tools/stock-profit-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是资本利得税计算器？', body: ['计算投资资产的资本利得税。'] },
      howTo: { title: '如何使用', intro: '使用资本利得税计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'gpa-calculator': {
    description: '计算 GPA（平均绩点）和学期 GPA。',
    keywords: ['GPA 计算器', '平均绩点计算器', '成绩计算器', '学期 GPA 计算器'],
    faqs: [
      { question: '如何计算 GPA？', answer: 'GPA = 总绩点 / 总学分。每门课的绩点 = 成绩点数 × 学分。例如，A（4.0）3 学分 = 12 绩点。' },
      { question: '什么是加权 GPA？', answer: '加权 GPA 考虑课程难度。AP、荣誉或 IB 课程可能使用 5.0 量表而非 4.0，使 A 在 AP 课程中值为 5.0 而非 4.0。' },
      { question: '如何提高 GPA？', answer: '专注于高学分课程，寻求辅导帮助，完成所有作业，参与课堂，与老师沟通，平衡课程难度。' }
    ],
    relatedTools: [
      { name: '成绩计算器', href: '/tools/grade-calculator' },
      { name: '百分比计算器', href: '/tools/percentage-calculator' },
      { name: '奖学金计算器', href: '/tools/scholarship-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 GPA 计算器？', body: ['计算 GPA（平均绩点）和学期 GPA。'] },
      howTo: { title: '如何使用', intro: '使用 GPA 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'grade-calculator': {
    description: '计算成绩、期末成绩和所需分数。',
    keywords: ['成绩计算器', '期末成绩计算器', '考试分数计算器', '成绩计算工具'],
    faqs: [
      { question: '如何计算加权成绩？', answer: '加权成绩 = (作业 1 × 权重 1) + (作业 2 × 权重 2) + ...。例如，期中考试 80 分（30%），期末考试 90 分（40%），作业 85 分（30%）：80×0.3 + 90×0.4 + 85×0.3 = 85.5。' },
      { question: '我需要期末考多少分才能达到目标成绩？', answer: '所需期末分数 = (目标成绩 - 当前成绩 × (1 - 期末权重)) / 期末权重。例如，当前 85%，目标 90%，期末占 40%：(90 - 85×0.6) / 0.4 = 97.5。' },
      { question: '如何计算 GPA？', answer: '将每个成绩转换为绩点（A=4.0, B=3.0, C=2.0, D=1.0, F=0），乘以学分，求和后除以总学分。' }
    ],
    relatedTools: [
      { name: 'GPA 计算器', href: '/tools/gpa-calculator' },
      { name: '百分比计算器', href: '/tools/percentage-calculator' },
      { name: '奖学金计算器', href: '/tools/scholarship-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是成绩计算器？', body: ['计算成绩、期末成绩和所需分数。'] },
      howTo: { title: '如何使用', intro: '使用成绩计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'refinance-calculator': {
    description: '计算再融资是否值得，比较新旧贷款。',
    keywords: ['再融资计算器', '房贷再融资计算器', '贷款再融资计算器', '再融资成本计算器'],
    faqs: [
      { question: '何时应该再融资？', answer: '当新利率比当前利率低 0.5-1% 以上，您计划在该房屋居住足够长时间以收回关闭成本，且您的信用评分改善时。' },
      { question: '再融资的关闭成本是多少？', answer: '关闭成本通常为贷款金额的 2-5%，包括评估费、发起费、产权保险、检查费等。平均约 5,000-12,500 美元。' },
      { question: '如何计算盈亏平衡点？', answer: '盈亏平衡月数 = 总关闭成本 / 每月节省金额。例如，关闭成本 6,000 美元，每月节省 200 美元：6,000 / 200 = 30 个月。您需要居住超过 30 个月才能获益。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '摊销计算器', href: '/tools/amortization-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是再融资计算器？', body: ['计算再融资是否值得，比较新旧贷款。'] },
      howTo: { title: '如何使用', intro: '使用再融资计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'markup-calculator': {
    description: '计算加价百分比和售价。',
    keywords: ['加价计算器', '售价计算器', '利润率计算器', '定价计算器'],
    faqs: [
      { question: '什么是加价？', answer: '加价是基于成本增加的百分比，用于确定售价。公式：售价 = 成本 × (1 + 加价百分比)。例如，成本 50 美元，加价 60%：售价 = 50 × 1.60 = 80 美元。' },
      { question: '加价和利润率有什么区别？', answer: '加价基于成本计算：(售价 - 成本) / 成本。利润率基于售价计算：(售价 - 成本) / 售价。60% 加价相当于 37.5% 利润率。' },
      { question: '如何计算合适的加价？', answer: '考虑行业平均、竞争对手定价、目标利润率和客户感知价值。零售典型加价 50-100%，餐厅 200-300%。' }
    ],
    relatedTools: [
      { name: '利润率计算器', href: '/tools/profit-margin-calculator' },
      { name: '销售税计算器', href: '/tools/sales-tax-calculator' },
      { name: '折扣计算器', href: '/tools/discount-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是加价计算器？', body: ['计算加价百分比和售价。'] },
      howTo: { title: '如何使用', intro: '使用加价计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'cd-calculator': {
    description: '计算定期存款（CD）的到期价值和利息。',
    keywords: ['CD 计算器', '定期存款计算器', '存款证书计算器', '固定存款计算器'],
    faqs: [
      { question: '什么是 CD？', answer: '定期存款（CD）是银行提供的储蓄产品，要求您在固定期限内保持存款，以换取比常规储蓄账户更高的利率。提前取款通常有罚款。' },
      { question: 'CD 如何计算利息？', answer: 'CD 通常使用复利计算。到期价值 = 本金 × (1 + 利率/复利频率)^(复利频率 × 年数)。利息按日、月或季度复利。' },
      { question: 'CD 安全吗？', answer: '是的，银行发行的 CD 由 FDIC 保险（最高 25 万美元），信用合作社由 NCUA 保险。这是最安全的投资之一。' }
    ],
    relatedTools: [
      { name: '储蓄计算器', href: '/tools/savings-calculator' },
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 CD 计算器？', body: ['计算定期存款（CD）的到期价值和利息。'] },
      howTo: { title: '如何使用', intro: '使用 CD 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'car-lease-calculator': {
    description: '计算汽车租赁月供和总成本。',
    keywords: ['汽车租赁计算器', '车租计算器', '租赁月供计算器', '汽车租赁成本计算器'],
    faqs: [
      { question: '汽车租赁如何计算月供？', answer: '月供 = (折旧费 + 财务费 + 税费)。折旧费 = (资本化成本 - 残值) / 期限。财务费 = (资本化成本 + 残值) × 货币因子。' },
      { question: '什么是资本化成本？', answer: '资本化成本是租赁中车辆的协商价格，类似于购买时的购买价格。包括车辆价格、税费、附加费用和减去任何折扣或定金。' },
      { question: '租赁和购买哪个更好？', answer: '租赁月供更低，但您不拥有车辆。购买月供更高，但最终拥有资产。如果您每年行驶少于 15,000 英里并喜欢新车，租赁可能更好。' }
    ],
    relatedTools: [
      { name: '汽车贷款计算器', href: '/tools/auto-loan-calculator' },
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '房贷计算器', href: '/tools/mortgage-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是汽车租赁计算器？', body: ['计算汽车租赁月供和总成本。'] },
      howTo: { title: '如何使用', intro: '使用汽车租赁计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'future-value-calculator': {
    description: '计算投资的未来价值，含复利和定期投入。',
    keywords: ['未来价值计算器', '终值计算器', '投资未来价值计算器', '复利终值计算器'],
    faqs: [
      { question: '什么是未来价值？', answer: '未来价值是当前投资在特定日期在给定利率下的价值。公式：FV = PV × (1 + r)^n，其中 PV 是现值，r 是利率，n 是期数。' },
      { question: '如何计算定期投入的未来价值？', answer: '使用年金公式：FV = PMT × [((1 + r)^n - 1) / r]，其中 PMT 是每期投入，r 是每期利率，n 是期数。' },
      { question: '未来价值和现值有什么区别？', answer: '未来价值是投资在将来值多少，现值是未来金额在今天值多少。它们是相反的概念，通过折现率相互转换。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' },
      { name: '年金计算器', href: '/tools/annuity-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是未来价值计算器？', body: ['计算投资的未来价值，含复利和定期投入。'] },
      howTo: { title: '如何使用', intro: '使用未来价值计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'annuity-calculator': {
    description: '计算年金的未来价值、现值和支付额。',
    keywords: ['年金计算器', '年金未来价值计算器', '年金现值计算器', '退休年金计算器'],
    faqs: [
      { question: '什么是年金？', answer: '年金是一系列等额支付，在固定时间间隔进行。普通年金在期末支付（如债券利息），先付年金在期初支付（如租金）。' },
      { question: '如何计算年金未来价值？', answer: '普通年金未来价值 = PMT × [((1 + r)^n - 1) / r]，其中 PMT 是每期支付，r 是每期利率，n 是期数。' },
      { question: '年金和复利有什么区别？', answer: '复利基于单笔投资计算，年金涉及一系列定期支付。年金公式考虑了多次支付及其复利效应。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '未来价值计算器', href: '/tools/future-value-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是年金计算器？', body: ['计算年金的未来价值、现值和支付额。'] },
      howTo: { title: '如何使用', intro: '使用年金计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'emi-calculator': {
    description: '计算等额本息还款（EMI）月供。',
    keywords: ['EMI 计算器', '等额本息计算器', '月供计算器', '贷款月供计算器'],
    faqs: [
      { question: '什么是 EMI？', answer: 'EMI（Equated Monthly Installment）是等额本息还款，每月还款额固定，包括本金和利息。公式：EMI = P × r × (1+r)^n / [(1+r)^n - 1]。' },
      { question: 'EMI 和摊销有什么区别？', answer: 'EMI 是固定月供，包括本金和利息。摊销是还款计划，显示每月的本金和利息分配。EMI 是金额，摊销是计划。' },
      { question: '如何计算总利息？', answer: '总利息 = (EMI × 期数) - 本金。例如，EMI 500 美元，60 期，本金 25,000 美元：总利息 = (500 × 60) - 25,000 = 5,000 美元。' }
    ],
    relatedTools: [
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '还款计算器', href: '/tools/payment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 EMI 计算器？', body: ['计算等额本息还款（EMI）月供。'] },
      howTo: { title: '如何使用', intro: '使用 EMI 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'debt-to-income-calculator': {
    description: '计算债务收入比（DTI），评估财务健康。',
    keywords: ['债务收入比计算器', 'DTI 计算器', '负债率计算器', '财务健康计算器'],
    faqs: [
      { question: '什么是债务收入比？', answer: '债务收入比（DTI）是每月债务还款与每月总收入的比率。公式：DTI = 月债务还款 / 月收入 × 100%。' },
      { question: '什么是好的 DTI？', answer: 'DTI 低于 36% 被认为是健康的。36-49% 表示需要改善财务状况。超过 50% 表示债务负担过重，难以获得贷款。' },
      { question: '贷方为什么关心 DTI？', answer: 'DTI 衡量您管理月度还款的能力。高 DTI 表示财务压力大，违约风险高。大多数贷方希望 DTI 低于 43%。' }
    ],
    relatedTools: [
      { name: '房贷承受能力计算器', href: '/tools/mortgage-affordability-calculator' },
      { name: '预算计算器', href: '/tools/budget-calculator' },
      { name: '债务偿还计算器', href: '/tools/debt-payoff-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是债务收入比计算器？', body: ['计算债务收入比（DTI），评估财务健康。'] },
      howTo: { title: '如何使用', intro: '使用债务收入比计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'income-percentile-calculator': {
    description: '计算您在美国收入分布中的百分位。',
    keywords: ['收入百分位计算器', '收入排名计算器', '收入分布计算器', '收入比较计算器'],
    faqs: [
      { question: '什么是收入百分位？', answer: '收入百分位显示您的收入在所有人中的排名。例如，第 80 百分位意味着您的收入高于 80% 的人，低于 20% 的人。' },
      { question: '美国中位数收入是多少？', answer: '2024 年美国家庭中位数收入约为 75,000 美元。个人中位数收入约为 55,000 美元。这些数字因地区、年龄和教育水平而异。' },
      { question: '如何增加收入？', answer: '提升技能、获得更高教育、谈判加薪、换工作、发展副业、投资自己、建立专业网络。' }
    ],
    relatedTools: [
      { name: '薪资计算器', href: '/tools/salary-calculator' },
      { name: '所得税计算器', href: '/tools/income-tax-calculator' },
      { name: '净资产百分位计算器', href: '/tools/net-worth-percentile-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是收入百分位计算器？', body: ['计算您在美国收入分布中的百分位。'] },
      howTo: { title: '如何使用', intro: '使用收入百分位计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'net-worth-percentile-calculator': {
    description: '计算您在美国净资产分布中的百分位。',
    keywords: ['净资产百分位计算器', '净资产排名计算器', '财富百分位计算器', '净资产比较计算器'],
    faqs: [
      { question: '什么是净资产百分位？', answer: '净资产百分位显示您的净资产（资产减负债）在所有人中的排名。例如，第 90 百分位意味着您的净资产高于 90% 的人。' },
      { question: '美国中位数净资产是多少？', answer: '2024 年美国家庭中位数净资产约为 192,000 美元。平均净资产更高（约 1,064,000 美元），因为富人的资产拉高了平均值。' },
      { question: '如何增加净资产？', answer: '增加资产（储蓄、投资、偿还债务减少负债）、增加收入、减少支出、避免不良债务、持续投资、长期持有。' }
    ],
    relatedTools: [
      { name: '净资产计算器', href: '/tools/net-worth-calculator' },
      { name: '收入百分位计算器', href: '/tools/income-percentile-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是净资产百分位计算器？', body: ['计算您在美国净资产分布中的百分位。'] },
      howTo: { title: '如何使用', intro: '使用净资产百分位计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'life-insurance-calculator': {
    description: '计算您需要多少人寿保险。',
    keywords: ['人寿保险计算器', '寿险计算器', '保险需求计算器', '寿险保额计算器'],
    faqs: [
      { question: '我需要多少人寿保险？', answer: '一般规则是年收入的 10-15 倍。更准确的方法：计算家庭需要的总金额（债务、教育、生活费用），减去现有资产和储蓄。' },
      { question: '定期寿险和终身寿险有什么区别？', answer: '定期寿险在特定期限（如 20 年）内提供保障，保费较低。终身寿险提供终身保障，有现金价值成分，保费更高。' },
      { question: '如何确定保险期限？', answer: '选择覆盖您财务责任最重的时期。通常覆盖到退休、房贷还清、孩子经济独立。常见期限为 10、20 或 30 年。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '预算计算器', href: '/tools/budget-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是人寿保险计算器？', body: ['计算您需要多少人寿保险。'] },
      howTo: { title: '如何使用', intro: '使用人寿保险计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'home-affordability-calculator': {
    description: '计算您可以负担的房屋价格范围。',
    keywords: ['房屋承受能力计算器', '购房预算计算器', '可负担房价计算器', '房贷承受能力计算器'],
    faqs: [
      { question: '我能负担多少房价？', answer: '考虑月收入、债务、首付、利率和费用。一般规则：房价不应超过年收入的 2.5-3 倍，月供不超过月收入的 28%。' },
      { question: '28/36 规则是什么？', answer: '28% 规则：住房支出（本金、利息、税、保险）不应超过月收入的 28%。36% 规则：总债务支出不超过月收入的 36%。' },
      { question: '哪些因素影响承受能力？', answer: '收入、债务、信用评分、首付、利率、财产税率、保险成本、HOA 费用、关闭成本都会影响您能负担的房价。' }
    ],
    relatedTools: [
      { name: '房贷承受能力计算器', href: '/tools/mortgage-affordability-calculator' },
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '首付计算器', href: '/tools/down-payment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是房屋承受能力计算器？', body: ['计算您可以负担的房屋价格范围。'] },
      howTo: { title: '如何使用', intro: '使用房屋承受能力计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'business-loan-calculator': {
    description: '计算商业贷款月供和总成本。',
    keywords: ['商业贷款计算器', '企业贷款计算器', '商业融资计算器', '小企业贷款计算器'],
    faqs: [
      { question: '商业贷款如何计算月供？', answer: '月供使用标准摊销公式计算：M = P[r(1+r)^n]/[(1+r)^n – 1]，考虑贷款金额、利率和期限。' },
      { question: '商业贷款利率是多少？', answer: '商业贷款利率通常在 6-30% 之间，取决于贷方、贷款类型、企业信用和期限。SBA 贷款通常利率较低。' },
      { question: '商业贷款有哪些类型？', answer: '常见类型包括：定期贷款、信用额度、SBA 贷款、设备融资、发票融资、商户现金预支。每种有不同的条款和用途。' }
    ],
    relatedTools: [
      { name: '贷款计算器', href: '/tools/loan-calculator' },
      { name: '摊销计算器', href: '/tools/amortization-calculator' },
      { name: '盈亏平衡计算器', href: '/tools/break-even-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是商业贷款计算器？', body: ['计算商业贷款月供和总成本。'] },
      howTo: { title: '如何使用', intro: '使用商业贷款计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'credit-score-simulator': {
    description: '模拟不同行为对信用评分的影响。',
    keywords: ['信用评分模拟器', '信用评分计算器', '信用影响模拟器', '信用评分预测器'],
    faqs: [
      { question: '什么因素影响信用评分？', answer: '主要因素：付款历史（35%）、欠款金额（30%）、信用历史长度（15%）、新信用（10%）、信用组合（10%）。' },
      { question: '如何提高信用评分？', answer: '按时付款、减少信用卡余额、不关闭旧账户、限制硬查询、建立多样化的信用组合。' },
      { question: '信用评分范围是多少？', answer: 'FICO 评分范围 300-850。良好：670-739，很好：740-799，优秀：800+。VantageScore 使用相同范围。' }
    ],
    relatedTools: [
      { name: '债务偿还计算器', href: '/tools/debt-payoff-calculator' },
      { name: '信用卡还款计算器', href: '/tools/credit-card-payoff-calculator' },
      { name: '预算计算器', href: '/tools/budget-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是信用评分模拟器？', body: ['模拟不同行为对信用评分的影响。'] },
      howTo: { title: '如何使用', intro: '使用信用评分模拟器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'self-employment-tax-calculator': {
    description: '计算自雇税（社会保障和医疗保险）。',
    keywords: ['自雇税计算器', '自由职业税计算器', '独立承包商税计算器', '自营业税计算器'],
    faqs: [
      { question: '什么是自雇税？', answer: '自雇税是自营职业者缴纳的社会保障和医疗保险税。税率 15.3%（社会保障 12.4% + 医疗保险 2.9%）。员工和雇主各付一半，但自雇者需付全部。' },
      { question: '如何计算自雇税？', answer: '自雇税 = 净收入 × 92.35% × 15.3%。例如，净收入 100,000 美元：100,000 × 0.9235 × 0.153 = 14,130 美元。您可以扣除雇主部分（7.65%）。' },
      { question: '自雇者可以扣除什么？', answer: '可以扣除：自雇税的一半、健康保险保费、退休计划供款、家庭办公费用、业务费用。这些减少应税收入。' }
    ],
    relatedTools: [
      { name: '所得税计算器', href: '/tools/income-tax-calculator' },
      { name: '薪资计算器', href: '/tools/salary-calculator' },
      { name: '税务计算器', href: '/tools/tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是自雇税计算器？', body: ['计算自雇税（社会保障和医疗保险）。'] },
      howTo: { title: '如何使用', intro: '使用自雇税计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'car-loan-interest-deduction-calculator': {
    description: '计算汽车贷款利息的税收扣除额。',
    keywords: ['汽车贷款利息扣除计算器', '车贷利息抵税计算器', '汽车贷款税收扣除计算器'],
    faqs: [
      { question: '汽车贷款利息可以抵税吗？', answer: '通常不可以，除非车辆用于业务。如果您是自雇者并使用车辆用于业务，可以按比例扣除利息。员工不能使用此扣除。' },
      { question: '如何计算业务使用比例？', answer: '业务使用比例 = 业务里程 / 总里程。例如，总里程 15,000 英里，业务里程 6,000 英里：业务比例 = 6,000 / 15,000 = 40%。' },
      { question: '哪些车辆费用可以扣除？', answer: '如果使用标准里程率，不能单独扣除利息。如果使用实际费用法，可以扣除：利息、汽油、维修、保险、注册费（按业务比例）。' }
    ],
    relatedTools: [
      { name: '汽车贷款计算器', href: '/tools/auto-loan-calculator' },
      { name: '自雇税计算器', href: '/tools/self-employment-tax-calculator' },
      { name: '所得税计算器', href: '/tools/income-tax-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是汽车贷款利息扣除计算器？', body: ['计算汽车贷款利息的税收扣除额。'] },
      howTo: { title: '如何使用', intro: '使用汽车贷款利息扣除计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'student-loan-tax-bomb-calculator': {
    description: '计算学生贷款免除可能产生的税务影响。',
    keywords: ['学生贷款税弹计算器', '学生贷款免除税计算器', '学生贷款税收影响计算器'],
    faqs: [
      { question: '什么是学生贷款税弹？', answer: '当学生贷款被免除或取消时，免除的金额通常被视为应税收入。这可能导致大额税单，称为"税弹"。' },
      { question: '学生贷款免除需要交税吗？', answer: '取决于免除类型和时间。2021-2025 年，根据 ARPA 法案，某些联邦贷款免除免税。但收入驱动还款（IDR）免除可能仍需交税。' },
      { question: '如何为税弹做准备？', answer: '估算免除金额和您的税率，开始储蓄以支付税款。考虑分期支付预估税款，避免罚款。咨询税务专业人士。' }
    ],
    relatedTools: [
      { name: '学生贷款计算器', href: '/tools/student-loan-calculator' },
      { name: '所得税计算器', href: '/tools/income-tax-calculator' },
      { name: '债务偿还计算器', href: '/tools/debt-payoff-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是学生贷款税弹计算器？', body: ['计算学生贷款免除可能产生的税务影响。'] },
      howTo: { title: '如何使用', intro: '使用学生贷款税弹计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'trump-account-calculator': {
    description: '计算 Trump 账户（税收优惠账户）的潜在收益。',
    keywords: ['Trump 账户计算器', '税收优惠账户计算器', 'Trump 储蓄计算器'],
    faqs: [
      { question: '什么是 Trump 账户？', answer: 'Trump 账户是一种提议的税收优惠储蓄账户，旨在鼓励美国公民储蓄。具体细节可能根据最终立法而变化。' },
      { question: 'Trump 账户如何工作？', answer: '账户允许税后供款，投资增长免税，合格取款免税。类似于 Roth IRA，但可能有不同的供款限制和取款规则。' },
      { question: '谁可以从 Trump 账户中受益？', answer: '所有收入水平的储蓄者都可能受益，特别是那些预期退休时税率更高的人。年轻人 benefit 更多，因为投资有更长时间增长。' }
    ],
    relatedTools: [
      { name: '复利计算器', href: '/tools/compound-interest-calculator' },
      { name: '退休金计算器', href: '/tools/retirement-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 Trump 账户计算器？', body: ['计算 Trump 账户（税收优惠账户）的潜在收益。'] },
      howTo: { title: '如何使用', intro: '使用 Trump 账户计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'mortgage-payoff-calculator': {
    description: '计算提前还清房贷的策略和节省。',
    keywords: ['房贷还清计算器', '提前还贷计算器', '房贷加速还款计算器', '房贷利息节省计算器'],
    faqs: [
      { question: '提前还清房贷有什么好处？', answer: '节省大量利息、缩短贷款期限、增加现金流、减少财务压力、完全拥有房屋。但可能失去税收扣除和投资机会。' },
      { question: '如何提前还清房贷？', answer: '选项包括：额外本金还款、双周还款（每年多还一个月）、重新融资为更短期限、一次性大额还款。' },
      { question: '我应该提前还清房贷还是投资？', answer: '比较房贷利率和预期投资回报。如果房贷利率低（<4%），投资可能更好。如果利率高（>6%），提前还款可能更好。考虑风险承受能力和财务目标。' }
    ],
    relatedTools: [
      { name: '房贷计算器', href: '/tools/mortgage-calculator' },
      { name: '摊销计算器', href: '/tools/amortization-calculator' },
      { name: '再融资计算器', href: '/tools/refinance-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是房贷还清计算器？', body: ['计算提前还清房贷的策略和节省。'] },
      howTo: { title: '如何使用', intro: '使用房贷还清计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'save-vs-rap-calculator': {
    description: '比较储蓄和投资策略与快速还款策略。',
    keywords: ['储蓄 vs 快速还款计算器', '投资 vs 还款计算器', '财务策略比较计算器'],
    faqs: [
      { question: '什么是 RAP（快速还款）策略？', answer: 'RAP（Rapid Payoff）策略是优先偿还债务，而不是投资或储蓄。这减少利息支出，但可能错过投资回报。' },
      { question: '何时应该储蓄/投资而不是还款？', answer: '当投资预期回报高于债务利率时。例如，如果房贷利率 4%，预期投资回报 7%，投资可能更好。但考虑风险。' },
      { question: '何时应该还款而不是储蓄/投资？', answer: '当债务利率高（>7%）、您需要心理成就感、或投资回报不确定时。高利率债务（如信用卡）通常应该优先偿还。' }
    ],
    relatedTools: [
      { name: '债务偿还计算器', href: '/tools/debt-payoff-calculator' },
      { name: '投资计算器', href: '/tools/investment-calculator' },
      { name: '储蓄计算器', href: '/tools/savings-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是储蓄 vs RAP 计算器？', body: ['比较储蓄和投资策略与快速还款策略。'] },
      howTo: { title: '如何使用', intro: '使用储蓄 vs RAP 计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'world-cup-2026-schedule': {
    description: '2026 年世界杯赛程和比赛时间表。',
    keywords: ['2026 世界杯赛程', '世界杯时间表', 'FIFA 2026 赛程', '世界杯比赛时间'],
    faqs: [
      { question: '2026 年世界杯何时举行？', answer: '2026 年 FIFA 世界杯将于 2026 年 6 月 11 日至 7 月 19 日举行。这是首次由三个国家（美国、加拿大、墨西哥）联合举办。' },
      { question: '2026 年世界杯在哪里举行？', answer: '比赛将在 16 个城市举行：美国 11 个、墨西哥 3 个、加拿大 2 个。决赛将在纽约/新泽西的大都会人寿体育场举行。' },
      { question: '有多少支球队参加？', answer: '2026 年世界杯将首次有 48 支球队参加，比之前的 32 支增加。这将导致更多比赛和不同的小组赛格式。' }
    ],
    relatedTools: [
      { name: '年龄计算器', href: '/tools/age-calculator' },
      { name: '日期计算器', href: '/tools/date-calculator' },
      { name: '时间计算器', href: '/tools/time-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是 2026 世界杯赛程？', body: ['2026 年世界杯赛程和比赛时间表。'] },
      howTo: { title: '如何使用', intro: '使用 2026 世界杯赛程很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  },
  'ohms-law-calculator': {
    description: '计算电压、电流、电阻和功率（欧姆定律）。',
    keywords: ['欧姆定律计算器', '电压计算器', '电流计算器', '电阻计算器', '功率计算器'],
    faqs: [
      { question: '什么是欧姆定律？', answer: '欧姆定律描述电压、电流和电阻之间的关系：V = I × R，其中 V 是电压（伏特），I 是电流（安培），R 是电阻（欧姆）。' },
      { question: '如何计算功率？', answer: '功率公式：P = V × I，其中 P 是功率（瓦特），V 是电压，I 是电流。其他形式：P = I² × R 或 P = V² / R。' },
      { question: '欧姆定律适用于所有电路吗？', answer: '欧姆定律适用于欧姆材料（大多数金属）。非欧姆材料（二极管、晶体管）不遵循线性关系，需要更复杂的模型。' }
    ],
    relatedTools: [
      { name: '电费计算器', href: '/tools/electricity-cost-calculator' },
      { name: '百分比计算器', href: '/tools/percentage-calculator' },
      { name: '科学计算器', href: '/tools/scientific-calculator' }
    ],
    guide: {
      whatIs: { title: '什么是欧姆定律计算器？', body: ['计算电压、电流、电阻和功率（欧姆定律）。'] },
      howTo: { title: '如何使用', intro: '使用欧姆定律计算器很简单：', items: ['在输入框中输入您的数值', '点击计算按钮', '立即查看结果'] },
      tips: { title: '提示', items: ['仔细检查输入以获得准确结果', '此工具用于估算——重要决策请咨询专业人士', '保存结果以备将来参考'] }
    }
  }
};
