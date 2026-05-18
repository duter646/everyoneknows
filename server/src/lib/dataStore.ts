import fs from "fs/promises";
import path from "path";
import { Question } from "./types";

const DATA_DIR = path.resolve(process.cwd(), "..", "data");
const STORAGE_DIR = path.resolve(process.cwd(), "storage");
const IMPORTED_PATH = path.join(STORAGE_DIR, "imported_questions.json");
const DISABLED_PATH = path.join(STORAGE_DIR, "disabled_questions.json");

const RELOAD_MS = 30000;

interface QuestionBank {
  questions: Question[];
  byId: Map<string, Question>;
  domains: string[];
  loadedAt: number;
}

let cache: QuestionBank | null = null;
let lastLoaded = 0;

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function loadBatchQuestions() {
  const files = await fs.readdir(DATA_DIR);
  const batchFiles = files.filter((name) => name.endsWith("_batch.json"));
  const all: Question[] = [];

  for (const file of batchFiles) {
    const fullPath = path.join(DATA_DIR, file);
    const data = await readJsonFile<Question[]>(fullPath, []);
    if (Array.isArray(data)) {
      all.push(...data);
    }
  }

  return all;
}

async function loadImportedQuestions() {
  return readJsonFile<Question[]>(IMPORTED_PATH, []);
}

async function loadDisabledIds() {
  const disabled = await readJsonFile<string[]>(DISABLED_PATH, []);
  return new Set(disabled);
}

function mergeQuestions(base: Question[], imported: Question[]) {
  const map = new Map<string, Question>();
  base.forEach((question) => map.set(question.id, question));
  imported.forEach((question) => map.set(question.id, question));
  return map;
}

export async function getQuestionBank(): Promise<QuestionBank> {
  const now = Date.now();
  if (cache && now - lastLoaded < RELOAD_MS) {
    return cache;
  }

  const base = await loadBatchQuestions();
  const imported = await loadImportedQuestions();
  const disabled = await loadDisabledIds();
  const merged = mergeQuestions(base, imported);

  const questions = [...merged.values()].filter((question) => !disabled.has(question.id));
  const domains = Array.from(new Set(questions.map((q) => q.domain))).sort();

  cache = {
    questions,
    byId: merged,
    domains,
    loadedAt: now
  };
  lastLoaded = now;

  return cache;
}

export async function getQuestionById(id: string) {
  const bank = await getQuestionBank();
  return bank.byId.get(id);
}

export async function getMeta() {
  const bank = await getQuestionBank();
  return {
    questionCount: bank.questions.length,
    domainCount: bank.domains.length,
    domains: bank.domains,
    loadedAt: bank.loadedAt
  };
}

export async function importQuestions(newQuestions: Question[]) {
  const bank = await getQuestionBank();
  const existingIds = new Set(bank.byId.keys());
  const imported = await loadImportedQuestions();
  const added: Question[] = [];
  let skipped = 0;

  newQuestions.forEach((question) => {
    if (existingIds.has(question.id)) {
      skipped += 1;
      return;
    }
    added.push(question);
  });

  if (added.length > 0) {
    await writeJsonFile(IMPORTED_PATH, [...imported, ...added]);
    cache = null;
  }

  return { added: added.length, skipped };
}

export async function setQuestionEnabled(id: string, enabled: boolean) {
  const disabled = await loadDisabledIds();
  if (enabled) {
    disabled.delete(id);
  } else {
    disabled.add(id);
  }
  await writeJsonFile(DISABLED_PATH, Array.from(disabled));
  cache = null;
  return { id, enabled };
}

export async function getAdminSummary() {
  const meta = await getMeta();
  const imported = await loadImportedQuestions();
  const disabled = await loadDisabledIds();
  return {
    ...meta,
    importedCount: imported.length,
    disabledCount: disabled.size
  };
}
