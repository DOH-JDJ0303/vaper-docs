---
title: Inputs
layout: page
nav_order: 4
---

# **{{ page.title }}**
{: .no_toc}

1. TOC
{:toc}

# **Overview**
Pipeline parameters can be adjusted using the following methods:

1. At the command line using `--{parameter_name}` (e.g., `--input`)
2. In the `nextflow.config` file
3. In a JSON file via the `-params-file` parameter

It is also possible pass arguments directly to a pipeline process using the `ext.args` variable in `conf/modules.config` (see example below):
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

# **Input Options**
## `--input`
Path to the samplesheet. 

### Example samplesheet
`samplesheet.csv`:
```csv
sample,fastq_1,fastq_2
sample01,sample01_R1_001.fastq.gz,sample01_R2_001.fastq.gz
sample02,sample02_R1_001.fastq.gz,sample02_R2_001.fastq.gz
```
### Samplesheet columns

{: .note}
- **Required columns:** `sample`, and `fastq_1` + `fastq_2` or `sra` 
- Absolute files paths must be used in the samplesheet.

|Column Name|Description|
|:-|:-|
|`sample`|Sample name|
|`fastq_1`|Absolute path to the forward (R1) Illumina read file. Must be supplied with `fastq_2`. Cannot be supplied with `sra` column.||
|`fastq_2`|Absolute path to the forward (R2) Illumina read file. Must be supplied with `fastq_1`. Cannot be supplied with `sra` column.|
|`sra`|NCBI SRA accession number. Cannot be supplied the `fastq_1` or `fastq_2` columns.|
|`reference`|Semicolon separated list of reference genomes to use for reference-based genome assembly. This can include absolute file paths to a FASTA file or the reference name(s) in the reference set supplied to `--refs` |

## `--refs`
Path to a reference set

- Default: `${baseDir}/assets/reference_sets/EPITOME_*.tar.gz`

> Learn more about reference sets [here](overview.html#reference-sets).

## `--max_reads`
The maximum number of reads to include in the analysis.

- Options: `0...Inf`
- Default: `2000000`

> Samples with more than this number of reads will be randomly down-sampled using `seqtk sample`. Read counts are based on the sum of the forward and reverse reads.

# **Classification Options**
## `--ref_mode`
Reference selection mode

- Options: `accurate`, `fast`, `kitchen-sink`, and `none`. 
- Default: `accurate`

> Learn more about reference selection modes [here](overview.html#reference-selection).

## `--ref_genfrac`
Minimum genome fraction used for reference selection.

- Options: `0...1`
- Default: `0.1`

> Consensus assemblies will only be generated if the proportion of the reference detected in the sample exceeds this value.  This differs from the genome fraction threshold used for the final quality assessment (`--qc_genfrac`). This value should generally be lower than the QC threshold, to account for gaps in the de novo assembly.

## `--ref_covplot`
Create reference coverage plots.

- Options: `true` or `false`
- Default: `false`

> Only applies to `accurate` reference selection mode.

## `--ref_denovo_assembler`
De novo assembler to use for accurate reference selection.

- Options: `spades`, `megahit`, `velvet`, and `skesa`.
- Default: `megahit`

> Only applies to `accurate` reference selection mode.

## `--ref_denovo_contigcov`
Minimum depth of coverage for a contig to be retained in the de novo assembly.

- Options: `0...Inf`
- Default: `10`

> Only applies to `accurate` reference selection mode.

## `--ref_denovo_contiglen`
Minimum length for a contig to be retained in the de novo assembly.

- Options: `0...Inf`
- Default: `300`

> Only applies to `accurate` reference selection mode.

# **Assembly Options**
## `--cons_assembler`
Reference-based assembler

- Options: `ivar` or `irma`
- Default: `ivar`

## `--cons_assembly_type`
Method used for creating the reference-based assembly.

- Options: `plurality`, `consensus`, or `padded`
- Default: `consensus`

> This option only applies to IRMA (ignored by iVar).

## `--cons_assembly_elong`
Use IRMA "elongation" feature.

- Options: `true` or `false`
- Default: `false`
{: .note}
Only applies when using `--cons_assembler irma`

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

## `--cons_drop_lowcov`
Treat alleles with coverage less than the minimum depth specified by `--cons_allele_depth` as deletions.

- Options: `true` or `false`
- Default: `false`

{: .note} 
Only applies when using `--cons_assembler ivar`

## `--cons_condist`
Average nucleotide difference used to condense duplicate assemblies (`1 - ( % ANI / 100 )`).

- Options: `0...1`
- Default: `0.02`

{: .note}
Use `--cons_condist 0` to return all duplicated assemblies.

# **Quality Control**
## `--qc_depth`
Minimum average depth of coverage used for quality assessment of reference-based assemblies.

- Options: `0...Inf`
- Default: `30`

## `--qc_genfrac`
Minimum genome fraction used for quality assessment of reference-based assemblies.

- Options: `0...1`
- Default: `0.8`

{: .note}
This differs from the minimum genome fraction used for reference selection (i.e., `--ref_genfrac`).