import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { getGreeting, formatTime, formatDate, dayProgress } from '../utils/time'
import { useHabits } from '../hooks/useHabits'
import { useTasks } from '../hooks/useTasks'
import { useFinance } from '../hooks/useFinance'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [progress, setProgress] = useState(dayProgress())

  const { habits, todayDone } = useHabits()
  const { pending } = useTasks()
  const { monthlyTotal, budget } = useFinance()

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date())
      setProgress(dayProgress())
    }, 30000)
    return () => clearInterval(t)
  }, [])

  const budgetPct = budget.monthly ? Math.min(999, Math.round((monthlyTotal() / budget.monthly) * 100)) : 0
  const budgetColor = budgetPct >= 100 ? 'var(--danger)' : budgetPct >= 80 ? '#f97316' : 'var(--text)'

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-semibold">{getGreeting()}</div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </div>
          </div>
          <Link
            to="/settings"
            className="shrink-0 p-2.5 rounded-xl mt-0.5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Settings size={16} style={{ color: 'var(--muted)' }} />
          </Link>
        </div>

        {/* Day progress bar */}
        <div className="mt-3">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Dagur: {progress}% liðinn</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{100 - progress}% eftir</span>
          </div>
        </div>
      </div>

      {/* Today at a glance */}
      <div className="grid grid-cols-3 gap-2">
        <Link to="/habits" className="card text-center py-3 px-2 transition-all hover:border-[var(--accent)] active:scale-95">
          <div
            className="text-xl font-bold tabular-nums"
            style={{ color: habits.length > 0 && todayDone === habits.length ? 'var(--success)' : 'var(--accent)' }}>
            {todayDone}/{habits.length}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Vanir</div>
        </Link>
        <Link to="/tasks" className="card text-center py-3 px-2 transition-all hover:border-[var(--accent)] active:scale-95">
          <div className="text-xl font-bold tabular-nums">
            {pending.length}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Verkefni</div>
        </Link>
        <Link to="/finance" className="card text-center py-3 px-2 transition-all active:scale-95">
          <div className="text-xl font-bold tabular-nums" style={{ color: budgetColor }}>
            {budgetPct}%
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Fjárhagsáætlun</div>
        </Link>
      </div>

      {/* Weather */}
      <WeatherWidget />

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
