// src/components/InsightsPanel.jsx
import { useState, useEffect, useRef } from 'react'

const BEST_BY_YEAR = [
  { year: '2026', steps: 27707, date: '2026-05-16', label: 'Chris Stussy at Junkyard', type: 'dancing' },
  { year: '2025', steps: 38878, date: '2025-08-30', label: 'Arc Festival Day 2 in Chicago, Illinois',    type: 'festival' },
  { year: '2024', steps: 43182, date: '2024-07-26', label: 'Tomorrowland Day 2 in Boom, Belgium',        type: 'festival' },
  { year: '2023', steps: 24092, date: '2023-08-12', label: 'Matroda show',                               type: 'dancing'  },
  { year: '2022', steps: 28708, date: '2022-05-10', label: 'Inca Trail to Machu Picchu, Peru',           type: 'hike'     },
  { year: '2021', steps: 23293, date: '2021-05-22', label: 'Backpacking trip near Canon City, Colorado', type: 'hike'     },
  { year: '2020', steps: 17733, date: '2020-10-03', label: 'Hiking and camping in Moab, Utah',           type: 'hike'     },
  { year: '2019', steps: 21578, date: '2019-01-05', label: 'Porto, Portugal',                            type: 'travel'   },
  { year: '2018', steps: 22872, date: '2018-11-20', label: 'Salamanca, Spain',                           type: 'travel'   },
  { year: '2017', steps: 21966, date: '2017-07-20', label: 'Amsterdam, Netherlands',                     type: 'travel'   },
]

const ACTIVITY_SUMMARY = [
  { type: 'festival', label: 'Music festivals',     img: '/music_festival_hello_kitty.jpg', avg: 30348, n: 8,   note: 'Tomorrowland & Arc' },
  { type: 'hike',     label: 'Hiking days',         img: '/hiker_hello_kitty.jpg',          avg: 15670, n: 36,  note: '36 logged hike days' },
  { type: 'dancing',  label: 'Dancing nights',      img: '/dancing_hello_kitty.jpg',        avg: 13831, n: 30,  note: '30 nights out' },
  { type: 'travel',   label: 'Travel & city trips', img: '/traveling_hello_kitty.jpg',      avg: 9824,  n: 210, note: 'Active days only, transit excluded' },
]

const BASELINE = 3159

const TYPE_IMAGES = {
  festival: '/music_festival_hello_kitty.jpg',
  hike:     '/hiker_hello_kitty.jpg',
  dancing:  '/dancing_hello_kitty.jpg',
  travel:   '/traveling_hello_kitty.jpg',
}

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
    travel:   { bar: '#FF2D9B', badgeBg: '#FF2D9B', badgeText: 'white'   },
    festival: { bar: '#F5A623', badgeBg: '#F5A623', badgeText: '#1A0030' },
    hike:     { bar: '#00C9B1', badgeBg: '#00C9B1', badgeText: '#1A0030' },
    dancing:  { bar: '#A78BFA', badgeBg: '#A78BFA', badgeText: 'white'   },
  }[type] ?? { bar: '#A78BFA', badgeBg: '#EDE9FE', badgeText: '#1A0030' }
}

