import re

filepath = r'D:\VScodeprojects\page\everyoneknows\import_questions.sql'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def replace_array_quotes(match):
    inner = match.group(1)
    inner = inner.replace('"', "'")
    return "ARRAY[" + inner + "]"

result = re.sub(r'ARRAY\[([^\]]+)\]', replace_array_quotes, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(result)

count = len(re.findall(r'ARRAY\[', content))
print(f'Replaced quotes in {count} ARRAY expressions')
