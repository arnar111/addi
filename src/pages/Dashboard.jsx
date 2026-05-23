import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import LendoWidget from '../components/widgets/LendoWidget'
import { useLendo } from '../hooks/useLendo'
import { formatShortISK } from '../utils/currency'

function DayMotivation({ incomeGoalPct }) {
  const hour = new Date().getHours()
  if (incomeGoalPct >= 100) return '🎉 Lendó markmið náð!'
  if (incomeGoalPct >= 75) return '🔥 Næstum kominn'
  if (hour < 10) return 'Góðan morgun, Addi'
  if (hour < 17) return 'Hvernig líður lendó í dag?'
  return 'Gott starf í dag'
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const { goalPct, upcomingBookings } = useLendo()
  const upcoming = upcomingBookings()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">
          <DayMotivation incomeGoalPct={goalPct} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
          {upcoming.length > 0 && (
            <span className="badge text-xs" style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}>
              🪑 {upcoming.length} bókun{upcoming.length > 1 ? 'ar' : ''} í bíð
            </span>
          )}
        </div>
      </div>

      {/* Lendó — always on top, it's the money widget */}
      <LendoWidget />

      {/* Weather */}
      <WeatherWidget />

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
