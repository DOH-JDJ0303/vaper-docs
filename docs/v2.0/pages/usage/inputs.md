---
title: Inputs
layout: page
nav_order: 4
grand_parent: v2.0
parent: Usage Guide
permalink: /docs/v2.0/pages/usage/inputs/
---

# {{ page.title }}
{: .no_toc}

1. TOC
{:toc}

---

# Overview
Pipeline parameters can be adjusted using the following methods:

1. At the command line using `--{parameter_name}` (e.g., `--input`)
2. In the `nextflow.config` file
3. In a JSON file via the `-params-file` parameter

It is also possible to pass arguments directly to a pipeline process using the `ext.args` variable in `conf/modules.config` (see example below):
```
    withName: 'IVAR_CONSENSUS' {
        ext.args            = "-n 'N' -k"
        ext.when            = {  }
        publishDir = [
            [
                path: { "${params.outdir}/${meta.id}/assembly/" },
                pattern: "none",
                mode: 'copy'
            ],
            [
                path: { "${params.outdir}/${meta.id}/qc" },
                pattern: "*.csv",
                mode: 'copy'
            ]
        ]
    }
```

---

# Input Options
## `--input`
Path to the samplesheet. 

### Example samplesheet
`samplesheet.csv`:
```
sample,fastq_1,fastq_2
sample01,sample01_R1_001.fastq.gz,sample01_R2_001.fastq.gz
sample02,sample02_R1_001.fastq.gz,sample02_R2_001.fastq.gz
```
### Samplesheet columns

{: .note}
- Required columns: `sample`, and `fastq_1` + `fastq_2` or `sra` 
- All file paths in the samplesheet must be absolute.

|Column Name|Description|
|:-|:-|
|`sample`|Sample name|
|`fastq_1`|Absolute path to the forward (R1) Illumina read file (`.fq` or `.fastq`). Must be supplied with `fastq_2`. Cannot be supplied with `sra` column.|
|`fastq_2`|Absolute path to the forward (R2) Illumina read file (`.fq` or `.fastq`). Must be supplied with `fastq_1`. Cannot be supplied with `sra` column.|
|`sra`|NCBI SRA accession number. Cannot be used with `fastq_1` or `fastq_2`.|
|`ref_file`|Semicolon-separated list of reference genome file paths (`.fa`, `.fasta`, or `.fna`). |
|`ref_name`|Semicolon-separated list of references to use based on their name in the reference set. |
|`ref_taxon`|Semicolon-separated list of references to select from based on the taxonomy listed in the reference set. |
|`ref_species`|Semicolon-separated list of references to select from based on the species listed in the reference set. |
|`ref_include`|Semicolon-separated list of reference selection inclusion patterns (e.g., `name=Betacoronavirus-wg-1`). |
|`ref_exclude`|Semicolon-separated list of reference selection exclusion patterns (e.g., `*`). |

{: .note}
Reference selection criteria supplied in the samplesheet via the `ref_taxon`, `ref_species`, `ref_segment`, `ref_name`, `ref_include`, and `ref_exclude` columns is applied per sample. You can apply these filters to an entire run using the `ref_*` filter config parameters.

{: .tip}
If a partcular reference is causing you problems you can exclude it using the `ref_exclude` column or parameter - e.g., `--ref_exclude name=Alphainfluenzavirus-4-24`

## `--max_reads`
The maximum number of reads to include in the analysis.

- Options: `0...Inf`
- Default: `2_000_000`

> Samples with more than this number of reads will be randomly down-sampled using `seqtk sample`. Read counts are based on the sum of the forward and reverse reads.

## `--scrub_reads`
Option to use the SRA Human Read Scrubber tool prior to read processing.

- Options: `true` or `false`
- Default: `false`

---

# Metagenomic Analysis
## `--metagenome`
Controls if metagenomic analysis is performed.

- Options: `true` or `false`
- Default: `true`

> Overridden when using `--ref_mode kitchen-sink`

## `--sm_db`
Path to Sourmash database to use for metagenomic classification

- Options: Path to database file
- Default: "${projectDir}/assets/databases/ncbi-viruses-2025.01.dna.k=21.sig.zip"

