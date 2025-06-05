---
title: Getting Started
layout: page
nav_order: 2
parent: Usage Guide
---

# {{ page.title }}
{: .no_toc}

1. TOC
{:toc}

# Dependencies
VAPER is built using [Nextflow](https://www.nextflow.io/). Nextflow simplifies the development and execution of complex, scalable data analysis workflows by enabling reproducibility, portability across computing environments, and seamless integration with container technologies like Docker and Singularity.

The following are required to run VAPER:
- [Nextflow](https://www.nextflow.io/docs/latest/install.html) (version 23.04.0 or higher)
- One of the following container engines: 
    - [Podman](https://podman.io/docs/installation) (recommended)
    - [Docker](https://docs.docker.com/engine/install/)
    - [Apptainer](https://apptainer.org/docs/admin/main/installation.html)
    - [Singularity](https://docs.sylabs.io/guides/3.0/user-guide/installation.html). 

{: .important}
VAPER does not support Conda / Mamba. Please submit a [feature request](https://github.com/DOH-JDJ0303/vaper/issues) if this is essential for your lab.

# Nextflow Basics
Below are some general pointers for how to run Nextflow workflows.
## Specifying the workflow version
There are two general ways you can specify which version of VAPER you want to run:
1. Tell Nextflow which version you want to use
```
nextflow run doh-jdj0303/vaper \
    -r v1.0 \
    -profile docker \
    --input samplesheet.csv \
    --outdir results
```
{: .tip}
Nextflow caches repos in ~/.nextflow/assets/ by default. Removing this cache can be helpful when running into version-related issues.

2. Clone the workflow version manually
```
git clone https://github.com/doh-jdj0303/vaper.git -b v1.0 
```
```
nextflow run vaper/main.nf \
    -profile docker \
    --input samplesheet.csv \
    --outdir results
```
## Specifying resource limits
We recommend adjusting the maximum resource limits that Nextflow can use. Setting these limits too high will cause the workflow to fail. There are four general ways to achieve this:
1. Set limits via command-line parameters
```
nextflow run doh-jdj0303/vaper \
    -r main \
    -profile docker \
    --input samplesheet.csv \
    --outdir results \
    --max_cpus 8 \
    --max_memory 12.GB 
```
2. Set limits in the [nextflow.config](https://github.com/DOH-JDJ0303/vaper/blob/main/nextflow.config) config file
```
    // Max resource options
    // Defaults only, expecting to be overwritten
    max_memory                 = '128.GB'
    max_cpus                   = 16
    max_time                   = '240.h'
```

3. Set limits via a custom config file
`custom.config`
```
process {
  // Default maximum resources allowed per process
  withName: '*' {
    maxCpus = 16         // set your desired max CPUs
    maxMemory = '64 GB'  // set your desired max memory
  }
}
```
```
nextflow run doh-jdj0303/vaper \
    -r main \
    -c custom.config \
    -profile docker \
    --input samplesheet.csv \
    --outdir results
```

{: .tip}
*All* parameters can be supplied via a custom config file, including `input` and `outdir`.

## Resuming a run
Nextflow can resume a run. This comes in handy when a workflow fails or when you need to make small parameter adjustments. Below is an example of how you can resume a workflow run:
```
nextflow run doh-jdj0303/vaper \
    -r main \
    -profile docker \
    --input samplesheet.csv \
    --outdir results \
    -resume
```

# Testing VAPER
Verify that VAPER is running properly using the command below. Update `-profile` to your preferred container engine.
```
nextflow run doh-jdj0303/vaper \
    -r main \
    -profile (docker|podman|apptainer|singularity),test \
    --outdir vaper_test
```
You can learn more about how the test configuration [here](https://github.com/DOH-JDJ0303/vaper/blob/main/conf/test.config)

# Basic Usage
Most users will find everything they need to run VAPER on the [quick start](quickstart.html) page and in the various examples over in the [examples](../examples/index.html) section. In-depth overviews of [inputs](inputs.html) and [outputs](outputs.html) are also available. All other questions / issues should be submitted via the VAPER [GitHub issues](https://github.com/DOH-JDJ0303/vaper/issues) page or by [email](mailto:waphl-bioinformatics@doh.wa.gov).