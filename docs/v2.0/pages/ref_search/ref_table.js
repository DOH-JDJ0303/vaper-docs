// assets/js/ref_search_table.js

// Requires:
// - jQuery
// - DataTables
// - DataTables Buttons + JSZip (for CSV export)

let dataTable = null;

// How many characters to show in the table display
const MAX_DISPLAY_CHARS = 60;

// Helper function to normalize taxon names (replace spaces with underscores)
function normalizeTaxonName(taxon) {
  return String(taxon).replace(/\s+/g, '_');
}

// Helper function to decompress gzip data
async function decompressGzip(response) {
  // Check if the browser supports DecompressionStream
  if (!window.DecompressionStream) {
    throw new Error('DecompressionStream not supported in this browser');
  }

  const stream = response.body
    .pipeThrough(new DecompressionStream('gzip'));
  
  const decompressedResponse = new Response(stream);
  return await decompressedResponse.text();
}

// Fetch and parse JSON, handling both regular and gzipped files
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  // Check if the file is gzipped based on URL or content-type
  const isGzipped = url.endsWith('.gz') || 
                    res.headers.get('content-encoding') === 'gzip';

  if (isGzipped && url.endsWith('.gz')) {
    // Manually decompress .gz files
    const text = await decompressGzip(res);
    return JSON.parse(text);
  } else {
    // Standard JSON parsing
    return await res.json();
  }
}

// Flatten a single record from a (now non-nested) JSON structure
function flattenRecord(rec) {
  const out = {};

  // Top-level fields
  out.name = [rec.taxon, rec.segment, rec.variant].join('-')

  // Arrays at top level -> comma-separated strings
  const arrayFields = [
    "accessions",
    "geographic_region",
    "host",
    "segment",
    "species",
    "tax_id",
    "taxon",
    "outlier"
  ];

  arrayFields.forEach(field => {
    const val = rec[field];
    if (Array.isArray(val)) {
      out[field] = val.join(", ");
    } else {
      out[field] = val ?? "";
    }
  });

  // collection_date can still be an object { min, max } at top level
  if (rec.collection_date && typeof rec.collection_date === "object") {
    out.collection_date_min = rec.collection_date.min ?? "";
    out.collection_date_max = rec.collection_date.max ?? "";
  } else {
    // or fall back to flat fields if you have them
    out.collection_date_min = rec.collection_date_min ?? "";
    out.collection_date_max = rec.collection_date_max ?? "";
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
    // Normalize taxon name for file lookup
    const normalizedTaxon = normalizeTaxonName(taxon);
    
    // Try .json.gz first, fall back to .json if not found
    let url = `data/taxon_jsons/${encodeURIComponent(normalizedTaxon)}.json.gz`;
    let json;
    
    try {
      json = await fetchJSON(url);
    } catch (err) {
      // If .gz fails, try regular .json
      console.log(`Gzipped file not found, trying uncompressed: ${err.message}`);
      url = `data/taxon_jsons/${encodeURIComponent(normalizedTaxon)}.json`;
      json = await fetchJSON(url);
    }

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
      "species",
      "segment",
      "outlier",
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
          title: `VAPER_${normalizedTaxon}_references`,
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
    // Try gzipped taxon list first
    let taxonList;
    try {
      taxonList = await fetchJSON('data/taxon_jsons/taxon_list.json.gz');
    } catch (err) {
      console.log('Gzipped taxon list not found, trying uncompressed');
      taxonList = await fetchJSON('data/taxon_jsons/taxon_list.json');
    }

    if (!Array.isArray(taxonList) || taxonList.length === 0) {
      console.warn('Taxon list is empty.');
      return;
    }

    const $buttons = $('#taxonButtons').empty();
    taxonList.forEach(taxon => {
      const label = String(taxon);
      const normalizedTaxon = normalizeTaxonName(taxon);
      $buttons.append(
        `<button type="button" class="taxon-filter" data-taxon="${normalizedTaxon}">${label}</button>`
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