// ============================================================
// LNS APPS SCRIPT — Full replacement
// Handles: downtime reports (doPost) + HMI scans + data fetch (doGet)
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'hmi') return handleHMI(data);
    return handleReport(data);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── DOWNTIME REPORT ──────────────────────────────────────────
function handleReport(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName('Reports');
  if (!sheet) { sheet = ss.getActiveSheet(); }

  const row = [
    new Date().toLocaleString(),
    String(data.id         || ''),
    String(data.stopType   || ''),
    String(data.equipment  || ''),
    String(data.machine    || ''),
    String(data.unit       || ''),
    String(data.assembly   || ''),
    String(data.dateRaw    || ''),
    String(data.startRaw   || ''),
    String(data.endRaw     || '-'),
    String(data.resolved   || ''),
    String(data.phenomenon || ''),
    String(data.rootCause  || ''),
    String(data.actionTaken|| ''),
    (data.downtimeMinutes != null && data.downtimeMinutes !== '-')
      ? Number(data.downtimeMinutes) : '-'
  ];

  const existingRow = findRowById(sheet, data.id);
  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]) === String(id)) return i + 1;
  }
  return -1;
}

// ── HMI SCAN ─────────────────────────────────────────────────
function handleHMI(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName('HMI Counts');

  // Create sheet + headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('HMI Counts');
    sheet.appendRow([
      'Timestamp', 'Equipment', 'Scanned By',
      'Upper Up Cutter', 'Upper Lo Cutter',
      'Center Up Cutter', 'Center Lo Cutter',
      'Final Up Cutter',  'Final Lo Cutter',
      'Upper Limit SV', 'Center Limit SV', 'Final Limit SV',
      'Upper Warning SV', 'Center Warning SV', 'Final Warning SV',
      'Notes'
    ]);
  }

  sheet.appendRow([
    new Date().toLocaleString(),
    String(data.equipment   || '1-H'),
    String(data.scannedBy   || ''),
    Number(data.upperUpCutter   || 0),
    Number(data.upperLoCutter   || 0),
    Number(data.centerUpCutter  || 0),
    Number(data.centerLoCutter  || 0),
    Number(data.finalUpCutter   || 0),
    Number(data.finalLoCutter   || 0),
    Number(data.upperLimitSV    || 0),
    Number(data.centerLimitSV   || 0),
    Number(data.finalLimitSV    || 0),
    Number(data.upperWarningSV  || 0),
    Number(data.centerWarningSV || 0),
    Number(data.finalWarningSV  || 0),
    String(data.notes       || '')
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── GET (dashboard fetch) ─────────────────────────────────────
function doGet(e) {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const action = e && e.parameter && e.parameter.action;

  // Fetch HMI counts
  if (action === 'getHMI') {
    const sheet = ss.getSheetByName('HMI Counts');
    if (!sheet) return json({ status: 'success', data: [] });
    const rows = sheet.getDataRange().getValues();
    return json({ status: 'success', data: stringify2D(rows.slice(1)) });
  }

  // Default: fetch downtime reports
  let sheet = ss.getSheetByName('Reports');
  if (!sheet) sheet = ss.getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  return json({ status: 'success', data: stringify2D(rows.slice(1)) });
}

function stringify2D(rows) {
  return rows.map(row => row.map(cell => {
    if (cell instanceof Date) {
      const y   = cell.getFullYear();
      const mo  = String(cell.getMonth()+1).padStart(2,'0');
      const d   = String(cell.getDate()).padStart(2,'0');
      const h   = String(cell.getHours()).padStart(2,'0');
      const min = String(cell.getMinutes()).padStart(2,'0');
      return (h === '00' && min === '00') ? `${y}-${mo}-${d}` : `${y}-${mo}-${d}T${h}:${min}`;
    }
    return cell;
  }));
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
