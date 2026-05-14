// src/components/StepTable.jsx
import { useState } from 'react'
import { GOAL_10K, GOAL_5K, sortAsc } from '../utils/calculations.js'

function getGoalForDate(date) {
  return date >= '2026-01-01' ? GOAL_10K : GOAL_5K
}

export default function StepTable({ entries, onEdit, onDelete }) {
  const [open,     setOpen]     = useState(false)
  const [showAll,  setShowAll]  = useState(false)

  const filtered = showAll
    ? sortAsc(entries).reverse()
    : sortAsc(entries.filter(e => e.date.startsWith('2026'))).reverse()

  const totalCount  = entries.length
  const year2026Count = entries.filter(e => e.date.startsWith('2026')).length

  return (
    <section>
      {/* ── header row — always visible ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between group mb-3"
      >
        <div className="flex items-center gap-3">
          <h2 className="section-label">Step Log</h2>
          <span className="text-xs text-slate-600">
            {showAll ? totalCount.toLocaleString() : year2026Count} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
            {open ? 'collapse' : 'expand'}
          </span>
          <span className={`text-slate-600 group-hover:text-slate-400 transition-all duration-200 ${open ? 'rotate-180' : ''}`}>
            ↓
          </span>
        </div>
      </button>

      {/* ── collapsible content ── */}
      {open && (
        <div className="flex flex-col gap-3">

          {/* year toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAll(false)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                !showAll
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                  : 'border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              2026 only
            </button>
            <button
              onClick={() => setShowAll(true)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                showAll
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                  : 'border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              All years ({totalCount.toLocaleString()})
            </button>
          </div>

          {/* table */}
          {filtered.length === 0 ? (
            <div className="card-padded text-center text-slate-600 text-sm py-10">
              No entries found.
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="tbl-head">Date</th>
                    <th className="tbl-head text-right">Steps</th>
                    <th className="tbl-head text-right hidden sm:table-cell">vs Goal</th>
                    <th className="tbl-head hidden md:table-cell">Note</th>
                    <th className="tbl-head w-20" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry, idx) => {
                    const goal = getGoalForDate(entry.date)
                    const met  = entry.steps >= goal
                    const diff = entry.steps - goal
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b border-slate-800/40 transition-colors hover:bg-slate-800/30
                                    ${idx % 2 === 0 ? '' : 'bg-slate-800/10'}`}
                      >
                        <td className="tbl-cell font-mono text-xs text-slate-400 whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="tbl-cell text-right tabular-nums whitespace-nowrap">
                          <span className={`font-semibold ${met ? 'text-emerald-400' : 'text-slate-100'}`}>
                            {entry.steps.toLocaleString()}
                          </span>
                        </td>
                        <td className="tbl-cell text-right tabular-nums hidden sm:table-cell whitespace-nowrap">
                          <span className={`text-xs font-mono ${met ? 'text-emerald-500' : 'text-rose-400'}`}>
                            {met ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                          </span>
                        </td>
                        <td className="tbl-cell text-slate-500 text-xs hidden md:table-cell max-w-xs truncate">
                          {entry.note || <span className="text-slate-700">—</span>}
                        </td>
                        <td className="tbl-cell text-right whitespace-nowrap">
                          <button
                            onClick={() => onEdit?.(entry)}
                            disabled={!onEdit}
                            className="text-xs text-slate-600 hover:text-teal-400 disabled:cursor-not-allowed px-1.5 py-1 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete?.(entry.id)}
                            disabled={!onDelete}
                            className="text-xs text-slate-600 hover:text-rose-400 disabled:cursor-not-allowed px-1.5 py-1 rounded-lg transition-colors ml-0.5"
                          >
                            Del
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  )
}