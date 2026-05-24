import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import MUWidget from '../components/widgets/MUWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import ExchangeRateWidget from '../components/widgets/ExchangeRateWidget'
import PaydayWidget from '../components/widgets/PaydayWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const name = (() => {
    try { return JSON.parse(localStorage.getItem('addi_name')) || 'Arnar' } catch { return 'Arnar' }
  })()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting(name)}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm tabular-nums" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Payday + Exchange rates */}
      <div className="grid grid-cols-2 gap-3">
        <PaydayWidget />
        <ExchangeRateWidget />
      </div>

      {/* Man United */}
      <MUWidget />

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
