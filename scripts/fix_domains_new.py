import json
import glob

DOMAIN_MAP = {
    35: "一些猎奇小众知识",
    36: "时事热点",
    37: "游戏知识",
    38: "工业界常识",
    39: "神话与民间传说",
    40: "社会学与人类学",
    41: "逻辑学与思维法则",
    42: "农业与农学常识",
    43: "宠物与动物行为学",
    44: "时尚与服装史"
}

files = glob.glob("data/*_batch.json")
count = 0
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    modified = False
    for item in data:
        dom = item.get("domain")
        if isinstance(dom, int) and dom in DOMAIN_MAP:
            item["domain"] = DOMAIN_MAP[dom]
            modified = True
            
    if modified:
        with open(file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Fixed {file}")
        count += 1
print(f"Total fixed: {count}")
