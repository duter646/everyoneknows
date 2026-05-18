import json
import os

def g(d, prefix, raw, start_idx=0):
    def fa(ans):
        if isinstance(ans, list): return ans
        return [ord(c)-65 for c in ans.upper()]
    def ft(t): return "single" if t == 1 else "multiple"
    def fd(diff): return ["easy", "medium", "hard"][diff-1]
    return [{"id": f"{prefix}_{start_idx+i+1:03d}","domain": d,"type": ft(r[0]),"question": r[1],"options": r[2],"answer": fa(r[3]),"difficulty": fd(r[4]),"explanation": r[5],"tags": r[6]} for i, r in enumerate(raw)]

game_raw_2 = [
    (1, "对于《英雄联盟》（LOL）这款游戏而言，“大龙”通常指代游戏地图上的哪一种史诗级野怪？", ["远古巨龙", "纳什男爵 (Baron Nashor)", "峡谷先锋", "红Buff"], "B", 1, "玩家俗称为大龙的是男爵Baron，能提供关键团队Buff。", ["MOBA游戏", "LOL"]),
    (2, "下列哪些是电子游戏常见的收费商业模式（Monetization）？", ["买断制 (Buy-to-play) 发售获得完整游戏", "免费游玩，内购物充值 (Free-to-play + Microtransactions)", "基于时间的月卡/点卡订阅制 (Subscription)", "必须每天给开发商写感谢信"], "ABC", 1, "这是游戏史上主要的三种商业模式。", ["游戏行业", "商业模式"]),
    (1, "《双人成行》(It Takes Two) 是哪位知名制作人（常在TGA大奖上飙脏话“Fuck the Oscars”）监制的需要强制两人合作的神作神作？", ["小岛秀夫", "约瑟夫·法尔斯 (Josef Fares)", "三上真司", "蒂姆·斯维尼"], "B", 2, "法尔斯因其暴脾气和对合作类游戏的极高造诣（前作逃出生天）而闻名。", ["双人游戏", "TGA大奖"]),
    (1, "对于游戏设计而言，“Hitbox” (受击判定框) 的作用是？", ["装游戏光盘的盒子", "音乐游戏里的节拍点", "在代码模型中不可见的多边形框，用来计算子弹或攻击是否碰到了这个角色", "游戏内弹出的聊天框"], "C", 2, "命中判定框是射击和格斗游戏最核心的系统判定边界。", ["游戏术语", "设计"]),
    (2, "下列哪些中国本土开发的游戏作品属于著名的国产单机“三剑”？", ["《仙剑奇侠传》", "《轩辕剑》", "《剑侠情缘》", "《古剑奇谭》"], "ABC", 1, "国产老三剑是仙剑、轩辕剑、剑侠情缘（古剑被称为新三剑之一）。", ["国产游戏", "仙侠RPG"]),
    (1, "在经典的战略沙盘游戏《星际争霸》（StarCraft）中，三大种族是人族、神族以及？", ["兽族", "虫族 (Zerg)", "不死族", "暗夜精灵"], "B", 1, "Zerg虫族依靠庞大的数量和生物异化战术淹没对手网络。", ["RTS", "星际争霸"]),
    (1, "对于《反恐精英》 (CS:GO) 而言，“ECO局”通常是什么意思？", ["环保局，游戏地图中种树", "经济局 (Economy Round)，全队不买或极少买装备攒钱以备下一局购买全甲长枪", "疯狂花钱购买投掷物", "退出游戏的局"], "B", 2, "ECO局是CS竞技战术核心，用最廉价手枪度过资金薄弱的回合。", ["战术射击", "CS赛事"]),
    (1, "《大航海时代》和《三国志》系列是日本哪家著名游戏公司开发的经典历史策略游戏老字号IP？", ["光荣特库摩 (Koei Tecmo)", "万代南梦宫", "SEGA (世嘉)", "Konami (科乐美)"], "A", 1, "光荣(Koei)以历史题材的模拟策略游戏和无双割草系列见长。", ["历史策略", "光荣"]),
    (2, "下列哪些平台属于PC（个人电脑）平台的数字游戏发行商城/商店？", ["Steam", "Epic Games Store", "GOG (Good Old Games)", "PlayStation Network (PSN)"], "ABC", 1, "PSN是索尼主机的专用网路商店，不是主要负责PC发行的商店。", ["PC游戏", "Steam"]),
    (1, "被称为魂系游戏祖师爷、“赞美太阳”文化来源的作品是？", ["《恶魔之魂》", "《黑暗之魂》 (Dark Souls)", "《国王密令》", "《怪物猎人》"], "B", 1, "黑魂中索拉尔等太阳骑士传播的“赞美太阳”成为了圈内绝对的膜拜梗。", ["ARPG", "黑暗之魂"]),
    (1, "赛车游戏中通常有两类分支，一类像《极限竞速：地平线》《极品飞车》追求爽快，而另一类极其追求物理拟真硬核手感（如《神力科莎》《iRacing》《GT赛车》）的被称为？", ["街机休闲赛车", "卡丁车", "模拟竞速/拟真赛车 (Sim Racing)", "太空飞船赛"], "C", 2, "Sim Racing通过精准的轮胎级物理摩擦演算逼近真实赛道体验。", ["RAC", "赛车游戏"]),
    (2, "《动物森友会》（动森）里那只总是找你要房贷、掌控着海岛经济命脉的著名狸猫商人叫什么？", ["西施惠", "Tom Nook (狸克)", "KK", "九尾"], "B", 1, "狸克（Tom Nook）提供房贷但可以无限期慢慢还清，是玩家的“债主”。", ["动森", "NPC角色"]),
    (1, "电子游戏中，让角色能够连续在空中进行两次向上动作的操作通常被简称为？", ["冲刺", "二段跳 (Double Jump)", "翻滚", "闪避"], "B", 1, "这是一种极度违背现实物理学，但能极大增强平台跳跃流畅度的经典机制。", ["动作游戏", "操作机制"])
]

existing = []
if os.path.exists("data/game_batch.json"):
    with open("data/game_batch.json", "r", encoding="utf-8") as f:
        existing = json.load(f)

new_data = g(37, "gam", game_raw_2, start_idx=len(existing))
all_data = existing + new_data

with open("data/game_batch.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)

print(f"Game Total: {len(all_data)}")
