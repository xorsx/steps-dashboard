// src/App.jsx
import { useState, useEffect } from 'react'
import Header        from './components/Header.jsx'
import SummaryCards  from './components/SummaryCards.jsx'
import Charts        from './components/Charts.jsx'
import InsightsPanel from './components/InsightsPanel.jsx'
import StepTable     from './components/StepTable.jsx'
import {
  parseDailyCsv,
  parseMonthlyCsv,
  parseYearlyCsv,
  parseStreakCsv,
} from './utils/csvParser.js'
import { buildStreakHistory } from './utils/calculations.js'

export default function App() {
  const [entries,       setEntries]       = useState([])
  const [monthlyData,   setMonthlyData]   = useState([])
  const [yearlyData,    setYearlyData]    = useState([])
  const [streakHistory, setStreakHistory] = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)

  useEffect(() => {
    async function loadAll() {
      try {
        const [dailyRes, monthlyRes, yearlyRes, streakRes] = await Promise.all([
          fetch('/activity-export-daily.csv'),
          fetch('/activity-export-monthly.csv'),
          fetch('/activity-export-yearly.csv'),
          fetch('/activity-export-streak.csv'),
        ])

        const [dailyText, monthlyText, yearlyText, streakText] = await Promise.all([
          dailyRes.text(),
          monthlyRes.text(),
          yearlyRes.text(),
          streakRes.text(),
        ])

        const { entries: dailyEntries } = parseDailyCsv(dailyText)
        const monthly  = parseMonthlyCsv(monthlyText)
        const yearly   = parseYearlyCsv(yearlyText)
        const streakRows = parseStreakCsv(streakText)
        const streakHist = buildStreakHistory(streakRows)

        setEntries(dailyEntries)
        setMonthlyData(monthly)
        setYearlyData(yearly)
        setStreakHistory(streakHist)
      } catch (err) {
        console.error(err)
        setError('Could not load CSV files. Make sure they are in the public/ folder.')
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm animate-pulse">Loading your data…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="card-padded max-w-md text-center">
          <p className="text-rose-400 text-sm font-medium">⚠ {error}</p>
          <p className="text-slate-600 text-xs mt-2">
            Expected files in <code className="text-slate-400">public/</code>:<br />
            activity-export-daily.csv<br />
            activity-export-monthly.csv<br />
            activity-export-yearly.csv<br />
            activity-export-streak.csv
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onLogClick={null} onExport={null} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
            Your Steps Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {entries.length.toLocaleString()} days tracked · 5k goal until 2026, 10k goal from 2026
          </p>
        </div>

        <SummaryCards entries={entries} />
        <Charts
          entries={entries}
          monthlyData={monthlyData}
          yearlyData={yearlyData}
        />
        <InsightsPanel />
        <StepTable entries={entries} onEdit={null} onDelete={null} />
      </main>

      <footer className="text-center text-slate-800 text-xs py-8 font-mono border-t border-slate-900 mt-4">
        StepWise · your data, your device
      </footer>
    </div>
  )
}