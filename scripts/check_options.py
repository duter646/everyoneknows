import json, glob, re

files = glob.glob('data/*_batch.json')
suspicious = []
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        try:
            data = json.load(fh)
        except:
            continue
        for q in data:
            for opt in q.get('options', []):
                # Search for single letter in parens or dots, like (A), A., etc.
                if re.search(r'[\(（][A-Da-d][\)）]', opt) or re.search(r'^[A-Da-d][\.、\s]', opt) or "正确" in opt or "对" in opt:
                    suspicious.append((f, q['id'], q['options']))
                    break

print(f"Found {len(suspicious)} suspicious questions")
for s in suspicious[:10]:
    print(s[1], s[2])
