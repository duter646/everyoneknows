# EveryoneKnows — 万物皆知 · 世界知识擂台

> 覆盖 44 个知识领域的百科答题竞赛平台，答完自动鉴定你的学科身份。

## 功能一览

| 模块 | 说明 |
|------|------|
| 🎯 智能组卷 | 按 44 领域均衡抽题，同域最多 3 题，选项随机打乱 + 答案重映射 |
| 📊 赋分引擎 | 基础分 × 正确率系数 × 时间因子 → 归一化百分制；秒答惩罚、超时衰减、多选漏选按比例给分 |
| 🧬 身份鉴定 | 基于十三大学科门类向量，通过「平均贡献 × 置信度 × 优势比映射」算法判定学科归属，生成段位词缀 + 学科后缀 |
| 🕸️ 学科雷达 | Chart.js 雷达图展示各学科原始正确率，不做归一化/sigmoid |
| 🏅 勋章墙 | 12 项成就（量子阅读、偏科战神、满分传说、天选之子…） |
| 🏆 排行榜 | Top 100，分难度 Tab，昵称上传 |
| 🔧 管理端 | 题库 JSON/CSV 导入、校验、启用/停用 |

## 答题配置

- **题量**：20 / 30 / 40 / 50 题
- **难度分布**：
  - 轻松 — 简:中:难 = 7:2:1
  - 均衡 — 简:中:难 = 3:4:3
  - 硬核 — 简:中:难 = 1:3:6
- **题型**：单选 75% + 多选 25%

## 赋分公式

```
最终得分 = (Σ 每题得分 / 试卷基准满分) × 100

每题得分 = 基础分 × 正确率系数 × 时间因子

基础分:  单选 {易10, 中15, 难20}  多选 {易15, 中22.5, 难30}
正确率:  单选 — 全对1否则0;  多选 — 有错选→0, 漏选→(选对数/应选数)
时间因子:  标准时间内 ≈ 1.0~1.5, 超时线性衰减至0.5, 秒答(<2s)→0.5
```

详细推导见 [`docs/change_logic.md`](docs/change_logic.md)。

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + TypeScript 5 + Vite 5 + react-router-dom 6 |
| 图表 | Chart.js 4 + react-chartjs-2 |
| 后端 | Supabase Edge Functions (Deno) + PostgreSQL |
| 辅助 | Python 3（题库生成 / 向量推断 / SQL 导出 / 数据合并） |
| 部署 | GitHub Actions → GitHub Pages（前端）、Supabase Cloud（后端） |

## 项目结构

```
├── data/                    # 题库数据（~48 个 batch JSON，44 领域）
├── docs/                    # 项目文档
│   ├── plan.md              # 项目规划
│   ├── change_logic.md      # 赋分规则推导
│   ├── doc_identity_v2.md   # 身份鉴定算法
│   └── DEPLOY.md            # 部署指南
├── scripts/                 # Python 辅助脚本
│   ├── generate_qbank.py    # 题库批量生成 Prompt
│   ├── generate_import_sql.py
│   ├── merge_to_web.py
│   └── add_vectors.py
├── supabase/                # Supabase 后端
│   ├── migrations/          # 数据库迁移
│   └── functions/           # Edge Functions
│       ├── _shared/         # 共享模块（cors / scoring / quiz / token …）
│       ├── paper/           # 出卷
│       ├── score/           # 评分
│       ├── submit/          # 提交成绩
│       ├── meta/            # 元数据
│       └── admin-*/         # 管理端
├── web/                     # 前端应用
│   ├── src/
│   │   ├── pages/           # 页面（Home / Quiz / Result / Leaderboard / Admin）
│   │   ├── lib/             # 核心逻辑
│   │   │   ├── localQuiz.ts # 前端本地组卷 + 评分
│   │   │   ├── identity.ts  # 身份鉴定算法
│   │   │   ├── api.ts       # API 调用层
│   │   │   └── types.ts     # 类型定义
│   │   └── styles/          # 全局样式（赛博朋克深色主题）
│   └── public/
│       └── questions.json   # 合并后的完整题库
└── import_questions.sql     # 题库导入 SQL
```

## 快速开始

### 前端

```bash
cd web
npm install
cp .env.example .env   # 填入 Supabase URL 和 Anon Key
npm run dev
```

### 后端（Supabase）

参见 [`docs/DEPLOY.md`](docs/DEPLOY.md) 完成数据库迁移和 Edge Functions 部署。

### 题库

1. 在 `data/` 中添加或编辑 `*_batch.json` 文件
2. 若无向量，运行 `python scripts/add_vectors.py` 自动推断学科向量
3. 运行 `python scripts/merge_to_web.py` 合并到 `web/public/questions.json`
4. 运行 `python scripts/generate_import_sql.py` 生成 SQL 导入脚本

## UI 风格

深色赛博朋克主题 — Orbitron + Noto Sans SC 字体，毛玻璃面板，霓虹青色 `#00e5ff` + 紫色 `#7c4dff` 双色调，移动端响应式。

## License

MIT
