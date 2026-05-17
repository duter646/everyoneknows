import json
import os

# 此处仅为结构示意，展示如果大规模生成题库，应当采用何种批量结构。
# 手工或通过脚本生成的题目最终将存入 data/questions.json

DOMAINS = [
    "地理", "历史", "文学", "数学常识", "物理常识", "化学常识", "生物常识", 
    "天文学", "地球科学", "医学与健康", "心理学常识", "计算机基础", "互联网与网络", 
    "人工智能基础", "经济学常识", "金融常识", "法律常识", "政治制度", "国际组织与外交", 
    "艺术史", "音乐常识", "电影与戏剧", "建筑与设计", "语言学与文字", "哲学常识", 
    "体育常识", "奥运与赛事", "美食与营养", "环境与可持续发展", "科技史", 
    "交通与工程", "日常生活与安全", "军事常识", "网络梗知识", "小众猎奇知识", "时事热点"
]

def generate_question_prompt(domain, count, difficulty_ratio=(3,4,3), types_ratio=(75,25)):
    """
    提供给大模型的 Prompt 模板，用于自动化跑数据
    """
    prompt = f"""
请你作为出题专家，为【{domain}】领域生成 {count} 道单选和多选题。
难度分布为 易:中:难 = {difficulty_ratio[0]}:{difficulty_ratio[1]}:{difficulty_ratio[2]}。
单选与多选比例约为 {types_ratio[0]}:{types_ratio[1]}。
请输出合法的 JSON 数组，格式如下：
[{{
  "id": "domain_001",
  "domain": "{domain}",
  "type": "single/multiple",
  "question": "题干内容",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "answer": [正确选项的索引0-3],
  "difficulty": "easy/medium/hard",
  "explanation": "答案解析",
  "tags": ["标签1", "标签2"]
}}]
极度注意：
1. 多选题 answer 数组长度>1，单选题为1。
2. 严肃客观，无事实错误。
    """
    return prompt

if __name__ == "__main__":
    print("题库批量生成工具准备就绪。")
    print(f"当前共规划 {len(DOMAINS)} 个领域。")
