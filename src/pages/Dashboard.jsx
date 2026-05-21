import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { useFinance } from '../hooks/useFinance'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import AuroraWidget from '../components/widgets/AuroraWidget'
import CurrencyWidget from '../components/widgets/CurrencyWidget'
import QuickLinksWidget from '../components/widgets/QuickLinksWidget'

function DaySummaryChip({ icon, label, color }) {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: `${color}18`, color }}>
      {icon} {label}
    </span>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const { pending, done } = useTasks()
  const { habits, todayDone } = useHabits()
  const { remaining, monthlyTotal, budget } = useFinance()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const left = remaining()
  const pct = Math.round((monthlyTotal() / budget.monthly) * 100)
  const budgetOk = left >= 0 && pct <= 85

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-3">
        <div className="text-2xl font-semibold">{getGreeting(name)}</div>
        <div className="flex items-center gap-1 mt-0.5 mb-2">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>

        {/* Day summary chips */}
        <div className="flex flex-wrap gap-1.5">
          {done.length > 0 && (
            <DaySummaryChip icon="✓" label={`${done.length} verkefni lokið`} color="var(--success)" />
          )}
          {pending.length > 0 && (
            <DaySummaryChip icon="📋" label={`${pending.length} eftir`} color="var(--muted)" />
          )}
          {habits.length > 0 && (
            <DaySummaryChip
              icon={todayDone === habits.length ? '🔥' : '🌱'}
              label={`${todayDone}/${habits.length} vanir`}
              color={todayDone === habits.length ? '#f97316' : 'var(--accent)'}
            />
          )}
          {monthlyTotal() > 0 && (
            <DaySummaryChip
              icon={budgetOk ? '💰' : '⚠️'}
              label={`${pct}% af áætlun`}
              color={budgetOk ? 'var(--muted)' : 'var(--danger)'}
            />
          )}
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Aurora forecast — Reykjavík special */}
      <AuroraWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Currency rates */}
      <CurrencyWidget />

      {/* Quick links */}
      <QuickLinksWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