> Learn more about sourmash databases [here](https://sourmash.readthedocs.io/en/latest/databases.html).

## `--sm_taxa`
Path to taxonomic information for the Sourmash database supplied via `--sm_db`.

- Options: Path to taxonomy file
- Default: "${projectDir}/assets/databases/ncbi-viruses.2025.01.lineages.csv.gz"

> Learn more about sourmash databases [here](https://sourmash.readthedocs.io/en/latest/databases-md/).

---

# Reference Selection
## `--ref_set`
Path to a compressed reference set in JSON lines format or CSV format.

- Options: Path to a `.jsonl` or `.csv`
- Default: `${projectDir}/assets/reference_sets/EPITOME_*.jsonl.gz`

> Learn more about reference sets [here](../overview/#reference-selection).

## `--ref_file`
Path(s) to reference files in FASTA format. References supplied this way will be used to create assemblies for **all** samples.

- Options: Path to one or more FASTA file.
- Default: `null`

> You must use quotes when supplying multiple paths (e.g., `--ref_file "references/*.fa.gz"`), otherwise Nextflow will only recognize the first path as input.

## `--ref_mode`
Reference selection mode

- Options: `standard`, `sensitive`, and `kitchen-sink`.
- Default: `standard`

> You can skip reference selection by setting `ref_mode` to `null`. Learn more about reference selection modes [here](../overview/#reference-selection).

## `--ref_genfrac`
Minimum genome fraction used for reference selection.

- Options: `0...1`
- Default: `0.5`

> Consensus assemblies will only be generated if the proportion of the reference detected in the sample exceeds this value.  This differs from the genome fraction threshold used for the final quality assessment (`--qc_genfrac`). This value should generally be lower than the QC threshold, to account for gaps in the de novo assembly.

## `--ref_dist`
Average nucleotide difference used to cluster references during reference selection (`1 - ( % ANI / 100 )`).

- Options: `0...1`
- Default: `0.2`

> This paramater primarily controls the selection of closely related references due to fragmented de novo assemblies.

## `--ref_denovo_assembler`
De novo assembler to use for accurate reference selection.

- Options: `spades`, `megahit`, `velvet`, and `skesa`.
- Default: `megahit`

> Only applies to `standard` and `sensitive` reference selection modes.

## `--ref_denovo_contigcov`
Minimum depth of coverage for a contig to be retained in the de novo assembly.

- Options: `0...Inf`
- Default: `10`

> Only applies to `standard` and `sensitive` reference selection modes.

## `--ref_denovo_contiglen`
Minimum length for a contig to be retained in the de novo assembly.

- Options: `0...Inf`
- Default: `300`

> Only applies to `standard` and `sensitive` reference selection modes.

## `--ref_denovo_gsize`
Genome size estimate used by Shovill

- Options: `0...Inf`
- Default: `1.0M`

> This is primarily used for read downsampling and should generally not need to be adjusted. Only applies to `standard` and `sensitive` reference selection modes.


## `--ref_denovo_depth`
Target assembly depth used by Shovill

- Options: `0...Inf`
- Default: `30`

> Shovill downsamples reads to this target depth using the the genome size supplied by `ref_denovo_gsize`. Increasing this may lead to greater reference selection sensitivity but with a corresponding decrease in efficiency. Only applies to `standard` and `sensitive` reference selection modes.


## `--ref_taxon`
A semi-colon separated list of taxon in the reference set that should be considered during reference selection

- Options: Taxon name(s) in the reference set
- Default: `null`

> This filter will be applied for all samples on a run.

## `--ref_species`
A semi-colon separated list of species in the reference set that should be considered during reference selection

- Options: Species name(s) in the reference set
- Default: `null`

> This filter will be applied for all samples on a run.

## `--ref_segment`
A semi-colon separated list of segments in the reference set that should be considered during reference selection

- Options: Segment name(s) in the reference set
- Default: `null`

> This filter will be applied for all samples on a run.

## `--ref_name`
A semi-colon separated list of references in the reference set that should be used for genome assembly

- Options: Reference name(s) in the reference set
- Default: `null`

> These references will be used for all samples on a run.

## `--ref_include`
A semi-colon separated list of inclusion patterns to be applied to the reference set

- Default: `null`
- Example: `species=Alphainfluenzavirus;segment=1`

> Inclusion patterns are applied after exclusion patterns.

## `--ref_exclude`
A semi-colon separated list of exclusion patterns to be applied to the reference set

- Default: `null`
- Example: `*`

> Exclusion patterns are applied before inclusion patterns.

---

# Assembly Options
## `--cons_mode`
Method used for creating the reference-based assembly.

- Options: `standard`, `strict`, or `mixed`
- Default: `standard`

## `--cons_allele_qual`
Minimum allele quality when making the reference-based assembly.

- Options: `0...Inf`
- Default: `20`

## `--cons_allele_ratio`
Minimum allele support when making the reference-based assembly.

- Options: `0...1`
- Default: `0.6`

## `--cons_allele_depth`
Minimum allele depth when making the reference-based assembly.

- Options: `0...Inf`
- Default: `10`

## `--cons_max_depth`
Maximum read depth per assembly.

- Options: `0...Inf`
- Default: `100`

> This paramater controls read subsamples per assembly and is performed after aligning reads to the reference(s). This contrasts `max_reads`, which is applied per sample (not per assembly) and prior to read alignment.

## `--cons_condist`
Average nucleotide difference used to condense duplicate assemblies (`1 - ( % ANI / 100 )`).

- Options: `0...1`
- Default: `0.02`

> Use `--cons_condist 0` to return all duplicated assemblies.

## `--cons_prune_termini`
Remove N characters from the ends of each assembly.

- Options: `true` or `false`
- Default: `false`

> This is often required for NCBI submissions

## `--cons_no_mixed_sites`
Replace all non-ATCGN sites with N

- Options: `true` or `false`
- Default: `false`

---

# Quality Control
## `--qc_depth`
Minimum average depth of coverage used for quality assessment of reference-based assemblies.

- Options: `0...Inf`
- Default: `30`

## `--qc_genfrac`
Minimum genome fraction used for quality assessment of reference-based assemblies.

- Options: `0...1`
- Default: `0.8`

> This is separate from the minimum genome fraction used for reference selection (i.e., `--ref_genfrac`) and applies only to the final quality assessment step.


