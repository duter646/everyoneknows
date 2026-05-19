import { AnswerPayload, PaperResponse, QuestionView, ScoreSummary, ScoreItem } from "./types";

interface QuestionFull {
  id: string;
  domain: string;
  type: "single" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  answer: number[];
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

export async function localFetchPaper(count: number): Promise<PaperResponse> {
  const questions = await loadQuestions();

  const domainGroups: Record<string, QuestionFull[]> = {};
  questions.forEach((q) => {
    if (q.type !== "single" && q.type !== "multiple") return;
    if (!domainGroups[q.domain]) domainGroups[q.domain] = [];
    domainGroups[q.domain].push(q);
  });

  const domains = Object.keys(domainGroups);
  const selectedQuestions: QuestionFull[] = [];

  const shuffledDomains = shuffle(domains);
  let domainIdx = 0;

  while (selectedQuestions.length < count && domains.length > 0) {
    const domain = shuffledDomains[domainIdx % domains.length];
    const available = domainGroups[domain].filter((q) => !selectedQuestions.includes(q));
    if (available.length > 0) {
      selectedQuestions.push(available[Math.floor(Math.random() * available.length)]);
    } else {
      domains.splice(domains.indexOf(domain), 1);
      shuffledDomains.splice(shuffledDomains.indexOf(domain), 1);
    }
    if (domains.length === 0) break;
    domainIdx++;
  }

  const finalQuestions = shuffle(selectedQuestions);
  const token = Math.random().toString(36).substring(2);

  currentPaperSession = {
    token,
    questions: finalQuestions
  };

  const views: QuestionView[] = finalQuestions.map((q) => ({
    id: q.id,
    domain: q.domain,
    type: q.type,
    difficulty: q.difficulty,
    question: q.question,
    options: q.options.map((opt, i) => ({ id: i, text: opt })),
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
      timeSec: t
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
