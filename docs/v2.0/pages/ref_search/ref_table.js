// assets/js/ref_search_table.js

// Requires:
// - jQuery
// - DataTables
// - DataTables Buttons + JSZip (for CSV export)

let dataTable = null;

// How many characters to show in the table display
const MAX_DISPLAY_CHARS = 60;

// Flatten a single record from the nested JSON structure
function flattenRecord(rec) {
  const md = rec.metadata || {};
  const out = {};

  // Top-level fields
  out.name = rec.name ?? "";

  // Arrays in metadata -> comma-separated strings
  const arrayFields = [
    "accessions",
    "geographic_region",
    "host",
    "segment",
    "species",
    "tax_id",
    "taxon"
  ];

  arrayFields.forEach(field => {
    if (Array.isArray(md[field])) {
      out[field] = md[field].join(", ");
    } else {
      out[field] = md[field] ?? "";
    }
  });

  // collection_date: { min, max }
  if (md.collection_date) {
    out.collection_date_min = md.collection_date.min ?? "";
    out.collection_date_max = md.collection_date.max ?? "";
  } else {
    out.collection_date_min = "";
    out.collection_date_max = "";
  }

  return out;
}

// Build DataTables column definitions with truncation for display only
function buildColumns(headers) {
  return headers.map(colName => ({
    data: colName,
    name: colName,
    render: function (data, type, row) {
      // Full data for everything except on-screen display
      if (type !== 'display' || typeof data !== 'string') {
        return data;
      }
      // Truncate only for display
      if (data.length > MAX_DISPLAY_CHARS) {
        return data.slice(0, MAX_DISPLAY_CHARS) + '…';
      }
      return data;
    }
  }));
}

// Load JSON for a specific taxon and render DataTable
async function loadTaxonData(taxon) {
  try {
    const url = `data/taxon_jsons/${encodeURIComponent(taxon)}.json`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to load taxon data:', res.status);
      return;
    }

    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) {
      console.warn('No data for taxon:', taxon);
      return;
    }

    // Full data lives here
    const flatData = json.map(flattenRecord);

    // Collect all keys across rows
    const keySet = new Set();
    flatData.forEach(row => {
      Object.keys(row).forEach(k => keySet.add(k));
    });

    // Preferred column ordering
    const preferredOrder = [
      "name",
      "taxon",
      "species",
      "segment",
      "host",
      "geographic_region",
      "accessions",
      "tax_id",
      "collection_date_min",
      "collection_date_max"
    ];

    const allKeys = Array.from(keySet);
    const headers = [
      ...preferredOrder.filter(k => keySet.has(k)),
      ...allKeys.filter(k => !preferredOrder.includes(k))
    ];

    // Destroy existing DataTable
    if (dataTable) {
      dataTable.destroy();
      dataTable = null;
      $('#data-table').hide();
    }

    // Build table header DOM
    $('#table-headers').empty();
    headers.forEach(key => {
      $('#table-headers').append(`<th>${key}</th>`);
    });

    $('#data-table').show();

    // Initialize DataTable using data + columns (no manual <tr> building)
    dataTable = $('#data-table').DataTable({
      data: flatData,
      columns: buildColumns(headers),
      responsive: true,
      pageLength: 10,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'csvHtml5',
          text: 'Download CSV',
          title: `VAPER_${taxon}_references`,
          exportOptions: {
            columns: ':visible',
            // Force CSV to use the full underlying data from flatData,
            // not the truncated display text.
            format: {
              body: function (data, rowIdx, colIdx /*, node */) {
                const rowData = flatData[rowIdx];
                const colName = headers[colIdx];
                const val = rowData && colName in rowData ? rowData[colName] : '';
                return val == null ? '' : String(val);
              }
            }
          }
        }
      ]
    });
  } catch (err) {
    console.error('Error loading taxon data:', err);
  }
}

// Load list of taxa and build filter buttons
async function loadTaxonList() {
  try {
    const res = await fetch('data/taxon_jsons/taxon_list.json');
    if (!res.ok) {
      console.error('Failed to load taxon list:', res.status);
      return;
    }

    const taxonList = await res.json();
    if (!Array.isArray(taxonList) || taxonList.length === 0) {
      console.warn('Taxon list is empty.');
      return;
    }

    const $buttons = $('#taxonButtons').empty();
    taxonList.forEach(taxon => {
      const label = String(taxon);
      $buttons.append(
        `<button type="button" class="taxon-filter" data-taxon="${label}">${label}</button>`
      );
    });

    // Delegate click handler
    $buttons.off('click', '.taxon-filter').on('click', '.taxon-filter', function () {
      const taxon = $(this).data('taxon');

      $('.taxon-filter').removeClass('active');
      $(this).addClass('active');

      loadTaxonData(taxon);
    });

    // Auto-select the first taxon
    $buttons.find('.taxon-filter').first().trigger('click');
  } catch (err) {
    console.error('Error loading taxon list:', err);
  }
}

// Initialize on DOM ready
function initReferenceSearchTable() {
  loadTaxonList();
}

$(document).ready(initReferenceSearchTable);
