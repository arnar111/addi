import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { formatShortISK } from '../utils/currency'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import { Link } from 'react-router-dom'
import { AlertTriangle, CreditCard } from 'lucide-react'

function SubAlertBanner({ alerts, monthlyISK }) {
  if (alerts.length === 0) return null
  return (
    <Link to="/subscriptions"
          className="card flex items-center gap-3 py-3"
          style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', textDecoration: 'none', color: 'inherit' }}>
      <AlertTriangle size={16} style={{ color: 'var(--danger)', shrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
          {alerts.length} áskrift{alerts.length > 1 ? 'ir' : ''} þarf athygli
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {alerts.map(a => a.name).join(', ')}
        </div>
      </div>
      <CreditCard size={14} style={{ color: 'var(--muted)' }} />
    </Link>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const { alerts, monthlyISK } = useSubscriptions()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting(name)}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Subscription alerts */}
      <SubAlertBanner alerts={alerts} monthlyISK={monthlyISK()} />

      {/* Weather */}
      <WeatherWidget />

      {/* NBA / Sports */}
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
