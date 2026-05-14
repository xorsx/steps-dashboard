// src/utils/calculations.js

// ── goal ──────────────────────────────────────────────────────
// Before 2026 you were aiming for 5k. From 2026 onwards, 10k.
export const GOAL_10K = 10000
export const GOAL_5K  = 5000

export function getGoalForDate(date) {
  return date >= '2026-01-01' ? GOAL_10K : GOAL_5K
}

// Default goal for "right now" calculations
export const GOAL = GOAL_10K

// ── helpers ───────────────────────────────────────────────────
export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function sortAsc(entries) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date))
}

function mean(nums) {
  if (!nums.length) return 0
  return nums.reduce((s, n) => s + n, 0) / nums.length
}

// ── summary stats ─────────────────────────────────────────────
export function getTodaySteps(entries) {
  const e = entries.find(e => e.date === todayStr())
  return e ? e.steps : null
}

export function getWeeklyAverage(entries) {
  const today = new Date()
  let total = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    const e = entries.find(e => e.date === ds)
    total += e ? e.steps : 0
  }
  return Math.round(total / 7)
}

export function getMonthlyAverage(entries) {
  const ym = todayStr().slice(0, 7)
  const month = entries.filter(e => e.date.startsWith(ym))
  if (!month.length) return 0
  return Math.round(mean(month.map(e => e.steps)))
}

export function getCurrentStreak(entries) {
  const map = new Map(entries.map(e => [e.date, e.steps]))
  const today = new Date()
  const startOffset = map.has(todayStr()) ? 0 : 1
  let streak = 0
  for (let i = startOffset; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    const goal = getGoalForDate(ds)
    if (map.has(ds) && map.get(ds) >= goal) streak++
    else break
  }
  return streak
}

export function getGoalRate(entries) {
  if (!entries.length) return 0
  const met = entries.filter(e => e.steps >= getGoalForDate(e.date)).length
  return Math.round((met / entries.length) * 100)
}

export function getAvgGap(entries) {
  const misses = entries.filter(e => e.steps < getGoalForDate(e.date))
  if (!misses.length) return 0
  return Math.round(mean(misses.map(e => getGoalForDate(e.date) - e.steps)))
}

// ── chart data ────────────────────────────────────────────────
export function getDailyChartData(entries, days = 30) {
  return sortAsc(entries)
    .slice(-days)
    .map(e => ({
      date: e.date.slice(5),
      steps: e.steps,
      goal: getGoalForDate(e.date),
    }))
}

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getWeekdayAverages(entries) {
  const buckets = Array.from({ length: 7 }, () => ({ total: 0, n: 0 }))
  entries.forEach(e => {
    const dow = new Date(e.date + 'T12:00:00').getDay()
    buckets[dow].total += e.steps
    buckets[dow].n += 1
  })
  return DOW.map((day, i) => ({
    day,
    avg: buckets[i].n ? Math.round(buckets[i].total / buckets[i].n) : 0,
  }))
}

export function getMonthlyChartData(monthlyData) {
  // monthlyData comes from parseMonthlyCsv — pre-aggregated, more accurate
  return monthlyData.map(r => ({
    month: r.date.slice(5, 7) + '/' + r.date.slice(2, 4),
    avg: Math.round(r.steps / new Date(r.date.slice(0, 7) + '-01').getDate()),
    total: r.steps,
    goal: getGoalForDate(r.date) * 30,
  }))
}

export function getYearlyChartData(yearlyData) {
  return yearlyData.map(r => ({
    year: r.year,
    steps: r.steps,
    goal: r.year >= '2026' ? GOAL_10K * 365 : GOAL_5K * 365,
  }))
}

