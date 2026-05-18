import { ScoreItem } from "./types";

export const DISCIPLINES = [
  "哲学",
  "经济学",
  "法学",
  "教育学",
  "文学",
  "历史学",
  "理学",
  "工学",
  "农学",
  "医学",
  "军事学",
  "管理学",
  "艺术学",
  "日子人"
] as const;

export type Discipline = (typeof DISCIPLINES)[number];

type Vector = Partial<Record<Discipline, number>>;

const DOMAIN_VECTOR: Record<string, Vector> = {
  "一些猎奇小众知识": { 日子人: 1 },
  "互联网与网络": { 工学: 1 },
  "交通与工程": { 工学: 1 },
  "人工智能基础": { 工学: 1 },
  "体育常识": { 日子人: 1 },
  "农学": { 农学: 1 },
  "化学常识": { 理学: 1 },
  "医学与健康": { 医学: 1 },
  "历史": { 历史学: 1 },
  "哲学常识": { 哲学: 1 },
  "国际组织与外交": { 法学: 0.6, 管理学: 0.4 },
  "地球科学": { 理学: 1 },
  "地理": { 理学: 1 },
  "天文学": { 理学: 1 },
  "奥运与赛事": { 日子人: 1 },
  "宠物与动物行为学": { 农学: 0.6, 日子人: 0.4 },
  "工业界常识": { 工学: 1 },
  "建筑与设计": { 工学: 0.6, 艺术学: 0.4 },
  "心理学常识": { 管理学: 0.7, 医学: 0.3 },
  "政治制度": { 法学: 0.6, 管理学: 0.4 },
  "数学常识": { 理学: 1 },
  "文学": { 文学: 1 },
  "日常生活与安全": { 日子人: 1 },
  "时事热点": { 管理学: 0.6, 法学: 0.4 },
  "时尚与服装史": { 艺术学: 1 },
  "法律常识": { 法学: 1 },
  "游戏知识": { 日子人: 1 },
  "物理常识": { 理学: 1 },
  "环境与可持续发展": { 理学: 0.6, 农学: 0.4 },
  "现代军事常识": { 军事学: 1 },
  "生物常识": { 理学: 0.6, 医学: 0.2, 农学: 0.2 },
  "电影与戏剧": { 艺术学: 1 },
  "社会学与人类学": { 管理学: 0.6, 哲学: 0.4 },
  "神话与民间传说": { 历史学: 0.6, 文学: 0.4 },
  "科技史": { 历史学: 0.5, 工学: 0.5 },
  "经济学常识": { 经济学: 1 },
  "网络梗知识": { 日子人: 1 },
  "美食与营养": { 医学: 0.6, 日子人: 0.4 },
  "艺术史": { 艺术学: 1 },
  "计算机基础": { 工学: 1 },
  "语言学与文字": { 文学: 1 },
  "逻辑学与思维法则": { 哲学: 0.6, 理学: 0.4 },
  "金融常识": { 经济学: 0.6, 管理学: 0.4 },
  "音乐常识": { 艺术学: 1 }
};

const PREFIX_BY_SCORE = [
  { threshold: 1, label: "人形AI" },
  { threshold: 0.8, label: "降维打击的学神" },
  { threshold: 0.6, label: "低分飘过的及格生" },
  { threshold: 0, label: "刚断奶的小屁孩" }
];

const SUFFIX_BY_DISCIPLINE: Record<Discipline, string> = {
  "哲学": "在野文史哲学者",
  "经济学": "准华尔街之狼",
  "法学": "律政先锋",
  "教育学": "灵魂导师",
  "文学": "吟游诗人",
  "历史学": "在野文史哲学者",
  "理学": "理科做题家",
  "工学": "硬核赛博打灰人",
  "农学": "赛博神农",
  "医学": "熬夜秃头的医学生",
  "军事学": "战术键盘侠",
  "管理学": "准华尔街之狼",
  "艺术学": "灵魂派画师",
  "日子人": "冲浪一级达人"
};

const DIFFICULTY_WEIGHT = {
  easy: 0.8,
  medium: 1,
  hard: 1.2
} as const;

export interface IdentityResult {
  totals: Record<Discipline, number>;
  percents: Record<Discipline, number>;
  topThree: { discipline: Discipline; percent: number }[];
  title: string;
  prefix: string;
  suffix: string;
}

export function scoreIdentity(items: ScoreItem[], scoreRate: number): IdentityResult {
  const totals = DISCIPLINES.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<Discipline, number>);

  items.forEach((item) => {
    if (!item.isCorrect) {
      return;
    }
    const vector = DOMAIN_VECTOR[item.domain] || { 日子人: 1 };
    const weight = DIFFICULTY_WEIGHT[item.difficulty] || 1;
    Object.entries(vector).forEach(([discipline, value]) => {
      const key = discipline as Discipline;
      totals[key] += (value || 0) * weight;
    });
  });

  const totalScore = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;
  const percents = DISCIPLINES.reduce((acc, key) => {
    acc[key] = Number(((totals[key] / totalScore) * 100).toFixed(1));
    return acc;
  }, {} as Record<Discipline, number>);

  const ranked = DISCIPLINES
    .map((discipline) => ({ discipline, score: totals[discipline] }))
    .sort((a, b) => b.score - a.score);

  const topThree = ranked.slice(0, 3).map((item) => ({
    discipline: item.discipline,
    percent: percents[item.discipline]
  }));

  const prefix = PREFIX_BY_SCORE.find((item) => scoreRate >= item.threshold)?.label ?? "未知生物";
  const topDiscipline = topThree[0]?.discipline ?? "日子人";
  const suffix = SUFFIX_BY_DISCIPLINE[topDiscipline];
  const title = `你是一个【${prefix}】级别的【${suffix}】！`;

  return { totals, percents, topThree, title, prefix, suffix };
}
