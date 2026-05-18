import { QuestionView } from "./types";

export type ValidationLevel = "error" | "warning";

export interface ValidationIssue {
  id?: string;
  field?: string;
  level: ValidationLevel;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validateQuestionsClient(questions: Partial<QuestionView>[]) {
  const issues: ValidationIssue[] = [];
  const idSet = new Set<string>();

  questions.forEach((question, index) => {
    const id = typeof question.id === "string" ? question.id.trim() : "";
    if (!id) {
      issues.push({
        level: "error",
        field: "id",
        message: `第 ${index + 1} 行缺少 id。`
      });
    } else if (idSet.has(id)) {
      issues.push({
        id,
        level: "error",
        field: "id",
        message: `发现重复 id：${id}`
      });
    } else {
      idSet.add(id);
    }

    if (!question.domain) {
      issues.push({
        id,
        level: "error",
        field: "domain",
        message: `题目 ${id || index + 1} 缺少领域。`
      });
    }

    if (question.type !== "single" && question.type !== "multiple") {
      issues.push({
        id,
        level: "error",
        field: "type",
        message: `题目 ${id || index + 1} 的题型不合法。`
      });
    }

    if (!question.question) {
      issues.push({
        id,
        level: "error",
        field: "question",
        message: `题目 ${id || index + 1} 缺少题干。`
      });
    }

    if (!Array.isArray(question.options) || question.options.length < 2) {
      issues.push({
        id,
        level: "error",
        field: "options",
        message: `题目 ${id || index + 1} 选项数量不足。`
      });
    }

    if (!Array.isArray((question as { answer?: number[] }).answer)) {
      issues.push({
        id,
        level: "error",
        field: "answer",
        message: `题目 ${id || index + 1} 缺少答案数组。`
      });
    }
  });

  const hasErrors = issues.some((issue) => issue.level === "error");
  return { valid: !hasErrors, issues } as ValidationResult;
}
