import json
import glob
import os
from collections import Counter

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

issues = []

for fp in sorted(glob.glob(os.path.join(DATA_DIR, "*_batch.json"))):
    fname = os.path.basename(fp)
    with open(fp, "r", encoding="utf-8-sig") as f:
        data = json.load(f)

    total = len(data)
    if total == 0:
        issues.append(f"[{fname}] 空文件")
        continue
    if total < 10:
        continue

    diff_cnt = Counter(q["difficulty"] for q in data)
    type_cnt = Counter(q["type"] for q in data)
    combo_cnt = Counter(q["type"] + "_" + q["difficulty"] for q in data)

    easy = diff_cnt.get("easy", 0)
    medium = diff_cnt.get("medium", 0)
    hard = diff_cnt.get("hard", 0)
    single = type_cnt.get("single", 0)
    multiple = type_cnt.get("multiple", 0)

    problems = []

    if hard == 0:
        problems.append(f"hard=0")
    elif hard < total * 0.15:
        problems.append(f"hard严重不足: {hard}/{total} ({hard/total:.0%})")

    if easy > total * 0.6:
        problems.append(f"easy严重偏多: {easy}/{total} ({easy/total:.0%})")

    if multiple == 0 and total >= 15:
        problems.append(f"多选题为0")

    missing_hard_buckets = []
    if combo_cnt.get("single_hard", 0) == 0:
        missing_hard_buckets.append("single_hard")
    if combo_cnt.get("multiple_hard", 0) == 0:
        missing_hard_buckets.append("multiple_hard")
    if missing_hard_buckets and hard > 0:
        pass
    elif missing_hard_buckets and total >= 20:
        problems.append(f"缺hard桶: {','.join(missing_hard_buckets)}")

    for q in data:
        opts_len = len(q.get("options", []))
        ans = q.get("answer", [])
        if any(a >= opts_len for a in ans):
            problems.append(f"答案越界: {q['id']}")
            break

    if problems:
        detail = f"easy={easy} medium={medium} hard={hard} single={single} multiple={multiple}"
        issues.append(f"[{fname}] {total}题 {detail} | {'; '.join(problems)}")

print("=" * 70)
print("题库严重问题检测 (仅报告显著异常)")
print("=" * 70)
print()
if issues:
    for iss in issues:
        print(iss)
    print(f"\n共 {len(issues)} 个文件存在严重问题")
else:
    print("未发现严重问题。")
