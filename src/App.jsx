// src/App.jsx
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
import { useState, useEffect } from 'react'

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
          dailyRes.text(), monthlyRes.text(), yearlyRes.text(), streakRes.text(),
        ])
        const { entries: dailyEntries } = parseDailyCsv(dailyText)
        const monthly    = parseMonthlyCsv(monthlyText)
        const yearly     = parseYearlyCsv(yearlyText)
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
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ fontFamily: '"Bubblicious", sans-serif', fontSize: '24px', color: 'white',
                    textShadow: '0 2px 20px rgba(255,45,155,0.5)' }}>
          Loading your steps... 🥾
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="win max-w-md text-center">
          <div className="win-bar">Error</div>
          <div className="win-body">
            <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#FF2D9B', fontWeight: 600 }}>
              ⚠ {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px 60px' }}
            className="flex flex-col gap-10 pt-8">

        <SummaryCards entries={entries} />
        <Charts entries={entries} monthlyData={monthlyData} yearlyData={yearlyData} />
        <InsightsPanel />
        <StepTable entries={entries} onEdit={null} onDelete={null} />

      </main>

      <footer style={{
        textAlign: 'center',
        padding: '24px',
        fontFamily: '"StoraLight", sans-serif',
        fontSize: '13px',
        letterSpacing: '0.15em',
        color: 'rgba(221,214,254,0.5)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        Liv's Step Tracker ♥ · your data, your device
      </footer>
    </div>
  )
}