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

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Greeting */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting()}</div>
        <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          {formatTime(time)} · {formatDate(time)}
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* ISK exchange rates */}
      <RatesWidget />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot with quick-add */}
      <FinanceSnapshotWidget />

      {/* Shopping list */}
      <ShoppingWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
