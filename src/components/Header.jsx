// src/components/Header.jsx
// ─────────────────────────────────────────────────────────────
// Top navigation bar.
// Props:
//   onLogClick  – called when "+ Log Steps" is pressed (Phase 2)
//   onExport    – called when "Export CSV" is pressed (Phase 3)
// ─────────────────────────────────────────────────────────────

export default function Header({ onLogClick, onExport }) {
  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xl select-none" aria-hidden>🥾</span>
          <span className="font-bold text-slate-50 tracking-tight text-lg leading-none">
            Step<span className="text-teal-400">Wise</span>
          </span>
          <span className="hidden sm:inline badge bg-slate-800 text-slate-500 ml-1">10k</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            disabled={!onExport}
            className="btn-ghost text-xs py-1.5 hidden sm:flex"
          >
            ↓ Export CSV
          </button>

          <button
            onClick={onLogClick}
            disabled={!onLogClick}
            className="btn-primary text-xs py-1.5"
          >
            <span className="text-base leading-none font-bold">+</span>
            Log Steps
          </button>
        </div>
      </div>
    </header>
  )
}
