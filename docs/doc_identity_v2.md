# 专业判断逻辑优化方案

## 1. 问题分析

### 当前方案（纯得分率 + softmax）

```
rate[d] = userScores[d] / baseScores[d]
softmax → percents
```

| 缺陷 | 原因 | 示例 |
|------|------|------|
| **难度无差异** | 得分率归一化消除难度信息 | 答对1道简单题和1道困难题，rate 均为 1.0 |
| **小样本不可靠** | 样本量不参与计算 | 某学科仅1题答对，rate=1.0，压过5题答对4题的学科(rate=0.8) |

### 排除的方案

| 方案 | 问题 |
|------|------|
| 得分率 × 难度权重 | 相当于把归一化除掉的难度又乘回来，本质接近平均得分 |
| 贝叶斯平滑得分率 | 平滑后简单 vs 困难差异仅 ~1%，难度信息依然丢失 |
| 直接用总得分 userScore | 出现频率高的学科必然得分高，不公平 |
| softmax 归一化 | 输出是概率分布（总和=100%），无法反映"我们有多确信 top1 是对的" |

---

## 2. 核心思路

### 2.1 每题平均贡献 × 小样本置信度

- **每题平均贡献** = userScore / effectiveCount，天然保留难度差异（item.score 含难度基础分），按题数归一化消除频率偏差
- **小样本置信度** = effectiveCount / (effectiveCount + k)，样本不足时衰减信号

### 2.2 优势比 → 置信度映射

softmax 输出是概率分布，无法直观反映"对 top1 有多确信"。改用**优势比映射**：

- 计算 top1 相对于 top2 的优势比 `advantage = signal[top1] / signal[top2]`
- 用 sigmoid 函数把优势比映射为 top1 的置信度（50%~100%）
- 其他学科按 signal 比例等比缩放

| advantage | 含义 | top1 置信度 |
|-----------|------|------------|
| 1.0 | top1 = top2，无法区分 | 50% |
| 1.5 | top1 略强于 top2 | ~82% |
| 2.0 | top1 是 top2 的两倍 | 95% |
| 3.0 | top1 远超 top2 | ~99% |
| →∞ | top1 完全碾压 | →100% |

---

## 3. 公式定义

### 3.1 输入

对每个学科 d ∈ DISCIPLINES：

| 变量 | 定义 | 计算方式 |
|------|------|----------|
| userScores[d] | 该学科用户总得分（含向量权重） | Σ(item.score × vector_weight) |
| effectiveCount[d] | 该学科有效题数（含向量权重） | Σ(vector_weight)，跨该学科所有题目 |

> vector_weight 为该领域到该学科的 DOMAIN_VECTOR 值（如"生物常识"→理学:0.6, 医学:0.2, 农学:0.2）

### 3.2 计算步骤

**Step 1 — 每题平均贡献**

```
avgScore[d] = userScores[d] / effectiveCount[d]    (effectiveCount[d] > 0)
avgScore[d] = 0                                      (effectiveCount[d] = 0)
```

**Step 2 — 小样本置信度**

```
confidence[d] = effectiveCount[d] / (effectiveCount[d] + k)
```

| 参数 | 符号 | 默认值 | 说明 |
|------|------|--------|------|
| 平滑常数 | k | 3 | 约等于"需要多少题才能较确信"，k 越大对小样本惩罚越强 |

**Step 3 — 最终信号**

```
signal[d] = avgScore[d] × confidence[d]
```

**Step 4 — 优势比与置信度**

```
sorted    = sort descend by signal
signal_1  = sorted[0]  (top1)
signal_2  = sorted[1]  (top2，若无则取 ε = 0.01)
advantage = signal_1 / signal_2

topConfidence = 1 / (1 + exp(-K × (advantage - 1)))
```

| 参数 | 符号 | 默认值 | 说明 |
|------|------|--------|------|
| 置信度斜率 | K | ln(19) ≈ 2.944 | 使 advantage=2 时 topConfidence=95% |

验证：
- advantage=1: `1/(1+e^0) = 0.5` = **50%** ✓（无法区分时置信度最低）
- advantage=2: `1/(1+e^(-2.944)) = 1/(1+1/19) = 0.95` = **95%** ✓
- advantage→∞: `→1.0` = **100%** ✓

**Step 5 — 各学科匹配度（0-100%）**

```
matchScore[d] = topConfidence × (signal[d] / signal_1) × 100
```

- top1 学科：matchScore = topConfidence × 100
- 其他学科：按 signal 比例等比缩放，signal 越低匹配度越低

---

## 4. 数值示例

假设 k=3。

### 4.1 单学科对比

| 场景 | userScore | effCount | avgScore | confidence | signal |
|------|-----------|----------|----------|------------|--------|
| 1道简单题答对 (基础分10) | 10 | 1 | 10 | 0.25 | **2.5** |
| 1道困难题答对 (基础分20) | 20 | 1 | 20 | 0.25 | **5.0** |
| 3道中等题答对2道 | 30 | 3 | 10 | 0.50 | **5.0** |
| 5道混合题答对4道 | 60 | 5 | 12 | 0.63 | **7.5** |

