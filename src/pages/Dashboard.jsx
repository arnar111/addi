import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SubscriptionsWidget from '../components/widgets/SubscriptionsWidget'
import QuickLinksWidget from '../components/widgets/QuickLinksWidget'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSubscriptions } from '../hooks/useSubscriptions'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const { failedSubs } = useSubscriptions()

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

      {/* Weather */}
      <WeatherWidget />

      {/* Subscription alerts (only when there are issues) */}
      {failedSubs.length > 0 && <SubscriptionsWidget />}

      {/* Quick links */}
      <QuickLinksWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance + Subscriptions summary side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <FinanceSnapshotWidget />
        {failedSubs.length === 0 && <SubscriptionsWidget />}
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
