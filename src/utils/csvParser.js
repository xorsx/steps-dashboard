// src/utils/csvParser.js
// Parses the four activity export CSVs from the Steps app.

// ── shared helper ─────────────────────────────────────────────
function parseActivityCsv(csvText, nameColumns) {
  const lines = csvText.trim().split('\n').map(l => l.trim()).filter(Boolean)
  // skip the "daily-activity-data;v1" style header row
  const dataLines = lines.filter(l => !l.match(/^[a-z]+-activity-data|^goals-data|^streak|^weight/i))
  return dataLines.map(line => {
    const cols = line.split(';').map(c => c.trim())
    const obj = {}
    nameColumns.forEach((name, i) => { obj[name] = cols[i] })
    return obj
  })
}

function cleanDate(raw) {
  return (raw || '').slice(0, 10) // "2017-07-15 00:00:00 +0000" → "2017-07-15"
}

// ── daily ─────────────────────────────────────────────────────
export function parseDailyCsv(csvText) {
  const rows = parseActivityCsv(csvText, ['date','steps','duration_s','distance_m','calories','floors'])
  const entries = []
  const errors = []
  rows.forEach((row, i) => {
    const date = cleanDate(row.date)
    const steps = parseInt(row.steps, 10)
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Row ${i + 1}: bad date "${row.date}"`)
      return
    }
    if (isNaN(steps) || steps < 0) {
      errors.push(`Row ${i + 1}: bad steps "${row.steps}"`)
      return
    }
    entries.push({ id: crypto.randomUUID(), date, steps, note: '' })
  })
  return { entries, errors }
}

// ── monthly ───────────────────────────────────────────────────
export function parseMonthlyCsv(csvText) {
  const rows = parseActivityCsv(csvText, ['date','steps'])
  return rows
    .map(row => ({ date: cleanDate(row.date), steps: parseInt(row.steps, 10) }))
    .filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && !isNaN(r.steps))
}

// ── yearly ────────────────────────────────────────────────────
export function parseYearlyCsv(csvText) {
  const rows = parseActivityCsv(csvText, ['date','steps'])
  return rows
    .map(row => ({ year: cleanDate(row.date).slice(0, 4), steps: parseInt(row.steps, 10) }))
    .filter(r => r.year && !isNaN(r.steps))
}

// ── streak ────────────────────────────────────────────────────
export function parseStreakCsv(csvText) {
  const rows = parseActivityCsv(csvText, ['goal_achieved','freeze_used','date'])
  return rows
    .map(row => ({
      date: cleanDate(row.date),
      achieved: row.goal_achieved?.trim() === 'true',
    }))
    .filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date))
}

// ── export helpers (for user-facing CSV download) ─────────────
export function entriesToCsv(entries) {
  const header = 'date,steps,note'
  const rows = entries.map(e => `${e.date},${e.steps},"${(e.note || '').replace(/"/g, '""')}"`)
  return [header, ...rows].join('\n')
}

export function downloadCsv(csvText, filename = 'stepwise-export.csv') {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}