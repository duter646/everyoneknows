import json, glob, os

all_data = []
files = sorted(glob.glob('data/*_batch.json'))

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
        all_data.extend(data)

# Sort by prefix and then by index to keep it neat
# all_data.sort(key=lambda x: x['id']) 

target = 'web/public/questions.json'
os.makedirs(os.path.dirname(target), exist_ok=True)

with open(target, 'w', encoding='utf-8') as f:
    json.dump(all_data, f, indent=4, ensure_ascii=False)

print(f"Successfully merged {len(all_data)} questions into {target}")
