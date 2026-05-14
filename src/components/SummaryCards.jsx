// src/components/SummaryCards.jsx
import { sortAsc } from '../utils/calculations.js'

const ANNUAL_GOAL  = 3_650_000
const MONTHLY_GOAL = 300_000

// ── helpers ───────────────────────────────────────────────────

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

function getDaysRemainingInYear() {
  const now = new Date()
  const end = new Date(now.getFullYear(), 11, 31)
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
}

function getDaysRemainingInMonth() {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return end.getDate() - now.getDate()
}

function getProjectedAnnual(annualTotal) {
  const doy = getDayOfYear()
  return doy ? Math.round((annualTotal / doy) * 365) : 0
}

function getPaceNeeded(annualTotal) {
  const remaining = ANNUAL_GOAL - annualTotal
  const days      = getDaysRemainingInYear()
  return remaining <= 0 ? 0 : Math.round(remaining / days)
}

function get10kDays(e26) {
  return e26.filter(e => e.steps >= 10000).length
}

function getBestMonth(e26) {
  const map = {}
  e26.forEach(e => {
    const ym = e.date.slice(0, 7)
    map[ym] = (map[ym] || 0) + e.steps
  })
  const entries = Object.entries(map)
  if (!entries.length) return { label: '—', total: 0 }
  const [ym, total] = entries.sort((a, b) => b[1] - a[1])[0]
  const [year, month] = ym.split('-')
  const label = new Date(Number(year), Number(month) - 1)
    .toLocaleString('default', { month: 'long' })
  return { label, total }
}

// ── card ──────────────────────────────────────────────────────

function Card({ label, value, sub, pct, barColor = 'bg-[#FF2D9B]', valueColor = 'text-[#1A0030]', badge, badgeColor = 'bg-[#DDD6FE] text-[#4A0E8F]' }) {
  // map any slate/emerald/teal/amber Tailwind classes to Y2K palette
  const barMap = {
    'bg-teal-500':    'bg-[#00C9B1]',
    'bg-emerald-500': 'bg-[#00C9B1]',
    'bg-amber-500':   'bg-[#F5A623]',
    'bg-slate-600':   'bg-[#A78BFA]',
  }
  const resolvedBar = barMap[barColor] ?? barColor

  return (
    <div className="win shadow-y2k">
      {/* title bar */}
      <div className="win-bar justify-between">
        <span className="truncate">{label}</span>
        <div className="chrome-btns ml-2 shrink-0">
          <span className="chrome-btn">─</span>
          <span className="chrome-btn">✕</span>
        </div>
      </div>

      {/* body */}
      <div className="win-body flex flex-col gap-2">
        {badge && (
          <span className={`badge text-[9px] self-start border-[#1A0030] ${badgeColor}`}>
            {badge}
          </span>
        )}

        <p style={{ fontFamily: '"VT323", monospace', fontSize: '2.2rem', lineHeight: 1 }}
           className={valueColor}>
          {value}
        </p>

        {sub && (
          <p style={{ fontFamily: '"Pixelify Sans", monospace', fontSize: '13px' }}
             className="text-[#4A0E8F] leading-snug">
            {sub}
          </p>
        )}

        {pct !== undefined && (
          <div className="bar-track mt-1">
            <div className={`bar-fill ${resolvedBar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── export ────────────────────────────────────────────────────

export default function SummaryCards({ entries }) {
  const e26           = get2026Entries(entries)
  const annualTotal   = getAnnualTotal(e26)
  const monthTotal    = getMonthTotal(e26)
  const days10k       = get10kDays(e26)
  const bestMonth     = getBestMonth(e26)
  const daysInYear    = getDayOfYear()

  const annualPct    = Math.round((annualTotal / ANNUAL_GOAL)  * 100)
  const monthPct     = Math.round((monthTotal  / MONTHLY_GOAL) * 100)

return (
  <section>

    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">

      <Card
        label="2026 Goal"
        value="820,656 / 3.65M"
        badge="22%"
        pct={22}
        barColor="bg-[#FF2D9B]"
        badgeColor="bg-[#4A0E8F] text-white"
      />

      <Card
        label="This Month"
        value={monthTotal.toLocaleString()}
        sub={`${monthTotal.toLocaleString()} / 300,000`}
        pct={monthPct}
        barColor={monthPct >= 100 ? 'bg-[#00C9B1]' : monthPct >= 50 ? 'bg-[#FF2D9B]' : 'bg-[#F5A623]'}
        badge={`${monthPct}%`}
        badgeColor={monthPct >= 75
          ? 'bg-[#00C9B1] text-[#1A0030]'
          : 'bg-[#F5A623] text-[#1A0030]'}
      />


      <Card
        label="10,000 Step Days"
        value={`${days10k} of ${daysInYear}`}
        sub="days at or above 10,000 steps"
        valueColor={days10k > 30 ? 'text-[#00897B]' : 'text-[#1A0030]'}
        pct={Math.round((days10k / daysInYear) * 100)}
        barColor="bg-[#00C9B1]"
      />

    </div>
  </section>
)
}