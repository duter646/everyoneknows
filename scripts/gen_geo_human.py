import json

new_questions = [
    {
        "id": "geo_031",
        "domain": "地理",
        "type": "single",
        "question": "连续多年位居中国省级经济总值（GDP）榜首的省份是？",
        "options": ["江苏省", "浙江省", "广东省", "山东省"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "广东省自1989年起连续多年GDP居全国首位。",
        "tags": ["人文地理", "省份经济"]
    },
    {
        "id": "geo_032",
        "domain": "地理",
        "type": "multiple",
        "question": "吴语主要分布在我国的哪些地区？",
        "options": ["上海市", "浙江省大部", "江苏省大部", "江苏省南部"],
        "answer": [0, 1, 3],
        "difficulty": "medium",
        "explanation": "吴语主要通行于上海、浙江大部以及江苏南部的苏南地区。",
        "tags": ["人文地理", "方言"]
    },
    {
        "id": "geo_033",
        "domain": "地理",
        "type": "single",
        "question": "中国传统的“八大菜系”中，以麻辣著称且发源于巴蜀地区的是？",
        "options": ["湘菜", "川菜", "鲁菜", "徽菜"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "川菜发源于四川和重庆（巴蜀地区），以麻、辣、鲜、香著称。",
        "tags": ["人文地理", "饮食文化"]
    },
    {
        "id": "geo_034",
        "domain": "地理",
        "type": "single",
        "question": "目前世界GDP总量排名第三的国家（按2023-2024年数据）是？",
        "options": ["日本", "英国", "印度", "德国"],
        "answer": [3],
        "difficulty": "hard",
        "explanation": "受汇率等因素影响，近年来德国GDP超越日本，成为世界第三大经济体（前两名为美、中）。",
        "tags": ["人文地理", "世界经济"]
    },
    {
        "id": "geo_035",
        "domain": "地理",
        "type": "single",
        "question": "“客家话”主要通行于我国的哪些省份交界地带？",
        "options": ["陕甘宁", "粤闽赣", "黑吉辽", "湘鄂渝"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "客家人主要聚居在广东、福建、江西三省交界处（即粤闽赣）。",
        "tags": ["人文地理", "方言"]
    },
    {
        "id": "geo_036",
        "domain": "地理",
        "type": "multiple",
        "question": "以下属于中国三大都市圈（城市群）的有哪些？",
        "options": ["京津冀", "长三角", "珠三角（粤港澳大湾区）", "滇中城市群"],
        "answer": [0, 1, 2],
        "difficulty": "easy",
        "explanation": "京津冀、长三角、珠三角是中国最具活力和规模的三大城市群。",
        "tags": ["人文地理", "城市化"]
    },
    {
        "id": "geo_037",
        "domain": "地理",
        "type": "single",
        "question": "美国的“硅谷”（Silicon Valley）位于哪个州？",
        "options": ["纽约州", "得克萨斯州", "加利福尼亚州", "华盛顿州"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "硅谷位于美国加利福尼亚州北部的大部分旧金山湾区。",
        "tags": ["人文地理", "国际产业"]
    },
    {
        "id": "geo_038",
        "domain": "地理",
        "type": "single",
        "question": "世界上人口密度最高的主权国家是？",
        "options": ["新加坡", "摩纳哥", "马尔代夫", "孟加拉国"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "摩纳哥是世界上人口密度最高的主权国家。",
        "tags": ["人文地理", "人口状况"]
    },
    {
        "id": "geo_039",
        "domain": "地理",
        "type": "single",
        "question": "泼水节是我国哪个少数民族最盛大的传统节日？",
        "options": ["苗族", "壮族", "傣族", "彝族"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "泼水节是傣族以及泰语民族和东南亚地区的传统节日。",
        "tags": ["人文地理", "民俗文化"]
    },
    {
        "id": "geo_040",
        "domain": "地理",
        "type": "multiple",
        "question": "我国八大菜系中，位于华东地区（东南沿海）的有？",
        "options": ["鲁菜", "苏菜", "闽菜", "浙菜"],
        "answer": [1, 2, 3],
        "difficulty": "medium",
        "explanation": "鲁菜属于北方菜系，苏菜（江苏）、闽菜（福建）、浙菜（浙江）位于华东、东南沿海。",
        "tags": ["人文地理", "饮食文化"]
    },
    {
        "id": "geo_041",
        "domain": "地理",
        "type": "single",
        "question": "简称“豫”的中国省份是？",
        "options": ["河北省", "河南省", "安徽省", "湖北省"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "河南省简称“豫”，因古为豫州之地而得名。",
        "tags": ["人文地理", "中国省份"]
    },
    {
        "id": "geo_042",
        "domain": "地理",
        "type": "single",
        "question": "在全球语言体系中，巴西的官方语言是？",
        "options": ["西班牙语", "英语", "葡萄牙语", "印第安语"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "巴西曾是葡萄牙的殖民地，所以其官方语言是葡萄牙语，南美大多数其他国家则是西班牙语。",
        "tags": ["人文地理", "世界语言"]
    },
    {
        "id": "geo_043",
        "domain": "地理",
        "type": "single",
        "question": "我国的“经济特区”中，位于福建省的是？",
        "options": ["深圳", "珠海", "汕头", "厦门"],
        "answer": [3],
        "difficulty": "medium",
        "explanation": "深圳、珠海、汕头均位于广东省，厦门位于福建省。",
        "tags": ["人文地理", "城市经济"]
    },
    {
        "id": "geo_044",
        "domain": "地理",
        "type": "single",
        "question": "被誉为“世界工厂”，以强大制造业闻名的中国南方城市，最典型的是？",
        "options": ["东莞", "温州", "义乌", "宁波"],
        "answer": [0],
        "difficulty": "medium",
        "explanation": "东莞因其高度发达的制造业和完善的产业链，常被称为“世界工厂”。",
        "tags": ["人文地理", "工业分布"]
    },
    {
        "id": "geo_045",
        "domain": "地理",
        "type": "multiple",
        "question": "藏族主要分布在我国的哪些省级行政区？",
        "options": ["西藏自治区", "青海省", "四川省西部", "新疆维吾尔自治区"],
        "answer": [0, 1, 2],
        "difficulty": "hard",
        "explanation": "除西藏外，青海、四川（西部如甘孜、阿坝）、甘肃、云南也有大量藏族聚居，新疆少数民族以维吾尔族等为主。",
        "tags": ["人文地理", "民族分布"]
    },
    {
        "id": "geo_046",
        "domain": "地理",
        "type": "single",
        "question": "素有“天府之国”美誉的是我国哪个平原？",
        "options": ["关中平原", "成都平原", "江汉平原", "太湖平原"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "成都平原土地肥沃、水利发达（如都江堰），自古便有“天府之国”之称。",
        "tags": ["人文地理", "地区别称"]
    },
    {
        "id": "geo_047",
        "domain": "地理",
        "type": "multiple",
        "question": "联合国的六种正式工作语言包括？",
        "options": ["汉语", "英语", "德语", "阿拉伯语"],
        "answer": [0, 1, 3],
        "difficulty": "hard",
        "explanation": "联合国六种工作语言是：阿拉伯语、汉语、英语、法语、俄语、西班牙语。德语不在其列。",
        "tags": ["人文地理", "国际组织"]
    },
    {
        "id": "geo_048",
        "domain": "地理",
        "type": "single",
        "question": "中国面积最大的直辖市是？",
        "options": ["北京市", "上海市", "重庆市", "天津市"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "重庆市总面积达8.24万平方公里，是中国面积最大的直辖市。",
        "tags": ["人文地理", "中国城市"]
    },
    {
        "id": "geo_049",
        "domain": "地理",
        "type": "single",
        "question": "我国拥有最多陆上邻国的省（区）是？",
        "options": ["西藏自治区", "内蒙古自治区", "新疆维吾尔自治区", "云南省"],
        "answer": [2],
        "difficulty": "hard",
        "explanation": "新疆维吾尔自治区与8个国家接壤（俄罗斯、哈萨克斯坦、吉尔吉斯斯坦、塔吉克斯坦、巴基斯坦、蒙古、印度、阿富汗），是我国陆上邻国最多的省级行政区。",
        "tags": ["人文地理", "国界接壤"]
    },
    {
        "id": "geo_050",
        "domain": "地理",
        "type": "single",
        "question": "印度的主体信仰宗教是？",
        "options": ["伊斯兰教", "佛教", "印度教", "锡克教"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "印度大约有80%左右的人口信仰印度教，伊斯兰教为第二大宗教，佛教目前在印度的信徒比例较小。",
        "tags": ["人文地理", "世界宗教"]
    }
]

with open('data/geo_batch.json', 'r', encoding='utf-8') as f:
    existing_q = json.load(f)

existing_q.extend(new_questions)

with open('data/geo_batch.json', 'w', encoding='utf-8') as f:
    json.dump(existing_q, f, ensure_ascii=False, indent=2)

print(f"Added {len(new_questions)} human geography questions. Total: {len(existing_q)}")
