import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { useIncome } from '../hooks/useIncome'
import { formatShortISK } from '../utils/currency'

function DailyBriefing({ tasks, habits, income }) {
  const urgent = tasks.pending.filter(t => t.priority === 'high')
  const habitsLeft = habits.habits.length - habits.todayDone
  const incPct = income.monthlyGoal > 0 ? Math.round((income.monthlyTotal() / income.monthlyGoal) * 100) : 0

  const items = [
    urgent.length > 0 && { icon: '🔴', text: `${urgent.length} brýn verkefni` },
    habitsLeft > 0 && { icon: '💪', text: `${habitsLeft} venjur eftir í dag` },
    habitsLeft === 0 && habits.habits.length > 0 && { icon: '🎉', text: 'Allar venjur kláraðar!' },
    incPct > 0 && { icon: '🪑', text: `Lendó: ${incPct}% af marki` },
  ].filter(Boolean)

  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5 px-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
          <span>{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const tasks = useTasks()
  const habits = useHabits()
  const income = useIncome()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting()}, Arnar 👋</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Daily briefing */}
      <DailyBriefing tasks={tasks} habits={habits} income={income} />

      {/* Weather */}
      <WeatherWidget />

      {/* Sports */}
      <SportsWidget />

      {/* Spotify */}
      <SpotifyWidget />

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
