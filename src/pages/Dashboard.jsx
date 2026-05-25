import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import CryptoWidget from '../components/widgets/CryptoWidget'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting()}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Sports */}
      <SportsWidget />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance + Crypto side by side on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FinanceSnapshotWidget />
        <CryptoWidget />
      </div>

      {/* Spotify */}
      <SpotifyWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
