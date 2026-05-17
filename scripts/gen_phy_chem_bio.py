import json

phy_questions = [
    {
        "id": "phy_001", "domain": "物理常识", "type": "single",
        "question": "相对论的提出者是？", "options": ["牛顿", "爱因斯坦", "伽利略", "玻尔"], "answer": [1], "difficulty": "easy",
        "explanation": "阿尔伯特·爱因斯坦提出了狭义和广义相对论。", "tags": ["相对论", "著名科学家"]
    },
    {
        "id": "phy_002", "domain": "物理常识", "type": "single",
        "question": "在国际单位制中，力的单位是？", "options": ["焦耳", "瓦特", "牛顿", "帕斯卡"], "answer": [2], "difficulty": "easy",
        "explanation": "力的国际单位是牛顿(N)。焦耳是能量单位，瓦特是功率单位，帕斯卡是压强单位。", "tags": ["物理单位", "力学"]
    },
    {
        "id": "phy_003", "domain": "物理常识", "type": "single",
        "question": "真空中光速大约为每秒多少千米？", "options": ["30万", "3万", "300万", "340"], "answer": [0], "difficulty": "easy",
        "explanation": "真空中光速约为3×10^8 m/s，即30万公里每秒。", "tags": ["光学", "常数"]
    },
    {
        "id": "phy_004", "domain": "物理常识", "type": "single",
        "question": "牛顿第一定律又称为什么定律？", "options": ["万有引力定律", "惯性定律", "能量守恒定律", "作用与反作用定律"], "answer": [1], "difficulty": "easy",
        "explanation": "牛顿第一定律指出物体在不受外力作用时保持静止或匀速直线运动状态，因此又称惯性定律。", "tags": ["力学", "牛顿定律"]
    },
    {
        "id": "phy_005", "domain": "物理常识", "type": "single",
        "question": "以下哪种电磁波的波长最短？", "options": ["无线电波", "可见光", "X射线", "伽马射线"], "answer": [3], "difficulty": "medium",
        "explanation": "在电磁波谱中，伽马射线的波长最短，频率最高，能量最大。", "tags": ["电磁波", "电磁学"]
    },
    {
        "id": "phy_006", "domain": "物理常识", "type": "single",
        "question": "发现电磁感应现象的物理学家是？", "options": ["法拉第", "麦克斯韦", "安培", "库仑"], "answer": [0], "difficulty": "medium",
        "explanation": "迈克尔·法拉第于1831年发现了电磁感应现象。", "tags": ["电磁学", "物理学史"]
    },
    {
        "id": "phy_007", "domain": "物理常识", "type": "single",
        "question": "声音在以下哪种介质中传播速度最快？", "options": ["真空", "空气", "水", "钢铁"], "answer": [3], "difficulty": "easy",
        "explanation": "声音在固体中传播速度最快，液体次之，气体较慢，真空中无法传播。", "tags": ["声学"]
    },
    {
        "id": "phy_008", "domain": "物理常识", "type": "single",
        "question": "能量守恒和转化定律通常统称为热力学的第几定律？", "options": ["第零定律", "第一定律", "第二定律", "第三定律"], "answer": [1], "difficulty": "medium",
        "explanation": "热力学第一定律即能量守恒与转化定律。", "tags": ["热力学", "定律"]
    },
    {
        "id": "phy_009", "domain": "物理常识", "type": "single",
        "question": "当物体以宇宙速度运动时，第二宇宙速度的数值约为？", "options": ["7.9 km/s", "11.2 km/s", "16.7 km/s", "29.8 km/s"], "answer": [1], "difficulty": "medium",
        "explanation": "第一宇宙速度约7.9km/s，第二宇宙速度(逃逸速度)约11.2km/s，第三宇宙速度约16.7km/s。", "tags": ["天体物理", "逃逸速度"]
    },
    {
        "id": "phy_010", "domain": "物理常识", "type": "single",
        "question": "提出“薛定谔的猫”思想实验，以旨在证明量子力学在宏观条件下的不完备性的是哪位科学家？", "options": ["爱因斯坦", "玻尔", "薛定谔", "海森堡"], "answer": [2], "difficulty": "easy",
        "explanation": "埃尔温·薛定谔提出了这一个著名的微观与宏观相联系的思想实验。", "tags": ["量子力学", "思想实验"]
    },
    {
        "id": "phy_011", "domain": "物理常识", "type": "single",
        "question": "描述理想气体在等温条件下，压强与体积成反比关系的定律是？", "options": ["查理定律", "玻意耳定律", "盖-吕萨克定律", "阿伏伽德罗定律"], "answer": [1], "difficulty": "medium",
        "explanation": "玻意耳定律表明，在定量定温下，理想气体的体积与压强成反比。", "tags": ["热学", "气体定律"]
    },
    {
        "id": "phy_012", "domain": "物理常识", "type": "single",
        "question": "用以描述黑洞表面边界（即光也无法逃逸的界限）的概念是？", "options": ["吸积盘", "事件视界", "奇点", "喷流"], "answer": [1], "difficulty": "medium",
        "explanation": "事件视界是指黑洞的最外层边界，任何物质包括光一旦越过将无法逃离。", "tags": ["天体物理", "黑洞"]
    },
    {
        "id": "phy_013", "domain": "物理常识", "type": "single",
        "question": "万有引力常数G的精确测量首次是由谁完成的？", "options": ["牛顿", "伽利略", "卡文迪许", "开普勒"], "answer": [2], "difficulty": "hard",
        "explanation": "英国物理学家卡文迪许利用扭秤实验首次比较精确地测出了万有引力常数。", "tags": ["力学", "引力"]
    },
    {
        "id": "phy_014", "domain": "物理常识", "type": "single",
        "question": "经典力学中，物体的动能公式是？", "options": ["E = mgh", "E = mc^2", "E = 1/2 mv^2", "E = Fs"], "answer": [2], "difficulty": "easy",
        "explanation": "经典力学中动能的表达式是 1/2 mv^2。", "tags": ["力学", "公式"]
    },
    {
        "id": "phy_015", "domain": "物理常识", "type": "single",
        "question": "以下哪种物理现象证明了光具有粒子性？", "options": ["光的衍射", "光电效应", "光的干涉", "光的偏振"], "answer": [1], "difficulty": "medium",
        "explanation": "爱因斯坦用光量子假说成功解释了光电效应，证明了光的粒子性；而衍射、干涉证明了波动性。", "tags": ["量子光学", "光电效应"]
    },
    {
        "id": "phy_016", "domain": "物理常识", "type": "single",
        "question": "交流电的频率在中国和多数欧洲国家的标准工业电网中通常是？", "options": ["50Hz", "60Hz", "110Hz", "220Hz"], "answer": [0], "difficulty": "medium",
        "explanation": "中国和多数欧洲国家的标准频率是50Hz，而美国和部分地区是60Hz。", "tags": ["电学", "日常生活"]
    },
    {
        "id": "phy_017", "domain": "物理常识", "type": "single",
        "question": "热力学第二定律有一种表述是，孤立系统的什么物理量总是趋向于增加？", "options": ["内能", "温度", "焓", "熵"], "answer": [3], "difficulty": "hard",
        "explanation": "热力学第二定律指出，孤立系统自发过程的熵总是增加的（熵增原理）。", "tags": ["热力学", "熵"]
    },
    {
        "id": "phy_018", "domain": "物理常识", "type": "single",
        "question": "根据光的折射定律（斯涅尔定律），光线从光疏介质进入光密介质，折射角与入射角相比会？", "options": ["变大", "变小", "不变", "有可能变大也有可能变小"], "answer": [1], "difficulty": "medium",
        "explanation": "光疏进光密，折射率增加，速度减慢，光线向法线偏折，折射角变小。", "tags": ["光学", "折射"]
    },
    {
        "id": "phy_019", "domain": "物理常识", "type": "single",
        "question": "原子核的主要组成部分是？", "options": ["电子和质子", "质子和中子", "中子和电子", "纯质子"], "answer": [1], "difficulty": "easy",
        "explanation": "原子核由带正电的质子和不带电的中子组成（除氕外）。周边是电子。", "tags": ["原子物理"]
    },
    {
        "id": "phy_020", "domain": "物理常识", "type": "single",
        "question": "在电路中，欧姆定律表明通过一段导体的电流与什么成正比？", "options": ["电压", "电阻", "电功率", "电容"], "answer": [0], "difficulty": "easy",
        "explanation": "欧姆定律：I = U/R，电流与该导体两端电压成正比，与电阻成反比。", "tags": ["电学", "欧姆定律"]
    },
    {
        "id": "phy_021", "domain": "物理常识", "type": "single",
        "question": "超导材料在低于其临界温度时，除了电阻为零外，还具有什么显著特性？", "options": ["铁磁性", "抗磁性（迈斯纳效应）", "高硬度", "绝缘性"], "answer": [1], "difficulty": "hard",
        "explanation": "超导体低于临界温度时具有完全抗磁性（即迈斯纳效应），能排斥内部磁场。", "tags": ["固体物理", "超导"]
    },
    {
        "id": "phy_022", "domain": "物理常识", "type": "single",
        "question": "描述流体流速大处压强小、流速小处压强大的著名原理是？", "options": ["阿基米德原理", "伯努利原理", "帕斯卡原理", "托里拆利定律"], "answer": [1], "difficulty": "medium",
        "explanation": "伯努利原理是流体力学中的重要原理，解释了飞机升力等现象。", "tags": ["流体力学", "伯努利原理"]
    },
    {
        "id": "phy_023", "domain": "物理常识", "type": "multiple",
        "question": "以下哪几位物理学家对经典电磁学理论有突出贡献，且名字被用作电磁学单位？", "options": ["安培", "伏特", "特斯拉", "开尔文"], "answer": [0, 1, 2], "difficulty": "medium",
        "explanation": "安培(电流)、伏特(电压)、特斯拉(磁感应强度)都是电磁学单位且为物理学家名。开尔文是热力学温度单位。", "tags": ["电磁学", "物理单位"]
    },
    {
        "id": "phy_024", "domain": "物理常识", "type": "multiple",
        "question": "经典力学中，具有守恒性质的基本物理量在特定条件下包括？", "options": ["动量", "角动量", "能量", "加速度"], "answer": [0, 1, 2], "difficulty": "easy",
        "explanation": "物理学三大基本守恒定律：能量守恒、动量守恒和角动量守恒。加速度不具有普遍的守恒律。", "tags": ["力学", "守恒定律"]
    },
    {
        "id": "phy_025", "domain": "物理常识", "type": "multiple",
        "question": "下列属于基本粒子中的“轻子”的有？", "options": ["电子", "光子", "中微子", "夸克"], "answer": [0, 2], "difficulty": "hard",
        "explanation": "电子和中微子属于轻子。夸克是组成强子的粒子；光子是玻色子，不是轻子。", "tags": ["粒子物理", "轻子"]
    },
    {
        "id": "phy_026", "domain": "物理常识", "type": "multiple",
        "question": "关于宇宙大爆炸理论，下列哪些观测现象提供了有力支持？", "options": ["哈勃定律（星系红移）", "宇宙微波背景辐射", "轻元素丰度", "光电效应"], "answer": [0, 1, 2], "difficulty": "hard",
        "explanation": "星系退行、宇宙微波背景辐射和原初核合成产生的轻元素丰度是大爆炸理论的三大观测支柱。光电效应支持量子论。", "tags": ["宇宙学", "大爆炸"]
    },
    {
        "id": "phy_027", "domain": "物理常识", "type": "multiple",
        "question": "下面哪些现象说明光具有波动性质？", "options": ["干涉", "衍射", "偏振", "康普顿效应"], "answer": [0, 1, 2], "difficulty": "medium",
        "explanation": "光的双缝干涉、薄膜干涉、衍射以及偏振（说明是横波）都证明了光的波动性。康普顿效应证明了粒子性。", "tags": ["光学", "光波"]
    },
    {
        "id": "phy_028", "domain": "物理常识", "type": "multiple",
        "question": "摩擦力根据其相对运动状态可以分为哪几种？", "options": ["静摩擦力", "滑动摩擦力", "滚动摩擦力", "引力"], "answer": [0, 1, 2], "difficulty": "easy",
        "explanation": "摩擦力通常分为这三类：静摩擦、滑动摩擦和滚动摩擦。引力是另一种基本相互作用。", "tags": ["力学", "摩擦力"]
    },
    {
        "id": "phy_029", "domain": "物理常识", "type": "multiple",
        "question": "自然界已知的四种基本相互作用力包括？", "options": ["引力相互作用", "电磁相互作用", "强相互作用", "弱相互作用"], "answer": [0, 1, 2, 3], "difficulty": "medium",
        "explanation": "这四大基本相互作用力支配着宇宙从微观粒子到宏观天体的所有物理现象。", "tags": ["基础物理", "自然力"]
    },
    {
        "id": "phy_030", "domain": "物理常识", "type": "multiple",
        "question": "以下哪几种状态属于物质的常见状态或特殊状态？", "options": ["固态", "液态", "等离子态", "玻色-爱因斯坦凝聚态"], "answer": [0, 1, 2, 3], "difficulty": "medium",
        "explanation": "除了常见的固液气，等离子态、玻色-爱因斯坦凝聚态等也是物质的物理状态。", "tags": ["热学", "物态"]
    }
]

