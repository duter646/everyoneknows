import { AnswerPayload, PaperResponse, QuestionView, ScoreSummary, ScoreItem } from "./types";

interface QuestionFull {
  id: string;
  domain: string;
  type: "single" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  answer: number[];
  explanation?: string;
  vector?: Record<string, number>;
  tags?: string[];
}

let allQuestions: QuestionFull[] | null = null;
let currentPaperSession: {
  token: string;
  questions: QuestionFull[];
} | null = null;

const BASE_SCORE_MAP: Record<string, Record<string, number>> = {
  easy: { single: 10, multiple: 15 },
  medium: { single: 15, multiple: 22.5 },
  hard: { single: 20, multiple: 30 }
};

const STANDARD_TIME: Record<string, number> = { easy: 7, medium: 12, hard: 20 };
const TIME_ALPHA = 0.5;
const TIME_BETA = 0.5;
const TIME_T_MIN = 2;

function getBaseScore(difficulty: string, type: string): number {
  return BASE_SCORE_MAP[difficulty]?.[type] ?? 10;
}

function getStandardTime(difficulty: string, type: string): number {
  let t = STANDARD_TIME[difficulty] ?? 10;
  if (type === "multiple") t *= 1.5;
  return t;
}

function computeCorrectness(
  type: string,
  selected: number[],
  correct: number[]
): number {
  if (type === "single") {
    return selected.length === 1 && selected[0] === correct[0] ? 1 : 0;
  }
  if (selected.length === 0) return 0;
  const hasWrong = selected.some((val) => !correct.includes(val));
  if (hasWrong) return 0;
  const overlap = selected.filter((val) => correct.includes(val)).length;
  return overlap / correct.length;
}

function computeTimeFactor(t: number, difficulty: string, type: string): number {
  if (t < TIME_T_MIN) return TIME_BETA;
  const T = getStandardTime(difficulty, type);
  const r = t / T;
  if (r <= 1) {
    return 1 + TIME_ALPHA * (1 - r);
  }
  return Math.max(TIME_BETA, 1 - TIME_ALPHA * (r - 1));
}

