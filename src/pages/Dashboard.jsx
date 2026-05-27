import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { useFinance } from '../hooks/useFinance'
import { useSubscriptions } from '../hooks/useSubscriptions'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import FootballWidget from '../components/widgets/FootballWidget'
import SubscriptionWidget from '../components/widgets/SubscriptionWidget'
import { CheckCircle, Target, TrendingUp, Calendar } from 'lucide-react'
import { formatShortISK } from '../utils/currency'

function QuickStat({ icon, label, value, color, sub }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-0.5 py-3 rounded-2xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="text-base">{icon}</div>
      <div className="text-base font-bold" style={{ color: color || 'var(--text)' }}>{value}</div>
      <div className="text-center" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</div>
      {sub && <div style={{ color: 'var(--muted)', fontSize: 9 }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const { tasks } = useTasks()
  const { todayDone, habits } = useHabits()
  const { monthlyTotal, budget, remaining } = useFinance()
  const { monthlyTotal: subTotal } = useSubscriptions()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const todayTasks = tasks.filter(t => !t.done).length
  const totalToday = monthlyTotal()
  const budgetLeft = remaining()
  const budgetPct = Math.round((totalToday / budget.monthly) * 100)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-3">
        <div className="text-2xl font-semibold">{getGreeting(name)} 👋</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-2">
        <QuickStat
          icon="✅"
          label="Verkefni eftir"
          value={todayTasks}
          color={todayTasks === 0 ? 'var(--success)' : 'var(--text)'}
        />
        <QuickStat
          icon="🔥"
          label="Vanir í dag"
          value={`${todayDone}/${habits.length}`}
          color={todayDone === habits.length ? 'var(--success)' : 'var(--accent)'}
        />
        <QuickStat
          icon="💳"
          label="Útgjöld"
          value={`${budgetPct}%`}
          color={budgetPct > 90 ? 'var(--danger)' : budgetPct > 75 ? '#f97316' : 'var(--success)'}
          sub={`${formatShortISK(budgetLeft)} eftir`}
        />
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Football */}
      <FootballWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance + Subscriptions */}
      <div className="grid md:grid-cols-2 gap-4">
        <FinanceSnapshotWidget />
        <SubscriptionWidget />
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
