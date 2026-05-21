import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'
import SubscriptionAlertWidget from '../components/widgets/SubscriptionAlertWidget'

function HuelCountdown() {
  const nextDelivery = new Date('2026-05-27')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((nextDelivery - today) / (1000 * 60 * 60 * 24))

  if (diff < 0 || diff > 10) return null

  return (
    <div className="card flex items-center gap-3"
         style={{ border: '1px solid rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.06)' }}>
      <span className="text-xl">💪</span>
      <div className="flex-1">
        <div className="text-sm font-medium">Næsta Huel sending</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {diff === 0 ? 'Kemur í dag!' : diff === 1 ? 'Kemur á morgun' : `${diff} dagar eftir · 27. maí`}
        </div>
      </div>
      <span className="text-xs font-semibold px-2 py-1 rounded-lg"
            style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
        {diff === 0 ? 'Í dag!' : `${diff}d`}
      </span>
    </div>
  )
}

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

      {/* World Cup Countdown — most prominent feature */}
      <WorldCupWidget />

      {/* Action alerts — Paramount+ paused, upcoming renewals */}
      <SubscriptionAlertWidget />

      {/* Huel delivery countdown */}
      <HuelCountdown />

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
