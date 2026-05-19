import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMeta } from "../lib/api";
import { Meta } from "../lib/types";

export default function Home() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(30);

  useEffect(() => {
    fetchMeta()
      .then(setMeta)
      .catch(() => setMeta(null));
  }, []);

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="section hero">
        <div>
          <h1>EveryoneKnows 世界知识擂台</h1>
          <p>
            {questionCount} 题极速挑战，覆盖 40+ 常识领域。答完立刻生成你的学科画像与雷达图，
            把你的知识版图晒上排行榜。
          </p>
          <div className="form-row">
            <select
              className="input-base"
              style={{ padding: "0.4rem 1rem", borderRadius: "999px" }}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              <option value={30}>30 题进阶</option>
              <option value={40}>40 题资深</option>
              <option value={50}>50 题极客</option>
            </select>
            <button className="btn" onClick={() => navigate(`/quiz?count=${questionCount}`)}>开始挑战</button>
            <button className="btn secondary" onClick={() => navigate("/leaderboard")}>去看榜单</button>
          </div>
          <div className="badge-row" style={{ marginTop: 18 }}>
            <span className="badge">单选为主，多选为辅</span>
            <span className="badge">领域覆盖优先</span>
            <span className="badge">难度梯度合理</span>
          </div>
        </div>
        <div className="grid two">
          <div className="stat-card">
            <span>题库规模</span>
            <strong>{meta ? `${meta.questionCount}+` : "加载中"}</strong>
            <span className="note">题库持续扩容，后续题量持续增长。</span>
          </div>
          <div className="stat-card">
            <span>覆盖领域</span>
            <strong>{meta ? `${meta.domainCount}+` : "加载中"}</strong>
            <span className="note">每次测试尽可能均衡覆盖。</span>
          </div>
          <div className="stat-card">
            <span>游戏化结算</span>
            <strong>身份鉴定 + 雷达图</strong>
            <span className="note">基于学科向量推测你的知识偏好。</span>
          </div>
          <div className="stat-card">
            <span>排行榜机制</span>
            <strong>得分率优先</strong>
            <span className="note">速度也重要，快且准才能登顶。</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>规则速览</h2>
        <div className="grid two">
          <div className="stat-card">
            <strong>题量与题型</strong>
            <span className="note">每次 {questionCount} 题，单选为主，多选为辅。</span>
          </div>
          <div className="stat-card">
            <strong>计分规则</strong>
            <span className="note">单选答对按难度得10/15/20分，多选全对得15/22.5/30分；漏选按比例计分；含错选0分。</span>
          </div>
          <div className="stat-card">
            <strong>领域均衡</strong>
            <span className="note">同一领域最多 3 题，尽可能多覆盖不同领域。</span>
          </div>
          <div className="stat-card">
            <strong>排行榜</strong>
            <span className="note">按得分率排序，同分看用时。</span>
          </div>
        </div>
      </div>
    </div>
  );
}
