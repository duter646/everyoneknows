import json, glob, re

files = glob.glob('data/*_batch.json')
count = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    
    modified_file = False
    for q in data:
        # Strip parens from options
        for i, opt in enumerate(q.get('options', [])):
            if re.search(r'[\(（].*?[\)）]', opt):
                new_opt = re.sub(r'[\(（].*?[\)）]', '', opt).strip()
                # If everything was stripped, revert back or just keep it without parens?
                if new_opt == "": 
                    # don't strip if it becomes empty
                    pass
                else:
                    q['options'][i] = re.sub(r'\s+', ' ', new_opt) # remove extra spaces
                    modified_file = True
                    count += 1

    if modified_file:
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(data, fh, indent=4, ensure_ascii=False)

print(f"Stripped parens from {count} options across all batches.")
