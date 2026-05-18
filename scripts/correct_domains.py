import json
import os

# 定义映射关系：当前错误的名称 -> 目标正确的名称
# 根据用户反馈和文件名对应：
# fas_batch.json (时尚) 目前是 "艺术史" -> 应改为 "时尚与服装史"
# log_batch.json (逻辑) 目前是 "哲学" -> 应改为 "逻辑学与思维法则"
# myt_batch.json (神话) 目前是 "一些猎奇小众知识" -> 应改为 "神话与民间传说"
# pet_batch.json (宠物) 目前是 "日常生活与安全" -> 应改为 "宠物与动物行为学"
# soc_batch.json (社会) 目前是 "法学" -> 应改为 "社会学与人类学"

FILE_MAP = {
    "data/fas_batch.json": "时尚与服装史",
    "data/log_batch.json": "逻辑学与思维法则",
    "data/myt_batch.json": "神话与民间传说",
    "data/pet_batch.json": "宠物与动物行为学",
    "data/soc_batch.json": "社会学与人类学"
}

for file_path, target_domain in FILE_MAP.items():
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for item in data:
            item["domain"] = target_domain
            
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Fixed domains in {file_path} to '{target_domain}'")
    else:
        print(f"File not found: {file_path}")
