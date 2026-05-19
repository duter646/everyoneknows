import { AnswerInput, ScoreQuestion, ScoreSummary } from "./types.ts";

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

export function scoreAnswers(
  questionMap: Map<string, ScoreQuestion>,
  questionOrder: string[],
  answers: AnswerInput[]
): ScoreSummary {
  const answerMap = new Map<string, AnswerInput>();
  answers.forEach((answer) => answerMap.set(answer.id, answer));

  const items = [] as ScoreSummary["items"];
  let userTotal = 0;
  let baseTotal = 0;
  let correctCount = 0;
  let multiTotal = 0;
  let multiFullyCorrect = 0;
  let multiMissedOne = 0;
  let multiSubsetOnly = 0;

  questionOrder.forEach((id) => {
    const question = questionMap.get(id);
    if (!question) {
      return;
    }
    const answer = answerMap.get(id);
    const selected = answer?.selected ?? [];
    const correct = question.answer;

    const baseScore = getBaseScore(question.difficulty, question.type);
    baseTotal += baseScore;

    const correctness = computeCorrectness(question.type, selected, correct);
    const t = answer?.timeSec ?? 0;

    let questionScore = 0;
    let isCorrect = false;

    if (correctness > 0) {
      const timeFactor = computeTimeFactor(t, question.difficulty, question.type);
      questionScore = baseScore * correctness * timeFactor;
      questionScore = Math.round(questionScore * 10) / 10;
    }

    if (question.type === "single") {
      if (correctness === 1) {
        isCorrect = true;
        correctCount++;
      }
    } else {
      multiTotal++;
      const hasWrong = selected.some((val) => !correct.includes(val));
      const isExact = selected.length === correct.length && selected.every((val) => correct.includes(val));
      if (isExact) {
        isCorrect = true;
        correctCount++;
        multiFullyCorrect++;
      } else if (!hasWrong && selected.length > 0 && selected.length < correct.length) {
        multiSubsetOnly++;
        if (correct.length - selected.length === 1) {
          multiMissedOne++;
        }
      }
    }

    userTotal += questionScore;

    items.push({
      id: question.id,
      domain: question.domain,
      type: question.type,
      difficulty: question.difficulty,
      score: questionScore,
      isCorrect,
      timeSec: answer?.timeSec
    });
  });

  const totalCount = questionOrder.length;
  const finalScore = baseTotal > 0 ? Math.round((userTotal / baseTotal) * 100 * 10) / 10 : 0;

  return {
    score: finalScore,
    totalPossible: 100,
    correctCount,
    totalCount,
    items,
    multiStats: {
      total: multiTotal,
      fullyCorrect: multiFullyCorrect,
      missedOne: multiMissedOne,
      subsetOnly: multiSubsetOnly
    }
  };
}
