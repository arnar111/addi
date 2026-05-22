import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import ShoppingWidget from '../components/widgets/ShoppingWidget'
import RatesWidget from '../components/widgets/RatesWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import SubscriptionsWidget from '../components/widgets/SubscriptionsWidget'
import QuickLinksWidget from '../components/widgets/QuickLinksWidget'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const { failedSubs } = useSubscriptions()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Greeting */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting(name)}</div>
        <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          {formatTime(time)} · {formatDate(time)}
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Subscription alert (only when payment issues exist) */}
      {failedSubs.length > 0 && <SubscriptionsWidget />}

      {/* Quick links */}
      <QuickLinksWidget />

      {/* World Cup Countdown */}
      <WorldCupWidget />

      {/* ISK exchange rates */}
      <RatesWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Football scores */}
      <SportsWidget />

      {/* Finance + Subscriptions */}
      <div className="grid md:grid-cols-2 gap-4">
        <FinanceSnapshotWidget />
        {failedSubs.length === 0 && <SubscriptionsWidget />}
      </div>

      {/* Shopping list */}
      <ShoppingWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
