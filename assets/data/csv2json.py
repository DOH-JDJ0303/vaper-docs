import json
import os
import csv

csv_file = 'refsheet.csv'

with open(csv_file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)  # Automatically uses the first row as headers
    data = list(reader)

# Output directory
output_dir = "taxon_jsons"
os.makedirs(output_dir, exist_ok=True)

# Group by taxon
taxon_groups = {}
for entry in data:
    taxon = entry.get("taxon", "Unknown").strip().replace(" ", "_")
    taxon_groups.setdefault(taxon, []).append(entry)

# Write each group to a separate JSON file
for taxon, entries in taxon_groups.items():
    filename = os.path.join(output_dir, f"{taxon}.json")
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2)

# Write list of taxa to a helper file
taxon_names = sorted(taxon_groups.keys())
with open(os.path.join(output_dir, "taxon_list.json"), "w", encoding="utf-8") as f:
    json.dump(taxon_names, f, indent=2)

print(f"Done. JSON files written to: {output_dir}")
