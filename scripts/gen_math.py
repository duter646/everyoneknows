import json

questions = [
    {
        "id": "math_001",
        "domain": "数学常识",
        "type": "single",
        "question": "圆周率 π 是一个什么数？",
        "options": ["有理数", "无理数", "虚数", "整数"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "圆周率 π 是一个无限不循环小数，属于无理数。",
        "tags": ["基础数学", "数系"]
    },
    {
        "id": "math_002",
        "domain": "数学常识",
        "type": "single",
        "question": "在直角三角形中，斜边平方等于两直角边平方和，这一定理在中国被称为？",
        "options": ["泰勒斯定理", "费马大定理", "勾股定理", "欧拉定理"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "这即为勾股定理（毕达哥拉斯定理），勾三股四弦五。",
        "tags": ["几何", "定理"]
    },
    {
        "id": "math_003",
        "domain": "数学常识",
        "type": "single",
        "question": "自然对数的底数 e 的近似值约等于？",
        "options": ["1.414", "2.718", "3.141", "1.618"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "自然对数底数 e 约等于 2.71828。",
        "tags": ["微积分", "常数"]
    },
    {
        "id": "math_004",
        "domain": "数学常识",
        "type": "single",
        "question": "一元二次方程 ax^2 + bx + c = 0 (a≠0) 有两个不相等实数根的条件是？",
        "options": ["b^2 - 4ac > 0", "b^2 - 4ac = 0", "b^2 - 4ac < 0", "b^2 + 4ac > 0"],
        "answer": [0],
        "difficulty": "easy",
        "explanation": "判别式 Δ = b^2 - 4ac > 0 时，方程有两个不相等实根。",
        "tags": ["代数", "方程"]
    },
    {
        "id": "math_005",
        "domain": "数学常识",
        "type": "single",
        "question": "在概率论中，不可能事件的概率等于？",
        "options": ["-1", "0", "0.5", "1"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "不可能发生的事件，其概率为 0。",
        "tags": ["概率论"]
    },
    {
        "id": "math_006",
        "domain": "数学常识",
        "type": "single",
        "question": "微积分学的基础是？",
        "options": ["集合论", "泛函分析", "极限理论", "群论"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "极限是微积分的基础概念，导数、积分等都是通过极限定义的。",
        "tags": ["微积分", "极限"]
    },
    {
        "id": "math_007",
        "domain": "数学常识",
        "type": "single",
        "question": "被称为“数学王子”，在数论、代数、统计等方面有巨大贡献的德国数学家是？",
        "options": ["艾萨克·牛顿", "莱昂哈德·欧拉", "卡尔·弗里德里希·高斯", "戈特弗里德·莱布尼茨"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "高斯被誉为“数学王子”，与阿基米德、牛顿齐名。",
        "tags": ["数学史", "高斯"]
    },
    {
        "id": "math_008",
        "domain": "数学常识",
        "type": "single",
        "question": "正态分布曲线的形状呈什么形式？",
        "options": ["U型曲线", "钟形曲线", "V型曲线", "直线"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "正态分布的密度函数图像呈中间高、两边低的对称钟形，因此也叫钟形曲线。",
        "tags": ["概率统计", "分布"]
    },
    {
        "id": "math_009",
        "domain": "数学常识",
        "type": "single",
        "question": "函数 f(x) = sin(x) 的导数是？",
        "options": ["cos(x)", "-sin(x)", "-cos(x)", "tan(x)"],
        "answer": [0],
        "difficulty": "medium",
        "explanation": "正弦函数的导数是余弦函数，即 (sin x)' = cos x。",
        "tags": ["微积分", "导数"]
    },
    {
        "id": "math_010",
        "domain": "数学常识",
        "type": "single",
        "question": "线性代数中，如果矩阵A与矩阵B相乘得单位矩阵（AB=I），则B是A的？",
        "options": ["转置矩阵", "逆矩阵", "伴随矩阵", "正交矩阵"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "根据逆矩阵的定义，若矩阵 A 可逆，且 AB = BA = I，则 B 为 A 的逆矩阵。",
        "tags": ["线性代数", "矩阵"]
    },
    {
        "id": "math_011",
        "domain": "数学常识",
        "type": "single",
        "question": "欧拉恒等式 e^(iπ) + 1 = 0 中，i 代表什么？",
        "options": ["自然对数的底", "真数", "虚数单位", "非零整数"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "在这里，i 代表虚数单位，满足 i^2 = -1。",
        "tags": ["复变函数", "欧拉公式"]
    },
    {
        "id": "math_012",
        "domain": "数学常识",
        "type": "single",
        "question": "“哥德巴赫猜想”被誉为数学皇冠上的明珠，它的核心内容是关于什么的研究？",
        "options": ["素数", "矩阵", "几何图形", "微积分"],
        "answer": [0],
        "difficulty": "medium",
        "explanation": "哥德巴赫猜想是数论中存在最久的未解问题之一，主要探讨偶数与素数的关系。",
        "tags": ["数论", "猜想"]
    },
    {
        "id": "math_013",
        "domain": "数学常识",
        "type": "single",
        "question": "在三维笛卡尔坐标系中，两点(x1,y1,z1)和(x2,y2,z2)之间的距离公式基础是？",
        "options": ["海伦公式", "勾股定理", "欧拉公式", "柯西不等式"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "空间两点距离公式是通过两次应用勾股定理推导出来的。",
        "tags": ["解析几何"]
    },
    {
        "id": "math_014",
        "domain": "数学常识",
        "type": "single",
        "question": "微积分学中，定积分在几何上的一个主要应用是求？",
        "options": ["曲线的切线斜率", "函数的极值点", "曲线下的面积", "图形的对称轴"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "导数主要用来求斜率/变化率等，定积分的一个基本几何意义是求曲线下方的面积。",
        "tags": ["微积分", "几何意义"]
    },
    {
        "id": "math_015",
        "domain": "数学常识",
        "type": "single",
        "question": "如果一个序列的后一项与前一项的比值为常数，这个序列被称为？",
        "options": ["等差数列", "等比数列", "斐波那契数列", "调和数列"],
        "answer": [1],
        "difficulty": "easy",
        "explanation": "比值为常数的是等比数列，差值为常数的是等差数列。",
        "tags": ["代数", "数列"]
    },
    {
        "id": "math_016",
        "domain": "数学常识",
        "type": "single",
        "question": "下列集合中，哪一个是不可数集？",
        "options": ["自然数集", "整数集", "有理数集", "实数集"],
        "answer": [3],
        "difficulty": "hard",
        "explanation": "康托尔的对角线论证法证明了实数集是不可数的，而自然数、整数、有理数集都是可数的。",
        "tags": ["集合论", "实分析"]
    },
    {
        "id": "math_017",
        "domain": "数学常识",
        "type": "single",
        "question": "在拓扑学中，莫比乌斯环的一个显著特征是它具有几个面？",
        "options": ["1个", "2个", "3个", "4个"],
        "answer": [0],
        "difficulty": "hard",
        "explanation": "莫比乌斯环是一种拓扑学结构，它只有一个面（表面）和一个边界。",
        "tags": ["拓扑学", "几何"]
    },
    {
        "id": "math_018",
        "domain": "数学常识",
        "type": "single",
        "question": "在信息论中，用于衡量信息不确定性的概念是？",
        "options": ["方差", "熵", "期望", "协方差"],
        "answer": [1],
        "difficulty": "hard",
        "explanation": "香农借鉴了热力学中的“熵”概念，用来表示信息量的不确定性，称为信息熵。",
        "tags": ["信息论", "香农"]
    },
    {
        "id": "math_019",
        "domain": "数学常识",
        "type": "single",
        "question": "求解线性方程组的一种经典初等变换算法（消元法）通常以哪位数学家命名？",
        "options": ["牛顿", "高斯", "欧拉", "泰勒"],
        "answer": [1],
        "difficulty": "medium",
        "explanation": "高斯消元法是线性代数中解线性方程组的经典算法。",
        "tags": ["线性代数", "算法"]
    },
    {
        "id": "math_020",
        "domain": "数学常识",
        "type": "single",
        "question": "哪一门数学分支主要研究离散结构，也是计算机科学的重要数学基础？",
        "options": ["实变函数", "泛函分析", "离散数学", "复变函数"],
        "answer": [2],
        "difficulty": "easy",
        "explanation": "离散数学（包括图论、逻辑、组合数学等）是研究离散结构的，是计算机科学的核心基础。",
        "tags": ["离散数学", "计算机数学"]
    },
    {
        "id": "math_021",
        "domain": "数学常识",
        "type": "single",
        "question": "下列哪个著名的未解决/已解决难题涉及到地图着色？",
        "options": ["四色定理", "费马大定理", "黎曼猜想", "庞加莱猜想"],
        "answer": [0],
        "difficulty": "medium",
        "explanation": "四色定理证明了任何平面地图只需四种颜色就能使相邻区域不重色。",
        "tags": ["图论", "数学定理"]
    },
    {
        "id": "math_022",
        "domain": "数学常识",
        "type": "single",
        "question": "行列式的值如果在交换两行后，其符号会如何变化？",
        "options": ["不变", "变为开方", "变为负号（相反数）", "变为倒数"],
        "answer": [2],
        "difficulty": "medium",
        "explanation": "根据行列式的性质，交换任意两行（或两列），行列式的值变号。",
        "tags": ["线性代数", "行列式"]
    },
    {
        "id": "math_023",
        "domain": "数学常识",
        "type": "single",
        "question": "17世纪发明了微积分的两位数学大师是？",
        "options": ["牛顿和莱布尼茨", "笛卡尔和费马", "欧拉和高斯", "拉格朗日和泰勒"],
        "answer": [0],
        "difficulty": "easy",
        "explanation": "艾萨克·牛顿和戈特弗里德·莱布尼茨分别独立创立了微积分。",
        "tags": ["微积分", "数学史"]
    },
    {
        "id": "math_024",
        "domain": "数学常识",
        "type": "multiple",
        "question": "下列哪些属于初等函数？",
        "options": ["多项式函数", "指数函数", "三角函数", "狄利克雷函数"],
        "answer": [0, 1, 2],
        "difficulty": "medium",
        "explanation": "初等函数包括幂函数、指数、对数、三角和反三角函数以及它们经过有限次四则运算和复合而成的函数。狄利克雷函数不是初等函数。",
        "tags": ["微积分", "函数"]
    },
    {
        "id": "math_025",
        "domain": "数学常识",
        "type": "multiple",
        "question": "在三维欧几里得空间中，以下哪些图形属于正多面体（柏拉图立体）？",
        "options": ["正四面体", "正六面体（立方体）", "正八面体", "正十面体"],
        "answer": [0, 1, 2],
        "difficulty": "hard",
        "explanation": "共有五种正多面体：正四、六、八、十二、二十面体。不存在“正十面体”。",
        "tags": ["立体几何"]
    },
    {
        "id": "math_026",
        "domain": "数学常识",
        "type": "multiple",
        "question": "概率论中，如果两个事件A和B相互独立，则下列等式正确的是？",
        "options": ["P(AB) = P(A)P(B)", "P(A|B) = P(A) (假设P(B)>0)", "P(A∪B) = P(A) + P(B)", "P(A) = P(B)"],
        "answer": [0, 1],
        "difficulty": "hard",
        "explanation": "事件独立则联合概率等于边缘概率乘积，条件概率等于无条件概率。P(A∪B) = P(A)+P(B)仅在A和B互斥时成立。",
        "tags": ["概率论", "计算"]
    },
    {
        "id": "math_027",
        "domain": "数学常识",
        "type": "multiple",
        "question": "以下哪些概念是微积分中的积分方法？",
        "options": ["换元积分法", "分部积分法", "高斯消元法", "最小二乘法"],
        "answer": [0, 1],
        "difficulty": "easy",
        "explanation": "换元积分和分部积分是求不定积分和定积分的两种基本方法；后两者属于线性代数和数值分析范畴。",
        "tags": ["微积分", "积分法"]
    },
    {
        "id": "math_028",
        "domain": "数学常识",
        "type": "multiple",
        "question": "线性代数中，对于一个 n 阶方阵，下列哪些情况意味着该方阵是不可逆的（奇异的）？",
        "options": ["行列式为 0", "满秩", "矩阵中存在两行元素互为比例", "矩阵有一个特征值为 0"],
        "answer": [0, 2, 3],
        "difficulty": "hard",
        "explanation": "满秩意味着可逆；行列式为0、某特征值为0、以及行（列）线性相关（如存在比例）都意味着矩阵降秩、不可逆。",
        "tags": ["线性代数", "矩阵性质"]
    },
    {
        "id": "math_029",
        "domain": "数学常识",
        "type": "multiple",
        "question": "下列属于统计学中“描述性统计”常用指标的有？",
        "options": ["平均数", "中位数", "泰勒展开式", "标准差"],
        "answer": [0, 1, 3],
        "difficulty": "easy",
        "explanation": "平均数、中位数和标准差都是描述数据集中趋势和离散程度的统计指标。泰勒展开式属于微积分中的级数展开。",
        "tags": ["统计学", "基础指标"]
    },
    {
        "id": "math_030",
        "domain": "数学常识",
        "type": "multiple",
        "question": "著名的数学常数包括哪些？",
        "options": ["圆周率 π", "自然对数底 e", "光速 c", "黄金分割率 φ"],
        "answer": [0, 1, 3],
        "difficulty": "medium",
        "explanation": "π、e、φ是数学常数，光速c是物理常数。",
        "tags": ["数学常数"]
    }
]

with open('data/math_batch.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Math domain generated {len(questions)} questions successfully.")
