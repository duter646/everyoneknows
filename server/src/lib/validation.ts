import { Difficulty, Question, QuestionType } from "./types";

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

const allowedTypes: QuestionType[] = ["single", "multiple"];
const allowedDifficulties: Difficulty[] = ["easy", "medium", "hard"];

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => Number.isInteger(item));
}

export function validateQuestions(
  questions: Partial<Question>[],
  knownDomains?: Set<string>
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const idSet = new Set<string>();

  questions.forEach((question, index) => {
    const id = typeof question.id === "string" ? question.id.trim() : "";
    if (!id) {
      issues.push({
        level: "error",
        field: "id",
        message: `Question at index ${index} is missing an id.`
      });
    } else if (idSet.has(id)) {
      issues.push({
        id,
        level: "error",
        field: "id",
        message: `Duplicate id detected: ${id}.`
      });
    } else {
      idSet.add(id);
    }

    if (!question.domain || typeof question.domain !== "string") {
      issues.push({
        id,
        level: "error",
        field: "domain",
        message: `Question ${id || index} is missing a domain.`
      });
    } else if (knownDomains && !knownDomains.has(question.domain)) {
      issues.push({
        id,
        level: "warning",
        field: "domain",
        message: `Domain ${question.domain} is new and not in the current bank.`
      });
    }

    if (!question.type || !allowedTypes.includes(question.type)) {
      issues.push({
        id,
        level: "error",
        field: "type",
        message: `Question ${id || index} has invalid type.`
      });
    }

    if (!question.question || typeof question.question !== "string") {
      issues.push({
        id,
        level: "error",
        field: "question",
        message: `Question ${id || index} has empty question text.`
      });
    }

    if (!Array.isArray(question.options) || question.options.length < 2) {
      issues.push({
        id,
        level: "error",
        field: "options",
        message: `Question ${id || index} must have at least two options.`
      });
    }

    if (!isNumberArray(question.answer) || question.answer.length < 1) {
      issues.push({
        id,
        level: "error",
        field: "answer",
        message: `Question ${id || index} must have a numeric answer array.`
      });
    }

    if (question.type === "single" && isNumberArray(question.answer)) {
      if (question.answer.length !== 1) {
        issues.push({
          id,
          level: "error",
          field: "answer",
          message: `Single-choice question ${id || index} must have exactly one answer.`
        });
      }
    }

    if (question.type === "multiple" && isNumberArray(question.answer)) {
      if (question.answer.length < 2) {
        issues.push({
          id,
          level: "warning",
          field: "answer",
          message: `Multiple-choice question ${id || index} should have at least two answers.`
        });
      }
    }

    if (
      question.options &&
      Array.isArray(question.options) &&
      isNumberArray(question.answer)
    ) {
      const maxIndex = question.options.length - 1;
      question.answer.forEach((idx) => {
        if (idx < 0 || idx > maxIndex) {
          issues.push({
            id,
            level: "error",
            field: "answer",
            message: `Answer index ${idx} out of range for question ${id || index}.`
          });
        }
      });
    }

    if (!question.difficulty || !allowedDifficulties.includes(question.difficulty)) {
      issues.push({
        id,
        level: "error",
        field: "difficulty",
        message: `Question ${id || index} has invalid difficulty.`
      });
    }
  });

  const hasErrors = issues.some((issue) => issue.level === "error");
  return { valid: !hasErrors, issues };
}
