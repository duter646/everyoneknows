with open('import_questions.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()
line7 = lines[6]
print("Line 7:")
print(line7[:500])
print()
print("Contains ARRAY[\" ? ", 'ARRAY["' in line7)
print("Contains ARRAY[$$ ? ", 'ARRAY[$$' in line7)