async function loadQuestions() {
  if (allQuestions) return allQuestions;
  let res = await fetch("/everyoneknows/questions.json").catch(() => null);

  if (!res || !res.ok) {
    res = await fetch("/questions.json").catch(() => null);
  }

  if (!res || !res.ok) {
    throw new Error("Failed to load questions.json");
  }

  allQuestions = await res.json();
  return allQuestions!;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type DifficultyProfile = "721" | "343" | "136";

const DIFFICULTY_PROFILES: Record<DifficultyProfile, Record<string, number>> = {
  "721": { easy: 0.7, medium: 0.2, hard: 0.1 },
  "343": { easy: 0.3, medium: 0.4, hard: 0.3 },
  "136": { easy: 0.1, medium: 0.3, hard: 0.6 }
};

export async function localFetchPaper(count: number, diffProfile: DifficultyProfile = "343"): Promise<PaperResponse> {
  const allQ = await loadQuestions();

  const validQ = allQ.filter((q) => q.type === "single" || q.type === "multiple");

  const SINGLE_RATIO = 0.75;
  const DIFFICULTY_RATIOS = DIFFICULTY_PROFILES[diffProfile];
  const MAX_SAME_DOMAIN = 3;
  const MIN_DOMAIN_COUNT = Math.ceil(count / 1.5);

  const targetSingle = Math.round(count * SINGLE_RATIO);
  const targetMultiple = count - targetSingle;

  const targetByType: Record<string, number> = { single: targetSingle, multiple: targetMultiple };
  const targetByDiff: Record<string, number> = {};
  for (const [diff, ratio] of Object.entries(DIFFICULTY_RATIOS)) {
    targetByDiff[diff] = Math.round(count * ratio);
  }

  const buckets: Record<string, QuestionFull[]> = {};
  for (const type of ["single", "multiple"]) {
    for (const diff of ["easy", "medium", "hard"]) {
      const key = `${type}_${diff}`;
      buckets[key] = validQ.filter((q) => q.type === type && q.difficulty === diff);
    }
  }

  const bucketTargets: Record<string, number> = {};
  for (const type of ["single", "multiple"]) {
    for (const diff of ["easy", "medium", "hard"]) {
      const key = `${type}_${diff}`;
      bucketTargets[key] = Math.round(targetByType[type] * DIFFICULTY_RATIOS[diff]);
    }
  }

  const selected: QuestionFull[] = [];
  const usedIds = new Set<string>();
  const domainCount: Record<string, number> = {};

  function pickFromPool(pool: QuestionFull[], max: number): QuestionFull[] {
    const available = pool.filter((q) => !usedIds.has(q.id) && (domainCount[q.domain] || 0) < MAX_SAME_DOMAIN);
    const shuffled = shuffle(available);
    const picked: QuestionFull[] = [];
    for (const q of shuffled) {
      if (picked.length >= max) break;
      picked.push(q);
    }
    return picked;
  }

  function addQuestions(qs: QuestionFull[]) {
    for (const q of qs) {
      selected.push(q);
      usedIds.add(q.id);
      domainCount[q.domain] = (domainCount[q.domain] || 0) + 1;
    }
  }

  const bucketOrder = shuffle(Object.keys(bucketTargets));
  for (const key of bucketOrder) {
    const target = bucketTargets[key];
    const remaining = count - selected.length;
    const actualTarget = Math.min(target, remaining);
    if (actualTarget <= 0) continue;
    const picked = pickFromPool(buckets[key], actualTarget);
    addQuestions(picked);
  }

  if (selected.length < count) {
    const fallback = validQ.filter((q) => !usedIds.has(q.id) && (domainCount[q.domain] || 0) < MAX_SAME_DOMAIN);
    const shuffled = shuffle(fallback);
    for (const q of shuffled) {
      if (selected.length >= count) break;
      selected.push(q);
      usedIds.add(q.id);
      domainCount[q.domain] = (domainCount[q.domain] || 0) + 1;
    }
  }

  if (selected.length < count) {
    const remaining = validQ.filter((q) => !usedIds.has(q.id));
    const shuffled = shuffle(remaining);
    for (const q of shuffled) {
      if (selected.length >= count) break;
      selected.push(q);
      usedIds.add(q.id);
      domainCount[q.domain] = (domainCount[q.domain] || 0) + 1;
    }
  }

  const coveredDomains = Object.keys(domainCount).length;
  if (coveredDomains < MIN_DOMAIN_COUNT && selected.length >= count) {
    const domainEntries = Object.entries(domainCount).sort((a, b) => b[1] - a[1]);
    const overDomains = domainEntries.filter(([, c]) => c > 1);
    const uncoveredDomains = new Set(
      [...new Set(validQ.map((q) => q.domain))].filter((d) => !domainCount[d])
    );

    for (const [domain] of overDomains) {
      if (uncoveredDomains.size === 0) break;
      if (coveredDomains + (count - selected.length) >= MIN_DOMAIN_COUNT) break;

      const domainQuestions = selected.filter((q) => q.domain === domain);
      if (domainQuestions.length <= 1) continue;

      const removable = domainQuestions[domainQuestions.length - 1];
      const newDomain = [...uncoveredDomains][0];
      const replacement = validQ.find(
        (q) => q.domain === newDomain && !usedIds.has(q.id) && q.type === removable.type && q.difficulty === removable.difficulty
      ) || validQ.find(
        (q) => q.domain === newDomain && !usedIds.has(q.id)
      );

      if (replacement) {
        const idx = selected.indexOf(removable);
        selected[idx] = replacement;
        usedIds.delete(removable.id);
        usedIds.add(replacement.id);
        domainCount[domain]--;
        if (domainCount[domain] === 0) delete domainCount[domain];
        domainCount[newDomain] = (domainCount[newDomain] || 0) + 1;
        uncoveredDomains.delete(newDomain);
      }
    }
  }

  const finalQuestions = shuffle(selected);
  const token = Math.random().toString(36).substring(2);

  currentPaperSession = {
    token,
    questions: finalQuestions.map((q) => {
      const shuffledOptionIndices = shuffle(q.options.map((_, i) => i));
      const answerRemap = new Map<number, number>();
      shuffledOptionIndices.forEach((origIdx, newIdx) => {
        answerRemap.set(origIdx, newIdx);
      });
      return {
        ...q,
        options: shuffledOptionIndices.map((origIdx) => q.options[origIdx]),
        answer: q.answer.map((origIdx) => answerRemap.get(origIdx)!).sort()
      };
    })
  };

  const sessionQuestions = currentPaperSession.questions;
  const views: QuestionView[] = sessionQuestions.map((q) => ({
    id: q.id,
    domain: q.domain,
    type: q.type,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options.map((opt, i) => ({ id: i, text: opt })),
    answer: q.answer,
    explanation: q.explanation,
    vector: q.vector,
    tags: q.tags
  }));

  return { token, questions: views };
}

export async function localScorePaper(token: string, answers: AnswerPayload[]): Promise<ScoreSummary> {
  if (!currentPaperSession || currentPaperSession.token !== token) {
    throw new Error("Invalid or expired session token");
  }

  const questions = currentPaperSession.questions;
  let userTotal = 0;
  let baseTotal = 0;
  let correctCount = 0;

  const multiStats = {
    total: 0,
    fullyCorrect: 0,
    missedOne: 0,
    subsetOnly: 0
  };

  const items: ScoreItem[] = questions.map((q) => {
    const baseScore = getBaseScore(q.difficulty, q.type);
    baseTotal += baseScore;

    const ans = answers.find((a) => a.id === q.id);
    const selected = ans ? [...ans.selected].sort() : [];
    const correct = [...q.answer].sort();

    const correctness = computeCorrectness(q.type, selected, correct);
    const t = ans?.timeSec ?? 0;

    let isCorrect = false;
    let itemScore = 0;

    if (correctness > 0) {
      const timeFactor = computeTimeFactor(t, q.difficulty, q.type);
      itemScore = baseScore * correctness * timeFactor;
      itemScore = Math.round(itemScore * 10) / 10;
    }

    if (q.type === "single") {
      if (correctness === 1) {
        isCorrect = true;
        correctCount++;
      }
    } else if (q.type === "multiple") {
      multiStats.total++;
      const hasWrong = selected.some((val) => !correct.includes(val));
      if (
        selected.length === correct.length &&
        selected.every((val, i) => val === correct[i])
      ) {
        isCorrect = true;
        correctCount++;
        multiStats.fullyCorrect++;
      } else if (selected.length > 0 && !hasWrong) {
        multiStats.subsetOnly++;
        if (correct.length - selected.length === 1) {
          multiStats.missedOne++;
        }
      }
    }

    userTotal += itemScore;

    return {
      id: q.id,
      domain: q.domain,
      type: q.type,
      difficulty: q.difficulty,
      score: itemScore,
      isCorrect,
      timeSec: t,
      vector: q.vector
    };
  });

  const finalScore = baseTotal > 0 ? Math.round((userTotal / baseTotal) * 100 * 10) / 10 : 0;

  return {
    score: finalScore,
    totalPossible: 100,
    correctCount,
    totalCount: questions.length,
    items,
    multiStats,
    rawUserTotal: Math.round(userTotal * 10) / 10,
    rawBaseTotal: Math.round(baseTotal * 10) / 10
  };
}
export async function localFetchMeta(): Promise<{
  questionCount: number;
  domainCount: number;
  domains: string[];
  loadedAt: number;
}> {
  const questions = await loadQuestions();
  const domains = new Set<string>();
  questions.forEach(q => domains.add(q.domain));
  return {
    questionCount: questions.length,
    domainCount: domains.size,
    domains: Array.from(domains),
    loadedAt: Date.now()
  };
}
