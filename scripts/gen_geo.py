import json

questions = [
    {
        "id": "geo_001",
        "domain": "地理",
        "type": "single",
        "question": "世界上面积最大的国家是？",
        "options": ["加拿大", "俄罗斯", "中国", "美国"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "按国土面积，俄罗斯位列世界第一。",
        "tags": ["国家", "地理之最"]
    },
    {
        "id": "geo_002",
        "domain": "地理",
        "type": "single",
        "question": "世界上最长的河流是？",
        "options": ["亚马逊河", "长江", "尼罗河", "密西西比河"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "公认世界上最长的河流是尼罗河，不过也有学者认为亚马逊河最长。",
        "tags": ["河流", "地理之最"]
    },
    {
        "id": "geo_003",
        "domain": "地理",
        "type": "single",
        "question": "世界最高峰珠穆朗玛峰位于哪两个国家边境？",
        "options": ["中国和印度", "中国和尼泊尔", "中国和不丹", "中国和巴基斯坦"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "珠峰位于中国西藏自治区与尼泊尔交界处。",
        "tags": ["山脉", "亚洲地理"]
    },
    {
        "id": "geo_004",
        "domain": "地理",
        "type": "single",
        "question": "世界上最大的沙漠是？",
        "options": ["阿拉伯沙漠", "戈壁沙漠", "南极荒漠", "撒哈拉沙漠"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "严格按降水量定义，南极荒漠是世界最大的沙漠（极地荒漠）。撒哈拉是最大的沙质荒漠。",
        "tags": ["沙漠", "自然地理"]
    },
    {
        "id": "geo_005",
        "domain": "地理",
        "type": "single",
        "question": "澳大利亚的首都是？",
        "options": ["悉尼", "墨尔本", "堪培拉", "布里斯班"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "澳大利亚首都是堪培拉，悉尼和墨尔本是其最大城市。",
        "tags": ["首都", "大洋洲"]
    },
    {
        "id": "geo_006",
        "domain": "地理",
        "type": "single",
        "question": "欧洲流经国家最多的河流是？",
        "options": ["莱茵河", "伏尔加河", "多瑙河", "塞纳河"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "多瑙河是欧洲第二长河，流经10个国家，是流经国家最多的河流。",
        "tags": ["欧洲地理", "河流"]
    },
    {
        "id": "geo_007",
        "domain": "地理",
        "type": "single",
        "question": "南美洲完全内陆的国家是哪两个？",
        "options": ["玻利维亚和巴拉圭", "秘鲁和智利", "哥伦比亚和委内瑞拉", "乌拉圭和阿根廷"],
        "answer": [0],
        "difficulty": "hard",
        "explanation": "南美洲只有两个内陆国：玻利维亚和巴拉圭。",
        "tags": ["南美洲", "国家"]
    },
    {
        "id": "geo_008",
        "domain": "地理",
        "type": "single",
        "question": "非洲面积最大的国家是？",
        "options": ["苏丹", "刚果民主共和国", "阿尔及利亚", "利比亚"],
        "answer": [2],
        "difficulty": "hard",
        "explanation": "南苏丹独立后，阿尔及利亚成为非洲面积最大的国家。",
        "tags": ["非洲地理", "国家"]
    },
    {
        "id": "geo_009",
        "domain": "地理",
        "type": "single",
        "question": "被称为“千湖之国”的是？",
        "options": ["挪威", "瑞典", "芬兰", "冰岛"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "芬兰境内湖泊众多，被称为“千湖之国”。",
        "tags": ["欧洲地理", "国家别称"]
    },
    {
        "id": "geo_010",
        "domain": "地理",
        "type": "single",
        "question": "世界上最大的热带雨林是？",
        "options": ["刚果雨林", "亚马逊雨林", "东南亚雨林", "大熊雨林"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "亚马逊热带雨林是世界最大热带雨林。",
        "tags": ["雨林", "自然生态"]
    },
    {
        "id": "geo_011",
        "domain": "地理",
        "type": "multiple",
        "question": "以下属于联合国的常任理事国的是？",
        "options": ["中国", "德国", "法国", "印度"],
        "answer": [0, 2],
        "difficulty": "easy",
        "explanation": "联合国五常是中、美、俄、英、法。",
        "tags": ["人文地理", "国际组织"]
    },
    {
        "id": "geo_012",
        "domain": "地理",
        "type": "multiple",
        "question": "北极圈穿过以下哪些国家？",
        "options": ["加拿大", "俄罗斯", "瑞典", "英国"],
        "answer": [0, 1, 2],
        "difficulty": "medium",
        "explanation": "北极圈穿过俄罗斯、加拿大、美国、丹麦(格陵兰)、挪威、瑞典、芬兰、冰岛。英国在北极圈以南。",
        "tags": ["纬线", "极点地理"]
    },
    {
        "id": "geo_013",
        "domain": "地理",
        "type": "multiple",
        "question": "以下哪些选项是地球的大洋？",
        "options": ["大西洋", "印度洋", "南冰洋", "地中海"],
        "answer": [0, 1, 2],
        "difficulty": "easy",
        "explanation": "传统四大洋加南冰洋（南大洋）共五大洋，地中海是陆间海，不是大洋。",
        "tags": ["海洋地理"]
    },
    {
        "id": "geo_014",
        "domain": "地理",
        "type": "single",
        "question": "日界线大致与哪条经线重合？",
        "options": ["0度经线", "西经90度", "180度经线", "东经90度"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "国际日期变更线大致与180度经线重合。",
        "tags": ["经纬网", "时间"]
    },
    {
        "id": "geo_015",
        "domain": "地理",
        "type": "single",
        "question": "世界陆地的最低点是？",
        "options": ["死海", "马里亚纳海沟", "里海", "艾尔湖"],
        "answer": [0],
        "difficulty": "medium",
        "explanation": "死海湖面海拔在海平面以下400多米，是地球表面的陆地最低点。",
        "tags": ["地形", "地理之最"]
    },
    {
        "id": "geo_016",
        "domain": "地理",
        "type": "single",
        "question": "黄石国家公园主要位于哪个国家？",
        "options": ["加拿大", "美国", "澳大利亚", "南非"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "黄石国家公园是美国也是世界上第一个国家公园。",
        "tags": ["公园", "北美地理"]
    },
    {
        "id": "geo_017",
        "domain": "地理",
        "type": "single",
        "question": "世界上最大的半岛是？",
        "options": ["阿拉伯半岛", "印度半岛", "中南半岛", "斯堪的纳维亚半岛"],
        "answer": [0],
        "difficulty": "medium",
        "explanation": "阿拉伯半岛是世界上最大的半岛。",
        "tags": ["半岛", "亚洲地理"]
    },
    {
        "id": "geo_018",
        "domain": "地理",
        "type": "multiple",
        "question": "以下国家中位于南半球的是？",
        "options": ["新西兰", "厄瓜多尔", "巴西", "埃及"],
        "answer": [0, 2],
        "difficulty": "medium",
        "explanation": "新西兰在南半球，巴西大部分在南半球，厄瓜多尔横跨赤道，埃及完全在北半球。",
        "tags": ["南北半球", "国家分布"]
    },
    {
        "id": "geo_019",
        "domain": "地理",
        "type": "single",
        "question": "赤道不穿过以下哪个洲？",
        "options": ["亚洲", "非洲", "南美洲", "欧洲"],
        "answer": [3],
        "difficulty": "easy",
        "explanation": "赤道穿过亚洲、非洲、大洋洲、南美洲。",
        "tags": ["赤道", "大洲分布"]
    },
    {
        "id": "geo_020",
        "domain": "地理",
        "type": "single",
        "question": "企鹅主要分布在自然地理上的哪里？",
        "options": ["北冰洋", "南极圈及其周边", "格陵兰岛", "撒哈拉沙漠"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "企鹅主要生活在南极地区及南半球的高纬度地区。",
        "tags": ["动物分布", "独特生态"]
    },
    {
        "id": "geo_021",
        "domain": "地理",
        "type": "single",
        "question": "湄公河发源于哪个国家？",
        "options": ["越南", "老挝", "泰国", "中国"],
        "answer": [3],
        "difficulty": "medium",
        "explanation": "湄公河发源于中国青海省，在中国境内称为澜沧江。",
        "tags": ["河流", "亚洲水系"]
    },
    {
        "id": "geo_022",
        "domain": "地理",
        "type": "multiple",
        "question": "组成联合王国的实体包括？",
        "options": ["英格兰", "苏格兰", "威尔士", "北爱尔兰"],
        "answer": [0, 1, 2, 3],
        "difficulty": "easy",
        "explanation": "英国全称大不列颠及北爱尔兰联合王国，由英格兰、苏格兰、威尔士和北爱尔兰组成。",
        "tags": ["国家构成", "欧洲地理"]
    },
    {
        "id": "geo_023",
        "domain": "地理",
        "type": "single",
        "question": "世界上面积最小的国家是？",
        "options": ["摩纳哥", "瑙鲁", "梵蒂冈", "圣马力诺"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "梵蒂冈是世界面积最小的国家，被称为城中国。",
        "tags": ["微型国家", "地理之最"]
    },
    {
        "id": "geo_024",
        "domain": "地理",
        "type": "single",
        "question": "大堡礁位于哪个国家东北沿海？",
        "options": ["印度尼西亚", "菲律宾", "澳大利亚", "马达加斯加"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "大堡礁位于澳大利亚东北海岸，是世界最大最长的珊瑚礁群。",
        "tags": ["珊瑚礁", "海洋保护"]
    },
    {
        "id": "geo_025",
        "domain": "地理",
        "type": "multiple",
        "question": "下列属于死火山或休眠火山的是？",
        "options": ["威苏威火山", "富士山", "乞力马扎罗山", "黄石超级火山"],
        "answer": [1, 2, 3],
        "difficulty": "hard",
        "explanation": "富士山是休眠火山，乞力马扎罗是休眠火山；黄石也是休眠的超级火山。威苏威是活火山。",
        "tags": ["火山", "地质活动"]
    },
    {
        "id": "geo_026",
        "domain": "地理",
        "type": "single",
        "question": "按面积，地球上最大的洲是？",
        "options": ["非洲", "南美洲", "亚洲", "南极洲"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "亚洲是面积最大、人口最多的大洲。",
        "tags": ["大洲", "面积排名"]
    },
    {
        "id": "geo_027",
        "domain": "地理",
        "type": "single",
        "question": "加拿大的首都是？",
        "options": ["多伦多", "温哥华", "渥太华", "蒙特利尔"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "渥太华是加拿大首都，尽管多伦多和温哥华更有知名度。",
        "tags": ["首府", "北美洲"]
    },
    {
        "id": "geo_028",
        "domain": "地理",
        "type": "single",
        "question": "跨三个半球且赤道横贯的洲是？",
        "options": ["非洲", "亚洲", "大洋洲", "南美洲"],
        "answer": [0],
        "difficulty": "hard",
        "explanation": "非洲位于东半球，跨南北半球，不仅赤道横穿，本初子午线也穿过，因此跨四个半球(东西南北)。",
        "tags": ["半球地理", "综合题"]
    },
    {
        "id": "geo_029",
        "domain": "地理",
        "type": "multiple",
        "question": "中国的三大平原是？",
        "options": ["东北平原", "华北平原", "长江中下游平原", "成都平原"],
        "answer": [0, 1, 2],
        "difficulty": "medium",
        "explanation": "中国的三大平原是东北、华北、长江中下游平原。成都平原属于四川盆地一部分。",
        "tags": ["中国地理", "地形地貌"]
    },
    {
        "id": "geo_030",
        "domain": "地理",
        "type": "single",
        "question": "里海是什么性质的水体？",
        "options": ["淡水湖", "咸水湖", "边缘海", "内陆海"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "里海是世界上最大的湖泊，属于咸水湖。",
        "tags": ["湖泊", "水文地理"]
    }
]

with open('data/geo_batch.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Batch 1 (geo) generation complete.")
