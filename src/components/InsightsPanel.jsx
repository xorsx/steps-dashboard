// src/components/InsightsPanel.jsx

const ACTIVITY_SUMMARY = [
  { type: 'festival', label: 'Music festivals',    emoji: '🎪', avg: 30348, n: 8,  note: 'Tomorrowland & Arc' },
  { type: 'hike',     label: 'Hiking days',         emoji: '🥾', avg: 15670, n: 36, note: '36 logged hike days' },
  { type: 'pride',    label: 'Pride',               emoji: '🌈', avg: 17053, n: 2,  note: 'Both pride events' },
  { type: 'dancing',  label: 'Dancing nights',      emoji: '💃', avg: 13831, n: 30, note: '30 nights out' },
  { type: 'city',     label: 'NYC trips',           emoji: '🗽', avg: 9082,  n: 9,  note: '4 trips total' },
  { type: 'travel',   label: 'International travel',emoji: '✈️', avg: 6274,  n: 28, note: 'Transit days lower avg' },
]

const BASELINE = 3159

const TOP_DAYS = [
  { date: '2024-07-26', steps: 43182, label: 'Tomorrowland 2024' },
  { date: '2024-07-27', steps: 41541, label: 'Tomorrowland 2024' },
  { date: '2025-08-30', steps: 38878, label: 'Arc Festival 2025' },
  { date: '2025-09-07', steps: 37376, label: 'Hike' },
  { date: '2025-08-31', steps: 30355, label: 'Arc Festival 2025' },
  { date: '2024-07-28', steps: 29757, label: 'Tomorrowland 2024' },
  { date: '2024-10-19', steps: 29617, label: 'Hike' },
  { date: '2022-05-10', steps: 28708, label: 'Intl travel May 2022' },
  { date: '2025-08-29', steps: 27207, label: 'Arc Festival 2025' },
  { date: '2024-10-05', steps: 25931, label: 'Hike' },
]

function pctAbove(avg) {
  return Math.round(((avg - BASELINE) / BASELINE) * 100)
}

function formatDate(ds) {
  const [y, m, d] = ds.split('-')
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function typeColors(type) {
  return {
    travel:   { text: 'text-teal-400',    border: 'border-teal-500/20',    bg: 'bg-teal-500/5',    bar: 'bg-teal-500'    },
    festival: { text: 'text-amber-400',   border: 'border-amber-500/20',   bg: 'bg-amber-500/5',   bar: 'bg-amber-500'   },
    hike:     { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', bar: 'bg-emerald-500' },
    dancing:  { text: 'text-purple-400',  border: 'border-purple-500/20',  bg: 'bg-purple-500/5',  bar: 'bg-purple-500'  },
    pride:    { text: 'text-rose-400',    border: 'border-rose-500/20',    bg: 'bg-rose-500/5',    bar: 'bg-rose-500'    },
    city:     { text: 'text-blue-400',    border: 'border-blue-500/20',    bg: 'bg-blue-500/5',    bar: 'bg-blue-500'    },
  }[type] ?? { text: 'text-slate-400', border: 'border-slate-600', bg: 'bg-slate-800/40', bar: 'bg-slate-500' }
}

function InsightSection({ title, subtitle, children }) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="section-label">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function ActivityBreakdown() {
  const maxAvg = Math.max(...ACTIVITY_SUMMARY.map(a => a.avg))
  return (
    <InsightSection
      title="What Gets You Moving"
      subtitle={`Compared to your all-time daily baseline of ${BASELINE.toLocaleString()} steps`}
    >
      <div className="card-padded flex flex-col gap-3">
        {ACTIVITY_SUMMARY.map((a, i) => {
          const pct    = Math.round((a.avg / maxAvg) * 100)
          const above  = pctAbove(a.avg)
          const c      = typeColors(a.type)
          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{a.emoji}</span>
                  <span className="text-sm font-medium text-slate-200">{a.label}</span>
                  <span className="text-xs text-slate-600">{a.note}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-slate-300 tabular-nums">{a.avg.toLocaleString()} avg</span>
                  <span className={`badge text-[10px] border ${c.text} ${c.border} ${c.bg}`}>+{above}%</span>
                </div>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${c.bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
        <p className="text-xs text-slate-700 border-t border-slate-800 pt-3 mt-1">
          Baseline = {BASELINE.toLocaleString()} steps/day across 3,227 logged days
        </p>
      </div>
    </InsightSection>
  ) }
const BEST_BY_YEAR = [
  { year: '2026', steps: 23707, date: '2026-04-25', label: 'Disclosure show',                          type: 'dancing'  },
  { year: '2025', steps: 38878, date: '2025-08-30', label: 'Arc Festival Day 2 in Chicago, Illinois',  type: 'festival' },
  { year: '2024', steps: 43182, date: '2024-07-26', label: 'Tomorrowland Day 2 in Boom, Belgium',      type: 'festival' },
  { year: '2023', steps: 24092, date: '2023-08-12', label: 'Matroda show',                             type: 'dancing'  },
  { year: '2022', steps: 28708, date: '2022-05-10', label: 'Inca Trail to Machu Picchu, Peru',         type: 'travel'   },
  { year: '2021', steps: 23293, date: '2021-05-22', label: 'Backpacking trip near Canon City, Colorado', type: 'hike'   },
  { year: '2020', steps: 17733, date: '2020-10-03', label: 'Hiking and camping in Moab, Utah',         type: 'hike'     },
  { year: '2019', steps: 21578, date: '2019-01-05', label: 'Porto, Portugal',                          type: 'travel'   },
  { year: '2018', steps: 22872, date: '2018-11-20', label: 'Salamanca, Spain',                         type: 'travel'   },
  { year: '2017', steps: 21966, date: '2017-07-20', label: 'Amsterdam, Netherlands',                   type: 'travel'   },
]

function GreatestHits() {
  const max = Math.max(...BEST_BY_YEAR.map(d => d.steps))

  return (
    <InsightSection
      title="Personal Record by Year"
      subtitle="Your single best day each year and what you were doing"
    >
      <div className="card-padded flex flex-col gap-3">
        {BEST_BY_YEAR.map((day, i) => {
          const c      = typeColors(day.type)
          const pct    = Math.round((day.steps / max) * 100)
          const ispeak = day.steps === max

          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold w-8 shrink-0 tabular-nums ${c.text}`}>
                    {day.year}
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-200">{day.label}</span>
                    <span className="text-[11px] text-slate-600 ml-2">{formatDate(day.date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {ispeak && <span className="text-[10px] badge bg-amber-500/10 text-amber-400 border border-amber-500/20">all-time best</span>}
                  <span className={`text-sm font-bold tabular-nums ${ispeak ? 'text-amber-400' : 'text-slate-300'}`}>
                    {day.steps.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${c.bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}

        <p className="text-xs text-slate-700 border-t border-slate-800 pt-3 mt-1">
          📈 Your personal best has grown 97% since 2017 — from 21,966 to 43,182 steps
        </p>
      </div>
    </InsightSection>
  )
}



export default function InsightsPanel() {
  return (
    <section>
      <h2 className="section-label mb-3">Smart Insights</h2>
      <div className="flex flex-col gap-8">
  <ActivityBreakdown />
  <GreatestHits />
</div>
    </section>
  )
}
