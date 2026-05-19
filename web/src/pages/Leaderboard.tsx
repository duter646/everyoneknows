import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLeaderboard } from "../lib/api";
import { LeaderboardEntry } from "../lib/types";
import { formatDate, formatDuration } from "../lib/format";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard(100)
      .then(setEntries)
      .catch(() => setError("排行榜加载失败"));
  }, []);

  return (
    <div className="section">
      <h2>排行榜 Top 100</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>排名</th>
                <th>昵称</th>
                <th>得分</th>
                <th>用时</th>
                <th>提交时间</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className="rank-badge">{entry.rank}</span>
                  </td>
                  <td>{entry.nickname}</td>
                  <td>{entry.score}</td>
                  <td>{formatDuration(entry.durationSec)}</td>
                  <td>{formatDate(entry.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <button className="btn ghost" onClick={() => navigate("/")}>返回首页</button>
      </div>
    </div>
  );
}
