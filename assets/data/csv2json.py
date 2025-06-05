import json
import os
import csv

csv_file = 'refsheet.csv'

with open(csv_file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    raw_data = list(reader)

# Output directory
output_dir = "taxon_jsons"
os.makedirs(output_dir, exist_ok=True)

# Group by taxon
taxon_groups = {}
for entry in raw_data:
    taxon = entry.get("taxon", "Unknown").strip().replace(" ", "_")
    
    # Rename 'assembly' to 'reference' and keep only basename
    if 'assembly' in entry:
        entry['reference'] = os.path.basename(entry['assembly'])
        del entry['assembly']
    
    taxon_groups.setdefault(taxon, []).append(entry)

# Clean and write each group to a separate JSON file
for taxon, entries in taxon_groups.items():
    # Determine valid fields (present in all entries)
    all_keys = [set(e.keys()) for e in entries]
    common_keys = set.union(*all_keys)
    present_keys = set(k for k in common_keys if any(k in e and e[k] for e in entries))

    # Filter entries to include only present_keys
    cleaned_entries = [{k: e[k] for k in present_keys if k in e} for e in entries]

    filename = os.path.join(output_dir, f"{taxon}.json")
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(cleaned_entries, f, indent=2)

# Write list of taxa to a helper file
taxon_names = sorted(taxon_groups.keys())
with open(os.path.join(output_dir, "taxon_list.json"), "w", encoding="utf-8") as f:
    json.dump(taxon_names, f, indent=2)

print(f"Done. JSON files written to: {output_dir}")
