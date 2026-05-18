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
import { apiPost } from "../lib/api";
import { AnswerPayload, ScoreSummary } from "../lib/types";
import { formatDuration, formatPercent } from "../lib/format";
import { DISCIPLINES, scoreIdentity } from "../lib/identity";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ResultPayload {
  summary: ScoreSummary;
  answers: AnswerPayload[];
  token: string;
  durationSec: number;
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [nickname, setNickname] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
    if (!summary) {
      return [] as { domain: string; correct: number; total: number; rate: number }[];
    }
    const map = new Map<string, { correct: number; total: number }>();
    summary.items.forEach((item) => {
      const current = map.get(item.domain) || { correct: 0, total: 0 };
      current.total += 1;
      if (item.isCorrect) {
        current.correct += 1;
      }
      map.set(item.domain, current);
    });

    return Array.from(map.entries())
      .map(([domain, value]) => ({
        domain,
        correct: value.correct,
        total: value.total,
        rate: value.total ? value.correct / value.total : 0
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [summary]);

  const scoreRate = summary ? summary.score / summary.totalPossible : 0;
  const identity = summary ? scoreIdentity(summary.items, scoreRate) : null;

  const achievements = useMemo(() => {
    if (!summary || !payload) {
      return [] as { title: string; desc: string }[];
    }
    const passLine = Math.ceil(summary.totalPossible * 0.6);
    const totalTime = payload.durationSec;
    const lastItem = summary.items[summary.items.length - 1];

    const hasHardFast = summary.items.some(
      (item) => item.difficulty === "hard" && item.isCorrect && (item.timeSec || 99) <= 3
    );

    const hasFocusedDomain = domainStats.some(
      (domain) => domain.total > 0 && domain.correct === domain.total
    );

    const achievementsList = [
      {
        title: "量子阅读",
        desc: "3 秒内答对一道困难题。",
        ok: hasHardFast
      },
      {
        title: "偏科战神",
        desc: "某一领域全对，但总分不及格。",
        ok: summary.score < passLine && hasFocusedDomain
      },
      {
        title: "天选之子",
        desc: "所有多选题一次不错、全部全对。",
        ok: summary.multiStats.total > 0 && summary.multiStats.fullyCorrect === summary.multiStats.total
      },
      {
        title: "差之毫厘",
        desc: "超过 3 道多选题只差 1 个正确答案。",
        ok: summary.multiStats.missedOne >= 4
      },
      {
        title: "绝地武士",
        desc: "最后一题答对刚好跨过及格线。",
        ok:
          !!lastItem &&
          lastItem.isCorrect &&
          summary.score >= passLine &&
          summary.score - lastItem.score < passLine
      },
      {
        title: "时间管理大师",
        desc: "极速答题且成绩及格。",
        ok: totalTime <= summary.totalCount * 8 && summary.score >= passLine
      }
    ];

    return achievementsList.filter((item) => item.ok).map((item) => ({
      title: item.title,
      desc: item.desc
    }));
  }, [summary, payload, domainStats]);

  const radarData = useMemo(() => {
    if (!identity) {
      return null;
    }
    return {
      labels: DISCIPLINES,
      datasets: [
        {
          label: "学科倾向",
          data: DISCIPLINES.map((discipline) => identity.percents[discipline]),
          backgroundColor: "rgba(255, 107, 53, 0.2)",
          borderColor: "rgba(255, 107, 53, 0.8)",
          pointBackgroundColor: "rgba(31, 122, 140, 0.9)",
          borderWidth: 2
        }
      ]
    };
  }, [identity]);

  if (!summary || !payload) {
    return (
      <div className="section">
        <p>还没有成绩记录，先去挑战一局吧。</p>
        <button className="btn" onClick={() => navigate("/quiz?count=20")}>开始挑战</button>
      </div>
    );
  }

  const handleUpload = async () => {
    setUploading(true);
    setUploadStatus(null);
    try {
      const result = await apiPost<{ entry: { nickname: string; score: number } }>("/api/leaderboard", {
        token: payload.token,
        answers: payload.answers,
        nickname,
        durationSec: payload.durationSec
      });
      setUploadStatus(`已上传：${result.entry.nickname} / ${result.entry.score} 分`);
    } catch {
      setUploadStatus("上传失败，请稍后再试。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="section">
        <div className="grid two">
          <div className="stat-card">
            <span>总分</span>
            <strong>{summary.score} / {summary.totalPossible}</strong>
            <span className="note">得分率 {formatPercent(scoreRate)}</span>
          </div>
          <div className="stat-card">
            <span>正确题数</span>
            <strong>{summary.correctCount} / {summary.totalCount}</strong>
            <span className="note">用时 {formatDuration(payload.durationSec)}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>趣味身份鉴定</h2>
        <p className="note">{identity?.title}</p>
        <div className="grid two">
          <div className="stat-card">
            <strong>Top 3 学科画像</strong>
            {identity?.topThree.map((item) => (
              <div key={item.discipline}>
                {item.discipline} · {item.percent}%
              </div>
            ))}
          </div>
          <div className="stat-card">
            {radarData && (
              <Radar
                data={radarData}
                options={{
                  scales: {
                    r: {
                      angleLines: { color: "rgba(34, 28, 20, 0.2)" },
                      grid: { color: "rgba(34, 28, 20, 0.1)" },
                      pointLabels: { color: "#221c14" },
                      ticks: { display: false }
                    }
                  },
                  plugins: { legend: { display: false } }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="section">
        <h2>领域正确率</h2>
        <div className="grid two">
          {domainStats.slice(0, 12).map((domain) => (
            <div key={domain.domain} className="stat-card">
              <span>{domain.domain}</span>
              <strong>{Math.round(domain.rate * 100)}%</strong>
              <span className="note">{domain.correct}/{domain.total} 题</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>成就解锁</h2>
        {achievements.length === 0 ? (
          <p className="note">本局暂未解锁成就，下次再冲！</p>
        ) : (
          <div className="achievements">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="achievement-card">
                <strong>{achievement.title}</strong>
                <span>{achievement.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <h2>上传排行榜</h2>
        <div className="form-row">
          <input
            className="input"
            placeholder="输入昵称"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
          <button className="btn" onClick={handleUpload} disabled={uploading}>
            上传成绩
          </button>
          <button className="btn ghost" onClick={() => navigate("/leaderboard")}>查看排行榜</button>
        </div>
        {uploadStatus && <p className="note" style={{ marginTop: 10 }}>{uploadStatus}</p>}
      </div>
    </div>
  );
}
