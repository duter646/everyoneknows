import json
import glob
import os
from collections import Counter

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

PLAN = {
    "地理": 40,
    "历史": 50,
    "文学": 40,
    "数学常识": 30,
    "物理常识": 30,
    "化学常识": 30,
    "生物常识": 30,
    "天文学": 20,
    "地球科学": 20,
    "医学与健康": 30,
    "心理学常识": 25,
    "计算机基础": 40,
    "互联网与网络": 30,
    "人工智能基础": 30,
    "经济学常识": 20,
    "金融常识": 20,
    "法律常识": 25,
    "政治制度": 20,
    "国际组织与外交": 20,
    "艺术史": 20,
    "音乐常识": 25,
    "电影与戏剧": 30,
    "建筑与设计": 25,
    "语言学与文字": 20,
    "哲学常识": 25,
    "体育常识": 30,
    "奥运与赛事": 40,
    "美食与营养": 30,
    "环境与可持续发展": 20,
    "科技史": 35,
    "交通与工程": 40,
    "日常生活与安全": 60,
    "现代军事常识": 30,
    "网络梗知识": 50,
    "一些猎奇小众知识": 100,
    "时事热点": 20,
    "游戏知识": 60,
    "工业界常识": 60,
    "神话与民间传说": 30,
    "社会学与人类学": 20,
    "逻辑学与思维法则": 20,
    "农业与农学常识": 20,
    "宠物与动物行为学": 20,
    "时尚与服装史": 20,
}

all_data = {}
for fp in sorted(glob.glob(os.path.join(DATA_DIR, "*_batch.json"))):
    fname = os.path.basename(fp)
    with open(fp, "r", encoding="utf-8-sig") as f:
        data = json.load(f)
    if not data:
        continue
    domain = data[0].get("domain", "未知")
    diff_cnt = Counter(q["difficulty"] for q in data)
    type_cnt = Counter(q["type"] for q in data)
    combo_cnt = Counter(q["type"] + "_" + q["difficulty"] for q in data)
    all_data[domain] = {
        "fname": fname,
        "total": len(data),
        "easy": diff_cnt.get("easy", 0),
        "medium": diff_cnt.get("medium", 0),
        "hard": diff_cnt.get("hard", 0),
        "single": type_cnt.get("single", 0),
        "multiple": type_cnt.get("multiple", 0),
    }

# Check for domains in files but not in plan
unplanned = set(all_data.keys()) - set(PLAN.keys())
# Check for domains in plan but not in files
missing = set(PLAN.keys()) - set(all_data.keys())

total_actual = 0
total_planned = 0

print("=" * 80)
print("题库数据统计与计划对比")
print("=" * 80)
print()
print(f"{'领域':<16} {'文件':<20} {'实际':>5} {'计划':>5} {'差距':>5} {'easy':>5} {'med':>5} {'hard':>5} {'单选':>5} {'多选':>5} {'状态':<6}")
print("-" * 100)

issues = []
for domain in sorted(PLAN.keys(), key=lambda d: PLAN[d], reverse=True):
    planned = PLAN[domain]
    if domain in all_data:
        d = all_data[domain]
        actual = d["total"]
        diff = actual - planned
        total_actual += actual
        total_planned += planned

        if actual < planned * 0.7:
            status = "!!不足"
            issues.append(f"[!!] {domain}: {actual}/{planned}，缺口{planned-actual}题")
        elif actual > planned * 1.3:
            status = "!!超标"
            issues.append(f"[!!] {domain}: {actual}/{planned}，超出{actual-planned}题")
        elif actual < planned * 0.9:
            status = "偏少"
        elif actual > planned * 1.1:
            status = "偏多"
        else:
            status = "OK"

        print(f"{domain:<16} {d['fname']:<20} {actual:>5} {planned:>5} {diff:>+5} {d['easy']:>5} {d['medium']:>5} {d['hard']:>5} {d['single']:>5} {d['multiple']:>5} {status:<6}")
    else:
        print(f"{domain:<16} {'(缺失)':<20} {'---':>5} {planned:>5} {'---':>5} {'---':>5} {'---':>5} {'---':>5} {'---':>5} {'---':>5} 缺失")

print("-" * 100)
print(f"{'合计':<16} {'':<20} {total_actual:>5} {total_planned:>5} {total_actual-total_planned:>+5}")
print()

if missing:
    print(f"计划中有但文件中缺失的领域: {', '.join(sorted(missing))}")
    print()

if unplanned:
    print(f"文件中有但计划中未列出的领域: {', '.join(sorted(unplanned))}")
    print()

# 343 distribution check summary
bad_343 = []
for domain, d in all_data.items():
    total = d["total"]
    if total < 10:
        continue
    hard_ratio = d["hard"] / total
    if hard_ratio < 0.15:
        bad_343.append(f"{domain}(hard仅{hard_ratio:.0%})")

if bad_343:
    print(f"难度343分布仍异常: {', '.join(bad_343)}")
else:
    print("难度343分布: 全部正常")

# Type ratio check
bad_type = []
for domain, d in all_data.items():
    total = d["total"]
    if total < 10:
        continue
    mult_ratio = d["multiple"] / total
    if mult_ratio < 0.1:
        bad_type.append(f"{domain}(多选仅{mult_ratio:.0%})")

if bad_type:
    print(f"题型75:25分布异常: {', '.join(bad_type)}")
else:
    print("题型75:25分布: 全部正常")

print()
if issues:
    print(f"严重偏差({len(issues)}个):")
    for iss in issues:
        print(f"  {iss}")
else:
    print("所有领域题目数与计划基本一致。")
