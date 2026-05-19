import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { submitLeaderboard } from "../lib/api";
import { AnswerPayload, QuestionView, ScoreSummary } from "../lib/types";
import { formatDuration } from "../lib/format";
import { DISCIPLINES, Discipline, scoreIdentity } from "../lib/identity";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ResultPayload {
  summary: ScoreSummary;
  answers: AnswerPayload[];
  token: string;
  durationSec: number;
  questions: QuestionView[];
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [nickname, setNickname] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [showDomainStats, setShowDomainStats] = useState(false);

  useEffect(() => {
    const statePayload = location.state as ResultPayload | null;
    if (statePayload?.summary) {
      setPayload(statePayload);
      return;
    }
    const stored = sessionStorage.getItem("lastResult");
    if (stored) {
      setPayload(JSON.parse(stored));
    }
  }, [location.state]);

  const summary = payload?.summary;

  const domainStats = useMemo(() => {
    if (!summary) return [] as { domain: string; correct: number; total: number; rate: number }[];
    const map = new Map<string, { correct: number; total: number }>();
    summary.items.forEach((item) => {
      const current = map.get(item.domain) || { correct: 0, total: 0 };
      current.total += 1;
      if (item.isCorrect) current.correct += 1;
      map.set(item.domain, current);
    });
    return Array.from(map.entries())
      .map(([domain, value]) => ({
        domain, correct: value.correct, total: value.total,
        rate: value.total ? value.correct / value.total : 0
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [summary]);

  const scoreRate = summary
    ? summary.rawBaseTotal && summary.rawBaseTotal > 0
      ? (summary.rawUserTotal ?? summary.score) / summary.rawBaseTotal
      : summary.score / summary.totalPossible
    : 0;
  const identity = summary ? scoreIdentity(summary.items, scoreRate) : null;

  const achievements = useMemo(() => {
    if (!summary || !payload) return [] as { title: string; desc: string }[];
    const passLine = 60;
    const totalTime = payload.durationSec;
    const lastItem = summary.items[summary.items.length - 1];
    const hasHardFast = summary.items.some(
      (item) => item.difficulty === "hard" && item.isCorrect && (item.timeSec || 99) <= 3
    );
    const hasFocusedDomain = domainStats.some((d) => d.total > 0 && d.correct === d.total);
    const list = [
      { title: "量子阅读", desc: "3 秒内答对一道困难题。", ok: hasHardFast },
      { title: "偏科战神", desc: "某一领域全对，但总分不及格。", ok: summary.score < passLine && hasFocusedDomain },
      { title: "天选之子", desc: "所有多选题一次不错、全部全对。", ok: summary.multiStats.total > 0 && summary.multiStats.fullyCorrect === summary.multiStats.total },
      { title: "差之毫厘", desc: "超过 3 道多选题只差 1 个正确答案。", ok: summary.multiStats.missedOne >= 4 },
      { title: "绝地武士", desc: "最后一题答对刚好跨过及格线。", ok: !!lastItem && lastItem.isCorrect && summary.score >= passLine && summary.score - lastItem.score < passLine },
      { title: "时间管理大师", desc: "极速答题且成绩及格。", ok: totalTime <= summary.totalCount * 8 && summary.score >= passLine }
    ];
    return list.filter((i) => i.ok);
  }, [summary, payload, domainStats]);

  const activeDisciplines = useMemo(() => {
    if (!identity) return [] as Discipline[];
    return DISCIPLINES.filter((d) => identity.signals[d] > 0 || identity.percents[d] > 0);
  }, [identity]);

  const radarData = useMemo(() => {
    if (!identity || activeDisciplines.length < 3) return null;
    return {
      labels: activeDisciplines,
      datasets: [{
        label: "学科倾向",
        data: activeDisciplines.map((d) => identity.percents[d]),
        backgroundColor: "rgba(0, 229, 255, 0.2)",
        borderColor: "rgba(0, 229, 255, 0.8)",
        pointBackgroundColor: "rgba(0, 229, 255, 1)",
        pointBorderColor: "rgba(0, 229, 255, 1)",
        borderWidth: 2,
        pointRadius: 4
      }]
    };
  }, [identity, activeDisciplines]);

  if (!summary || !payload) {
    return (
      <div className="section">
        <p>还没有成绩记录，先去挑战一局吧。</p>
        <button className="btn" onClick={() => navigate("/")}>开始挑战</button>
      </div>
    );
  }

  const handleUpload = async () => {
    setUploading(true);
    setUploadStatus(null);
    try {
      const entry = await submitLeaderboard(payload.token, payload.answers, nickname, payload.durationSec);
      setUploadStatus(`已上传：${entry.nickname} / ${entry.score} 分`);
    } catch {
      setUploadStatus("上传失败，请稍后再试。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="section">
        <div className="result-header">
          <div className="result-score">
            <span className="result-score-label">得分</span>
            <strong className="result-score-val">{summary.score}</strong>
            <span className="result-score-unit">分</span>
          </div>
          <div className="result-meta">
            <div>正确 <strong>{summary.correctCount}</strong> / {summary.totalCount}</div>
            <div>用时 {formatDuration(payload.durationSec)}</div>
          </div>
          <button className="btn" onClick={() => navigate("/")}>再来一局</button>
        </div>
        <p className="result-identity">{identity?.title}</p>
      </div>

      <div className="section">
        <h2>学科画像</h2>
        <div className="identity-bars">
          {identity && activeDisciplines
            .sort((a, b) => identity.percents[b] - identity.percents[a])
            .map((d) => (
              <div key={d} className="identity-bar-row">
                <span className="identity-bar-label">{d}</span>
                <div className="identity-bar-track">
                  <div
                    className="identity-bar-fill"
                    style={{ width: `${identity.percents[d]}%` }}
                  />
                </div>
                <span className="identity-bar-pct">{identity.percents[d]}%</span>
              </div>
            ))}
        </div>
        <div className="radar-chart-wrap" style={{ marginTop: 16 }}>
          {radarData ? (
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  r: {
                    angleLines: { color: "rgba(255, 255, 255, 0.1)" },
                    grid: { color: "rgba(255, 255, 255, 0.06)" },
                    pointLabels: { color: "#e8eaed", font: { size: 11 } },
                    ticks: { display: false, stepSize: 20 },
                    suggestedMin: 0,
                    suggestedMax: 100
                  }
                },
                plugins: { legend: { display: false } }
              }}
            />
          ) : (
            <p className="note">学科数据不足，无法生成雷达图。</p>
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn ghost" onClick={() => setShowDomainStats(!showDomainStats)}>
            {showDomainStats ? "收起领域正确率" : "查看领域正确率"}
          </button>
        </div>
        {showDomainStats && (
          <div className="domain-stats-compact" style={{ marginTop: 12 }}>
            {domainStats.map((d) => (
              <div key={d.domain} className="identity-bar-row">
                <span className="identity-bar-label">{d.domain}</span>
                <div className="identity-bar-track">
                  <div
                    className="identity-bar-fill domain"
                    style={{ width: `${Math.round(d.rate * 100)}%` }}
                  />
                </div>
                <span className="identity-bar-pct">{Math.round(d.rate * 100)}% <span className="note">({d.correct}/{d.total})</span></span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h2>答题详情</h2>
        {payload.questions.map((q, idx) => {
          const ans = payload.answers.find((a) => a.id === q.id);
          const scoreItem = summary.items.find((i) => i.id === q.id);
          const userSelected = ans?.selected ?? [];
          const correctAnswer = q.answer;
          const isCorrect = scoreItem?.isCorrect ?? false;
          const isExpanded = expandedQ === q.id;
          const difficultyLabel = q.difficulty === "easy" ? "简单" : q.difficulty === "medium" ? "中等" : "困难";

          return (
            <div key={q.id} className="detail-item">
              <div
                className="detail-summary-row"
                onClick={() => setExpandedQ(isExpanded ? null : q.id)}
              >
                <span className="tag">第 {idx + 1} 题</span>
                <span className="tag">{q.domain}</span>
                <span className={`detail-status ${isCorrect ? "correct" : "wrong"}`}>
                  {isCorrect ? "正确" : "错误"} · {scoreItem?.score ?? 0}分
                </span>
                <span className="detail-expand-icon">{isExpanded ? "▲" : "▼"}</span>
              </div>
              {isExpanded && (
                <div className="detail-body">
                  <p className="detail-question">{q.question}</p>
                  <div className="detail-options">
                    {q.options.map((opt) => {
                      const isUserChoice = userSelected.includes(opt.id);
                      const isCorrectOption = correctAnswer.includes(opt.id);
                      let cls = "detail-opt";
                      if (isCorrectOption) cls += " opt-correct";
                      else if (isUserChoice && !isCorrectOption) cls += " opt-wrong";
                      const prefix = isCorrectOption ? "✓" : isUserChoice && !isCorrectOption ? "✗" : " ";
                      return (
                        <div key={opt.id} className={cls}>
                          {prefix} {String.fromCharCode(65 + opt.id)}. {opt.text}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <p className="detail-explanation">解析：{q.explanation}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {achievements.length > 0 && (
        <div className="section">
          <h2>成就解锁</h2>
          <div className="achievements">
            {achievements.map((a) => (
              <div key={a.title} className="achievement-card">
                <strong>{a.title}</strong>
                <span>{a.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <h2>上传排行榜</h2>
        <div className="form-row">
          <input className="input" placeholder="输入昵称" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <button className="btn" onClick={handleUpload} disabled={uploading}>上传成绩</button>
          <button className="btn ghost" onClick={() => navigate("/leaderboard")}>查看排行榜</button>
        </div>
        {uploadStatus && <p className="note" style={{ marginTop: 10 }}>{uploadStatus}</p>}
      </div>
    </div>
  );
}
