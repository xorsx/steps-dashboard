// src/components/StepTable.jsx
import { useState } from 'react'
import { GOAL_10K, GOAL_5K, sortAsc } from '../utils/calculations.js'

function getGoalForDate(date) {
  return date >= '2026-01-01' ? GOAL_10K : GOAL_5K
}

export default function StepTable({ entries, onEdit, onDelete }) {
  const [open,    setOpen]    = useState(false)
  const [showAll, setShowAll] = useState(false)

  const filtered = showAll
    ? sortAsc(entries).reverse()
    : sortAsc(entries.filter(e => e.date.startsWith('2026'))).reverse()

  const totalCount    = entries.length
  const year2026Count = entries.filter(e => e.date.startsWith('2026')).length

  return (
    <section>
      {/* ── header — always visible ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between group mb-4"
      >
        <h2 className="section-label">Step Log</h2>
        <span className="badge bg-[#FF2D9B] text-white border-[#1A0030] text-[9px]">
          {open ? '▲ collapse' : '▼ expand'}
        </span>
      </button>

      {/* ── collapsible content ── */}
      {open && (
        <div className="flex flex-col gap-3">

          {/* year toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAll(false)}
              className={`btn-ghost text-xs py-1 ${!showAll ? 'bg-[#FF2D9B] text-white' : ''}`}
            >
              2026 only
            </button>
            <button
              onClick={() => setShowAll(true)}
              className={`btn-ghost text-xs py-1 ${showAll ? 'bg-[#FF2D9B] text-white' : ''}`}
            >
              All years ({totalCount.toLocaleString()})
            </button>
          </div>

          {/* table */}
          {filtered.length === 0 ? (
            <div className="win shadow-y2k">
              <div className="win-bar">No entries found</div>
              <div className="win-body text-center py-10"
                   style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '14px', color: '#4A0E8F' }}>
                No entries found.
              </div>
            </div>
          ) : (
            <div className="win shadow-y2k">
              <div className="win-bar-teal justify-between">
                <span>{showAll ? 'All Entries' : '2026 Entries'}</span>
                <span style={{ fontFamily: '"Pixelify Sans"', fontSize: '12px' }}>
                  {filtered.length} rows
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
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
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-[#EDE9FE]'}
                        >
                          <td className="tbl-cell font-mono text-xs whitespace-nowrap">
                            {entry.date}
                          </td>
                          <td className="tbl-cell text-right tabular-nums whitespace-nowrap">
                            <span style={{ fontFamily: '"VT323", monospace', fontSize: '20px' }}
                                  className={met ? 'text-[#00897B]' : 'text-[#1A0030]'}>
                              {entry.steps.toLocaleString()}
                            </span>
                          </td>
                          <td className="tbl-cell text-right tabular-nums hidden sm:table-cell whitespace-nowrap">
                            <span style={{ fontFamily: '"VT323", monospace', fontSize: '18px' }}
                                  className={met ? 'text-[#00897B]' : 'text-[#FF2D9B]'}>
                              {met ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                            </span>
                          </td>
                          <td className="tbl-cell hidden md:table-cell max-w-xs truncate text-[#4A0E8F]">
                            {entry.note || <span className="text-[#A78BFA]">—</span>}
                          </td>
                          <td className="tbl-cell text-right whitespace-nowrap">
                            <button
                              onClick={() => onEdit?.(entry)}
                              disabled={!onEdit}
                              className="btn-ghost text-[11px] px-2 py-0.5 disabled:cursor-not-allowed"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete?.(entry.id)}
                              disabled={!onDelete}
                              className="btn-ghost text-[11px] px-2 py-0.5 ml-1 disabled:cursor-not-allowed hover:bg-[#FF2D9B] hover:text-white"
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
            </div>
          )}
        </div>
      )}
    </section>
  )
}