// ── streak history ────────────────────────────────────────────
export function buildStreakHistory(streakRows) {
  // streakRows: [{ date, achieved }] from parseStreakCsv
  const streaks = []
  let current = 0
  let start = null

  streakRows.forEach((row, i) => {
    if (row.achieved) {
      if (current === 0) start = row.date
      current++
    } else {
      if (current > 0) {
        streaks.push({ start, end: row.date, days: current })
      }
      current = 0
    }
  })
  if (current > 0) {
    streaks.push({ start, end: streakRows[streakRows.length - 1].date, days: current })
  }

  const sorted = [...streaks].sort((a, b) => b.days - a.days)
  const totalGoalDays = streakRows.filter(r => r.achieved).length

  return {
    longest: sorted[0] || null,
    topStreaks: sorted.slice(0, 5),
    totalGoalDays,
    allStreaks: streaks,
  }
}

// ── insights ──────────────────────────────────────────────────
export function buildInsights(entries, streakHistory) {
  if (entries.length < 7) {
    return [{ icon: '📋', title: 'Keep logging', body: 'Add at least 7 entries to unlock insights.', tone: 'neutral' }]
  }

  const sorted = sortAsc(entries)
  const insights = []

  // Trend
  const r7 = sorted.slice(-7).map(e => e.steps)
  const p7 = sorted.slice(-14, -7).map(e => e.steps)
  const rAvg = Math.round(mean(r7))
  const pAvg = p7.length ? Math.round(mean(p7)) : rAvg
  const pct = pAvg ? Math.round(Math.abs((rAvg - pAvg) / pAvg) * 100) : 0
  if (rAvg >= pAvg) {
    insights.push({ icon: '📈', title: `Up ${pct}% vs prior week`, body: `7-day avg is ${rAvg.toLocaleString()} vs ${pAvg.toLocaleString()} steps. Momentum is building.`, tone: 'positive' })
  } else {
    insights.push({ icon: '📉', title: `Down ${pct}% vs prior week`, body: `7-day avg dropped to ${rAvg.toLocaleString()} from ${pAvg.toLocaleString()}. A couple strong days will reverse this.`, tone: 'warning' })
  }

  // Best weekday
  const wda = getWeekdayAverages(entries)
  const best = wda.reduce((b, d) => d.avg > b.avg ? d : b, wda[0])
  if (best.avg > 0) {
    insights.push({ icon: '🏆', title: `${best.day} is your strongest day`, body: `You average ${best.avg.toLocaleString()} steps on ${best.day}s — your personal peak.`, tone: 'positive' })
  }

  // Goal rate
  const rate = getGoalRate(entries)
  const met = entries.filter(e => e.steps >= getGoalForDate(e.date)).length
  insights.push(rate >= 70
    ? { icon: '🎯', title: `${rate}% goal completion`, body: `Hit your goal on ${met} of ${entries.length} days — solid work.`, tone: 'positive' }
    : { icon: '🎯', title: `${rate}% goal completion`, body: `Missed the goal on ${entries.length - met} of ${entries.length} days. Small wins add up.`, tone: 'warning' }
  )

  // Streak highlight
  if (streakHistory?.longest) {
    const { longest, totalGoalDays } = streakHistory
    insights.push({
      icon: '🔥',
      title: `Best streak: ${longest.days} days`,
      body: `Your longest goal streak ran ${longest.start} to ${longest.end}. You've hit your goal on ${totalGoalDays.toLocaleString()} days total.`,
      tone: 'positive',
    })
  }

  // Gap
  const gap = getAvgGap(entries)
  if (gap > 0) {
    insights.push({ icon: '📏', title: `~${gap.toLocaleString()} steps short on miss days`, body: `That's roughly a ${Math.max(1, Math.round(gap / 1300))}-minute walk away from the goal.`, tone: 'neutral' })
  }

  // Recommendation
  const last3 = Math.round(mean(sorted.slice(-3).map(e => e.steps)))
  insights.push(last3 >= GOAL
    ? { icon: '💡', title: 'Keep the streak alive', body: `Last 3-day avg is ${last3.toLocaleString()} — above goal. Stay consistent.`, tone: 'tip' }
    : { icon: '💡', title: 'Quick win opportunity', body: `Last 3-day avg is ${last3.toLocaleString()}. A ${Math.max(1, Math.round((GOAL - last3) / 1300))}-min walk tomorrow closes the gap.`, tone: 'tip' }
  )

  return insights
}