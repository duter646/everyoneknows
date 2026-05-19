import json, glob, re

files = glob.glob('data/*_batch.json')
suspicious = []
for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
        for q in data:
            for opt in q.get('options', []):
                # Search for brackets that might contain clues
                if re.search(r'[\[【\<《].*?[\]】\>》]', opt):
                    suspicious.append((f, q['id'], q['options']))
                    break

print(f"Found {len(suspicious)} questions with parens")
for s in suspicious[:20]:
    print(s[1], s[2])
