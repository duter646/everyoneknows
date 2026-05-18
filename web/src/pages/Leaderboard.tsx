import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import { LeaderboardEntry } from "../lib/types";
import { formatDate, formatDuration, formatPercent } from "../lib/format";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ leaderboard: LeaderboardEntry[] }>("/api/leaderboard?limit=100")
      .then((data) => setEntries(data.leaderboard))
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
                <th>得分率</th>
                <th>分数</th>
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
                  <td>{formatPercent(entry.accuracy)}</td>
                  <td>{entry.score}</td>
                  <td>{formatDuration(entry.durationSec)}</td>
                  <td>{formatDate(entry.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
