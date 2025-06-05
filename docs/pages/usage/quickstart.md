---
title: Quick Start
layout: page
nav_order: 1
parent: Usage Guide
---

# {{ page.title }}
{: .no_toc}

{: .important}
VAPER requires [Nextflow](https://www.nextflow.io/docs/latest/install.html) and <ins>one</ins> of the following container engines: [Docker](https://docs.docker.com/engine/install/), [Podman](https://podman.io/docs/installation), [Apptainer](https://apptainer.org/docs/admin/main/installation.html), [Singularity](https://docs.sylabs.io/guides/3.0/user-guide/installation.html).

## 1. Make your samplesheet:

{: .note}
Samplesheets must use absolute file paths to avoid path resolution errors.

`samplesheet.csv`:
```
sample,fastq_1,fastq_2
sample1,sample1_R1.fastq.gz,sample1_R2.fastq.gz
sample2,sample2_R1.fastq.gz,sample2_R2.fastq.gz
```

## 2. Run VAPER:

{: .note}
This uses the **default reference set**, which includes <span id="taxon-count">[loading]</span> viral taxa ([full list](../ref_search.md)). It is also possible to supply your own reference(s) in the samplesheet or via the `--refs` parameter ([learn more](overview.html#reference-selection)).
```
nextflow run doh-jdj0303/vaper \
    -r main \
    -profile docker \
    --input $PWD/samplesheet.csv \
    --db $PWD/db \
    --outdir $PWD/results \
    --max_cpus 4 \
    --max_memory 8.GB
```

## 3. Check the results:
Results can be found in `--outdir`. A good place to start is `VAPER-summary.csv`. Genome assemblies can be found in `${outdir}/${sample}/assembly/` and metagenomic summary in `${outdir}/${sample}/metagenome` ([learn more](outputs.html)).

{: .tip}
🔍 Want to learn more? Check out the [getting started](getting_started.html) and [overview](overview.html) pages.

<script>
  const baseurl = '{{ site.baseurl }}';
  fetch(`${baseurl}/assets/data/taxon_jsons/taxon_list.json`)
    .then(response => response.json())
    .then(data => {
      const count = data.length;
      document.getElementById('taxon-count').textContent = count;
    })
    .catch(() => {
      document.getElementById('taxon-count').textContent = 'an unknown number of';
    });
</script>