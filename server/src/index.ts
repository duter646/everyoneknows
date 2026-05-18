import express from "express";
import cors from "cors";
import crypto from "crypto";
import { getAdminSummary, getMeta, getQuestionBank, importQuestions, setQuestionEnabled } from "./lib/dataStore";
import { buildPaper } from "./lib/quizBuilder";
import { mulberry32, shuffle } from "./lib/rng";
import { signToken, verifyToken } from "./lib/token";
import { scoreAnswers } from "./lib/scoring";
import { appendLeaderboard, getLeaderboard } from "./lib/leaderboardStore";
import { validateQuestions } from "./lib/validation";
import { QuestionView } from "./lib/types";

const app = express();
const port = Number(process.env.PORT || 3001);
const createId = () => crypto.randomBytes(6).toString("base64url");

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/meta", async (_req, res) => {
  const meta = await getMeta();
  res.json(meta);
});

app.get("/api/paper", async (req, res) => {
  const count = Math.max(5, Math.min(Number(req.query.count) || 20, 50));
  const seed = (Date.now() ^ Math.floor(Math.random() * 1_000_000)) >>> 0;
  const rng = mulberry32(seed);
  const bank = await getQuestionBank();

  const paper = buildPaper(bank.questions, count, rng);
  const qids = paper.map((question) => question.id);
  const token = signToken({ qids, createdAt: Date.now(), version: 1 });

  const questions: QuestionView[] = paper.map((question) => {
    const options = shuffle(
      question.options.map((option, index) => ({ id: index, text: option })),
      rng
    );
    return {
      id: question.id,
      domain: question.domain,
      type: question.type,
      difficulty: question.difficulty,
      question: question.question,
      options,
      tags: question.tags
    };
  });

  res.json({ token, questions });
});

app.post("/api/score", async (req, res) => {
  const { token, answers } = req.body as { token?: string; answers?: unknown };
  if (!token || !Array.isArray(answers)) {
    res.status(400).json({ error: "Invalid payload." });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(400).json({ error: "Invalid token." });
    return;
  }

  const bank = await getQuestionBank();
  const summary = scoreAnswers(bank.byId, payload.qids, answers);

  res.json({ summary });
});

app.post("/api/leaderboard", async (req, res) => {
  const { token, answers, nickname, durationSec } = req.body as {
    token?: string;
    answers?: unknown;
    nickname?: string;
    durationSec?: number;
  };

  if (!token || !Array.isArray(answers)) {
    res.status(400).json({ error: "Invalid payload." });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(400).json({ error: "Invalid token." });
    return;
  }

  const bank = await getQuestionBank();
  const summary = scoreAnswers(bank.byId, payload.qids, answers);
  const totalPossible = summary.totalPossible || 1;
  const accuracy = summary.score / totalPossible;
  const safeNickname = (nickname || "匿名玩家").trim().slice(0, 12) || "匿名玩家";

  const entry = {
    id: createId(),
    nickname: safeNickname,
    score: summary.score,
    correctCount: summary.correctCount,
    totalCount: summary.totalCount,
    accuracy: Number(accuracy.toFixed(4)),
    durationSec: Math.max(0, Math.floor(durationSec || 0)),
    submittedAt: Date.now()
  };

  const leaderboard = await appendLeaderboard(entry);
  res.json({ entry, leaderboard });
});

app.get("/api/leaderboard", async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 100, 200));
  const leaderboard = await getLeaderboard(limit);
  const ranked = leaderboard.map((entry, index) => ({
    rank: index + 1,
    ...entry
  }));
  res.json({ leaderboard: ranked });
});

app.get("/api/admin/summary", async (_req, res) => {
  const summary = await getAdminSummary();
  res.json(summary);
});

app.post("/api/admin/import", async (req, res) => {
  const { questions } = req.body as { questions?: unknown };
  if (!Array.isArray(questions)) {
    res.status(400).json({ error: "Questions must be an array." });
    return;
  }

  const bank = await getQuestionBank();
  const validation = validateQuestions(questions, new Set(bank.domains));
  if (!validation.valid) {
    res.status(400).json(validation);
    return;
  }

  const result = await importQuestions(questions);
  res.json({ ...validation, ...result });
});

app.post("/api/admin/status", async (req, res) => {
  const { id, enabled } = req.body as { id?: string; enabled?: boolean };
  if (!id || typeof enabled !== "boolean") {
    res.status(400).json({ error: "Invalid payload." });
    return;
  }

  const result = await setQuestionEnabled(id, enabled);
  res.json(result);
});

app.listen(port, () => {
  console.log(`EveryoneKnows server running on port ${port}`);
});
