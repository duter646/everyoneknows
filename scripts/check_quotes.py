import sys

with open('import_questions.sql', 'r', encoding='utf-8') as f:
    content = f.read()

left_curly = '\u2018'
right_curly = '\u2019'

count_left = content.count(left_curly)
count_right = content.count(right_curly)
print(f"Left curly quote (U+2018): {count_left}")
print(f"Right curly quote (U+2019): {count_right}")

if count_left > 0 or count_right > 0:
    lines = content.split('\n')
    for i, line in enumerate(lines[:20], 1):
        if left_curly in line or right_curly in line:
            print(f"  Line {i}: has curly quotes")
            for j, ch in enumerate(line):
                if ch in (left_curly, right_curly):
                    print(f"    pos {j}: U+{ord(ch):04X} context: ...{line[max(0,j-5):j+6]}...")
                    break
