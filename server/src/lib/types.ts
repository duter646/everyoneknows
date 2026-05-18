export type QuestionType = "single" | "multiple";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  domain: string;
  type: QuestionType;
  question: string;
  options: string[];
  answer: number[];
  difficulty: Difficulty;
  explanation?: string;
  tags?: string[];
}

export interface QuestionOptionView {
  id: number;
  text: string;
}

export interface QuestionView {
  id: string;
  domain: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options: QuestionOptionView[];
  tags?: string[];
}

export interface AnswerInput {
  id: string;
  selected: number[];
  timeSec?: number;
}

export interface ScoreItem {
  id: string;
  domain: string;
  type: QuestionType;
  difficulty: Difficulty;
  score: number;
  isCorrect: boolean;
  timeSec?: number;
}

export interface ScoreSummary {
  score: number;
  totalPossible: number;
  correctCount: number;
  totalCount: number;
  items: ScoreItem[];
  multiStats: {
    total: number;
    fullyCorrect: number;
    missedOne: number;
    subsetOnly: number;
  };
}
