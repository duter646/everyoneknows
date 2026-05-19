import json
import glob
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "import_questions.sql")

def escape_sql_str(s):
    if s is None:
        return "NULL"
    s = str(s).replace("\\", "\\\\")
    return "$$" + s + "$$"

def to_jsonb(obj):
    if obj is None:
        return "NULL"
    return escape_sql_str(json.dumps(obj, ensure_ascii=False))

def to_text_array(arr):
    if arr is None:
        return "NULL"
    escaped = []
    for item in arr:
        s = item.replace("\\", "\\\\")
        escaped.append(f"$${s}$$")
    return "ARRAY[" + ",".join(escaped) + "]::text[]"

def main():
    batch_files = sorted(glob.glob(os.path.join(DATA_DIR, "*_batch.json")))
    all_questions = []

    for f in batch_files:
        with open(f, "r", encoding="utf-8") as fh:
            questions = json.load(fh)
            all_questions.extend(questions)
            print(f"  {os.path.basename(f)}: {len(questions)} 题")

    print(f"\n总计: {len(all_questions)} 题")

    lines = []
    lines.append("-- 批量导入题目到 Supabase questions 表")
    lines.append(f"-- 共 {len(all_questions)} 道题，来自 {len(batch_files)} 个领域批次文件")
    lines.append("-- 在 Supabase SQL Editor 中执行即可\n")
    lines.append("INSERT INTO questions (id, domain, type, question, options, answer, difficulty, explanation, tags, vector, source)")
    lines.append("VALUES")

    value_rows = []
    for q in all_questions:
        id_ = escape_sql_str(q["id"])
        domain = escape_sql_str(q["domain"])
        type_ = escape_sql_str(q["type"])
        question = escape_sql_str(q["question"])
        options = to_jsonb(q["options"])
        answer = to_jsonb(q["answer"])
        difficulty = escape_sql_str(q["difficulty"])
        explanation = escape_sql_str(q.get("explanation"))
        tags = to_text_array(q.get("tags"))
        vector = to_jsonb(q.get("vector"))
        source = "'batch'"

        row = f"  ({id_}, {domain}, {type_}, {question}, {options}, {answer}, {difficulty}, {explanation}, {tags}, {vector}, {source})"
        value_rows.append(row)

    lines.append(",\n".join(value_rows))
    lines.append("\nON CONFLICT (id) DO UPDATE SET")
    lines.append("  domain = EXCLUDED.domain,")
    lines.append("  type = EXCLUDED.type,")
    lines.append("  question = EXCLUDED.question,")
    lines.append("  options = EXCLUDED.options,")
    lines.append("  answer = EXCLUDED.answer,")
    lines.append("  difficulty = EXCLUDED.difficulty,")
    lines.append("  explanation = EXCLUDED.explanation,")
    lines.append("  tags = EXCLUDED.tags,")
    lines.append("  vector = EXCLUDED.vector;")
    lines.append("")

    sql = "\n".join(lines)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as fh:
        fh.write(sql)

    size_kb = os.path.getsize(OUTPUT_FILE) / 1024
    print(f"\nSQL 文件已生成: {OUTPUT_FILE}")
    print(f"文件大小: {size_kb:.1f} KB")
    print(f"\n使用方法: 打开 Supabase Dashboard → SQL Editor → 粘贴执行")

if __name__ == "__main__":
    main()
