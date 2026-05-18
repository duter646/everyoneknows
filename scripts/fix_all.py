import json
import os
import glob

# Domain map based on template
domain_map = {
    1: "地理", 2: "历史", 3: "文学", 4: "数学常识", 5: "物理常识",
    6: "化学常识", 7: "生物常识", 8: "天文学", 9: "地球科学", 10: "医学与健康",
    11: "心理学常识", 12: "计算机基础", 13: "互联网与网络", 14: "人工智能基础", 15: "经济学常识",
    16: "金融常识", 17: "法律常识", 18: "政治制度", 19: "国际组织与外交", 20: "艺术史",
    21: "音乐常识", 22: "电影与戏剧", 23: "建筑与设计", 24: "语言学与文字", 25: "哲学常识",
    26: "体育常识", 27: "奥运与赛事", 28: "美食与营养", 29: "环境与可持续发展", 30: "科技史",
    31: "交通与工程", 32: "日常生活与安全", 33: "现代军事常识", 34: "网络梗知识", 35: "一些猎奇小众知识",
    36: "时事热点", 37: "游戏知识", 38: "工业界常识"
}

def fix_answer(ans):
    if isinstance(ans, list):
        return ans
    if isinstance(ans, str):
        res = []
        ans = ans.upper()
        if 'A' in ans: res.append(0)
        if 'B' in ans: res.append(1)
        if 'C' in ans: res.append(2)
        if 'D' in ans: res.append(3)
        return sorted(res)
    return ans

def fix_type(t):
    if t == 1: return "single"
    if t == 2: return "multiple"
    return t

def fix_diff(d):
    if d == 1: return "easy"
    if d == 2: return "medium"
    if d == 3: return "hard"
    return d

def fix_domain(d):
    if isinstance(d, int) and d in domain_map:
        return domain_map[d]
    return d

count = 0
for filepath in glob.glob("data/*.json"):
    with open(filepath, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            continue
    changed = False
    new_data = []
    
    if not isinstance(data, list):
        continue
        
    for item in data:
        new_item = item.copy()
        
        # fix type
        new_type = fix_type(item.get("type"))
        if new_type != item.get("type"):
            new_item["type"] = new_type
            changed = True
            
        # fix difficulty
        new_diff = fix_diff(item.get("difficulty"))
        if new_diff != item.get("difficulty"):
            new_item["difficulty"] = new_diff
            changed = True
            
        # fix answer
        new_ans = fix_answer(item.get("answer"))
        if new_ans != item.get("answer"):
            new_item["answer"] = new_ans
            changed = True
            
        # fix domain
        new_dom = fix_domain(item.get("domain"))
        if new_dom != item.get("domain"):
            new_item["domain"] = new_dom
            changed = True
            
        new_data.append(new_item)
        
    if changed:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(new_data, f, ensure_ascii=False, indent=4)
        count += 1
        print(f"Fixed {filepath}")

print(f"Total fixed files: {count}")
