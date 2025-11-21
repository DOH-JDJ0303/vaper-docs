---
title: Reference Sets
layout: page
nav_order: 1
grand_parent: v1.0
parent: Developers
permalink: /docs/v1.0/pages/developers/reference_sets/
---

# **{{ page.title }}**
This page provides an overview of the use, structure, and creation of VAPER reference sets.

{: .important}
Reference sets in VAPER v1.6 will likely using a JSON formatted refsheet.

## Using Reference Sets
Reference sets can be specified using the `--refs` parameter (learn more [here](../../../usage/inputs/index.html#--refs))

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
Although not required, it’s best practice to compress the reference set into a `tar.gz` file. This tarball should include both the _refsheet_ and the reference assemblies. This is especially useful when sharing reference sets. See the [default reference set](https://github.com/DOH-JDJ0303/vaper/tree/637e1fe65c86a964e8ee331f39ca2f14188481d5/assets/reference_sets) for an example of the recommended structure.

### The Default Reference Set
The default reference sets used by VAPER are generated using [EPITOME](https://github.com/DOH-JDJ0303/epitome) with a 2% divergence threshold. This threshold was selected based on results from [varcraft](https://github.com/DOH-HNH0303/varcraft), which showed that assembly quality tends to degrade when sample-reference divergence exceeds 5%.

EPITOME-derived references include rich metadata about each source sequence, such as `SPECIES`, `COLLECTIONDATE`, `GEOGRAPHICREGION`, and `SEROTYPE`. Because this information is sourced from public databases, its accuracy is not guaranteed—please interpret it with caution ⚠️. Visit the [reference search](../../ref_search/index.html) page to explore available references.