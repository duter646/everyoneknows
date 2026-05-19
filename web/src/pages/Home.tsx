import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NOTES = [
  "30/40/50 题可选，单选75%多选25%，难度可调",
  "答得越快奖励越高，秒答惩罚，超时衰减",
  "百分制归一化，不同题量可公平对比",
  "基于答题推测学科倾向，生成雷达图与身份"
];

export default function Home() {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(30);
  const [diffProfile, setDiffProfile] = useState<"721" | "343" | "136">("343");

  const handleStart = () => {
    navigate(`/quiz?count=${questionCount}&diff=${diffProfile}`);
  };

  return (
    <div className="home">
      <div className="home-center">
        <div className="home-logo">EK</div>
        <h1 className="home-title">EveryoneKnows</h1>
        <p className="home-subtitle">世界知识擂台</p>

        <div className="home-count-select">
          {[
            { val: 20, label: "20 题", tag: "热身" },
            { val: 30, label: "30 题", tag: "进阶" },
            { val: 40, label: "40 题", tag: "资深" },
            { val: 50, label: "50 题", tag: "极客" }
          ].map((item) => (
            <button
              key={item.val}
              className={`count-btn ${questionCount === item.val ? "active" : ""}`}
              onClick={() => setQuestionCount(item.val)}
            >
              <span className="count-num">{item.label}</span>
              <span className="count-tag">{item.tag}</span>
            </button>
          ))}
        </div>

        <div className="home-diff-select">
          {[
            { val: "721" as const, label: "轻松", desc: "易7 中2 难1" },
            { val: "343" as const, label: "均衡", desc: "易3 中4 难3" },
            { val: "136" as const, label: "硬核", desc: "易1 中3 难6" }
          ].map((item) => (
            <button
              key={item.val}
              className={`diff-btn ${diffProfile === item.val ? "active" : ""}`}
              onClick={() => setDiffProfile(item.val)}
            >
              <span className="diff-label">{item.label}</span>
              <span className="diff-desc">{item.desc}</span>
            </button>
          ))}
        </div>

        <button className="home-start" onClick={handleStart}>
          开始挑战
        </button>
      </div>

      <div className="home-actions">
        <button className="home-link" onClick={() => navigate("/leaderboard")}>
          排行榜
        </button>
        <a
          className="home-link"
          href="https://github.com/duter646/everyoneknows"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>

      <div className="home-notes">
        {NOTES.map((note, i) => (
          <p key={i} className="home-note">{note}</p>
        ))}
        <p className="home-note" style={{ marginTop: 8, opacity: 0.7 }}>
          发现错题或有建议？欢迎到 GitHub 提 Issue
        </p>
      </div>
    </div>
  );
}
