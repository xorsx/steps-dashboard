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

function Card({ label, value, sub, pct, barColor = 'bg-teal-500', valueColor = 'text-slate-50', badge, badgeColor = 'bg-slate-800 text-slate-400' }) {
  return (
    <div className="card-padded flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <span className="section-label">{label}</span>
        {badge && (
          <span className={`badge text-[10px] shrink-0 ${badgeColor}`}>{badge}</span>
        )}
      </div>

      <p className={`text-2xl font-bold tabular-nums leading-none ${valueColor}`}>
        {value}
      </p>

      {sub && <p className="text-xs text-slate-500 leading-snug">{sub}</p>}

      {pct !== undefined && (
        <div className="bar-track mt-auto">
          <div className={`bar-fill ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      )}
    </div>
  )
}

// ── export ────────────────────────────────────────────────────

export default function SummaryCards({ entries }) {
  const e26           = get2026Entries(entries)
  const annualTotal   = getAnnualTotal(e26)
  const monthTotal    = getMonthTotal(e26)
  const projected     = getProjectedAnnual(annualTotal)
  const paceNeeded    = getPaceNeeded(annualTotal)
  const days10k       = get10kDays(e26)
  const bestMonth     = getBestMonth(e26)
  const daysInYear    = getDayOfYear()
  const daysLeftMonth = getDaysRemainingInMonth()

  const annualPct    = Math.round((annualTotal / ANNUAL_GOAL)  * 100)
  const monthPct     = Math.round((monthTotal  / MONTHLY_GOAL) * 100)
  const projectedPct = Math.round((projected   / ANNUAL_GOAL)  * 100)

  const expectedByNow = Math.round((ANNUAL_GOAL / 365) * daysInYear)
  const paceDelta     = annualTotal - expectedByNow
  const paceDeltaStr  = paceDelta >= 0
    ? `+${Math.abs(paceDelta).toLocaleString()} ahead of pace`
    : `${Math.abs(paceDelta).toLocaleString()} behind pace`

  return (
    <section>
      <h2 className="section-label mb-3">2026 Snapshot</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">

        <Card
          label="Annual Progress"
          value={annualTotal.toLocaleString()}
          sub={`of ${ANNUAL_GOAL.toLocaleString()} · ${annualPct}% there`}
          pct={annualPct}
          barColor={annualPct >= 100 ? 'bg-emerald-500' : 'bg-teal-500'}
          badge="2026 goal"
          badgeColor="bg-teal-500/10 text-teal-400"
        />

        <Card
          label="This Month"
          value={monthTotal.toLocaleString()}
          sub={`of ${MONTHLY_GOAL.toLocaleString()} · ${daysLeftMonth}d left`}
          pct={monthPct}
          barColor={monthPct >= 100 ? 'bg-emerald-500' : monthPct >= 50 ? 'bg-teal-500' : 'bg-amber-500'}
          badge={`${monthPct}%`}
          badgeColor={monthPct >= 75 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}
        />

        <Card
          label="Daily Pace Needed"
          value={paceNeeded.toLocaleString()}
          sub={`steps/day to hit ${(ANNUAL_GOAL / 1_000_000).toFixed(2)}M`}
          valueColor={paceNeeded <= 10000 ? 'text-emerald-400' : paceNeeded <= 12000 ? 'text-amber-400' : 'text-rose-400'}
          badge={paceNeeded <= 10000 ? 'on track' : 'stretch'}
          badgeColor={paceNeeded <= 10000 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}
        />

        <Card
          label="Projected Total"
          value={`${(projected / 1_000_000).toFixed(2)}M`}
          sub={paceDeltaStr}
          valueColor={projected >= ANNUAL_GOAL ? 'text-emerald-400' : 'text-slate-50'}
          pct={projectedPct}
          barColor={projected >= ANNUAL_GOAL ? 'bg-emerald-500' : 'bg-slate-600'}
          badge={projected >= ANNUAL_GOAL ? '🎯 on track' : `${projectedPct}% of goal`}
          badgeColor={projected >= ANNUAL_GOAL ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-500'}
        />

        <Card
          label="10k Days"
          value={`${days10k} of ${daysInYear}`}
          sub="days at or above 10,000 steps"
          valueColor={days10k > 30 ? 'text-emerald-400' : 'text-slate-50'}
          pct={Math.round((days10k / daysInYear) * 100)}
          barColor="bg-emerald-500"
        />

        <Card
          label="Best Month"
          value={bestMonth.total.toLocaleString()}
          sub={`${bestMonth.label} · your 2026 high`}
          valueColor="text-amber-400"
          badge="🏆"
          badgeColor="bg-amber-500/10 text-amber-400"
        />

      </div>
    </section>
  )
}
