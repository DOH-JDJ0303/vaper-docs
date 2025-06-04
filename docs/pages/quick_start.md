---
title: Quick Start
layout: page
nav_order: 2
---

# **{{ page.title }}**

{: .important}
VAPER requires [Nextflow](https://www.nextflow.io/docs/latest/install.html) and one of the following container engines: [Docker](https://docs.docker.com/engine/install/), [Podman](https://podman.io/docs/installation), [Apptainer](https://apptainer.org/docs/admin/main/installation.html), [Singularity](https://docs.sylabs.io/guides/3.0/user-guide/installation.html).

## 1. Make your samplesheet:

{: .note}
Must use absolute file paths in samplesheets.

`samplesheet.csv`:
```
sample,fastq_1,fastq_2
sample1,sample1_R1.fastq.gz,sample1_R2.fastq.gz
sample2,sample2_R1.fastq.gz,sample2_R2.fastq.gz
```

## 2. Run VAPER:

{: .note}
This uses the default reference set, which includes 18 viral genera. It is also possible to supply your own reference(s).
```
nextflow run DOH-JDJ0303/vaper \
    -r main \
    -profile docker \
    --input $PWD/samplesheet.csv
    --db $PWD/db \
    --outdir $PWD/results \
    --max_cpus 4 \
    --max_memory 8.GB
```

## 3. Check the results:
Results can be found in `--outdir`. A good place to start is `VAPER-summary.csv`. Genome assemblies can be found in `${outdir}/${sample}/assembly/` and a metagenomic summary in `${outdir}/${sample}/metagenome`.

{: .tip}
Want to learn more? Check out the pipeline overview [here](overview.html).