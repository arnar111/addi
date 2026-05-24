import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { useLendo } from '../hooks/useLendo'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import LendoWidget from '../components/widgets/LendoWidget'
import SpursWidget from '../components/widgets/SpursWidget'

function TodayChips() {
  const { pending } = useTasks()
  const { habits, todayDone } = useHabits()
  const { upcomingBookings } = useLendo()
  const todayStr = new Date().toDateString()
  const todayBookings = upcomingBookings.filter(b => new Date(b.date).toDateString() === todayStr)

  return (
    <div className="flex gap-2 flex-wrap mt-2">
      {pending.length > 0 && (
        <span className="text-xs px-2 py-1 rounded-full"
          style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          📋 {pending.length} verkefni
        </span>
      )}
      <span className="text-xs px-2 py-1 rounded-full"
        style={{ background: 'var(--surface2)', color: todayDone === habits.length ? 'var(--success)' : 'var(--muted)' }}>
        {todayDone === habits.length ? '✅' : '⭕'} {todayDone}/{habits.length} vanir
      </span>
      {todayBookings.length > 0 && (
        <span className="text-xs px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
          🪑 {todayBookings.length} bókun í dag
        </span>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-3">
        <div className="text-2xl font-semibold">{getGreeting()}</div>
        <div className="mt-0.5">
          <span className="text-sm capitalize" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
          <TodayChips />
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Lendó business snapshot */}
      <LendoWidget />

      {/* Spurs */}
      <SpursWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
