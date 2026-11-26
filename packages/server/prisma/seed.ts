import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ExpertSeed = { name: string; title: string; stance: string; color: string };
type SpeechSeed = { expertName: string; text: string; publicThought?: string };
type ConsensusItem = { statement: string; supporters: string[]; opponents: string[] };

type Sample = {
  topic: string;
  host: { name: string; title: string };
  experts: ExpertSeed[];
  opening: string;
  speeches: SpeechSeed[];
  consensus: ConsensusItem[];
  divergences: ConsensusItem[];
  summary: string;
};

const samples: Sample[] = [
  {
    topic: "人工智能是否会取代人类的创造力？",
    host: { name: "陈睿", title: "资深科技主持人" },
    experts: [
      { name: "林晓", title: "AI 伦理研究员", stance: "谨慎乐观：AI 是放大器而非替代者", color: "#6366f1" },
      { name: "王强", title: "科技专栏作者", stance: "技术乐观派", color: "#10b981" },
      { name: "苏梅", title: "独立设计师", stance: "忧患派：创造性岗位正被侵蚀", color: "#f59e0b" },
      { name: "赵一鸣", title: "AI 创业公司 CTO", stance: "工具论", color: "#ef4444" },
    ],
    opening: "欢迎来到今天的圆桌。我们聊聊一个让很多人焦虑的话题——人工智能会不会取代人类的创造力？各位老师请畅所欲言。",
    speeches: [
      { expertName: "王强", text: "历史反复证明，工具进步只会解放创造力，摄影没有杀死绘画，反而催生了印象派。", publicThought: "想从历史类比切入" },
      { expertName: "苏梅", text: "这个类比不成立，AI 不是被动工具，它能直接生成成稿，压缩了初级创意岗位的生存空间。", publicThought: "反驳历史类比的漏洞" },
      { expertName: "林晓", text: "我部分同意苏梅，风险确实集中在执行层，但真正的创造力在于提出问题，这一层 AI 目前还够不着。", publicThought: "想把讨论引向问题的提出" },
      { expertName: "赵一鸣", text: "从工程角度，AI 是可编排的能力，用它的人和不用的人差距会拉大，问题不是取代，而是分化。", publicThought: "想提出分化论" },
      { expertName: "王强", text: "分化论我认同，工具革命从来都是重新分配，而不是消灭职业。", publicThought: "想接住分化论" },
      { expertName: "苏梅", text: "可被重新分配的，往往是抗风险能力最弱的群体，我们不能只谈技术红利。", publicThought: "想强调公平维度" },
    ],
    consensus: [
      { statement: "AI 是能力放大器而非简单替代者", supporters: ["林晓", "王强", "赵一鸣"], opponents: [] },
      { statement: "风险集中在执行层与初级岗位", supporters: ["苏梅", "林晓"], opponents: [] },
    ],
    divergences: [
      { statement: "AI 是否构成对创造力的根本威胁", supporters: ["苏梅"], opponents: ["王强", "赵一鸣"] },
    ],
    summary: "感谢各位。今天的分歧很清晰：技术派看到的是解放与分化，忧患派看到的是执行层岗位被侵蚀。共识在于——AI 是放大器，真正的创造力仍掌握在能提出问题的人手里。",
  },
  {
    topic: "远程办公是未来主流还是过渡方案？",
    host: { name: "周扬", title: "商业观察主持人" },
    experts: [
      { name: "刘畅", title: "组织管理顾问", stance: "支持远程：效率与自由兼得", color: "#14b8a6" },
      { name: "何静", title: "人力资源总监", stance: "审慎：协作与归属感受损", color: "#f97316" },
      { name: "郑博", title: "资深程序员", stance: "看岗位与阶段", color: "#8b5cf6" },
    ],
    opening: "疫情之后，远程办公从应急变成了常态选项。它是未来主流，还是只是一阵风？请三位老师聊聊。",
    speeches: [
      { expertName: "刘畅", text: "数据显示远程团队的人均产出不降反升，通勤时间的释放是实打实的红利。", publicThought: "想用产出数据立论" },
      { expertName: "何静", text: "产出上升不等于组织健康，创新往往发生在茶水间和会议室里的偶然碰撞，这些远程补不回来。", publicThought: "想点出协作的隐性成本" },
      { expertName: "郑博", text: "对资深工程师，远程确实是福音；但对新人，没人带的代价很大，所以要看岗位和阶段。", publicThought: "想补充分层的视角" },
      { expertName: "刘畅", text: "新人问题可以用结构化的 onboarding 和异步文档解决，不是远程本身的原罪。", publicThought: "想反驳新人论" },
      { expertName: "何静", text: "结构化能解决流程，解决不了归属感，长期纯远程的员工离职率会说话。", publicThought: "想引入归属感证据" },
    ],
    consensus: [
      { statement: "远程办公对资深/独立型岗位明显利好", supporters: ["刘畅", "郑博"], opponents: [] },
    ],
    divergences: [
      { statement: "远程是否损害协作创新与归属感", supporters: ["何静"], opponents: ["刘畅"] },
      { statement: "混合模式是否是更优解", supporters: ["郑博", "何静"], opponents: ["刘畅"] },
    ],
    summary: "今天的核心分歧在于：刘畅强调效率与自由，何静强调协作与归属，郑博则提醒要分层看岗位与阶段。共识是远程对资深独立型岗位是红利，但对组织协作的隐性影响仍需正视，混合模式可能是多数组织的现实答案。",
  },
  {
    topic: "新能源车能否在十年内全面取代燃油车？",
    host: { name: "方琳", title: "产业经济主持人" },
    experts: [
      { name: "高翔", title: "新能源行业分析师", stance: "乐观：渗透率将超预期", color: "#22c55e" },
      { name: "马超", title: "传统车企工程师", stance: "谨慎：补能与成本仍是坎", color: "#f43f5e" },
      { name: "杨帆", title: "能源政策研究员", stance: "看电网与充电基建", color: "#0ea5e9" },
      { name: "顾言", title: "二手车从业者", stance: "关注残值与用户真实顾虑", color: "#eab308" },
    ],
    opening: "新能源车的渗透率这几年涨得很快，但'十年内全面取代燃油车'这个说法到底成不成立？",
    speeches: [
      { expertName: "高翔", text: "按当前的渗透曲线，很多地区燃油车在 2035 年前后就会变成小众选项，趋势几乎不可逆。", publicThought: "想用渗透率曲线说话" },
      { expertName: "马超", text: "渗透率高不代表全面取代，充电便利性和电池成本对三四线和长途场景仍是硬门槛。", publicThought: "想指出补能与成本短板" },
      { expertName: "杨帆", text: "真正的瓶颈在电网，如果充电桩和配电网跟不上，渗透率越高反而越容易暴露矛盾。", publicThought: "想引入基础设施维度" },
      { expertName: "顾言", text: "用户最实际的顾虑是保值率，二手新能源残值一直不稳，这会拖慢真实置换意愿。", publicThought: "想从用户钱包出发" },
      { expertName: "高翔", text: "残值问题会随规模和技术成熟收敛，早期所有新技术都经历过这个阶段。", publicThought: "想回应残值质疑" },
      { expertName: "马超", text: "收敛需要时间，而'十年'恰恰是一个很紧的窗口，我担心的就是这个时间差。", publicThought: "想把焦点拉回时间窗口" },
    ],
    consensus: [
      { statement: "新能源渗透率将持续上行", supporters: ["高翔", "杨帆", "顾言"], opponents: [] },
      { statement: "补能、电网与残值是全面取代的关键约束", supporters: ["马超", "杨帆", "顾言"], opponents: [] },
    ],
    divergences: [
      { statement: "十年内能否完成'全面'取代", supporters: ["高翔"], opponents: ["马超", "顾言"] },
    ],
    summary: "高翔从渗透曲线看趋势不可逆，马超和顾言则强调补能、成本与残值这些'最后一公里'约束，杨帆提醒电网才是底层瓶颈。共识是渗透率会继续涨，但'十年全面取代'的说法，至少还卡在基础设施和用户真实顾虑这两关。",
  },
  {
    topic: "短视频是知识传播的福音还是灾难？",
    host: { name: "韩雪", title: "文化评论主持人" },
    experts: [
      { name: "许知", title: "知识科普博主", stance: "福音：降低了知识门槛", color: "#a855f7" },
      { name: "沈默", title: "图书编辑", stance: "灾难：深度被碎片化吞噬", color: "#64748b" },
      { name: "白露", title: "认知心理学研究者", stance: "警惕注意力经济", color: "#ec4899" },
    ],
    opening: "短视频让知识变得触手可及，但也有人说它把思考碎片化了。它到底是福音还是灾难？",
    speeches: [
      { expertName: "许知", text: "一分钟讲清一个概念，让几千万原本不读书的人第一次接触到了科学和人文，这本身就是进步。", publicThought: "想强调普及的价值" },
      { expertName: "沈默", text: "接触不等于理解，短视频把知识切成金句，受众误以为懂了，其实只是记住了结论。", publicThought: "想指出理解的假象" },
      { expertName: "白露", text: "更大的问题是注意力被算法劫持，用户以为在学，实际在被动消费情绪和爽点。", publicThought: "想引入认知机制" },
      { expertName: "许知", text: "但把知识做浅是入口，有了入口才有深入的可能，不能要求所有人都直接读原著。", publicThought: "想辩护入口价值" },
      { expertName: "沈默", text: "问题是从浅到深的那座桥，在算法里几乎不存在，多数人停在了入口。", publicThought: "想点出桥梁缺失" },
    ],
    consensus: [
      { statement: "短视频显著降低了知识获取的门槛", supporters: ["许知", "白露"], opponents: [] },
    ],
    divergences: [
      { statement: "短视频对深度思考的影响是正还是负", supporters: ["许知"], opponents: ["沈默", "白露"] },
    ],
    summary: "许知看重普及与入口的价值，沈默担忧深度被金句化吞噬，白露则从注意力机制提醒算法对认知的绑架。共识是门槛确实降低了，但'从浅入深'的路径缺失，是短视频作为知识媒介最大的未解难题。",
  },
  {
    topic: "延迟退休对年轻一代是利是弊？",
    host: { name: "吴桐", title: "财经评论主持人" },
    experts: [
      { name: "李严", title: "社保政策研究者", stance: "利：缓解养老金压力", color: "#0891b2" },
      { name: "陈晨", title: "青年就业导师", stance: "弊：挤压年轻岗位", color: "#f97316" },
      { name: "杜康", title: "宏观经济学家", stance: "看结构与配套", color: "#16a34a" },
      { name: "罗薇", title: "职场博主", stance: "关注个体选择权", color: "#db2777" },
    ],
    opening: "延迟退休政策一出来就争议不断，尤其年轻人关心：这对我到底是好是坏？",
    speeches: [
      { expertName: "李严", text: "人口结构摆在那里，不延迟退休，养老金收支缺口会越来越大，最终还是要年轻一代买单。", publicThought: "想从养老金可持续性切入" },
      { expertName: "陈晨", text: "可延迟退休意味着高级岗位被占更久，年轻人的晋升通道和就业机会会被进一步压缩。", publicThought: "想点出代际挤压" },
      { expertName: "杜康", text: "这两件事不能简单对立，关键看配套——如果延迟退休释放的劳动力能被合理配置，未必是零和。", publicThought: "想引入结构性视角" },
      { expertName: "罗薇", text: "我最在意的是选择权，能不能弹性退休，让想继续的人继续、想退的人体面退出。", publicThought: "想强调个体选择" },
      { expertName: "陈晨", text: "弹性是理想状态，但现实中岗位和社保都是刚性的，弹性空间往往落不到普通人头上。", publicThought: "想质疑弹性可行性" },
      { expertName: "李严", text: "所以政策才需要精算和过渡安排，把对年轻一代的冲击降到最低，而不是一刀切。", publicThought: "想把话题收回到政策设计" },
    ],
    consensus: [
      { statement: "延迟退休是应对老龄化的必要选项", supporters: ["李严", "杜康"], opponents: [] },
      { statement: "政策能否成立取决于配套与弹性设计", supporters: ["杜康", "罗薇", "李严"], opponents: [] },
    ],
    divergences: [
      { statement: "延迟退休对年轻人就业是挤压还是中性", supporters: ["陈晨"], opponents: ["杜康", "李严"] },
    ],
    summary: "李严从养老金可持续性强调必要性，陈晨担忧代际岗位挤压，杜康和罗薇则把焦点引向配套与个体选择权。共识是延迟退休方向难以避免，但能否对年轻一代真正公平，取决于精算、过渡与弹性安排的落地程度。",
  },
];

