import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import { useHabits } from '../hooks/useHabits'
import { useTasks } from '../hooks/useTasks'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatShortISK } from '../utils/currency'
import { Flame, CheckCircle2, Zap, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'

function MomentumCard() {
  const { todayDone, habits } = useHabits()
  const { done } = useTasks()
  const { todayTotal } = useFinance()
  const { monthlyTotal: subMonthly } = useSubscriptions()

  const todayDoneCount = done.filter(t => {
    const doneAt = t.doneAt
    if (!doneAt) return false
    return new Date(doneAt).toDateString() === new Date().toDateString()
  }).length

  const subCost = subMonthly()
  const spentToday = todayTotal()
  const allHabitsDone = habits.length > 0 && todayDone === habits.length

  return (
    <div className="card"
         style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">
          <Zap size={14} style={{ color: 'var(--accent)' }} />
          Í dag
        </h3>
        {allHabitsDone && (
          <span className="badge text-xs" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
            🎉 Allt lokið!
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Link to="/habits" className="flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all"
              style={{ background: 'var(--surface2)' }}>
          <span className="text-lg font-bold" style={{ color: todayDone > 0 ? '#f97316' : 'var(--muted)' }}>
            {todayDone > 0 ? '🔥' : '—'}
          </span>
          <span className="text-sm font-semibold">{todayDone}/{habits.length}</span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Vanur</span>
        </Link>
        <Link to="/tasks" className="flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all"
              style={{ background: 'var(--surface2)' }}>
          <CheckCircle2 size={18} style={{ color: todayDoneCount > 0 ? 'var(--success)' : 'var(--muted)' }} />
          <span className="text-sm font-semibold">{todayDoneCount}</span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Lokið</span>
        </Link>
        <Link to="/finance" className="flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all"
              style={{ background: 'var(--surface2)' }}>
          <CreditCard size={18} style={{ color: spentToday > 0 ? 'var(--accent)' : 'var(--muted)' }} />
          <span className="text-sm font-semibold">{spentToday > 0 ? formatShortISK(spentToday) : '—'}</span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Eytt</span>
        </Link>
      </div>
      {subCost > 0 && (
        <div className="mt-2.5 pt-2.5 flex items-center justify-between text-xs"
             style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
          <span>Mánaðarlegar áskriftir</span>
          <Link to="/finance" style={{ color: 'var(--accent)', fontWeight: 600 }}>{formatShortISK(subCost)}</Link>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-3">
        <div className="text-2xl font-semibold">{getGreeting()}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm tabular-nums" style={{ color: 'var(--muted)' }}>
            {formatTime(time)}
          </span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Today's momentum */}
      <MomentumCard />

      {/* Weather */}
      <WeatherWidget />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance */}
      <FinanceSnapshotWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
