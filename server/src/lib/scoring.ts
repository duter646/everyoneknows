import { AnswerInput, Question, ScoreSummary } from "./types";

const FULL_SCORE = 5;
const PARTIAL_SCORE = 2;

function isSameSet(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }
  const setA = new Set(a);
  return b.every((value) => setA.has(value));
}

export function scoreAnswers(
  questionMap: Map<string, Question>,
  questionOrder: string[],
  answers: AnswerInput[]
): ScoreSummary {
  const answerMap = new Map<string, AnswerInput>();
  answers.forEach((answer) => answerMap.set(answer.id, answer));

  const items = [] as ScoreSummary["items"];
  let score = 0;
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
    let questionScore = 0;
    let isCorrect = false;

    if (question.type === "single") {
      isCorrect = selected.length === 1 && selected[0] === question.answer[0];
      questionScore = isCorrect ? FULL_SCORE : 0;
    } else {
      multiTotal += 1;
      const correct = question.answer;
      const hasWrong = selected.some((value) => !correct.includes(value));
      const isExact = isSameSet(selected, correct);

      if (isExact) {
        questionScore = FULL_SCORE;
        isCorrect = true;
        multiFullyCorrect += 1;
      } else if (!hasWrong && selected.length > 0 && selected.length < correct.length) {
        questionScore = PARTIAL_SCORE;
        multiSubsetOnly += 1;
        if (correct.length - selected.length === 1) {
          multiMissedOne += 1;
        }
      }
    }

    score += questionScore;
    if (isCorrect) {
      correctCount += 1;
    }

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
  return {
    score,
    totalPossible: totalCount * FULL_SCORE,
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
