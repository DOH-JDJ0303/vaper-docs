---
title: Reference Search
layout: page
nav_order: 9
parent: v2.0
permalink: /docs/v2.0/pages/ref_search/
---

<!-- Filter Buttons -->
<div id="taxon-filter-section">
  <h2 class="filter-title">Select a Taxon</h2>
  <div id="taxonButtons"></div>
</div>

<!-- Table -->
<table id="data-table" class="display stripe hover compact" style="width:100%; display: none;">
  <thead>
    <tr id="table-headers"></tr>
  </thead>
  <tbody></tbody>
</table>

{: .note}
All references were created at the genus level, except those belonging to Betacoronavirus (Embecovirus, Hibecovirus, Merbecovirus, Nobecovirus, and Sarbecovirus), using [EPITOME v2.1](https://doh-jdj0303.github.io/epitome-docs/). Taxonomic names were derived from [NCBI](https://www.ncbi.nlm.nih.gov/taxonomy). References with unusual lengths, as compared to the global average for that genus, are listed as `outliers`.
- [Learn more about reference sets](../developers/reference_sets/index.html)
- [Request a new reference set](https://github.com/DOH-JDJ0303/vaper/issues)

<!-- Styles and Dependencies -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" />
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css">

<style>
  #taxon-filter-section {
    margin-bottom: 1.5em;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 0.75em;
    background-color: #f9f9f9;
  }
  .filter-title {
    font-size: 1.2em;
    margin-bottom: 0.75em;
    font-weight: bold;
  }
  #taxonButtons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
  }
  #taxonButtons button {
    background-color: #eee;
    border: 1px solid #ccc;
    border-radius: 0.5em;
    padding: 0.4em 0.8em;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  #taxonButtons button:hover {
    background-color: #ddd;
  }
  #taxonButtons button.active {
    background-color: #007acc;
    color: white;
    border-color: #007acc;
  }
</style>

<!-- JS Dependencies -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

<!-- Custom table script -->
<script src="{{ 'ref_table.js' }}"></script>
