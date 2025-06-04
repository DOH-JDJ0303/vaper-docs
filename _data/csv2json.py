import csv
import json

# Input and output file paths
csv_file = 'EPITOME_2025-02-14/refsheet.csv'
json_file = 'EPITOME_2025-02-14.json'

# Read CSV and convert to list of dicts
with open(csv_file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# Write to JSON
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(rows, f, indent=2)
