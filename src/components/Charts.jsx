// src/components/Charts.jsx
import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts'
import {
  GOAL, GOAL_5K, GOAL_10K,
  getDailyChartData,
  getMonthlyChartData,
  getYearlyChartData,
} from '../utils/calculations.js'

const C = {
  pink:    '#FF2D9B',
  teal:    '#00C9B1',
  amber:   '#F5A623',
  purple:  '#A78BFA',
  muted:   '#C4B5FD',
  grid:    'rgba(167, 139, 250, 0.2)',
  text:    '#6D28D9',
  tooltip: 'rgba(255,255,255,0.95)',
}

const axisStyle = {
  tick:     { fill: C.text, fontSize: 11, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 },
  axisLine: false,
  tickLine: false,
}

function WindowTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(255,255,255,0.9)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(106,33,168,0.25), 0 2px 8px rgba(255,45,155,0.15)',
      overflow: 'hidden',
      minWidth: '160px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FF2D9B 0%, #d4006e 100%)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <span style={{ fontFamily: '"Bubblicious", sans-serif', fontSize: '12px', color: 'white' }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['─','✕'].map((s, i) => (
            <span key={i} style={{
              width: '12px', height: '12px', borderRadius: '999px',
              background: 'rgba(255,255,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '7px', color: 'rgba(255,255,255,0.8)', cursor: 'default',
            }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#6D28D9',
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Steps</span>
            <span style={{ fontFamily: '"VT323", monospace', fontSize: '22px', color: p.color || '#1A0030', lineHeight: 1 }}>
              {typeof p.value === 'number' ? p.value.toLocaleString() : p.value ?? 'No data'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children, barStyle = 'pink' }) {
  const bars = { pink: 'win-bar', teal: 'win-bar-teal', amber: 'win-bar-amber', purple: 'win-bar-purple' }
  return (
    <div className="win" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={bars[barStyle] ?? 'win-bar'}>
        <span style={{ fontFamily: '"Bubblicious", sans-serif', fontSize: 'clamp(14px, 1.8vw, 18px)' }}>
          {title}
        </span>
        <div className="chrome-btns">
          <span className="chrome-btn">─</span>
          <span className="chrome-btn">□</span>
          <span className="chrome-btn">✕</span>
        </div>
      </div>
      <div className="win-body" style={{ flex: 1 }}>
        {subtitle && (
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#6D28D9', marginBottom: '12px' }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

function Legend({ color, label, dashed }) {
  return (
    <div className="flex items-center gap-1.5">
      {dashed ? (
        <svg width="16" height="8" className="shrink-0">
          <line x1="0" y1="4" x2="16" y2="4" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
        </svg>
      ) : (
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
      )}
      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#6D28D9', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  )
}

function DailyChart({ entries }) {
  const data = getDailyChartData(entries, 30)
  return (
    <ChartCard title="Daily Steps — Last 30 Days" barStyle="pink">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="date" {...axisStyle} interval={5} />
          <YAxis {...axisStyle} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<WindowTooltip />} cursor={{ fill: 'rgba(167,139,250,0.15)' }} />
          <ReferenceLine y={GOAL} stroke={C.teal} strokeDasharray="5 3" strokeWidth={2} />
          <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.steps >= d.goal ? C.teal : C.pink} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3 flex-wrap">
        <Legend color={C.teal} label="Goal met" />
        <Legend color={C.pink} label="Below goal" />
        <Legend color={C.teal} label="10k line" dashed />
      </div>
    </ChartCard>
  )
}

function MonthlyProgressChart({ monthlyData }) {
  const MONTHLY_GOAL = 300_000
  const months = ['2026-01','2026-02','2026-03','2026-04','2026-05']
  const labels = ['January','February','March','April','May']

  const data = months.map((ym, i) => {
    const row   = monthlyData.find(r => r.date.startsWith(ym))
    const total = row ? row.steps : 0
    const pct   = Math.round((total / MONTHLY_GOAL) * 100)
    return { month: labels[i], total, goal: MONTHLY_GOAL, pct }
  })

  return (
    <ChartCard title="Monthly Totals — 2026" subtitle="Goal is 300,000 steps per month" barStyle="teal">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.grid} />
          <XAxis dataKey="month" {...axisStyle} />
          <YAxis {...axisStyle} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<WindowTooltip />} cursor={{ fill: 'rgba(167,139,250,0.15)' }} />
          <ReferenceLine y={MONTHLY_GOAL} stroke={C.pink} strokeDasharray="5 3" strokeWidth={2} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.total >= MONTHLY_GOAL ? C.teal : C.amber} fillOpacity={0.9} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-5 gap-1 mt-3">
        {data.map((d, i) => (
          <div key={i} className="text-center">
            <span style={{ fontFamily: '"VT323", monospace', fontSize: '20px',
                           color: d.pct >= 100 ? C.teal : d.pct >= 70 ? C.amber : C.pink }}>
              {d.pct}%
            </span>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#6D28D9', marginTop: '2px' }}>
              {d.total.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 flex-wrap">
        <Legend color={C.teal}  label="Goal met" />
        <Legend color={C.amber} label="Below goal" />
        <Legend color={C.pink}  label="300k line" dashed />
      </div>
    </ChartCard>
  )
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function YearlyAndMonthlyChart({ monthlyData, yearlyData }) {
  const yearlyChartData = getYearlyChartData(yearlyData)
  const [selectedYear, setSelectedYear] = useState(null)

  const monthlyDrillData = selectedYear
    ? MONTH_NAMES.map((name, i) => {
        const goal = selectedYear >= '2026' ? GOAL_10K : GOAL_5K
        const mm   = String(i + 1).padStart(2, '0')
        const row  = monthlyData.find(r => r.date.startsWith(`${selectedYear}-${mm}`))
        return {
          month: name,
          total: row ? row.steps : null,
          goal:  goal * new Date(Number(selectedYear), i + 1, 0).getDate(),
        }
      })
    : null

  const handleBarClick = (data) => {
    if (!data?.activePayload?.[0]) return
    const year = data.activePayload[0].payload.year
    setSelectedYear(prev => prev === year ? null : year)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div style={{ flex: selectedYear ? '0 0 auto' : '1', display: 'flex', flexDirection: 'column' }}>
        <ChartCard
          title="Yearly Step Totals"
          subtitle={selectedYear ? 'Click same bar or ✕ to close' : 'Click any bar for monthly breakdown'}
          barStyle="amber"
        >
          <ResponsiveContainer width="100%" height={selectedYear ? 180 : 260}>
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
              <Tooltip content={<WindowTooltip />} cursor={{ fill: 'rgba(167,139,250,0.15)' }} />
              <Bar dataKey="steps" radius={[6, 6, 0, 0]}>
                {yearlyChartData.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.steps >= d.goal ? C.teal : C.purple}
                    fillOpacity={selectedYear && d.year !== selectedYear ? 0.3 : 0.9}
                    stroke={d.year === selectedYear ? C.pink : 'transparent'}
                    strokeWidth={2}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <Legend color={C.teal}   label="Goal met" />
            <Legend color={C.purple} label="Below goal" />
            {selectedYear && (
              <button
                onClick={() => setSelectedYear(null)}
                style={{ fontFamily: '"DM Sans"', fontSize: '12px', color: '#6D28D9', marginLeft: 'auto', fontWeight: 600 }}
              >
                ✕ Close {selectedYear}
              </button>
            )}
          </div>
        </ChartCard>
      </div>

      {selectedYear && monthlyDrillData && (
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <ChartCard
            title={`${selectedYear} — Monthly Totals`}
            subtitle={`Goal was ${selectedYear >= '2026' ? '10,000' : '5,000'} steps/day`}
            barStyle="purple"
          >
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyDrillData} barCategoryGap="25%" margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis dataKey="month" {...axisStyle} />
                <YAxis {...axisStyle} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<WindowTooltip />} cursor={{ fill: 'rgba(167,139,250,0.15)' }} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {monthlyDrillData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.total === null ? C.muted : d.total >= d.goal ? C.teal : C.pink}
                      fillOpacity={d.total === null ? 0.3 : 0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 flex-wrap">
              <Legend color={C.teal}  label="Goal met" />
              <Legend color={C.pink}  label="Below goal" />
              <Legend color={C.muted} label="No data" />
            </div>
          </ChartCard>
        </div>
      )}
    </div>
  )
}

export default function Charts({ entries, monthlyData, yearlyData }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <img
          src="/glasses_hello_kitty.jpg"
          alt="hello kitty with glasses"
          style={{
            width: '56px', height: '56px', objectFit: 'cover',
            borderRadius: '999px', border: '2px solid #FF2D9B',
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
          Data Breakdown
        </h2>
        <img
          src="/glasses_hello_kitty.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width: '56px', height: '56px', objectFit: 'cover',
            borderRadius: '999px', border: '2px solid #FF2D9B',
            boxShadow: '0 0 16px rgba(255,45,155,0.4)',
            transform: 'scaleX(-1)',
          }}
        />
      </div>

      <div className="flex flex-col gap-4">
        <DailyChart entries={entries} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <MonthlyProgressChart monthlyData={monthlyData} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <YearlyAndMonthlyChart monthlyData={monthlyData} yearlyData={yearlyData} />
          </div>
        </div>
      </div>
    </section>
  )
}