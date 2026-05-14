// src/components/InsightsPanel.jsx

const BEST_BY_YEAR = [
  { year: '2026', steps: 23707, date: '2026-04-25', label: 'Disclosure show',                           type: 'dancing'  },
  { year: '2025', steps: 38878, date: '2025-08-30', label: 'Arc Festival Day 2 in Chicago, Illinois',   type: 'festival' },
  { year: '2024', steps: 43182, date: '2024-07-26', label: 'Tomorrowland Day 2 in Boom, Belgium',       type: 'festival' },
  { year: '2023', steps: 24092, date: '2023-08-12', label: 'Matroda show',                              type: 'dancing'  },
  { year: '2022', steps: 28708, date: '2022-05-10', label: 'Inca Trail to Machu Picchu, Peru',          type: 'travel'   },
  { year: '2021', steps: 23293, date: '2021-05-22', label: 'Backpacking trip near Canon City, Colorado',type: 'hike'     },
  { year: '2020', steps: 17733, date: '2020-10-03', label: 'Hiking and camping in Moab, Utah',          type: 'hike'     },
  { year: '2019', steps: 21578, date: '2019-01-05', label: 'Porto, Portugal',                           type: 'travel'   },
  { year: '2018', steps: 22872, date: '2018-11-20', label: 'Salamanca, Spain',                          type: 'travel'   },
  { year: '2017', steps: 21966, date: '2017-07-20', label: 'Amsterdam, Netherlands',                    type: 'travel'   },
]

const ACTIVITY_SUMMARY = [
  { type: 'festival', label: 'Music festivals',    emoji: '🎪', avg: 30348, n: 8,  note: 'Tomorrowland & Arc' },
  { type: 'pride',    label: 'Pride',               emoji: '🌈', avg: 17053, n: 2,  note: 'Both pride events' },
  { type: 'hike',     label: 'Hiking days',         emoji: '🥾', avg: 15670, n: 36, note: '36 logged hike days' },
  { type: 'dancing',  label: 'Dancing nights',      emoji: '💃', avg: 13831, n: 30, note: '30 nights out' },
  { type: 'city',     label: 'NYC trips',           emoji: '🗽', avg: 9082,  n: 9,  note: '4 trips total' },
  { type: 'travel',   label: 'International travel',emoji: '✈️', avg: 6274,  n: 28, note: 'Transit days lower avg' },
]

const BASELINE = 3159

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
    travel:   { text: 'text-[#00897B]',  bar: 'bg-[#00C9B1]', badge: 'bg-[#00C9B1] text-[#1A0030]'  },
    festival: { text: 'text-[#F5A623]',  bar: 'bg-[#F5A623]', badge: 'bg-[#F5A623] text-[#1A0030]'  },
    hike:     { text: 'text-[#00897B]',  bar: 'bg-[#00C9B1]', badge: 'bg-[#00C9B1] text-[#1A0030]'  },
    dancing:  { text: 'text-[#4A0E8F]',  bar: 'bg-[#A78BFA]', badge: 'bg-[#A78BFA] text-white'       },
    pride:    { text: 'text-[#FF2D9B]',  bar: 'bg-[#FF2D9B]', badge: 'bg-[#FF2D9B] text-white'       },
    city:     { text: 'text-[#4A0E8F]',  bar: 'bg-[#DDD6FE]', badge: 'bg-[#DDD6FE] text-[#1A0030]'  },
  }[type] ?? { text: 'text-[#1A0030]', bar: 'bg-[#A78BFA]', badge: 'bg-[#EDE9FE] text-[#1A0030]' }
}

// ── Activity Breakdown ────────────────────────────────────────

function ActivityBreakdown() {
  const maxAvg = Math.max(...ACTIVITY_SUMMARY.map(a => a.avg))

  return (
    <div className="win shadow-y2k">
      <div className="win-bar justify-between">
        <span>What Gets You Moving</span>
        <div className="chrome-btns">
          <span className="chrome-btn">─</span>
          <span className="chrome-btn">✕</span>
        </div>
      </div>
      <div className="win-body flex flex-col gap-4">
        <p style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '12px' }}
           className="text-[#4A0E8F]">
          Compared to your all-time daily baseline of {BASELINE.toLocaleString()} steps
        </p>

        {ACTIVITY_SUMMARY.map((a, i) => {
          const pct   = Math.round((a.avg / maxAvg) * 100)
          const above = pctAbove(a.avg)
          const c     = typeColors(a.type)

          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{a.emoji}</span>
                  <span style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '15px', fontWeight: 700 }}
                        className="text-[#1A0030]">
                    {a.label}
                  </span>
                  <span style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '12px' }}
                        className="text-[#A78BFA] hidden sm:inline">
                    {a.note}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span style={{ fontFamily: '"VT323", monospace', fontSize: '20px' }}
                        className="text-[#1A0030] tabular-nums">
                    {a.avg.toLocaleString()}
                  </span>
                  <span className={`badge text-[9px] border-[#1A0030] ${c.badge}`}>
                    +{above}%
                  </span>
                </div>
              </div>
              <div className="bar-track">
                <div className={`bar-fill ${c.bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}

        <p style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '11px' }}
           className="text-[#A78BFA] border-t-2 border-[#DDD6FE] pt-3 mt-1">
          Baseline = {BASELINE.toLocaleString()} steps/day across 3,227 logged days
        </p>
      </div>
    </div>
  )
}

// ── Greatest Hits ─────────────────────────────────────────────

function GreatestHits() {
  const max = Math.max(...BEST_BY_YEAR.map(d => d.steps))

  return (
    <div className="win shadow-y2k">
      <div className="win-bar-amber justify-between">
        <span>Personal Record by Year</span>
        <div className="chrome-btns">
          <span className="chrome-btn">─</span>
          <span className="chrome-btn">✕</span>
        </div>
      </div>
      <div className="win-body flex flex-col gap-3">
        <p style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '12px' }}
           className="text-[#4A0E8F]">
          Your single best day each year and what you were doing
        </p>

        {BEST_BY_YEAR.map((day, i) => {
          const c      = typeColors(day.type)
          const pct    = Math.round((day.steps / max) * 100)
          const isPeak = day.steps === max

          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}
                        className={`w-10 shrink-0 tabular-nums ${c.text}`}>
                    {day.year}
                  </span>
                  <div>
                    <span style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '14px', fontWeight: 600 }}
                          className="text-[#1A0030]">
                      {day.label}
                    </span>
                    <span style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '12px' }}
                          className="text-[#A78BFA] ml-2">
                      {formatDate(day.date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isPeak && (
                    <span className="badge bg-[#F5A623] text-[#1A0030] border-[#1A0030] text-[9px]">
                      🏆 best ever
                    </span>
                  )}
                  <span style={{ fontFamily: '"VT323", monospace', fontSize: '22px' }}
                        className={`tabular-nums ${isPeak ? 'text-[#F5A623]' : 'text-[#1A0030]'}`}>
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

        <p style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '11px' }}
           className="text-[#A78BFA] border-t-2 border-[#DDD6FE] pt-3 mt-1">
          📈 Your personal best has grown 97% since 2017 — from 21,966 to 43,182 steps
        </p>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────

export default function InsightsPanel() {
  return (
    <section>
      <h2 className="section-label mb-4">Smart Insights</h2>
      <div className="flex flex-col gap-6">
        <ActivityBreakdown />
        <GreatestHits />
      </div>
    </section>
  )
}