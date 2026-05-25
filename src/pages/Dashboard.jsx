import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'
import QuickLinksWidget from '../components/widgets/QuickLinksWidget'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const navigate = useNavigate()

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
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <button onClick={() => navigate('/settings')} className="btn btn-ghost" style={{ padding: 8 }}>
          <Settings size={18} style={{ color: 'var(--muted)' }} />
        </button>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Sports + World Cup side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <SportsWidget />
        <WorldCupWidget />
      </div>

      {/* Quick links */}
      <QuickLinksWidget />

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
