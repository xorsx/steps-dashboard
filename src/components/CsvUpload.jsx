// src/components/CsvUpload.jsx
// ─────────────────────────────────────────────────────────────
// Drag-or-click CSV upload panel.
// Upload + parse logic wired in Phase 3.
//
// Props:
//   onImport(entries) – called with parsed entries array (Phase 3)
// ─────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'

export default function CsvUpload({ onImport }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)

  function handleFile(file) {
    if (!file || !onImport) return
    setFileName(file.name)
    // Phase 3: parse and call onImport
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="card-padded">
      <h2 className="section-label mb-4">Import CSV</h2>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
          cursor-pointer select-none py-7 px-4 text-center transition-colors duration-150
          ${dragging
            ? 'border-teal-500 bg-teal-500/5'
            : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/30'}
        `}
      >
        <span className="text-2xl" aria-hidden>📂</span>
        {fileName ? (
          <p className="text-sm text-teal-400 font-medium">{fileName}</p>
        ) : (
          <>
            <p className="text-sm text-slate-400">Drop a CSV file here</p>
            <p className="text-xs text-slate-600">or click to browse</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Format hint */}
      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
        Expected columns: <span className="text-slate-500 font-mono">date</span>,{' '}
        <span className="text-slate-500 font-mono">steps</span>,{' '}
        <span className="text-slate-500 font-mono">note</span> (optional)
      </p>

      {!onImport && (
        <p className="text-xs text-slate-700 mt-2">Import wired in Phase 3</p>
      )}
    </div>
  )
}
