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
            opts = q.get('options', [])
            has_paren = [bool(re.search(r'[\(（].*?[\)）]', opt)) for opt in opts]
            # If exactly one option has parens and it is the correct answer
            if sum(has_paren) == 1:
                # check if it matches the answer
                paren_index = has_paren.index(True)
                ans = q.get('answer', [])
                if paren_index in ans:
                    suspicious.append((f, q['id'], opts))

print(f"Found {len(suspicious)} questions where exactly ONE option (the correct one) has a parenthesis.")
for s in suspicious[:25]:
    print(s)
