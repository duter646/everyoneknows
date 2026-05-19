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
  answer: number[];
  explanation?: string;
  tags?: string[];
}

export interface Meta {
  questionCount: number;
  domainCount: number;
  domains: string[];
  loadedAt: number;
}

export interface AdminSummary {
  questionCount: number;
  domainCount: number;
  importedCount: number;
  disabledCount: number;
}

export interface AdminImportResult {
  added: number;
  skipped: number;
  issues?: { message: string }[];
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
  rawUserTotal?: number;
  rawBaseTotal?: number;
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

export interface LeaderboardRow {
  id: string;
  nickname: string;
  score: number;
  correct_count: number;
  total_count: number;
  accuracy: number | string;
  duration_sec: number;
  submitted_at: string;
}
