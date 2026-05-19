import json, glob, re, os

# 1. 获取所有 batch 文件
files = glob.glob('data/*_batch.json')
total_stripped = 0

# 匹配并移除选项中带括号的内容（各种括号及其内部翻译/说明）
# 模式： (abc) 或 （中文） 或 (英文+中文)
pattern = re.compile(r'[\(（].*?[\)）]')

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    
    modified_file = False
    for q in data:
        opts = q.get('options', [])
        for i, opt in enumerate(opts):
            new_opt = pattern.sub('', opt).strip()
            if new_opt != opt and new_opt != "":
                q['options'][i] = re.sub(r'\s+', ' ', new_opt)
                modified_file = True
                total_stripped += 1

    if modified_file:
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(data, fh, indent=4, ensure_ascii=False)

print(f"Total options cleaned: {total_stripped}")

# 2. 合并全量题库
all_data = []
batch_files = sorted(glob.glob('data/*_batch.json'))
for bf in batch_files:
    with open(bf, 'r', encoding='utf-8') as fh:
        all_data.extend(json.load(fh))

# 3. 写入 Web 路径
target = 'web/public/questions.json'
os.makedirs(os.path.dirname(target), exist_ok=True)
with open(target, 'w', encoding='utf-8') as f:
    json.dump(all_data, f, indent=4, ensure_ascii=False)

print(f"Successfully synced {len(all_data)} questions to {target}")
