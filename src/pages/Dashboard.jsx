import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import ManUnitedWidget from '../components/widgets/ManUnitedWidget'
import QuickLinksWidget from '../components/widgets/QuickLinksWidget'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useGoals } from '../hooks/useGoals'
import { formatShortISK } from '../utils/currency'

function GoalsTeaser({ savings, totalSaved, totalTarget }) {
  if (savings.length === 0) return null
  const topGoal = savings[0]
  const pct = topGoal.target > 0 ? Math.min(100, Math.round((topGoal.current / topGoal.target) * 100)) : 0
  return (
    <Link to="/goals" style={{ textDecoration: 'none' }}>
      <div className="card" style={{ borderColor: `${topGoal.color}33` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>{topGoal.icon}</span>
            <span className="text-sm font-semibold">{topGoal.name}</span>
          </div>
          <span className="text-xs font-semibold" style={{ color: topGoal.color }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full transition-all"
               style={{ width: `${pct}%`, background: topGoal.color }} />
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
          <span>{formatShortISK(topGoal.current)}</span>
          <span>{formatShortISK(topGoal.target)}</span>
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const { savings, totalSaved, totalTarget } = useGoals()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between px-1 pt-2">
        <div>
          <div className="text-2xl font-semibold">{getGreeting(name)}</div>
          <div className="mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <Link to="/settings" className="p-2 rounded-xl md:hidden transition-all"
              style={{ color: 'var(--muted)', background: 'var(--surface)' }}>
          <Settings size={18} />
        </Link>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Man United */}
      <ManUnitedWidget />

      {/* Tasks + Habits side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Goals teaser */}
      <GoalsTeaser savings={savings} totalSaved={totalSaved} totalTarget={totalTarget} />

      {/* Quick links */}
      <QuickLinksWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
