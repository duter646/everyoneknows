import { useEffect, useState } from "react";
import Papa from "papaparse";
import { fetchAdminSummary, importQuestions, setQuestionStatus } from "../lib/api";
import { validateQuestionsClient } from "../lib/validation";
import { AdminSummary } from "../lib/types";

function parseArray(value: string, separator = "|") {
  if (!value) {
    return [] as string[];
  }
  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed) as string[];
    } catch {
      return [];
    }
  }
  const regex = separator === "|" ? /\s*\|\s*/ : /\s*,\s*/;
  return trimmed.split(regex).filter(Boolean);
}

function parseNumberArray(value: string) {
  if (!value) {
    return [] as number[];
  }
  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed) as number[];
    } catch {
      return [];
    }
  }
  return trimmed
    .split(/\s*,\s*/)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

export default function Admin() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [adminSecret, setAdminSecret] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Record<string, unknown>[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [toggleId, setToggleId] = useState("");
  const [toggleEnabled, setToggleEnabled] = useState(true);
  const [toggleStatus, setToggleStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  const handleFile = async (file?: File) => {
    if (!file) {
      return;
    }
    setFileName(file.name);
    setImportStatus(null);

    const content = await file.text();
    let parsed: Record<string, unknown>[] = [];

    if (file.name.endsWith(".json")) {
      try {
        const data = JSON.parse(content) as Record<string, unknown>[];
        if (Array.isArray(data)) {
          parsed = data;
        } else {
          setImportStatus("JSON 格式不正确，根节点应为数组。");
          return;
        }
      } catch {
        setImportStatus("JSON 解析失败，请检查格式。");
        return;
      }
    } else if (file.name.endsWith(".csv")) {
      const result = Papa.parse<Record<string, string>>(content, {
        header: true,
        skipEmptyLines: true
      });
      parsed = result.data.map((row) => ({
        id: row.id,
        domain: row.domain,
        type: row.type,
        question: row.question,
        options: parseArray(row.options || ""),
        answer: parseNumberArray(row.answer || ""),
        difficulty: row.difficulty,
        explanation: row.explanation,
        tags: parseArray(row.tags || "", ",")
      }));
    }

    const validation = validateQuestionsClient(parsed);
    setQuestions(parsed);
    setIssues(validation.issues.map((issue) => `${issue.level.toUpperCase()}: ${issue.message}`));
  };

  const handleImport = async () => {
    if (questions.length === 0) {
      setImportStatus("请先选择题库文件。");
      return;
    }
    try {
      const result = await importQuestions(questions, adminSecret || undefined);
      setImportStatus(`导入成功：新增 ${result.added} 道，跳过 ${result.skipped} 道。`);
      setIssues(result.issues?.map((issue) => issue.message) || []);
    } catch {
      setImportStatus("导入失败，请检查文件格式。");
    }
  };

  const handleToggle = async () => {
    if (!toggleId) {
      setToggleStatus("请输入题目 ID。");
      return;
    }
    try {
      await setQuestionStatus(toggleId, toggleEnabled, adminSecret || undefined);
      setToggleStatus(toggleEnabled ? "已启用" : "已停用");
    } catch {
      setToggleStatus("操作失败，请检查 ID。");
    }
  };

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="section">
        <h2>管理端概览</h2>
        <div className="grid two">
          <div className="stat-card">
            <span>题库总量</span>
            <strong>{summary ? summary.questionCount : "加载中"}</strong>
          </div>
          <div className="stat-card">
            <span>已导入题目</span>
            <strong>{summary ? summary.importedCount : "加载中"}</strong>
          </div>
          <div className="stat-card">
            <span>停用题目</span>
            <strong>{summary ? summary.disabledCount : "加载中"}</strong>
          </div>
          <div className="stat-card">
            <span>领域数量</span>
            <strong>{summary ? summary.domainCount : "加载中"}</strong>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>导入题库（JSON / CSV）</h2>
        <div className="form-row" style={{ marginBottom: 12 }}>
          <input
            className="input"
            placeholder="管理密钥（可选）"
            type="password"
            value={adminSecret}
            onChange={(event) => setAdminSecret(event.target.value)}
          />
          <span className="note">部署后建议设置 ADMIN_SECRET。</span>
        </div>
        <input
          type="file"
          accept=".json,.csv"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        {fileName && <p className="note">已读取：{fileName}</p>}
        {issues.length > 0 && (
          <div className="note">
            {issues.map((issue) => (
              <div key={issue}>{issue}</div>
            ))}
          </div>
        )}
        <div className="form-row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={handleImport}>导入题库</button>
          {importStatus && <span className="note">{importStatus}</span>}
        </div>
        <p className="note">CSV 需包含列：id, domain, type, question, options, answer, difficulty, explanation, tags。</p>
      </div>

      <div className="section">
        <h2>题目启用 / 停用</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="题目 ID"
            value={toggleId}
            onChange={(event) => setToggleId(event.target.value)}
          />
          <select
            className="input"
            value={toggleEnabled ? "enable" : "disable"}
            onChange={(event) => setToggleEnabled(event.target.value === "enable")}
          >
            <option value="enable">启用</option>
            <option value="disable">停用</option>
          </select>
          <button className="btn ghost" onClick={handleToggle}>执行</button>
        </div>
        {toggleStatus && <p className="note" style={{ marginTop: 8 }}>{toggleStatus}</p>}
      </div>
    </div>
  );
}
