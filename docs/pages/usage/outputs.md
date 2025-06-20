---
title: Outputs
layout: page
nav_order: 5
parent: Usage Guide
---

# {{ page.title }}
{: .no_toc}

1. TOC
{:toc}

# Overview
Below is an overview of the standard outputs produced by VAPER.
```
`${outdir}` 
├── `${sample}`
│   ├── align
│   │   ├── `${reference}`.fa
│   │   ├── `${reference}`.fa.fai
│   │   ├── `${sample}-${reference}`.bam
│   │   └── `${sample}-${reference}`.bam.bai
│   ├── assembly
│   │   └── `${sample}-${reference}`.fa.gz
│   ├── metagenome
│   │   ├── `${sample}`.all-taxa.csv.gz
│   │   ├── `${sample}`.html
│   │   ├── `${sample}`.sm-meta.csv
│   │   └── `${sample}`.taxa-plot.jpg
│   ├── qc
│   │   ├── `${sample}-${reference}`.coverage.txt
│   │   ├── `${sample}-${reference}`.read-list.txt
│   │   ├── `${sample}-${reference}`.stats.txt
│   │   ├── `${sample}`.condense_dist.csv
│   │   ├── `${sample}`.condense_summary.csv
│   │   ├── `${sample}`.fastp.json
│   │   ├── `${sample}`_1_fastqc.html
│   │   ├── `${sample}`_1_fastqc.zip
│   │   ├── `${sample}`_2_fastqc.html
│   │   └── `${sample}`_2_fastqc.zip
│   ├── reads
│   │   ├── `${sample}-${reference}`_R1.fastq.gz
│   │   └── `${sample}-${reference}`_R2.fastq.gz
│   ├── ref-select
│   │   ├── `${sample}`.acc-ref.paf
│   │   ├── `${sample}`.denovo.fa
│   │   └── `${sample}`.ref-summary.csv
│   └── summary
│       └── `${sample}-${reference}`.summaryline.csv
├── VAPER-summary.csv
├── multiqc
└── pipeline_info
```
# Alignment Files
Read alignments and the corresponding reference and index files are provided for visualization tools like [IGV](https://igv.org/app/).
```
├── align
│   ├── `${reference}`.fa
│   ├── `${reference}`.fa.fai
│   ├── `${sample}-${reference}`.bam
│   └── `${sample}-${reference}`.bam.bai
```

# Assembly Files
Final assemblies based on selected references.
```
├── assembly
│   └── `${sample}-${reference}`.fa.gz
```

# Metagenome Files
Multiple metagenomic outputs are provided. See descriptions below:
```
├── metagenome
│   ├── `${sample}`.all-taxa.csv.gz
│   ├── `${sample}`.html
│   ├── `${sample}`.sm-meta.csv
│   └── `${sample}`.taxa-plot.jpg
```
## Sourmash Outputs
* `${sample}`.all-taxa.csv.gz is the summary file generated by `sourmash gather`
* `${sample}`.sm-meta.csv` is the summary file generated by `sourmash taxa metagenome`

## Visualizations
* `${sample}`.html is a Krona plot generated from `${sample}`.sm-meta.csv
* `${sample}`.taxa-plot.jpg shows the relative abundance of all classified sequences (excludes *unclassified*). Classifications with < 1% relative abundance are grouped under "Other".

# Quality Files
Files related to quality control are saved to a common directory. See descriptions below:
```
├── qc
│   ├── `${sample}-${reference}`.coverage.txt
│   ├── `${sample}-${reference}`.read-list.txt
│   ├── `${sample}-${reference}`.stats.txt
│   ├── `${sample}`.condense_dist.csv
│   ├── `${sample}`.condense_summary.csv
│   ├── `${sample}`.fastp.json
│   ├── `${sample}`_1_fastqc.html
│   ├── `${sample}`_1_fastqc.zip
│   ├── `${sample}`_2_fastqc.html
│   └── `${sample}`_2_fastqc.zip
```
## Read QC
* `${sample}`.fastp.json is the QC summary of the raw and quality filtered reads provided by `fastp`.
* `${sample}`_`{1,2}`_fastqc.`*` are the QC files for the `fastp`-controlled reads generated by `FASTQC`.

## Read Alignment
`${sample}-${reference}`.coverage.txt and `${sample}-${reference}`.stats.txt describe read mapping quality metrics for each reference genome.

## Assembly Selection
`${sample}`.condense_dist.csv and `${sample}`.condense_summary.csv are the outputs generated by `vaper-condense.py` and used to determine whether two assemblies should be merged.

# Mapped Reads
Reads that map to each reference genome are exported for downstream use.
```
├── reads
│   ├── `${sample}-${reference}`_R1.fastq.gz
│   └── `${sample}-${reference}`_R2.fastq.gz
```
# Reference selection
Files related to reference selection are saved to a common directory. See descriptions below:
```
│   ├── ref-select
│   │   ├── `${sample}`.acc-ref.paf
│   │   ├── `${sample}`.denovo.fa
│   │   └── `${sample}`.ref-summary.csv
```

* `${sample}`.denovo.fa is the de novo assembly generated by `shovill` when using `accurate` reference selection mode.
* `${sample}`.acc-ref.paf is the alignment file generated by `minimap2` between the de novo assembly and the references, when using `accurate` reference selection mode.
* `${sample}`.ref-summary.csv is a summary of the genome fraction of each reference covered by the de novo assembly contigs.

# Summary Files
Summary files are provided both individually (by sample) or collectively (by run)
```
│   └── summary
│       └── `${sample}-${reference}`.summaryline.csv
├── VAPER-summary.csv
```
* `${sample}-${reference}`.summaryline.csv is the individual summary for each sample-reference combo and may lack columns present in the combined summary.
* VAPER-summary.csv is the combined summary for all samples included on a run.

## VAPER Summary Columns
> [!NOTE]
> The descriptions below only include the *default* VAPER columns. Additional columns may appear when using the EPITOME reference set, including `SPECIES`, `COLLECTIONDATE`, `GEOGRAPHICREGION`, etc. These columns include information about the sequences that were used to create the reference genome (as listed in NCBI or GISAID). See the EPITOME [wiki](https://github.com/DOH-JDJ0303/epitome/wiki/6.-Outputs#column-descriptions) for more info.


|Column Name|Description|
|:-|:-|
|ID|The sample ID provided in the samplesheet followed by the sample replicate number (e.g., `_T1`).|
|REFERENCE|Name of the reference genome used to create the sample assembly.|
|SEGMENT|The genome segment name or number. Non-segmented viruses will be reported as `wg` (whole genome) when using the default reference set.|
|ASSEMBLY_VARIANT|Numbered version of an assembly. This should always be `1 of 1` unless there are multiple assemblies associated with a single species-segment combination for a sample. Multiple assemblies may arise from same-species co-infections or fragmented de novo assemblies affecting reference selection.|
|ASSEMBLY_QC|Automated reporting of assembly quality (`PASS` or `FAIL`) based on reference genome fraction (`--qc_genfrac`) and reference depth of coverage (`--qc_depth`).|
|ASSEMBLY_QC_REASON|Explanation for QC failure.|
|ASSEMBLY_LENGTH|Number of nucleotides in the sample assembly (includes non-ATCG).|
|REF_LENGTH|Number of nucleotides in the reference assembly (includes non-ATCG).|
|ASSEMBLY_EST_DEPTH|Estimated number of reads supporting each position in the sample assembly.|
|ASSEMBLY_GEN_FRAC|The proportion of nucleotide positions in the reference genome present in the sample assembly (excludes missing nucleotides).|
|ASSEMBLY_SUBS|Number of nucleotide substitutions in the sample compared to the reference.|
|ASSEMBLY_DEL|Number of nucleotide deletions in the sample assembly compared to the reference.|
|ASSEMBLY_INS|Number of nucleotide insertions in the sample assembly compared to the reference.|
|ASSEMBLY_MISSING|Number of unassigned nucleotides (`N`) in the sample assembly compared to the reference.|
|ASSEMBLY_NON_ACGTN|Number of nucleotides assigned as something other than A, C, G, T, or N in the sample assembly compared to the reference.|
|ASSEMBLY_TERMINI_GAPS|Number of terminal nucleotides in the reference that are missing in the sample assembly. Nextclade reports these separately from `missing` nucleotides.|
|PERC_READS_MAPPED|Percent of clean reads that mapped to the reference genome.|
|PERC_BASES_MAPPED|Percent of bases in the clean reads that mapped to the reference genome.|
|MEAN_MAPPED_READ_LENGTH|Average length of the clean reads that mapped to the reference genome.|
|MEAN_MAPPED_READ_QUALITY|Average Phred score of the clean reads that mapped to the reference genome.|
|TOTAL_READS_CLEAN|Number of clean reads (R1 + R2).|
|TOTAL_BASES_CLEAN|Number of bases in the clean reads (R1 + R2).|
|READ1_MEAN_LENGTH_CLEAN|Average length of the clean forward reads.|
|READ2_MEAN_LENGTH_CLEAN|Average length of the clean reverse reads.|
|Q30_RATE_CLEAN|Percentage of bases in the clean reads that have a Phred score of 30 or greater.|
|TOTAL_READS_RAW|Number of raw reads (R1 + R2).|
|TOTAL_BASES_RAW|Number of bases in the raw reads (R1 + R2).|
|READ1_MEAN_LENGTH_RAW|Average length of the raw forward reads.|
|READ2_MEAN_LENGTH_RAW|Average length of the raw reverse reads.|
|Q30_RATE_RAW|Percentage of bases in the raw reads that have a Phred score of 30 or greater.|
|SPECIES_SUMMARY|Relative abundance of viral species detected in the sample reads using Sourmash. Species with ≤ 1% relative abundance are categorized as `Other`. Relative abundance is calculated using only the classified sequences.|