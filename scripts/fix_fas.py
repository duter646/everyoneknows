import json

fas_data = [
    {
        "id": "fas_001",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "被称为“时尚界的凯撒大帝”，曾长期执掌香奈儿（Chanel）并创立同名品牌的著名设计师是？",
        "options": ["克里斯汀·迪奥", "伊夫·圣·罗兰", "卡尔·拉格斐", "乔治·阿玛尼"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "卡尔·拉格斐（Karl Lagerfeld）被尊称为“老佛爷”，职业生涯跨越半个多世纪。",
        "tags": ["设计师", "时尚史"]
    },
    {
        "id": "fas_002",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "在1947年推出以“蜂腰长裙”为特征的“新风貌”（New Look），彻底改变了战后女性时尚的设计师是？",
        "options": ["可可·香奈儿", "克里斯汀·迪奥", "艾尔莎·夏帕瑞丽", "休伯特·德·纪梵希"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "Dior的New Look通过收腰和宽大的裙褶重塑了女性轮廓。",
        "tags": ["时尚史", "New Look"]
    },
    {
        "id": "fas_003",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "以下哪项是Coco Chanel设计的标志性单品，旨在将女性从束身衣中解放出来？",
        "options": ["吸烟装", "小黑裙", "比基尼", "松糕鞋"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "小黑裙（Little Black Dress）和香奈儿套装是Chanel定义的经典独立风格。",
        "tags": ["经典设计", "Chanel"]
    },
    {
        "id": "fas_004",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "1960年代由设计师玛丽·奎恩特（Mary Quant）推广开来，成为当时青年文化象征的服饰是？",
        "options": ["喇叭裤", "阔腿裤", "迷你裙", "紧身胸衣"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "迷你裙（Miniskirt）是60年代摇摆伦敦和女性解放运动的重要视觉标签。",
        "tags": ["时尚史", "亚文化"]
    },
    {
        "id": "fas_005",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "时尚品牌“爱马仕”（Hermès）最著名的丝巾系列常以什么作为设计母本和技艺展示的核心？",
        "options": ["花卉图案", "赛马与马具文化", "现代几何图形", "世界地图"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "爱马仕最早以制造高级马具起家，马具文化深深植根于其丝巾及皮具设计中。",
        "tags": ["奢侈品牌", "文化渊源"]
    },
    {
        "id": "fas_006",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "“安特卫普六君子”代表了哪个国家在20世纪80年代末在时装设计界的崛起？",
        "options": ["法国", "意大利", "比利时", "日本"],
        "answer": [2],
        "difficulty": "hard",
        "explanation": "这六位来自比利时安特卫普皇家艺术学院的设计师为现代主义设计注入了先锋力量。",
        "tags": ["设计师集群", "先锋设计"]
    },
    {
        "id": "fas_007",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "日本设计师川久保玲创建的追求解构主义和打破常规审美的品牌是？",
        "options": ["Yohji Yamamoto", "Comme des Garçons", "Issey Miyake", "Kenzo"],
        "answer": [1],
        "difficulty": "hard",
        "explanation": "Comme des Garçons（像小男孩一样）是川久保玲建立的反传统美学巅峰品牌。",
        "tags": ["日本设计", "解构主义"]
    },
    {
        "id": "fas_008",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "所谓的“高定时装”（Haute Couture）起源于哪个城市，并受法律保护其标准？",
        "options": ["伦敦", "纽约", "巴黎", "米兰"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "高级定制起源于巴黎，受法国时装公会的法律严格规定其准入门槛。",
        "tags": ["时装词霸", "时尚制度"]
    },
    {
        "id": "fas_009",
        "domain": "时尚与服装史",
        "type": "single",
        "question": "被誉为“剪裁大师”，曾为电影《龙凤配》设计奥黛丽·赫本绝大多数造型的设计师是？",
        "options": ["圣罗兰", "纪梵希", "华伦天奴", "维维安·韦斯特伍德"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "纪梵希与奥黛丽·赫本的长期友谊造就了时尚史上无数经典时刻。",
        "tags": ["电影时尚", "经典偶像"]
    },
    {
        "id": "fas_010",
        "domain": "时尚与服装史",
        "type": "multiple",
        "question": "以下哪些品牌属于当今时尚界的传统“蓝血”奢侈品牌（依据业界非正式分类）？",
        "options": ["Louis Vuitton", "Chanel", "Supreme", "Dior"],
        "answer": [0, 1, 3],
        "difficulty": "medium",
        "explanation": "“蓝血”通常指LV, Chanel, Dior, Gucci, Prada, Calvin Klein六个品牌（早期划分方法）。Supreme属于街头品牌。",
        "tags": ["品牌知识", "奢侈品"]
    }
]

with open('data/fas_batch.json', 'w', encoding='utf-8') as f:
    json.dump(fas_data, f, indent=4, ensure_ascii=False)

print("Created 10 unique fashion items in fas_batch.json")
