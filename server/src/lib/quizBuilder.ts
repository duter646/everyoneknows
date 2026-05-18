import { Difficulty, Question, QuestionType } from "./types";
import { shuffle } from "./rng";

interface Bucket {
  type: QuestionType;
  difficulty: Difficulty;
  count: number;
  pool: Question[];
}

function getDifficultyTargets(count: number) {
  const easy = Math.round(count * 0.3);
  const medium = Math.round(count * 0.4);
  const hard = Math.max(count - easy - medium, 0);
  return { easy, medium, hard };
}

function clampCount(count: number, max: number) {
  return Math.min(Math.max(count, 0), max);
}

export function buildPaper(questions: Question[], count: number, rng: () => number) {
  const singleCount = clampCount(Math.round(count * 0.75), count);
  const multipleCount = count - singleCount;

  const singleTargets = getDifficultyTargets(singleCount);
  const multipleTargets = getDifficultyTargets(multipleCount);

  const buckets: Bucket[] = [
    {
      type: "single",
      difficulty: "easy",
      count: singleTargets.easy,
      pool: questions.filter((q) => q.type === "single" && q.difficulty === "easy")
    },
    {
      type: "single",
      difficulty: "medium",
      count: singleTargets.medium,
      pool: questions.filter((q) => q.type === "single" && q.difficulty === "medium")
    },
    {
      type: "single",
      difficulty: "hard",
      count: singleTargets.hard,
      pool: questions.filter((q) => q.type === "single" && q.difficulty === "hard")
    },
    {
      type: "multiple",
      difficulty: "easy",
      count: multipleTargets.easy,
      pool: questions.filter((q) => q.type === "multiple" && q.difficulty === "easy")
    },
    {
      type: "multiple",
      difficulty: "medium",
      count: multipleTargets.medium,
      pool: questions.filter((q) => q.type === "multiple" && q.difficulty === "medium")
    },
    {
      type: "multiple",
      difficulty: "hard",
      count: multipleTargets.hard,
      pool: questions.filter((q) => q.type === "multiple" && q.difficulty === "hard")
    }
  ];

  const selected: Question[] = [];
  const selectedIds = new Set<string>();
  const domainCounts = new Map<string, number>();

  const tryAdd = (question: Question) => {
    if (selectedIds.has(question.id)) {
      return false;
    }
    const currentCount = domainCounts.get(question.domain) ?? 0;
    if (currentCount >= 3) {
      return false;
    }
    selected.push(question);
    selectedIds.add(question.id);
    domainCounts.set(question.domain, currentCount + 1);
    return true;
  };

  const pickBalanced = (pool: Question[], targetCount: number) => {
    const shuffled = shuffle(pool, rng);
    for (let pass = 0; pass <= 2 && selected.length < count; pass += 1) {
      for (const question of shuffled) {
        if (selected.length >= count || targetCount <= 0) {
          return;
        }
        const currentCount = domainCounts.get(question.domain) ?? 0;
        if (currentCount > pass) {
          continue;
        }
        if (tryAdd(question)) {
          targetCount -= 1;
        }
      }
    }

    if (targetCount <= 0) {
      return;
    }

    for (const question of shuffled) {
      if (selected.length >= count || targetCount <= 0) {
        return;
      }
      if (tryAdd(question)) {
        targetCount -= 1;
      }
    }
  };

  buckets.forEach((bucket) => {
    if (bucket.count <= 0) {
      return;
    }
    pickBalanced(bucket.pool, bucket.count);
  });

  if (selected.length < count) {
    const remainingPool = questions.filter((question) => !selectedIds.has(question.id));
    pickBalanced(remainingPool, count - selected.length);
  }

  return shuffle(selected, rng).slice(0, count);
}
