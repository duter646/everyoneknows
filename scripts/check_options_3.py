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
            ans = q.get('answer', [])
            opts = q.get('options', [])
            for a in ans:
                if 0 <= a < len(opts):
                    opt = opts[a]
                    # Check for weird parens like (正确), (正确答案), etc
                    if re.search(r'[\(（].*?[\)）]', opt):
                        # Does it contain "正确" or "对" or is it ONLY on the correct answer?
                        if "正确" in opt or "对" in opt or "√" in opt or "答案" in opt:
                            suspicious.append((f, q['id'], opts, a))
                        # What if it's like "选项A" or something
                        elif re.search(r'[\(（][A-Z][\)）]', opt):
                            suspicious.append((f, q['id'], opts, a))
                            
print(f"Found {len(suspicious)} explicitly leaky options")
for s in suspicious:
    print(s)
