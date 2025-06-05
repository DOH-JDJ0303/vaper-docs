---
title: Reference Search
layout: page
nav_order: 9
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

- [Learn more about reference sets](developers/reference_sets.html)
- [Request a new reference set](https://github.com/DOH-JDJ0303/vaper/issues)

<!-- Styles and Dependencies -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" />
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

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>

<script>
  let dataTable = null;

  async function loadTaxonList() {
    const res = await fetch('../../assets/data/taxon_jsons/taxon_list.json');
    const taxonList = await res.json();

    taxonList.forEach(taxon => {
      $('#taxonButtons').append(
        `<button class="taxon-filter" data-taxon="${taxon}">${taxon}</button>`
      );
    });

    $('#taxonButtons').on('click', '.taxon-filter', function () {
      const taxon = $(this).data('taxon');
      $('.taxon-filter').removeClass('active');
      $(this).addClass('active');
      loadTaxonData(taxon);
    });
  }

  async function loadTaxonData(taxon) {
    const url = `../../assets/data/taxon_jsons/${taxon}.json`;
    const res = await fetch(url);
    const json = await res.json();

    const headers = Object.keys(json[0] || {});

    if (dataTable) {
      dataTable.destroy();
      $('#data-table').hide();
    }

    $('#table-headers').empty();
    headers.forEach(key => {
      $('#table-headers').append(`<th>${key}</th>`);
    });

    const rowsHtml = json.map(row => {
      return '<tr>' + headers.map(key => `<td>${row[key] || ''}</td>`).join('') + '</tr>';
    }).join('');
    $('#data-table tbody').html(rowsHtml);

    $('#data-table').show();
    dataTable = $('#data-table').DataTable({
      responsive: true,
      pageLength: 10
    });
  }

  $(document).ready(function () {
    loadTaxonList();
  });
</script>