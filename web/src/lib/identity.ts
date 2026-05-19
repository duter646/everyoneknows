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
  { threshold: 1.0, label: "通晓万物的星童" },
  { threshold: 0.9, label: "降维打击的学神" },
  { threshold: 0.8, label: "知识面极其离谱的学霸" },
  { threshold: 0.6, label: "涉猎广泛的及格生" },
  { threshold: 0.4, label: "偏科严重的学渣" },
  { threshold: 0, label: "刚出新手村的小白" }
];

const SUFFIX_BY_DISCIPLINE: Record<Discipline, string> = {
  "哲学": "仰望星空的思想家",
  "经济学": "准华尔街之狼",
  "法学": "无情法外狂徒",
  "教育学": "灵魂指路黑塔",
  "文学": "忧郁吟游诗人",
  "历史学": "穿越时空的记录者",
  "理学": "洞视宇宙的赛博真理客",
  "工学": "硬核赛博打灰人",
  "农学": "赛博神农后浪",
  "医学": "熬夜秃头的医学生",
  "军事学": "纸上谈兵战术家",
  "管理学": "职场PUA防御带师",
  "艺术学": "灵魂派行为艺术家",
  "日子人": "太有生活了"
};

const SMOOTH_K = 3;
const CONFIDENCE_K = Math.log(19);
const SIGNAL_EPSILON = 0.01;

function getVector(item: ScoreItem): Vector {
  if (item.vector) {
    const vec: Vector = {};
    for (const [key, val] of Object.entries(item.vector)) {
      if (DISCIPLINES.includes(key as Discipline)) {
        vec[key as Discipline] = val;
      }
    }
    if (Object.keys(vec).length > 0) return vec;
  }
  return DOMAIN_VECTOR[item.domain] || { 日子人: 1 };
}

export interface IdentityResult {
  signals: Record<Discipline, number>;
  percents: Record<Discipline, number>;
  topThree: { discipline: Discipline; percent: number }[];
  title: string;
  prefix: string;
  suffix: string;
}

export function scoreIdentity(items: ScoreItem[], scoreRate: number): IdentityResult {
  const userScores = DISCIPLINES.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<Discipline, number>);

  const effectiveCount = DISCIPLINES.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<Discipline, number>);

  items.forEach((item) => {
    const vector = getVector(item);
    Object.entries(vector).forEach(([discipline, value]) => {
      const key = discipline as Discipline;
      const w = value || 0;
      userScores[key] += item.score * w;
      effectiveCount[key] += w;
    });
  });

  const signals = DISCIPLINES.reduce((acc, key) => {
    const count = effectiveCount[key];
    if (count <= 0) {
      acc[key] = 0;
      return acc;
    }
    const avgScore = userScores[key] / count;
    const confidence = count / (count + SMOOTH_K);
    acc[key] = avgScore * confidence;
    return acc;
  }, {} as Record<Discipline, number>);

  const sorted = DISCIPLINES
    .map((d) => ({ discipline: d, signal: signals[d] }))
    .sort((a, b) => b.signal - a.signal);

  const signal1 = sorted[0]?.signal ?? 0;
  const signal2 = sorted[1]?.signal ?? SIGNAL_EPSILON;
  const advantage = signal1 / Math.max(signal2, SIGNAL_EPSILON);
  const topConfidence = 1 / (1 + Math.exp(-CONFIDENCE_K * (advantage - 1)));

  const percents = DISCIPLINES.reduce((acc, key) => {
    if (signal1 <= 0) {
      acc[key] = 0;
      return acc;
    }
    acc[key] = Number((topConfidence * (signals[key] / signal1) * 100).toFixed(1));
    return acc;
  }, {} as Record<Discipline, number>);

  const topThree = sorted.slice(0, 3).map((item) => ({
    discipline: item.discipline,
    percent: percents[item.discipline]
  }));

  const prefix = PREFIX_BY_SCORE.find((item) => scoreRate >= item.threshold)?.label ?? "未知生物";
  const topDiscipline = topThree[0]?.discipline ?? "日子人";
  const suffix = SUFFIX_BY_DISCIPLINE[topDiscipline];
  const title = `你是一个【${prefix}】级别的【${suffix}】！`;

  return { signals, percents, topThree, title, prefix, suffix };
}