async function seedDiscussion(sample: Sample) {
  const discussion = await prisma.discussion.create({
    data: {
      topic: sample.topic,
      expertCount: sample.experts.length,
      status: "finished",
      consensus: JSON.stringify({
        consensus: sample.consensus,
        divergences: sample.divergences,
      }),
      summary: sample.summary,
      finishedAt: new Date(),
    },
  });

  await prisma.participant.create({
    data: {
      discussionId: discussion.id,
      role: "HOST",
      name: sample.host.name,
      title: sample.host.title,
      order: 0,
    },
  });

  const expertIds = new Map<string, string>();
  for (let i = 0; i < sample.experts.length; i++) {
    const e = sample.experts[i];
    const p = await prisma.participant.create({
      data: {
        discussionId: discussion.id,
        role: "EXPERT",
        name: e.name,
        title: e.title,
        stance: e.stance,
        color: e.color,
        order: i + 1,
      },
    });
    expertIds.set(e.name, p.id);
  }

  const events: { type: string; payload: unknown }[] = [];
  events.push({ type: "discussion.created", payload: { topic: sample.topic, expertCount: sample.experts.length } });
  events.push({ type: "lineup.ready", payload: { host: sample.host, experts: sample.experts } });
  events.push({ type: "discussion.started", payload: {} });
  events.push({ type: "host.speech", payload: { kind: "opening", text: sample.opening } });

  for (const s of sample.speeches) {
    const expertId = expertIds.get(s.expertName)!;
    events.push({ type: "expert.status", payload: { expertId, status: "preparing", publicThought: s.publicThought } });
    events.push({ type: "expert.status", payload: { expertId, status: "speaking" } });
    events.push({ type: "speech.done", payload: { expertId, text: s.text, publicThought: s.publicThought } });
    events.push({ type: "expert.status", payload: { expertId, status: "idle" } });
  }

  events.push({ type: "consensus.updated", payload: { consensus: sample.consensus, divergences: sample.divergences } });
  events.push({ type: "host.speech", payload: { kind: "summary", text: sample.summary } });
  events.push({ type: "discussion.finished", payload: { summary: sample.summary } });

  for (const ev of events) {
    await prisma.event.create({
      data: {
        discussionId: discussion.id,
        type: ev.type,
        payload: JSON.stringify(ev.payload),
      },
    });
  }
}

async function main() {
  await prisma.event.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.discussion.deleteMany();

  for (const sample of samples) {
    await seedDiscussion(sample);
  }

  const count = await prisma.discussion.count();
  console.log(`Seeded ${count} discussions with full event timelines.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
