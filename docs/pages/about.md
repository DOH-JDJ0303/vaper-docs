---
title: About
layout: page
nav_order: 2
---

# **{{ page.title }}**

## What is VAPER?
**VAPER** (**<ins>V</ins>**iral **<ins>A</ins>**ssembly from **<ins>P</ins>**robe-based **<ins>E</ins>**n**<ins>r</ins>**ichment) is a viral (meta-)assembly pipeline that can:
- Assemble genomes from complex samples, supporting multiple assemblies per sample (e.g., co-infections)
- Automatically detect and select reference genomes
- Predict the taxonomy of each assembly, with an optional viral metagenomic summary
- Export reads associated with each assembly for downstream use

While VAPER was originally designed for hybrid capture data (e.g., [Illumina VSP](https://www.illumina.com/products/by-type/sequencing-kits/library-prep-kits/viral-surveillance-panel.html) or [Twist CVRP](https://www.twistbioscience.com/products/ngs/fixed-panels/comprehensive-viral-research-panel)), it has been used with shotgun metagenomic and tile-amplicon data. By default, VAPER comes with comprehensive reference sets for <span id="taxon-count">[loading]</span> taxon, including influenza A, SARS-CoV-2, and Monkeypox ([full list](ref_search.html)). Check out the [overview page](overview.html) to learn more!

## Who created VAPER?
VAPER was originally created by the Washington State Department of Health (WA DOH) as part of the Pathogen Genomics Center of Excellence (PGCoE). Check out the links below to learn more:
- [VAPER developers](https://github.com/DOH-JDJ0303/vaper/graphs/contributors)
- [Other contributors](https://github.com/DOH-JDJ0303/vaper?tab=readme-ov-file#acknowledgements)
- [NW PGCoE](https://nwpage.org/)

<script>
  fetch('/assets/data/taxon_jsons/taxon_list.json')
    .then(response => response.json())
    .then(data => {
      const count = data.length;
      document.getElementById('taxon-count').textContent = count;
    })
    .catch(() => {
      document.getElementById('taxon-count').textContent = 'an unknown number of';
    });
</script>

