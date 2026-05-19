filepath = r'D:\VScodeprojects\page\everyoneknows\import_questions.sql'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()
count = content.count("''")
print(f'Found {count} escaped single quotes (double single quotes)')