**关键特性**：
- 简单 vs 困难：signal 2.5 vs 5.0，**2倍差距**，难度差异完整保留
- 1题 vs 5题：confidence 0.25 vs 0.63，小样本被显著压低
- 大样本收敛：effCount → ∞ 时 confidence → 1，signal → avgScore

### 4.2 完整场景（30题）

| 学科 | userScore | effCount | avgScore | confidence | signal |
|------|-----------|----------|----------|------------|--------|
| 工学 | 85.2 | 6 | 14.2 | 0.67 | 9.5 |
| 理学 | 52.0 | 4 | 13.0 | 0.57 | 7.4 |
| 日子人 | 28.5 | 3 | 9.5 | 0.50 | 4.8 |
| 医学 | 15.0 | 2 | 7.5 | 0.40 | 3.0 |
| 农学 | 8.0 | 1 | 8.0 | 0.25 | 2.0 |

优势比计算：
- signal_1 = 9.5（工学），signal_2 = 7.4（理学）
- advantage = 9.5 / 7.4 = **1.284**
- topConfidence = 1 / (1 + exp(-2.944 × 0.284)) = **66.7%**

各学科匹配度：

| 学科 | signal | signal/signal_1 | matchScore |
|------|--------|-----------------|------------|
| 工学 | 9.5 | 1.000 | **66.7%** |
| 理学 | 7.4 | 0.779 | **51.9%** |
| 日子人 | 4.8 | 0.505 | **33.7%** |
| 医学 | 3.0 | 0.316 | **21.1%** |
| 农学 | 2.0 | 0.211 | **14.1%** |

### 4.3 强优势场景

| 学科 | signal | signal/signal_1 | matchScore |
|------|--------|-----------------|------------|
| 工学 | 9.5 | 1.000 | **95.0%** |
| 理学 | 4.75 | 0.500 | **47.5%** |
| 日子人 | 2.0 | 0.211 | **20.0%** |

（advantage = 9.5/4.75 = 2.0，topConfidence = 95%）

### 4.4 无法区分场景

| 学科 | signal | signal/signal_1 | matchScore |
|------|--------|-----------------|------------|
| 工学 | 9.5 | 1.000 | **50.0%** |
| 理学 | 9.5 | 1.000 | **50.0%** |
| 日子人 | 5.0 | 0.526 | **26.3%** |

（advantage = 1.0，topConfidence = 50%，表示两个学科旗鼓相当，无法确信）

---

## 5. 与旧方案对比

| 维度 | 旧方案（答对题向量累加） | 新方案（平均贡献 × 置信度 × 优势比映射） |
|------|------------------------|----------------------------------------|
| 难度差异 | 固定权重 easy:0.8/medium:1/hard:1.2 | 基础分10/15/20，2倍差距 |
| 漏选/部分答对 | 不统计（只看 isCorrect） | item.score 含正确率和时间因子 |
| 频率偏差 | 答对题数累加，频率高的学科占优 | 除以 effCount 归一化 |
| 小样本 | 无处理 | confidence 衰减 |
| 输出含义 | softmax 概率分布（总和=100%） | 匹配度（0-100%，反映优势置信度） |
| 直觉性 | "工学占35%"——不知道35%算高还是低 | "工学匹配95%"——很确信；"工学匹配50%"——和第二名差不多 |

---

## 6. 实现修改清单

### 文件：`web/src/lib/identity.ts`

1. 移除 `BASE_SCORE_MAP`、`getBaseScore`（不再需要 baseScores）
2. 移除 `rateScores` 计算
3. 移除 `SOFTMAX_TEMPERATURE` 常量和 `softmax` 函数
4. 新增常量：`SMOOTH_K = 3`、`CONFIDENCE_K = Math.log(19)`、`SIGNAL_EPSILON = 0.01`
5. 修改 `scoreIdentity` 函数：

```typescript
// 1. 累加 userScores 和 effectiveCount
items.forEach(item => {
  const vector = DOMAIN_VECTOR[item.domain] || { 日子人: 1 };
  Object.entries(vector).forEach(([discipline, value]) => {
    userScores[key] += item.score * value;
    effectiveCount[key] += value;
  });
});

// 2. 计算 signal
for each discipline:
  avgScore = effectiveCount > 0 ? userScores / effectiveCount : 0;
  conf = effectiveCount / (effectiveCount + SMOOTH_K);
  signal = avgScore * conf;

// 3. 优势比 → 置信度
sorted = sort signals desc;
advantage = signal_1 / max(signal_2, ε);
topConfidence = 1 / (1 + exp(-CONFIDENCE_K * (advantage - 1)));

// 4. 匹配度
percents[d] = topConfidence * (signal[d] / signal_1) * 100;
```

6. `IdentityResult.totals` 改为存储 `signal` 值
7. Top3 排序改为按 signal 排序

---

## 7. 配置常量参考

| 常量 | 值 | 调参建议 |
|------|-----|---------|
| SMOOTH_K | 3 | 增大→小样本惩罚更强；减小→更信任少量样本 |
| CONFIDENCE_K | ln(19) ≈ 2.944 | 固定，由 advantage=2→95% 推导得出 |
| SIGNAL_EPSILON | 0.01 | 防止除零，仅在 top2=0 时启用 |
