import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RULES = [
  { icon: "📋", title: "题型与题量", desc: "30/40/50 题可选，单选为主，多选为辅，领域均衡覆盖。" },
  { icon: "🎯", title: "计分规则", desc: "单选按难度得 10/15/20 分，多选全对得 15/22.5/30 分。漏选按比例计分，含错选 0 分。" },
  { icon: "⚡", title: "时间因子", desc: "答得越快奖励越高，秒答(<2s)惩罚。超时线性衰减，保底 0.5 倍。" },
  { icon: "📊", title: "百分制归一", desc: "最终得分归一化到百分制，不同题量可公平对比。" },
  { icon: "🧬", title: "学科画像", desc: "基于得分率 + softmax 推测你的学科倾向，生成雷达图与趣味身份。" }
];

export default function Home() {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(30);
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="home">
      <div className="home-center">
        <div className="home-logo">EK</div>
        <h1 className="home-title">EveryoneKnows</h1>
        <p className="home-subtitle">世界知识擂台</p>

        <div className="home-count-select">
          {[
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

        <button
          className="home-start"
          onClick={() => navigate(`/quiz?count=${questionCount}`)}
        >
          开始挑战
        </button>
      </div>

      <div className="home-actions">
        <button className="home-link" onClick={() => setShowRules(!showRules)}>
          {showRules ? "收起规则" : "游戏规则"}
        </button>
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

      {showRules && (
        <div className="home-rules">
          {RULES.map((rule) => (
            <div key={rule.title} className="rule-item">
              <span className="rule-icon">{rule.icon}</span>
              <div>
                <strong>{rule.title}</strong>
                <p>{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