chem_questions = [
    {
        "id": "chem_001", "domain": "化学常识", "type": "single",
        "question": "化学元素周期表是由哪位俄国科学家首创的？", "options": ["居里夫人", "拉瓦锡", "门捷列夫", "玻尔"], "answer": [2], "difficulty": "easy",
        "explanation": "德米特里·门捷列夫于1869年发表了第一版化学元素周期表。", "tags": ["化学史", "元素周期表"]
    },
    {
        "id": "chem_002", "domain": "化学常识", "type": "single",
        "question": "地壳中含量最丰富的元素是？", "options": ["硅", "氧", "铝", "铁"], "answer": [1], "difficulty": "easy",
        "explanation": "地壳中含量前四的元素依次是氧、硅、铝、铁。", "tags": ["地球化学", "元素丰度"]
    },
    {
        "id": "chem_003", "domain": "化学常识", "type": "single",
        "question": "在常温常压下，唯一呈液态的金属元素是？", "options": ["汞（水银）", "溴", "镓", "铯"], "answer": [0], "difficulty": "easy",
        "explanation": "汞(Hg)在室温下为液态金属；溴(Br)虽为液态但是非金属。", "tags": ["无机化学", "金属元素"]
    },
    {
        "id": "chem_004", "domain": "化学常识", "type": "single",
        "question": "水的化学式是H2O，其中氢和氧的质量比是？", "options": ["2:1", "1:8", "1:16", "8:1"], "answer": [1], "difficulty": "medium",
        "explanation": "氢的相对原子质量约1，氧约16。H2O中有2个H和1个O，质量比 = 2:16 = 1:8。", "tags": ["基础化学", "质量比"]
    },
    {
        "id": "chem_005", "domain": "化学常识", "type": "single",
        "question": "酸雨的主要成因是大气中哪一类气体的超标排放？", "options": ["二氧化碳", "二氧化硫和氮氧化物", "甲烷", "氟利昂"], "answer": [1], "difficulty": "easy",
        "explanation": "工业排放的SO2和NOx溶于水形成硫酸和硝酸，导致酸雨。", "tags": ["环境化学", "酸雨"]
    },
    {
        "id": "chem_006", "domain": "化学常识", "type": "single",
        "question": "区分有机物和无机物的最主要标志是该化合物中是否含有哪种元素？", "options": ["氧", "氢", "碳", "氮"], "answer": [2], "difficulty": "easy",
        "explanation": "有机物主要指含碳化合物（除去一氧化碳、二氧化碳、碳酸盐等特殊无机含碳物）。", "tags": ["有机化学", "碳"]
    },
    {
        "id": "chem_007", "domain": "化学常识", "type": "single",
        "question": "pH值等于7的溶液呈现？", "options": ["酸性", "中性", "弱碱性", "强碱性"], "answer": [1], "difficulty": "easy",
        "explanation": "在常温下，pH=7为中性，<7为酸性，>7为碱性。", "tags": ["溶液化学", "酸碱度"]
    },
    {
        "id": "chem_008", "domain": "化学常识", "type": "single",
        "question": "铁生锈主要发生的是什么化学反应？", "options": ["氧化反应", "还原反应", "置换反应", "中和反应"], "answer": [0], "difficulty": "medium",
        "explanation": "铁生锈是铁与空气中的氧气、水分发生缓慢氧化反应生成氧化铁水合物的过程。", "tags": ["氧化还原", "日常生活化学"]
    },
    {
        "id": "chem_009", "domain": "化学常识", "type": "single",
        "question": "干冰是哪种物质的固态形式？", "options": ["水", "二氧化碳", "一氧化碳", "氮气"], "answer": [1], "difficulty": "easy",
        "explanation": "干冰即固态二氧化碳，常用于制冷或制造舞台烟雾效果。", "tags": ["无机化学", "状态"]
    },
    {
        "id": "chem_010", "domain": "化学常识", "type": "single",
        "question": "“王水”是由哪两种浓酸按体积比大约3:1混合而成的？", "options": ["浓硝酸和浓硫酸", "浓盐酸和浓硝酸", "浓硫酸和浓盐酸", "浓盐酸和氢氟酸"], "answer": [1], "difficulty": "medium",
        "explanation": "王水由浓盐酸(HCl)和浓硝酸(HNO3)以3:1体积比混合，能溶解黄金。", "tags": ["无机化学", "酸性物质"]
    },
    {
        "id": "chem_011", "domain": "化学常识", "type": "single",
        "question": "在原子和分子水平上对物质进行合成和改造的化学体系，被称为？", "options": ["绿色化学", "量子化学", "分析化学", "超分子化学"], "answer": [3], "difficulty": "hard",
        "explanation": "超分子化学(也被称为纳米化学的一部分)研究非共价键作用的复杂分子组装体。", "tags": ["现代化学", "超分子"]
    },
    {
        "id": "chem_012", "domain": "化学常识", "type": "single",
        "question": "哪一类碳水化合物是人类膳食中淀粉分解和血糖的主要来源？", "options": ["果糖", "葡萄糖", "蔗糖", "纤维素"], "answer": [1], "difficulty": "medium",
        "explanation": "淀粉在人体内最终水解为葡萄糖，是血糖的直接来源。", "tags": ["生物化学", "糖类"]
    },
    {
        "id": "chem_013", "domain": "化学常识", "type": "single",
        "question": "臭氧(O3)相对于氧气(O2)属于？", "options": ["同分异构体", "同位素", "同素异形体", "高聚物"], "answer": [2], "difficulty": "medium",
        "explanation": "由同一种元素组成的不同单质互称为同素异形体。", "tags": ["分子结构", "氧元素"]
    },
    {
        "id": "chem_014", "domain": "化学常识", "type": "single",
        "question": "催化剂在化学反应中的主要作用是？", "options": ["增加反应物浓度", "改变反应的焓变", "降低反应活化能以改变反应速率", "改变反应的方向"], "answer": [2], "difficulty": "medium",
        "explanation": "催化剂能改变反应途径，降低(或升高)活化能，从而改变反应速率，但不改变总和反应热。", "tags": ["物理化学", "动力学"]
    },
    {
        "id": "chem_015", "domain": "化学常识", "type": "single",
        "question": "石油经过分馏过程后，沸点最高且残留在底部的产物是？", "options": ["汽油", "柴油", "航空煤油", "沥青（渣油）"], "answer": [3], "difficulty": "easy",
        "explanation": "分馏塔底部出来的是重油、沥青等高沸点大分子碳氢化合物。", "tags": ["有机化工", "石油"]
    },
    {
        "id": "chem_016", "domain": "化学常识", "type": "single",
        "question": "在元素周期表中，第一主族（IA族，氢除外）的元素统称为？", "options": ["碱金属", "碱土金属", "卤素", "稀有气体"], "answer": [0], "difficulty": "medium",
        "explanation": "第一主族包括Li、Na、K等，统称为碱金属。", "tags": ["元素周期表", "无机化学"]
    },
    {
        "id": "chem_017", "domain": "化学常识", "type": "single",
        "question": "化学电池（原电池）工作时发生能量转化的本质是？", "options": ["热能转化为化学能", "化学能转化为电能", "电能转化为化学能", "机械能转化为电能"], "answer": [1], "difficulty": "easy",
        "explanation": "原电池是通过自发氧化还原反应，将化学能转化为电能的装置。", "tags": ["电化学", "能量"]
    },
    {
        "id": "chem_018", "domain": "化学常识", "type": "single",
        "question": "工业上合成氨的主要方法“哈伯法”（Haber process）需要的反应物是？", "options": ["氢气和氧气", "氮气和氧气", "氮气和氢气", "甲烷和水"], "answer": [2], "difficulty": "medium",
        "explanation": "哈伯法是在高温高压及催化剂下，N2和H2反应生成NH3(氨)。", "tags": ["工业化学", "合成氨"]
    },
    {
        "id": "chem_019", "domain": "化学常识", "type": "single",
        "question": "含有孤对电子并常显碱性的经典配体是下面哪种物质？", "options": ["甲烷(CH4)", "氨(NH3)", "乙烷(C2H6)", "四氯化碳(CCl4)"], "answer": [1], "difficulty": "hard",
        "explanation": "氨分子中的氮原子有一对孤对电子，可充当路易斯碱或配体形成络合物。", "tags": ["配位化学", "分子结构"]
    },
    {
        "id": "chem_020", "domain": "化学常识", "type": "single",
        "question": "不粘锅涂层特氟龙(Teflon)的主要化学成分是哪种聚合物？", "options": ["聚氯乙烯", "聚四氟乙烯", "聚丙烯", "聚苯乙烯"], "answer": [1], "difficulty": "medium",
        "explanation": "特氟龙即聚四氟乙烯(PTFE)，具备极佳的不粘性、耐热性和抗腐蚀性。", "tags": ["高分子材料", "有机化学"]
    },
    {
        "id": "chem_021", "domain": "化学常识", "type": "single",
        "question": "哪一类反应通常指酯类与碱溶液发生反应生成皂类？", "options": ["酯化反应", "水解反应", "皂化反应", "加成反应"], "answer": [2], "difficulty": "easy",
        "explanation": "脂肪(一种酯)和强碱反应生成高级脂肪酸盐和甘油，该过程即皂化反应，是制皂的基础。", "tags": ["有机化学", "皂化"]
    },
    {
        "id": "chem_022", "domain": "化学常识", "type": "single",
        "question": "焰色反应中，含有钠元素的物质在火焰中呈现的颜色是？", "options": ["紫色", "砖红色", "黄色", "绿色"], "answer": [2], "difficulty": "medium",
        "explanation": "钠元素的特征焰色为黄色；钾为紫色(透过蓝色钴玻璃)，铜为绿色。", "tags": ["分析化学", "金属鉴定"]
    },
    {
        "id": "chem_023", "domain": "化学常识", "type": "multiple",
        "question": "下面哪些物质属于高分子化合物？", "options": ["蛋白质", "纤维素", "脂肪", "聚乙烯"], "answer": [0, 1, 3], "difficulty": "medium",
        "explanation": "蛋白质和纤维素是天然高分子，聚乙烯是合成高分子。脂肪(甘油三酯)分子量一般在千以下，不属于高分子。", "tags": ["有机化学", "高分子"]
    },
    {
        "id": "chem_024", "domain": "化学常识", "type": "multiple",
        "question": "以下哪些属于化学变化？", "options": ["冰雪融化", "铁钉生锈", "食物腐败", "汽油挥发"], "answer": [1, 2], "difficulty": "easy",
        "explanation": "铁生锈(氧化)和食物腐败(变质反应)有新物质生成为化学变化。融化和挥发是物理变化。", "tags": ["基础概念", "化学反应"]
    },
    {
        "id": "chem_025", "domain": "化学常识", "type": "multiple",
        "question": "温室气体除了二氧化碳(CO2)，还主要包括哪些？", "options": ["甲烷(CH4)", "水蒸气(H2O)", "一氧化二氮(N2O)", "氮气(N2)"], "answer": [0, 1, 2], "difficulty": "medium",
        "explanation": "氮气和氧气不能吸收红外辐射不属温室气体。甲烷、水汽和一氧化二氮均为重要温室气体。", "tags": ["环境化学", "温室效应"]
    },
    {
        "id": "chem_026", "domain": "化学常识", "type": "multiple",
        "question": "元素周期表中常见的四大卤素元素是？", "options": ["氟(F)", "氯(Cl)", "溴(Br)", "碘(I)"], "answer": [0, 1, 2, 3], "difficulty": "easy",
        "explanation": "第七主族元素氟、氯、溴、碘是典型的卤素。砹具有放射性很少见。", "tags": ["无机化学", "卤素"]
    },
    {
        "id": "chem_027", "domain": "化学常识", "type": "multiple",
        "question": "关于同位素，下列哪些说法是正确的？", "options": ["质子数相同", "中子数不同", "原子序数不同", "属于同种元素"], "answer": [0, 1, 3], "difficulty": "medium",
        "explanation": "同位素是质子数相同(属于同种元素、原子序数相同)但中子数不同的原子互称。", "tags": ["原子结构", "同位素"]
    },
    {
        "id": "chem_028", "domain": "化学常识", "type": "multiple",
        "question": "在有机化学中，碳碳三键(C≡C)常见的反应类型包含？", "options": ["取代反应", "加成反应", "加聚反应", "消去反应"], "answer": [1, 2], "difficulty": "hard",
        "explanation": "炔烃中的三键极易发生加成反应，也能进行加聚反应(如生成导电聚乙炔等)。取代和消去不是三键本身的主要特征反应。", "tags": ["有机反应", "炔烃"]
    },
    {
        "id": "chem_029", "domain": "化学常识", "type": "multiple",
        "question": "电化学中，电解池的阳极发生的现象有？", "options": ["发生氧化反应", "发生还原反应", "与电源正极相连", "与电源负极相连"], "answer": [0, 2], "difficulty": "hard",
        "explanation": "在电解池中，阳极与直流电源的正极相连，失去电子，发生氧化反应。", "tags": ["电化学", "电解池"]
    },
    {
        "id": "chem_030", "domain": "化学常识", "type": "multiple",
        "question": "硬水是指含有较多可溶性钙、镁化合物的水。将暂时硬水软化的常见简单方法有哪些？", "options": ["过滤", "煮沸", "加酸", "离子交换法"], "answer": [1, 3], "difficulty": "medium",
        "explanation": "加热煮沸可以使碳酸氢钙分解沉淀软化暂时硬水。离子交换树脂能软化永久和暂时硬水。过滤只能去悬浮物，加酸不能去除金属离子。", "tags": ["生活化学", "硬水"]
    }
]