function InsightSection({ title, subtitle, children, barStyle = 'purple' }) {
  const bars = {
    pink:   'win-bar',
    teal:   'win-bar-teal',
    amber:  'win-bar-amber',
    purple: 'win-bar-purple',
  }
  return (
    <div className="win">
      {title && (
        <div className={bars[barStyle] ?? 'win-bar-purple'}>
          <span>{title}</span>
          <div className="chrome-btns">
            <span className="chrome-btn">─</span>
            <span className="chrome-btn">✕</span>
          </div>
        </div>
      )}
      <div className="win-body flex flex-col gap-2">
        {subtitle && (
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6D28D9', marginBottom: '8px' }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

// ── Activity Breakdown ────────────────────────────────────────

function ActivityBreakdown() {
  const maxAvg = Math.max(...ACTIVITY_SUMMARY.map(a => a.avg))

  return (
    <InsightSection
      title="˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮"
      subtitle={`Compared to your all-time daily baseline of ${BASELINE.toLocaleString()} steps`}
      barStyle="pink"
    >
      <div className="flex flex-col gap-4">
        {ACTIVITY_SUMMARY.map((a, i) => {
          const pct   = Math.round((a.avg / maxAvg) * 100)
          const above = pctAbove(a.avg)
          const c     = typeColors(a.type)

          return (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={a.img}
                    alt={a.label}
                    style={{
                      width: '36px',
                      height: '36px',
                      objectFit: 'cover',
                      borderRadius: '999px',
                      border: '1.5px solid #1A0030',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: 700 }}
                        className="text-[#1A0030]">
                    {a.label}
                  </span>
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px' }}
                        className="text-[#A78BFA] hidden sm:inline">
                    {a.note}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span style={{ fontFamily: '"VT323", monospace', fontSize: '20px' }}
                        className="text-[#1A0030] tabular-nums">
                    {a.avg.toLocaleString()} avg
                  </span>
                  <span
                    className="badge text-[9px]"
                    style={{ background: c.badgeBg, color: c.badgeText, border: '1px solid #1A0030' }}
                  >
                    +{above}%
                  </span>
                </div>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%`, background: c.bar }} />
              </div>
            </div>
          )
        })}

        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '11px',
          color: '#A78BFA',
          borderTop: '1px solid rgba(167,139,250,0.3)',
          paddingTop: '12px',
          marginTop: '4px',
        }}>
          Baseline = {BASELINE.toLocaleString()} steps/day across 3,227 logged days
        </p>
      </div>
    </InsightSection>
  )
}

// ── Greatest Hits ─────────────────────────────────────────────

function GreatestHits() {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const max = Math.max(...BEST_BY_YEAR.map(d => d.steps))

  return (
    <InsightSection
    title="˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮˙⋆✮"
      subtitle="Your single best day each year and what you were doing"
      barStyle="amber"
    >
      <div ref={ref} className="flex flex-col gap-4">
        {BEST_BY_YEAR.map((day, i) => {
          const c      = typeColors(day.type)
          const pct    = Math.round((day.steps / max) * 100)
          const isPeak = day.steps === max
          const img    = TYPE_IMAGES[day.type]

          return (
            <div key={i} className="flex flex-col gap-1.5">

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span style={{
                    fontFamily: '"Bubblicious", sans-serif',
                    fontSize: '30px',
                    width: '70px',
                    minWidth: '70px',
                    flexShrink: 0,
                    color: c.bar,
                  }}>
                    {day.year}
                  </span>
                  <div>
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 600 }}
                          className="text-[#1A0030]">
                      {day.label}
                    </span>
                    <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#A78BFA', marginLeft: '8px' }}>
                      {formatDate(day.date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isPeak && (
                    <span className="badge text-[9px]"
                          style={{ background: '#F5A623', color: '#1A0030', border: '1px solid #1A0030' }}>
                      🏆 best ever
                    </span>
                  )}
                  <span style={{ fontFamily: '"VT323", monospace', fontSize: '22px',
                                 color: isPeak ? '#F5A623' : '#1A0030' }}
                        className="tabular-nums">
                    {day.steps.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ position: 'relative', height: '28px', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '10px',
                  borderRadius: '999px',
                  background: 'rgba(167,139,250,0.25)',
                  position: 'relative',
                  overflow: 'visible',
                }}>
                  <div style={{
                    width: animated ? `${pct}%` : '0%',
                    height: '10px',
                    borderRadius: '999px',
                    background: c.bar,
                    transition: `width 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.1}s`,
                    position: 'relative',
                    overflow: 'visible',
                  }}>
                    {img && (
                      <img
                        src={img}
                        alt=""
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          right: '-14px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '28px',
                          height: '28px',
                          borderRadius: '999px',
                          objectFit: 'cover',
                          border: `2px solid ${c.bar}`,
                          boxShadow: `0 2px 8px ${c.bar}88`,
                          background: 'white',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

            </div>
          )
        })}

        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '11px',
          color: '#A78BFA',
          borderTop: '1px solid rgba(167,139,250,0.3)',
          paddingTop: '12px',
          marginTop: '4px',
        }}>
          📈 Your personal best has grown 97% since 2017 — from 21,966 to 43,182 steps
        </p>
      </div>
    </InsightSection>
  )
}

// ── Main export ───────────────────────────────────────────────

export default function InsightsPanel() {
  return (
    <section>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', 
              gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
  <img
    src="/kitty_dance.gif"
    alt="dancing hello kitty"
    style={{
      width: '64px',
      height: '64px',
      objectFit: 'cover',
      borderRadius: '999px',
      border: '2px solid #FF2D9B',
      boxShadow: '0 0 16px rgba(255,45,155,0.4)',
    }}
  />
  <h2 style={{
    fontFamily: '"Bubblicious", sans-serif',
    fontSize: 'clamp(28px, 5vw, 48px)',
    color: 'white',
    textAlign: 'center',
    textShadow: '0 2px 20px rgba(255,45,155,0.5), 0 0 40px rgba(124,58,237,0.4)',
  }}>
    What Gets You Moving
  </h2>
  <img
    src="/kuromi_dance.gif"
    alt="dancing kuromi"
    style={{
      width: '64px',
      height: '64px',
      objectFit: 'cover',
      borderRadius: '999px',
      border: '2px solid #A78BFA',
      boxShadow: '0 0 16px rgba(167,139,250,0.4)',
    }}
  />
</div>
      <div className="flex flex-col gap-6">
        <ActivityBreakdown />

        <h2 style={{
          fontFamily: '"Bubblicious", sans-serif',
          fontSize: 'clamp(28px, 5vw, 48px)',
          color: 'white',
          textAlign: 'center',
          textShadow: '0 2px 20px rgba(255,45,155,0.5), 0 0 40px rgba(124,58,237,0.4)',
          marginTop: '24px',
          marginBottom: '24px',
        }}>
          Personal Record by Year
        </h2>
        <GreatestHits />
      </div>
    </section>
  )
}