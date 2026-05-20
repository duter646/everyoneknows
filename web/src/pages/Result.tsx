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
import { submitLeaderboard, fetchLeaderboard } from "../lib/api";
import { AnswerPayload, LeaderboardEntry, QuestionView, ScoreSummary } from "../lib/types";
import { formatDuration } from "../lib/format";
import { DISCIPLINES, Discipline, scoreIdentity } from "../lib/identity";

const DISCIPLINE_IMAGE: Record<Discipline, string> = {
  "哲学": "/images/philosophy.png",
  "经济学": "/images/economy.png",
  "法学": "/images/law.png",
  "教育学": "/images/education.png",
  "文学": "/images/literature.png",
  "历史学": "/images/history.png",
  "理学": "/images/science.png",
  "工学": "/images/engineering.png",
  "农学": "/images/agriculture.png",
  "医学": "/images/medicine.png",
  "军事学": "/images/military.png",
  "管理学": "/images/management.png",
  "艺术学": "/images/arts.png",
  "生活常识": "/images/life.png",
  "体育生": "/images/sports.png"
};

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ResultPayload {
  summary: ScoreSummary;
  answers: AnswerPayload[];
  token: string;
  durationSec: number;
  questions: QuestionView[];
  difficultyProfile: string;
}

const ALL_ACHIEVEMENTS = [
  { title: "量子阅读", icon: "⚡", desc: "3秒内答对一道困难题" },
  { title: "偏科战神", icon: "🎯", desc: "某一领域全对但总分不及格" },
  { title: "天选之子", icon: "👑", desc: "所有多选题一次不错全部全对" },
  { title: "差之毫厘", icon: "💔", desc: "超过3道多选题只差1个正确答案" },
  { title: "绝地武士", icon: "⚔️", desc: "最后一题答对刚好跨过及格线" },
  { title: "时间管理大师", icon: "⏱️", desc: "极速答题且成绩及格" },
  { title: "满分传说", icon: "💎", desc: "得分率达到100%" },
  { title: "稳如老狗", icon: "🪨", desc: "没有任何一道题秒答" },
  { title: "多选杀手", icon: "🔮", desc: "多选题正确率100%" },
  { title: "全领域探索", icon: "🗺️", desc: "答到的领域超过10个" },
  { title: "困难突破者", icon: "🏔️", desc: "答对至少3道困难题" },
  { title: "不抛弃不放弃", icon: "🛡️", desc: "没有任何一道题未作答" }
];

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [nickname, setNickname] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [showDomainStats, setShowDomainStats] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [lbEntries, setLbEntries] = useState<LeaderboardEntry[]>([]);
  const [lbTab, setLbTab] = useState<string>("343");

  useEffect(() => {
    const statePayload = location.state as ResultPayload | null;
    if (statePayload?.summary) {
      setPayload(statePayload);
      if (statePayload.difficultyProfile) setLbTab(statePayload.difficultyProfile);
      if (sessionStorage.getItem("lbSubmitted") === statePayload.token) setSubmitted(true);
      return;
    }
    const stored = sessionStorage.getItem("lastResult");
    if (stored) {
      const parsed = JSON.parse(stored) as ResultPayload;
      setPayload(parsed);
      if (parsed.difficultyProfile) setLbTab(parsed.difficultyProfile);
      if (sessionStorage.getItem("lbSubmitted") === parsed.token) setSubmitted(true);
    }
  }, [location.state]);

  useEffect(() => {
    fetchLeaderboard(100, lbTab).then(setLbEntries).catch(() => {});
  }, [lbTab]);

  const summary = payload?.summary;

  const domainStats = useMemo(() => {
    if (!summary) return [] as { domain: string; correct: number; total: number; rate: number }[];
    const map = new Map<string, { correct: number; total: number }>();
    summary.items.forEach((item) => {
      const cur = map.get(item.domain) || { correct: 0, total: 0 };
      cur.total += 1;
      if (item.isCorrect) cur.correct += 1;
      map.set(item.domain, cur);
    });
    return Array.from(map.entries())
      .map(([domain, v]) => ({ domain, correct: v.correct, total: v.total, rate: v.total ? v.correct / v.total : 0 }))
      .sort((a, b) => b.rate - a.rate);
  }, [summary]);

  const scoreRate = summary
    ? summary.rawBaseTotal && summary.rawBaseTotal > 0
      ? (summary.rawUserTotal ?? summary.score) / summary.rawBaseTotal
      : summary.score / summary.totalPossible
    : 0;
  const identity = summary ? scoreIdentity(summary.items, scoreRate) : null;

  const unlockedSet = useMemo(() => {
    if (!summary || !payload) return new Set<string>();
    const passLine = 60;
    const totalTime = payload.durationSec;
    const lastItem = summary.items[summary.items.length - 1];
    const hasHardFast = summary.items.some((i) => i.difficulty === "hard" && i.isCorrect && (i.timeSec || 99) <= 3);
    const hasFocused = domainStats.some((d) => d.total > 0 && d.correct === d.total);
    const noInstantAnswer = summary.items.every((i) => (i.timeSec || 0) >= 1);
    const multiAllCorrect = summary.multiStats.total > 0 && summary.multiStats.fullyCorrect === summary.multiStats.total;
    const hardCorrect = summary.items.filter((i) => i.difficulty === "hard" && i.isCorrect).length;
    const allAnswered = payload.answers.every((a) => a.selected && a.selected.length > 0);

    const unlocked = new Set<string>();
    if (hasHardFast) unlocked.add("量子阅读");
    if (summary.score < passLine && hasFocused) unlocked.add("偏科战神");
    if (summary.multiStats.total > 0 && summary.multiStats.fullyCorrect === summary.multiStats.total) unlocked.add("天选之子");
    if (summary.multiStats.missedOne >= 4) unlocked.add("差之毫厘");
    if (!!lastItem && lastItem.isCorrect && summary.score >= passLine && summary.score - lastItem.score < passLine) unlocked.add("绝地武士");
    if (totalTime <= summary.totalCount * 8 && summary.score >= passLine) unlocked.add("时间管理大师");
    if (scoreRate >= 1) unlocked.add("满分传说");
    if (noInstantAnswer) unlocked.add("稳如老狗");
    if (multiAllCorrect) unlocked.add("多选杀手");
    if (domainStats.length >= 10) unlocked.add("全领域探索");
    if (hardCorrect >= 3) unlocked.add("困难突破者");
    if (allAnswered) unlocked.add("不抛弃不放弃");
    return unlocked;
  }, [summary, payload, domainStats, scoreRate]);

  const activeDisciplines = useMemo(() => {
    if (!identity) return [] as Discipline[];
    return DISCIPLINES.filter((d) => identity.signals[d] > 0 || identity.percents[d] > 0);
  }, [identity]);

  const radarData = useMemo(() => {
    if (!identity || activeDisciplines.length < 3) return null;
    return {
      labels: activeDisciplines,
      datasets: [{
        label: "正确率",
        data: activeDisciplines.map((d) => identity.rawRates[d]),
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
    if (uploading || submitted) return;
    setUploading(true);
    setUploadStatus(null);
    try {
      const entry = await submitLeaderboard(payload.token, payload.answers, nickname, payload.durationSec, payload.difficultyProfile);
      sessionStorage.setItem("lbSubmitted", payload.token);
      setSubmitted(true);
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
        <div className="result-identity-wrap" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          {identity && (
            <img
              src={DISCIPLINE_IMAGE[identity.topThree[0]?.discipline ?? "生活常识"]}
              alt={identity.suffix}
              style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0 }}
            />
          )}
          <p className="result-identity">{identity?.title}</p>
        </div>
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
                  <div className="identity-bar-fill" style={{ width: `${identity.percents[d]}%` }} />
                </div>
                <span className="identity-bar-pct">{identity.percents[d]}%</span>
              </div>
            ))}
        </div>
        <div className="radar-chart-wrap" style={{ marginTop: 16 }}>
          {radarData ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#8ab4f8" }}>学科正确率雷达图</span>
              </div>
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
                    ticks: { display: false },
                    min: 0,
                    max: 100
                  }
                },
                plugins: { legend: { display: false } }
              }}
            />
            </>
          ) : (
            <p className="note">学科数据不足，无法生成雷达图。</p>
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn ghost" onClick={() => setShowDomainStats(!showDomainStats)}>
            {showDomainStats ? "收起领域正确率" : "查看领域正确率"}
          </button>
        </div>
        <div className={`slide-panel ${showDomainStats ? "open" : ""}`}>
          <div className="domain-stats-compact" style={{ paddingTop: 12 }}>
            {domainStats.map((d) => (
              <div key={d.domain} className="identity-bar-row">
                <span className="identity-bar-label">{d.domain}</span>
                <div className="identity-bar-track">
                  <div className="identity-bar-fill domain" style={{ width: `${Math.round(d.rate * 100)}%` }} />
                </div>
                <span className="identity-bar-pct">{Math.round(d.rate * 100)}% <span className="note">({d.correct}/{d.total})</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <h2>勋章墙</h2>
        <div className="badge-wall">
          {ALL_ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedSet.has(a.title);
            return (
              <div key={a.title} className={`badge-item ${unlocked ? "unlocked" : "locked"}`}>
                <span className="badge-icon">{unlocked ? a.icon : "🔒"}</span>
                <span className="badge-title">{a.title}</span>
                <span className="badge-desc">{a.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="detail-peek" onClick={() => setShowDetail(true)}>
          <div className="detail-peek-row">
            <span>查看全部答题详情与解析</span>
            <span className="detail-expand-icon">▼</span>
          </div>
        </div>
      </div>

      {showDetail && (
        <div className="dialog-backdrop" onClick={() => { setShowDetail(false); setExpandedQ(null); }}>
          <div className="dialog detail-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="detail-dialog-header">
              <h2>答题详情</h2>
              <button className="btn ghost" onClick={() => { setShowDetail(false); setExpandedQ(null); }}>关闭</button>
            </div>
            <div className="detail-dialog-body">
          {payload.questions.map((q, idx) => {
            const ans = payload.answers.find((a) => a.id === q.id);
            const scoreItem = summary.items.find((i) => i.id === q.id);
            const userSelected = ans?.selected ?? [];
            const correctAnswer = q.answer;
            const isCorrect = scoreItem?.isCorrect ?? false;
            const isExpanded = expandedQ === q.id;

            return (
              <div key={q.id} className="detail-item">
                <div className="detail-summary-row" onClick={() => setExpandedQ(isExpanded ? null : q.id)}>
                  <span className="tag">第 {idx + 1} 题</span>
                  <span className="tag">{q.domain}</span>
                  <span className={`detail-status ${isCorrect ? "correct" : "wrong"}`}>
                    {isCorrect ? "正确" : "错误"} · {scoreItem?.score ?? 0}分
                  </span>
                  <span className={`detail-expand-icon ${isExpanded ? "rotated" : ""}`}>▼</span>
                </div>
                <div className={`slide-panel ${isExpanded ? "open" : ""}`}>
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
                </div>
              </div>
            );
          })}
            </div>
          </div>
        </div>
      )}

      <div className="section">
        <h2>排行榜</h2>
        <div className="form-row" style={{ marginBottom: 12 }}>
          <input className="input" placeholder="输入昵称" value={nickname} onChange={(e) => setNickname(e.target.value)} style={{ minWidth: 120 }} />
          <button className="btn" onClick={handleUpload} disabled={uploading || submitted}>{submitted ? "已上传" : "上传成绩"}</button>
        </div>
        {uploadStatus && <p className="note" style={{ marginBottom: 8 }}>{uploadStatus}</p>}
        <div className="diff-tabs" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[{ key: "721", label: "轻松" }, { key: "343", label: "均衡" }, { key: "136", label: "硬核" }].map((t) => (
            <button
              key={t.key}
              className={`btn ghost ${lbTab === t.key ? "active" : ""}`}
              onClick={() => setLbTab(t.key)}
              style={lbTab === t.key ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
        {lbEntries.length > 0 ? (
          <div style={{ overflowX: "auto", maxHeight: 320, overflowY: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>昵称</th>
                  <th>得分</th>
                  <th>用时</th>
                </tr>
              </thead>
              <tbody>
                {lbEntries.map((e) => (
                  <tr key={e.id}>
                    <td><span className="rank-badge">{e.rank}</span></td>
                    <td>{e.nickname}</td>
                    <td>{e.score}</td>
                    <td>{formatDuration(e.durationSec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="note">暂无排行数据</p>
        )}
      </div>
    </div>
  );
}
