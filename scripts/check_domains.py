import json
import glob

# 统计 data/ 中的所有 domain
all_domains = set()
domain_counts = {}

for f in glob.glob('data/*_batch.json'):
    with open(f, 'r', encoding='utf-8') as fp:
        data = json.load(fp)
        if data:
            # 取第一个题目获取domain
            first_q = data[0]
            domain = first_q.get('domain', '').strip()
            if domain:
                all_domains.add(domain)
                domain_counts[domain] = domain_counts.get(domain, 0) + 1

print(f"data/ 中有 {len(all_domains)} 个唯一 domain:")
for domain in sorted(all_domains):
    print(f"  - {domain}")

print(f"\n重复domain统计:")
duplicate_domains = {d: c for d, c in domain_counts.items() if c > 1}
if duplicate_domains:
    for domain, count in sorted(duplicate_domains.items()):
        print(f"  {domain}: {count} 个文件")
else:
    print("  无重复domain")