bio_questions = [
    {
        "id": "bio_001", "domain": "生物常识", "type": "single",
        "question": "控制生物遗传性状的主要遗传物质是？", "options": ["蛋白质", "RNA", "DNA", "糖类"], "answer": [2], "difficulty": "easy",
        "explanation": "绝大多数生物(除部分病毒外)的遗传物质是DNA。", "tags": ["分子生物学", "遗传物质"]
    },
    {
        "id": "bio_002", "domain": "生物常识", "type": "single",
        "question": "在细胞结构中，被称为“动力工厂”，主要进行有氧呼吸的细胞器是？", "options": ["高尔基体", "核糖体", "线粒体", "内质网"], "answer": [2], "difficulty": "easy",
        "explanation": "线粒体是细胞内氧化磷酸化和产生ATP的主要场所，被称作动力工厂。", "tags": ["细胞生物学", "细胞器"]
    },
    {
        "id": "bio_003", "domain": "生物常识", "type": "single",
        "question": "植物光合作用产生的氧气，其氧原子全部来自于哪种物质的分解？", "options": ["二氧化碳", "水", "葡萄糖", "叶绿素"], "answer": [1], "difficulty": "medium",
        "explanation": "同位素标记实验证明，光合作用释放的O2全部来源于H2O的光解。", "tags": ["植物生理学", "光合作用"]
    },
    {
        "id": "bio_004", "domain": "生物常识", "type": "single",
        "question": "人类的体细胞拥有多少条染色体？", "options": ["23条", "46条", "48条", "22条"], "answer": [1], "difficulty": "easy",
        "explanation": "正常人体细胞有23对染色体，共46条（包含两性染色体XX或XY）。生殖细胞包含23条。", "tags": ["人体遗传学", "染色体"]
    },
    {
        "id": "bio_005", "domain": "生物常识", "type": "single",
        "question": "由DNA转录生成信使RNA(mRNA)，再由mRNA指导合成蛋白质的过程在分子生物学上被称为？", "options": ["克隆定律", "基因工程", "中心法则", "PCR扩增"], "answer": [2], "difficulty": "medium",
        "explanation": "克里克提出的中心法则描述了遗传信息从DNA到RNA再到蛋白质的流向。", "tags": ["分子生物学", "中心法则"]
    },
    {
        "id": "bio_006", "domain": "生物常识", "type": "single",
        "question": "世界上第一个成功克隆的哺乳动物“多莉”是一只？", "options": ["狗", "猴", "羊", "鼠"], "answer": [2], "difficulty": "easy",
        "explanation": "多莉(Dolly)是体细胞克隆技术培育出的一只绵羊。", "tags": ["生物技术", "克隆"]
    },
    {
        "id": "bio_007", "domain": "生物常识", "type": "single",
        "question": "提出生物进化论，认为“物竞天择，适者生存”的科学家是？", "options": ["孟德尔", "拉马克", "达尔文", "巴斯德"], "answer": [2], "difficulty": "easy",
        "explanation": "查尔斯·达尔文在《物种起源》中提出了基于自然选择的进化论。", "tags": ["进化生物学", "达尔文"]
    },
    {
        "id": "bio_008", "domain": "生物常识", "type": "single",
        "question": "血型系统的ABO血型是由红细胞表面的什么物质决定的？", "options": ["抗体", "抗原", "脂质", "无机盐"], "answer": [1], "difficulty": "medium",
        "explanation": "血型主要由红细胞膜表面特异性糖蛋白（抗原）的种类决定。", "tags": ["人体生理", "血液"]
    },
    {
        "id": "bio_009", "domain": "生物常识", "type": "single",
        "question": "青霉素是由哪类微生物产生的？", "options": ["细菌", "真菌", "病毒", "原虫"], "answer": [1], "difficulty": "easy",
        "explanation": "青霉素(Penicillin)是由青霉菌（一种真菌）分泌的抗生素。", "tags": ["微生物学", "抗生素"]
    },
    {
        "id": "bio_010", "domain": "生物常识", "type": "single",
        "question": "负责合成蛋白质的游离或附着型细胞器是？", "options": ["溶酶体", "核糖体", "中心体", "液泡"], "answer": [1], "difficulty": "medium",
        "explanation": "核糖体是细胞中翻译mRNA生成蛋白质亚基的分子机器。", "tags": ["细胞成分", "核糖体"]
    },
    {
        "id": "bio_011", "domain": "生物常识", "type": "single",
        "question": "构成人体蛋白质的氨基酸种类主要有？", "options": ["8种", "20种", "64种", "过百万种"], "answer": [1], "difficulty": "medium",
        "explanation": "构成蛋白质的标准氨基酸约有20种（加上硒半胱氨酸等罕见种类约为22种，通用讲法为20）。", "tags": ["生物化学", "氨基酸"]
    },
    {
        "id": "bio_012", "domain": "生物常识", "type": "single",
        "question": "免疫系统中，能够产生抗体的细胞是？", "options": ["红细胞", "巨噬细胞", "B淋巴细胞(浆细胞)", "T淋巴细胞"], "answer": [2], "difficulty": "hard",
        "explanation": "体液免疫中，B淋巴细胞分化为浆细胞，负责分泌特异性抗体。", "tags": ["免疫学", "淋巴细胞"]
    },
    {
        "id": "bio_013", "domain": "生物常识", "type": "single",
        "question": "生态系统中的“分解者”主要是？", "options": ["绿色植物", "食草动物", "细菌和真菌", "食肉动物"], "answer": [2], "difficulty": "easy",
        "explanation": "细菌和真菌等微生物可以分解动植物遗体，将有机物转化为无机物，归还环境。", "tags": ["生态学", "生物圈"]
    },
    {
        "id": "bio_014", "domain": "生物常识", "type": "single",
        "question": "鸟类不仅肺能进行气体交换，还具有辅助呼吸的器官是？", "options": ["气管", "气囊", "鳃", "皮肤"], "answer": [1], "difficulty": "medium",
        "explanation": "鸟类具有特殊的气囊辅助呼吸，进行高效的双重呼吸。", "tags": ["动物学", "鸟类特征"]
    },
    {
        "id": "bio_015", "domain": "生物常识", "type": "single",
        "question": "大多数植物体内水分散失到大气中的主要途径作用叫做？", "options": ["蒸发作用", "呼吸作用", "光合作用", "蒸腾作用"], "answer": [3], "difficulty": "easy",
        "explanation": "植物体内的水分主要通过气孔以水蒸气形式散失，这叫做蒸腾作用。", "tags": ["植物学", "生理循环"]
    },
    {
        "id": "bio_016", "domain": "生物常识", "type": "single",
        "question": "DNA双螺旋结构的主要发现者（获得诺贝尔奖）是？", "options": ["沃森和克里克", "孟德尔", "摩尔根", "艾弗里"], "answer": [0], "difficulty": "easy",
        "explanation": "1953年，沃森和克里克基于富兰克林的X射线衍射数据提出了DNA双螺旋模型。", "tags": ["生物史", "DNA"]
    },
    {
        "id": "bio_017", "domain": "生物常识", "type": "single",
        "question": "狂犬病病毒(Rabies virus)的遗传物质是？", "options": ["单链DNA", "双链DNA", "单链RNA", "双链RNA"], "answer": [2], "difficulty": "hard",
        "explanation": "狂犬病病毒是典型的单股负链RNA病毒。", "tags": ["微生物学", "病毒学"]
    },
    {
        "id": "bio_018", "domain": "生物常识", "type": "single",
        "question": "“食物链”常由什么生物作为能量转化的第一营养级（起点）？", "options": ["食肉动物", "初级消费者", "分解者", "生产者"], "answer": [3], "difficulty": "easy",
        "explanation": "生产者体内的叶绿体通过光合作用固定太阳能，是食物链的基础。", "tags": ["生态学", "食物链"]
    },
    {
        "id": "bio_019", "domain": "生物常识", "type": "single",
        "question": "能够降低血糖浓度的主要激素是？", "options": ["肾上腺素", "甲状腺激素", "胰高血糖素", "胰岛素"], "answer": [3], "difficulty": "easy",
        "explanation": "胰岛B细胞分泌的胰岛素是体内唯一能降低血糖水平的激素。", "tags": ["人体生理", "内分泌"]
    },
    {
        "id": "bio_020", "domain": "生物常识", "type": "single",
        "question": "神经系统中，细胞之间的信息传递主要通过释放什么化学物质完成跨突触传递？", "options": ["神经递质", "血红蛋白", "激素", "消化酶"], "answer": [0], "difficulty": "medium",
        "explanation": "突触前膜释放神经递质作用于突触后膜，实现神经元间的化学信号传导。", "tags": ["神经生物学", "突触"]
    },
    {
        "id": "bio_021", "domain": "生物常识", "type": "single",
        "question": "果蝇因其什么特点而长期作为遗传学的重要模式生物？", "options": ["寿命超长", "繁殖快、染色体少且易观察", "基因组与人类完全一致", "几乎不发生突变"], "answer": [1], "difficulty": "medium",
        "explanation": "果蝇培养容易、繁殖快、世代短且巨型染色体便于观察，摩尔根用其证明了基因在染色体上。", "tags": ["遗传学", "模式生物"]
    },
    {
        "id": "bio_022", "domain": "生物常识", "type": "single",
        "question": "艾滋病病毒（HIV）破坏的人体关键免疫细胞主要是？", "options": ["红细胞", "血小板", "辅助性T细胞(CD4+ T细胞)", "骨髓干细胞"], "answer": [2], "difficulty": "hard",
        "explanation": "HIV特异性攻击人体的CD4+ T淋巴细胞，导致细胞免疫及体液免疫崩溃。", "tags": ["免疫学", "病毒感染"]
    },
    {
        "id": "bio_023", "domain": "生物常识", "type": "multiple",
        "question": "以下哪些选项属于高等植物体特有的细胞结构？", "options": ["细胞壁", "叶绿体", "线粒体", "中心体"], "answer": [0, 1], "difficulty": "medium",
        "explanation": "动植物都有线粒体；中心体见于动物和低等植物；植物特有细胞壁（含纤维素）、叶绿体和大液泡。", "tags": ["细胞学", "动植物细胞比较"]
    },
    {
        "id": "bio_024", "domain": "生物常识", "type": "multiple",
        "question": "现代分类系统中，生物被分为多个界，下列属于“真核生物域”的有？", "options": ["动物界", "植物界", "真菌界", "原核生物（如细菌）"], "answer": [0, 1, 2], "difficulty": "easy",
        "explanation": "除了原核生物无成形的细胞核结构外，动植物及真菌都拥有包裹在核膜内的真核结构。", "tags": ["生物分类"]
    },
    {
        "id": "bio_025", "domain": "生物常识", "type": "multiple",
        "question": "关于DNA复制过程，下列说法正确的有？", "options": ["半保留复制", "需要DNA聚合酶", "需要解旋酶", "以单股RNA为模板"], "answer": [0, 1, 2], "difficulty": "medium",
        "explanation": "DNA是通过解旋酶解链后，在DNA聚合酶作用下利用游离核苷酸按照半保留方式进行复制的。逆转录才用RNA作模板。", "tags": ["分子生物学", "复制"]
    },
    {
        "id": "bio_026", "domain": "生物常识", "type": "multiple",
        "question": "维生素在人体中起着重要的调节作用成分，下列缺乏症匹配正确的有？", "options": ["缺乏维A易得夜盲症", "缺乏维C易得坏血病", "缺乏维D易得佝偻病", "缺乏维K引起贫血"], "answer": [0, 1, 2], "difficulty": "medium",
        "explanation": "缺乏维K会导致凝血障碍出血。维B12缺乏也可导致巨幼红细胞贫血等。", "tags": ["人体健康", "营养学"]
    },
    {
        "id": "bio_027", "domain": "生物常识", "type": "multiple",
        "question": "减数分裂(Meiosis)区别于有丝分裂的重要特征包括？", "options": ["染色体复制两次", "细胞连续分裂两次", "产生四个单倍体子细胞", "发生同源染色体联会及交叉互换"], "answer": [1, 2, 3], "difficulty": "hard",
        "explanation": "减数分裂复制一次分裂两次；包含联会；最终染色体减半，产生四个生殖细胞。", "tags": ["细胞分裂", "减数分裂"]
    },
    {
        "id": "bio_028", "domain": "生物常识", "type": "multiple",
        "question": "植物体内主要用于运输水分、无机盐和有机营养物质的组织包括？", "options": ["木质部(导管)", "韧皮部(筛管)", "分生组织", "机械组织"], "answer": [0, 1], "difficulty": "easy",
        "explanation": "导管(木质部)主要自下而上运输水和无机盐，筛管(韧皮部)运输光合作用产生的营养有机物。", "tags": ["植物学", "组织"]
    },
    {
        "id": "bio_029", "domain": "生物常识", "type": "multiple",
        "question": "下列属于哺乳动物典型共同特征的有？", "options": ["胎生", "哺乳", "体表长毛或被毛", "有成形的下颌骨和外耳壳"], "answer": [0, 1, 2, 3], "difficulty": "easy",
        "explanation": "胎生(绝大多数)、哺乳、恒温、长毛、具外耳是哺乳动物基本特征。", "tags": ["动物分类学", "哺乳动物"]
    },
    {
        "id": "bio_030", "domain": "生物常识", "type": "multiple",
        "question": "现代基因工程技术中必不可少的“工具酶”主要包括？", "options": ["限制性核酸内切酶（分子手术刀）", "DNA连接酶（分子缝合针）", "载体（如质粒）", "胃蛋白酶"], "answer": [0, 1], "difficulty": "hard",
        "explanation": "限制酶和连接酶是工具酶。质粒虽然是必需的基因运载体，但它不是酶而是DNA分子。胃蛋白酶属于消化酶。", "tags": ["生物工程", "基因工程"]
    }
]

with open('data/phy_batch.json', 'w', encoding='utf-8') as f:
    json.dump(phy_questions, f, ensure_ascii=False, indent=2)

with open('data/chem_batch.json', 'w', encoding='utf-8') as f:
    json.dump(chem_questions, f, ensure_ascii=False, indent=2)

with open('data/bio_batch.json', 'w', encoding='utf-8') as f:
    json.dump(bio_questions, f, ensure_ascii=False, indent=2)

print(f"Physics: {len(phy_questions)}, Chemistry: {len(chem_questions)}, Biology: {len(bio_questions)} questions generated.")
