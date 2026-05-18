export type QuestionType = "single" | "multiple";
export type Difficulty = "easy" | "medium" | "hard";

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

export interface PaperResponse {
  token: string;
  questions: QuestionView[];
}

export interface AnswerPayload {
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

export interface LeaderboardEntry {
  rank: number;
  id: string;
  nickname: string;
  score: number;
  correctCount: number;
  totalCount: number;
  accuracy: number;
  durationSec: number;
  submittedAt: number;
}
