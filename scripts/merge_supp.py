import json, glob, os

# Map prefixes to standard domains based on current prompt
standard_domains = {
    "geo": "地理", "his": "历史", "lit": "文学", "math": "数学常识", "phy": "物理常识",
    "chem": "化学常识", "bio": "生物常识", "astro": "天文学", "geo_sci": "地球科学",
    "med": "医学与健康", "psy": "心理学常识", "cs": "计算机基础", "net": "互联网与网络",
    "ai": "人工智能基础", "eco": "经济学常识", "fin": "金融常识", "law": "法律常识",
    "pol": "政治制度", "dip": "国际组织与外交", "art": "艺术史", "mus": "音乐常识",
    "mov": "电影与戏剧", "arc": "建筑与设计", "lng": "语言学与文字", "phi": "哲学常识",
    "spo": "体育常识", "oly": "奥运与赛事", "foo": "美食与营养", "env": "环境与可持续发展",
    "hst": "科技史", "tra": "交通与工程", "saf": "日常生活与安全", "mil": "现代军事常识",
    "mem": "网络梗知识", "nch": "一些猎奇小众知识", "hot": "时事热点", "game": "游戏知识",
    "ind": "工业界常识", "myt": "神话与民间传说", "soc": "社会学与人类学", "log": "逻辑学与思维法则",
    "agr": "农业与农学常识", "pet": "宠物与动物行为学", "fas": "时尚与服装史"
}

# 1. Inspect existing non-supp batch files to ensure we perfectly match their latest domain if it diverges
for f in glob.glob("data/*_batch.json"):
    if "supp" in f: continue
    prefix = f.replace("data/", "").replace("_batch.json", "")
    with open(f, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
        if data and 'domain' in data[0]:
            standard_domains[prefix] = data[0]['domain']

# 2. Merge supp files into their batch files
supp_files = glob.glob("data/*supp*.json")
merged_prefixes = set()

for sf in supp_files:
    filename = os.path.basename(sf)
    prefix = filename.split('_')[0]
    if filename.startswith("art_art"): prefix = "art"
    if filename.startswith("geo_sci"): prefix = "geo_sci"
    
    batch_file = f"data/{prefix}_batch.json"
    batch_data = []
    if os.path.exists(batch_file):
        with open(batch_file, 'r', encoding='utf-8') as bfh:
            batch_data = json.load(bfh)
    
    with open(sf, 'r', encoding='utf-8') as sfh:
        supp_data = json.load(sfh)
    
    batch_data.extend(supp_data)
    
    with open(batch_file, "w", encoding="utf-8") as bfh:
        json.dump(batch_data, bfh, indent=4, ensure_ascii=False)
    
    os.remove(sf)
    merged_prefixes.add(prefix)

print(f"Merged and deleted {len(supp_files)} supp files.")

# 3. Clean up the domain and ID of EVERY batch file
for f in glob.glob("data/*_batch.json"):
    prefix = f.replace("data/", "").replace("_batch.json", "")
    with open(f, 'r', encoding='utf-8') as fh:
        batch_data = json.load(fh)
    
    correct_domain = standard_domains.get(prefix, batch_data[0].get("domain", "") if batch_data else "Unknown")
    
    changed = False
    for i, q in enumerate(batch_data):
        old_domain = q.get('domain')
        old_id = q.get('id')
        new_id = f"{prefix}_{i+1:03d}"
        
        if old_domain != correct_domain or old_id != new_id:
            q['domain'] = correct_domain
            q['id'] = new_id
            changed = True
            
    if changed:
        with open(f, 'w', encoding="utf-8") as fh:
            json.dump(batch_data, fh, indent=4, ensure_ascii=False)

print("All batch files have been sanitized: rigorous IDs and standard domains.")
