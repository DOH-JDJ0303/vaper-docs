---
title: Reference Search
layout: page
nav_order: 6
---

{% assign first_row = site.data.refset[0] %}
{% assign headers = "" %}
{% for pair in first_row %}
  {% assign headers = headers | append: pair[0] | append: "||" %}
{% endfor %}
{% assign header_list = headers | split: "||" %}

<!-- Taxon Filter Section -->
<div id="taxon-filter-section">
  <h2 class="filter-title">Filter by Taxon</h2>
  <div id="taxonButtons">
    <button class="taxon-filter" data-taxon="All">All</button>
    {% assign taxa = "" %}
    {% for row in site.data.refset %}
      {% assign t = row.taxon | strip %}
      {% unless taxa contains t %}
        {% assign taxa = taxa | append: t | append: "||" %}
      {% endunless %}
    {% endfor %}
    {% assign taxon_list = taxa | split: "||" %}
    {% for t in taxon_list %}
      {% unless t == "" %}
        <button class="taxon-filter" data-taxon="{{ t }}">{{ t }}</button>
      {% endunless %}
    {% endfor %}
  </div>
</div>

<!-- Table -->
<table id="data-table" class="display stripe hover compact" style="width:100%">
  <thead>
    <tr>
      {% for key in header_list %}
        {% unless key == "" %}
          <th>{{ key }}</th>
        {% endunless %}
      {% endfor %}
    </tr>
  </thead>
  <tbody>
    {% for row in site.data.refset %}
      <tr>
        {% for key in header_list %}
          {% unless key == "" %}
            <td>{{ row[key] }}</td>
          {% endunless %}
        {% endfor %}
      </tr>
    {% endfor %}
  </tbody>
</table>

<!-- Styles -->
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

<!-- Scripts -->
<link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>

<script>
  $(document).ready(function () {
    const table = $('#data-table').DataTable({
      responsive: true,
      pageLength: 25
    });

    $('.taxon-filter').on('click', function () {
      const taxon = $(this).data('taxon');

      $('.taxon-filter').removeClass('active');
      $(this).addClass('active');

      if (taxon === "All") {
        table.column(0).search('').draw();
      } else {
        table.column(0).search('^' + taxon + '$', true, false).draw();
      }
    });
  });
</script>
