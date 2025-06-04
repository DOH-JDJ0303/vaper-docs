---
title: Reference Sets
layout: page
nav_order: 1
parent: Developers
---

# **{{ page.title }}**
This page provides an overview of the use, structure, and creation of VAPER reference sets.  

## Using Reference Sets
Reference sets can be specified using the `--refs` parameter (learn more [here](/docs/pages/inputs.html#--refs))

## Creating Reference sets
### The Refsheet
The _refsheet_ is a comma-separated file containing the paths to each reference assembly file (like a _samplesheet_ but for references 😬). Information about each reference (e.g., species, segment, creation date, source, etc.,) can be supplied by adding extra columns to the _refsheet_ (this is totally optional - name the columns whatever you want!). This extra info will be copied into the `VAPER-summary.csv` each time the reference genome is used.

Below is an example of what a `refsheet` looks like:

`refsheet.csv`
```
assembly,taxon,segment
Influenza_A_HA.fa.gz,Alphainfluenzavirus,4
Monkeypox_virus_wg.fa.gz,Orthopoxvirus,wg
```
### Compressing the Reference Set
While not required, it is best practice to compress reference sets into a `tar.gz` file. This tar file will contain both the _refsheet_ and the reference assemblies. This is ideal if you plan to share the references. Take a look at the [default reference set](https://github.com/DOH-JDJ0303/vaper/tree/main/assets/reference_sets) to learn more about the structure.


### The Default Reference Set
The default reference sets for VAPER are created using [EPITOME](https://github.com/DOH-JDJ0303/epitome) with a 2% divergence threshold. This divergence threshold was selected based on work conducted using [varcraft](https://github.com/DOH-HNH0303/varcraft), which found that assembly quality tends to drop-off when sample-reference divergence exceeds 5%. EPITOME references come with a plethora of information associated with each input sequence that was used to create the reference. These includes fields like `SPECIES`, `COLLECTIONDATE`, `GEOGRAPHICREGION`, and `SEROTYPE`. Given that this data comes from a public sequencing repo, we cannot vouch for its validity. Please interpret with caution ⚠️! Check out the [reference search](../ref_search.html) page to learn more.