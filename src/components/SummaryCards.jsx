// src/components/SummaryCards.jsx

const ANNUAL_GOAL  = 3_650_000
const MONTHLY_GOAL = 300_000

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function get2026Entries(entries) {
  return entries.filter(e => e.date.startsWith('2026'))
}

function getAnnualTotal(e26) {
  return e26.reduce((s, e) => s + e.steps, 0)
}

function getMonthTotal(e26) {
  const ym = todayStr().slice(0, 7)
  return e26.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.steps, 0)
}

function getDayOfYear() {
  const now   = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

function get10kDays(e26) {
  return e26.filter(e => e.steps >= 10000).length
}

const ACTIVITY_DATES = {
  festival: [],
  hike:     ['2026-01-31'],
  dancing:  ['2026-02-07','2026-02-08','2026-03-13','2026-03-14','2026-03-27','2026-03-28','2026-04-03','2026-04-25'],
  travel:   [],
}

const ACTIVITY_META = {
  festival: { label: 'Music festivals', img: '/music_festival_hello_kitty.jpg', color: '#F5A623' },
  hike:     { label: 'Hiking',          img: '/hiker_hello_kitty.jpg',          color: '#00C9B1' },
  dancing:  { label: 'Dancing',         img: '/dancing_hello_kitty.jpg',        color: '#A78BFA' },
  travel:   { label: 'Travel',          img: '/traveling_hello_kitty.jpg',      color: '#FF2D9B' },
}

function getTopActivity2026(entries) {
  const totals = {}
  Object.entries(ACTIVITY_DATES).forEach(([type, dates]) => {
    totals[type] = dates.reduce((sum, date) => {
      const entry = entries.find(e => e.date === date)
      return sum + (entry ? entry.steps : 0)
    }, 0)
  })
  const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]
  return { type: top[0], steps: top[1], ...ACTIVITY_META[top[0]] }
}

// ── card ──────────────────────────────────────────────────────

function Card({ label, bigValue, sub, pct, barColor, barStyle, children }) {
  const color = barColor || '#FF2D9B'

  const barStyles = {
    pink:   'win-bar',
    amber:  'win-bar-amber',
    teal:   'win-bar-teal',
    purple: 'win-bar-purple',
  }

  const barClass = barStyles[barStyle] ?? 'win-bar'

  return (
    <div className="win">
      <div className={`${barClass} justify-between`}>
        <span>{label}</span>
        <div className="chrome-btns">
          <span className="chrome-btn">─</span>
          <span className="chrome-btn">✕</span>
        </div>
      </div>
      <div className="win-body flex flex-col items-center text-center gap-3">
        {children ? children : (
          <>
            <p style={{
              fontFamily: '"Bubblicious", sans-serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: 1,
              color: color,
              textShadow: `0 2px 12px ${color}55`,
            }}>
              {bigValue}
            </p>

            {sub && (
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                color: '#4A1A6B',
                lineHeight: 1.4,
              }}>
                {sub}
              </p>
            )}

            {pct !== undefined && (
              <div className="bar-track w-full mt-1">
                <div
                  className="bar-fill"
                  style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── export ────────────────────────────────────────────────────

export default function SummaryCards({ entries }) {
  const e26         = get2026Entries(entries)
  const annualTotal = getAnnualTotal(e26)
  const monthTotal  = getMonthTotal(e26)
  const days10k     = get10kDays(e26)
  const daysInYear  = getDayOfYear()
  const topActivity = getTopActivity2026(e26)

  const annualPct  = Math.round((annualTotal / ANNUAL_GOAL)  * 100)
  const monthPct   = Math.round((monthTotal  / MONTHLY_GOAL) * 100)
  const days10kPct = Math.round((days10k     / daysInYear)   * 100)

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card
          label="2026 Goal"
          bigValue={`${annualPct}%`}
          sub={`${annualTotal.toLocaleString()} / ${ANNUAL_GOAL.toLocaleString()} steps`}
          pct={annualPct}
          barColor="#FF2D9B"
          barStyle="#FF2D9B"
        />

        <Card
          label="This Month"
          bigValue={`${monthPct}%`}
          sub={`${monthTotal.toLocaleString()} / ${MONTHLY_GOAL.toLocaleString()} steps`}
          pct={monthPct}
          barColor="#F5A623"
          barStyle="amber"
        />

        <Card
          label="10k Step Days"
          bigValue={`${days10kPct}%`}
          sub={`${days10k} of ${daysInYear} days at or above 10,000 steps`}
          pct={days10kPct}
          barColor="#00C9B1"
          barStyle="teal"
        />

        <Card label="Most Active Doing"  barStyle="purple">
          <img
            src={topActivity.img}
            alt={topActivity.label}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '999px',
              border: '2.5px solid #1A0030',
              boxShadow: '0 4px 16px rgba(255,45,155,0.3)',
            }}
          />
          <p style={{
            fontFamily: '"Bubblicious", sans-serif',
            fontSize: 'clamp(20px, 2.5vw, 28px)',
            color: topActivity.color,
            lineHeight: 1.2,
            textShadow: `0 2px 8px ${topActivity.color}55`,
          }}>
            {topActivity.label}
          </p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#4A1A6B' }}>
            {topActivity.steps.toLocaleString()} steps in 2026
          </p>
        </Card>

      </div>
    </section>
  )
}