// src/components/Charts.jsx
import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts'
import {
  GOAL, GOAL_5K, GOAL_10K,
  getDailyChartData,
  getWeekdayAverages,
  getMonthlyChartData,
  getYearlyChartData,
} from '../utils/calculations.js'

// ── palette ───────────────────────────────────────────────────
const C = {
  teal:    '#2dd4bf',
  emerald: '#34d399',
  amber:   '#fbbf24',
  muted:   '#475569',
  grid:    '#1e293b',
  text:    '#64748b',
  tooltip: '#1e293b',
}

const axisStyle = {
  tick:     { fill: C.text, fontSize: 10, fontFamily: 'Plus Jakarta Sans, sans-serif' },
  axisLine: false,
  tickLine: false,
}

const tooltipStyle = {
  backgroundColor: C.tooltip,
  border: '1px solid #334155',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#e2e8f0',
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card-padded">
      <div className="mb-5">
        <h3 className="section-label">{title}</h3>
        {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Legend({ color, label, dashed }) {
  return (
    <div className="flex items-center gap-1.5">
      {dashed ? (
        <svg width="16" height="8" className="shrink-0">
          <line x1="0" y1="4" x2="16" y2="4" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>
      ) : (
        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
      )}
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  )
}

// ── 1. Daily ──────────────────────────────────────────────────
function DailyChart({ entries }) {
  const data = getDailyChartData(entries, 30)
  return (
    <ChartCard title="Daily Steps — Last 30 Days">
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="date" {...axisStyle} interval={5} />
          <YAxis {...axisStyle} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={v => [v.toLocaleString(), 'Steps']}
            cursor={{ fill: '#1e293b' }}
          />
          <ReferenceLine y={GOAL} stroke={C.emerald} strokeDasharray="4 3" strokeWidth={1.5} />
          <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.steps >= d.goal ? C.emerald : C.teal} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <Legend color={C.emerald} label="Goal met" />
        <Legend color={C.teal}    label="Below goal" />
        <Legend color={C.emerald} label="Goal line" dashed />
      </div>
    </ChartCard>
  )
}

// ── 2. Monthly Progress────────────────────────────────────────────────
function MonthlyProgressChart({ monthlyData }) {
  const MONTHLY_GOAL = 300_000
  const months = ['2026-01','2026-02','2026-03','2026-04']
  const labels  = ['January','February','March','April']

  const data = months.map((ym, i) => {
    const row   = monthlyData.find(r => r.date.startsWith(ym))
    const total = row ? row.steps : 0
    const pct   = Math.round((total / MONTHLY_GOAL) * 100)
    return { month: labels[i], total, goal: MONTHLY_GOAL, pct }
  })

  return (
    <ChartCard
      title="Monthly Totals — 2026"
      subtitle="Jan – Apr · goal is 300,000 steps per month"
    >
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="month" {...axisStyle} />
          <YAxis {...axisStyle} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={v => [v.toLocaleString(), 'Total steps']}
            cursor={{ fill: '#1e293b' }}
          />
          <ReferenceLine y={MONTHLY_GOAL} stroke={C.emerald} strokeDasharray="4 3" strokeWidth={1.5} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.total >= MONTHLY_GOAL ? C.emerald : C.teal}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* % of goal labels under each bar */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <span className={`text-xs font-semibold tabular-nums ${
              d.pct >= 100 ? 'text-emerald-400' : d.pct >= 70 ? 'text-teal-400' : 'text-amber-400'
            }`}>
              {d.pct}%
            </span>
            <p className="text-[10px] text-slate-600 mt-0.5">{d.total.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-2">
        <Legend color={C.emerald} label="Goal met" />
        <Legend color={C.teal}    label="Below goal" />
        <Legend color={C.emerald} label="300k line" dashed />
      </div>
    </ChartCard>
  )
}

// ── 3. Yearly + Monthly drill-down ────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function YearlyAndMonthlyChart({ monthlyData, yearlyData }) {
  const yearlyChartData = getYearlyChartData(yearlyData)
  const [selectedYear, setSelectedYear] = useState(null)

  const monthlyDrillData = selectedYear
    ? (() => {
        const goal = selectedYear >= '2026' ? GOAL_10K : GOAL_5K
        return MONTH_NAMES.map((name, i) => {
          const mm  = String(i + 1).padStart(2, '0')
          const key = `${selectedYear}-${mm}`
          const row = monthlyData.find(r => r.date.startsWith(key))
          const daysInMonth = new Date(selectedYear, i + 1, 0).getDate()
          return {
            month: name,
            total: row ? row.steps : null,
            goal:  goal * daysInMonth,
          }
        })
      })()
    : null

  const handleBarClick = (data) => {
    if (!data?.activePayload?.[0]) return
    const year = data.activePayload[0].payload.year
    setSelectedYear(prev => prev === year ? null : year)
  }

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        title="Yearly Step Totals"
        subtitle={selectedYear
          ? `Click a bar to switch year · click same bar or ✕ to close`
          : 'Click any bar to see monthly breakdown'}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={yearlyChartData}
            barCategoryGap="25%"
            margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
            onClick={handleBarClick}
            style={{ cursor: 'pointer' }}
          >
            <CartesianGrid vertical={false} stroke={C.grid} />
            <XAxis dataKey="year" {...axisStyle} />
            <YAxis {...axisStyle} tickFormatter={v => `${(v / 1_000_000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={v => [v.toLocaleString(), 'Total steps']}
              cursor={{ fill: '#1e293b' }}
            />
            <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
              {yearlyChartData.map((d, i) => (
                <Cell
                  key={i}
                  fill={d.steps >= d.goal ? C.emerald : C.teal}
                  fillOpacity={selectedYear && d.year !== selectedYear ? 0.25 : 0.9}
                  stroke={d.year === selectedYear ? C.amber : 'transparent'}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3">
          <Legend color={C.emerald} label="Goal met" />
          <Legend color={C.teal}    label="Below goal" />
          {selectedYear && (
            <button
              onClick={() => setSelectedYear(null)}
              className="ml-auto text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              ✕ Close {selectedYear}
            </button>
          )}
        </div>
      </ChartCard>

      {selectedYear && monthlyDrillData && (
        <ChartCard
          title={`${selectedYear} — Monthly Totals`}
          subtitle={`Goal was ${selectedYear >= '2026' ? '10,000' : '5,000'} steps/day`}
        >
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={monthlyDrillData}
              barCategoryGap="25%"
              margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke={C.grid} />
              <XAxis dataKey="month" {...axisStyle} />
              <YAxis {...axisStyle} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={v => [v ? v.toLocaleString() : 'No data', 'Total steps']}
                cursor={{ fill: '#1e293b' }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {monthlyDrillData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.total === null ? C.muted : d.total >= d.goal ? C.emerald : C.teal}
                    fillOpacity={d.total === null ? 0.2 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <Legend color={C.emerald} label="Goal met" />
            <Legend color={C.teal}    label="Below goal" />
            <Legend color={C.muted}   label="No data" />
          </div>
        </ChartCard>
      )}
    </div>
  )
}

// ── main export ───────────────────────────────────────────────
export default function Charts({ entries, monthlyData, yearlyData }) {
  return (
    <section>
      <h2 className="section-label mb-3">Charts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <DailyChart entries={entries} />
        </div>
        <MonthlyProgressChart monthlyData={monthlyData} />
        <div className="lg:col-span-1">
          <YearlyAndMonthlyChart monthlyData={monthlyData} yearlyData={yearlyData} />
        </div>
      </div>
    </section>
  )
}