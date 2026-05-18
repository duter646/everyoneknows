import json, os

def make_qs(start_id, domain, q_list):
    res = []
    for i, q in enumerate(q_list):
        opts = q[1]
        ans = q[2]
        if isinstance(ans, str): ans = [ord(c)-65 for c in ans]
        res.append({
            "id": f"{start_id}_{i+1:03d}",
            "domain": domain,
            "type": "single" if len(ans)==1 else "multiple",
            "question": q[0],
            "options": opts,
            "answer": ans,
            "difficulty": q[3],
            "explanation": q[4],
            "tags": q[5]
        })
    return res

art_supp = [
    ("文艺复兴时期的‘美术三杰’不包括以下哪位？", ["达·芬奇", "米开朗基罗", "拉斐尔", "梵高"], "D", "easy", "美术三杰是指达·芬奇、米开朗基罗和拉斐尔。梵高是后印象派画家。", ["文艺复兴", "西方美术"]),
    ("《向日葵》和《星月夜》是哪位现代艺术先驱的代表作？", ["莫奈", "梵高", "毕加索", "塞尚"], "B", "easy", "文森特·梵高创作了《向日葵》和《星月夜》。他影响了后来的现代流派。", ["现代艺术流派", "表现主义"]),
    ("世界著名艺术馆卢浮宫位于哪座城市？", ["伦敦", "巴黎", "罗马", "纽约"], "B", "easy", "卢浮宫位于法国巴黎。", ["著名艺术馆藏", "艺术馆博物馆"])
]

agr_supp = [
    ("世界三大主要粮食作物(主粮)是哪些？", ["水稻、小麦、大豆", "水稻、小麦、玉米", "水稻、高粱、薯类", "小麦、玉米、黑麦"], "B", "easy", "水稻、小麦、玉米被称为世界三大主粮。", ["主粮作物史", "农作物"]),
    ("被誉为‘杂交水稻之父’的中国科学家是？", ["钟南山", "屠呦呦", "袁隆平", "钱学森"], "C", "easy", "袁隆平培育出了高产的杂交水稻。", ["农业科技", "现代科技"]),
    ("波尔多液是一种传统的农业杀菌剂，它主要是由硫酸铜和哪种物质配制而成的？", ["生石灰", "小苏打", "氯化钠", "漂白粉"], "A", "medium", "波尔多液是由硫酸铜、生石灰和水配制成的无机杀菌农药。", ["农药与肥料基础", "农业化学"])
]

eco_supp2 = [
    ("在行为经济学中，人们常常在失去同样价值的物品时产生的痛苦，大于获得带来的快乐，这一现象称为？", ["沉没成本", "禀赋效应", "损失厌恶", "羊群效应"], "C", "medium", "损失厌恶是行为经济学中的重要概念，人们对损失比对获得更敏感。", ["行为经济学", "认知偏差"]),
    ("在证券交易市场中，‘A股’的正式名称是？", ["外资股", "人民币普通股票", "国家股", "红筹股"], "B", "easy", "A股指人民币普通股票。", ["交易市场常识", "股市"])
]

law_supp2 = [
    ("《中华人民共和国民法典》被誉为‘社会生活的百科全书’，它于哪一年起正式施行？", ["2019年", "2020年", "2021年", "2022年"], "C", "medium", "《中华人民共和国民法典》于2021年1月1日起施行。", ["民法典基础", "中国法"]),
    ("某作家创作了一部畅销小说，根据版权法规定，其著作权的保护期通常为作者终生及其死亡后多少年？", ["20年", "30年", "50年", "70年"], "C", "medium", "多数国家(包括中国)的著作权法规定，财产权利保护期为作者终生及死亡后50年。", ["知识产权法", "著作权保护"])
]

all_supps = [
    ("art_supp", "Art", art_supp),
    ("agr_supp", "Agriculture", agr_supp),
    ("eco_supp2", "Economics", eco_supp2),
    ("law_supp2", "Law", law_supp2)
]

for name, domain, supp_data in all_supps:
    # Notice we save as _batch.json so add_vectors.py will pick them up
    fname = f"data/{domain.lower()[:3]}_{name}_batch.json"
    qs = make_qs(f"supp_{name}", domain, supp_data)
    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(qs, f, indent=4, ensure_ascii=False)
    print(f"Generated {fname} with {len(qs)} questions.")

