// src/components/StepForm.jsx
// ─────────────────────────────────────────────────────────────
// Form for manually logging a step entry.
// Currently renders the layout; submit logic wired in Phase 2.
//
// Props:
//   onSubmit(entry) – called with a new entry object (Phase 2)
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function StepForm({ onSubmit }) {
  const [date,  setDate]  = useState(todayStr())
  const [steps, setSteps] = useState('')
  const [note,  setNote]  = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!onSubmit) return          // not wired yet
    const parsed = parseInt(steps, 10)
    if (!date || isNaN(parsed) || parsed < 0) return
    onSubmit({ id: crypto.randomUUID(), date, steps: parsed, note: note.trim() })
    setSteps('')
    setNote('')
  }

  return (
    <div className="card-padded">
      <h2 className="section-label mb-4">Log Steps</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Row 1: date + steps */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="sw-date">Date</label>
            <input
              id="sw-date"
              type="date"
              className="input"
              value={date}
              max={todayStr()}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="sw-steps">Steps</label>
            <input
              id="sw-steps"
              type="number"
              min="0"
              max="100000"
              placeholder="8 500"
              className="input"
              value={steps}
              onChange={e => setSteps(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: note */}
        <div>
          <label className="label" htmlFor="sw-note">Note <span className="text-slate-600">(optional)</span></label>
          <input
            id="sw-note"
            type="text"
            maxLength={120}
            placeholder="Morning jog, rainy day…"
            className="input"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!onSubmit}
          className="btn-primary mt-1 w-full"
        >
          Save Entry
        </button>

        {!onSubmit && (
          <p className="text-xs text-slate-600 text-center -mt-1">
            Submission wired in Phase 2
          </p>
        )}
      </form>
    </div>
  )
}
