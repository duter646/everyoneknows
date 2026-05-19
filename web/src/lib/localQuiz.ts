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

// Fisher-Yates shuffle
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
  
  // Group by domain
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
     const available = domainGroups[domain].filter(q => !selectedQuestions.includes(q));
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

  const views: QuestionView[] = finalQuestions.map(q => ({
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
  let score = 0;
  let totalPossible = 0;
  let correctCount = 0;
  
  const multiStats = {
    total: 0,
    fullyCorrect: 0,
    missedOne: 0,
    subsetOnly: 0,
  };

  const items: ScoreItem[] = questions.map(q => {
     const weight = q.difficulty === "hard" ? 3 : q.difficulty === "medium" ? 2 : 1;
     const typeMultiplier = q.type === "multiple" ? 2 : 1;
     const maxScore = weight * typeMultiplier;
     totalPossible += maxScore;
     
     const ans = answers.find(a => a.id === q.id);
     const selected = ans ? ans.selected.sort() : [];
     const correct = [...q.answer].sort();
     
     let isCorrect = false;
     let itemScore = 0;

     if (q.type === "single") {
        if (selected.length === 1 && selected[0] === correct[0]) {
           isCorrect = true;
           itemScore = maxScore;
           correctCount++;
        }
     } else if (q.type === "multiple") {
        multiStats.total++;
        if (selected.length === correct.length && selected.every((val, i) => val === correct[i])) {
           isCorrect = true;
           itemScore = maxScore;
           correctCount++;
           multiStats.fullyCorrect++;
        } else if (selected.length > 0 && selected.every(val => correct.includes(val))) {
           isCorrect = false;
           itemScore = maxScore * 0.5;
           multiStats.subsetOnly++;
           if (selected.length === correct.length - 1) {
              multiStats.missedOne++;
           }
        }
     }

     score += itemScore;

     return {
        id: q.id,
        domain: q.domain,
        type: q.type,
        difficulty: q.difficulty,
        score: itemScore,
        isCorrect,
        timeSec: ans?.timeSec
     };
  });

  return {
    score,
    totalPossible,
    correctCount,
    totalCount: questions.length,
    items,
    multiStats
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
