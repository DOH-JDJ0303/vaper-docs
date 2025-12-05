#!/usr/bin/env python3
import argparse
import gzip
import json
from pathlib import Path
from collections import defaultdict


def parse_args():
    parser = argparse.ArgumentParser(
        description="Partition a jsonl.gz file by taxon and remove a field."
    )
    parser.add_argument(
        "--input",
        "-i",
        required=True,
        help="Input .jsonl.gz file",
    )
    parser.add_argument(
        "--outdir",
        "-o",
        default="taxon_jsons",
        help="Output directory for taxon JSON files (default: taxon_json)",
    )
    parser.add_argument(
        "--exclude",
        "-f",
        default=["sequence"],
        help="Field to remove from each JSON object (default: sequence)",
    )
    return parser.parse_args()

def main():
    args = parse_args()

    input_path = Path(args.input)
    outdir = Path(args.outdir)

    outdir.mkdir(parents=True, exist_ok=True)

    buckets = defaultdict(list)
    taxons  = set()

    # Read compressed JSONL
    with gzip.open(input_path, "rt", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue

            rec = json.loads(line)
            out = {}
            out = { k: v for k, v in rec.items() if k not in args.exclude + ['metadata'] }

            for k, v in rec['metadata'].items():
                if k in out:
                    if out[k] == v or k == 'taxon':
                        continue
                    else:
                        out[f"{k}_alt"] = v
                else:
                    out[k] = v

            taxon = out['taxon']

            buckets[taxon].append(out)
            taxons.add(taxon)

    # Write one gzipped file per taxon
    for taxon, items in buckets.items():
        safe = "".join(c if c.isalnum() or c in "-._" else "_" for c in taxon)
        outfile = outdir / f"{safe}.json.gz"

        with gzip.open(outfile, "wt", encoding="utf-8") as f:
            json.dump(items, f, indent=2)

    # Write list of taxa to a helper file (uncompressed)
    taxon_names = sorted(buckets.keys())
    with open(outdir / "taxon_list.json", "w", encoding="utf-8") as f:
        json.dump(taxon_names, f, indent=2)

    print(f"Done. Wrote {len(buckets)} gzipped files to {outdir}/")


if __name__ == "__main__":
    main()