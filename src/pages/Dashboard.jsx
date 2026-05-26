import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import LendoWidget from '../components/widgets/LendoWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { NavLink } from 'react-router-dom'
import { formatISK } from '../utils/currency'

function SubRenewalBanner() {
  const { renewingSoon } = useSubscriptions()
  const renewing = renewingSoon()
  if (renewing.length === 0) return null
  const first = renewing[0]
  const days = Math.ceil((new Date(first.nextDate) - new Date()) / 86400000)
  return (
    <NavLink to="/subscriptions"
      className="card flex items-center gap-3 py-3"
      style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', textDecoration: 'none' }}>
      <span className="text-xl shrink-0">{first.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{first.name} endurnýjast</div>
        <div className="text-xs" style={{ color: '#f97316' }}>
          {days === 0 ? 'Í dag' : `Eftir ${days} daga`} · {formatISK(first.amount)}
          {renewing.length > 1 ? ` (+${renewing.length - 1} fleiri)` : ''}
        </div>
      </div>
      <span className="text-xs shrink-0" style={{ color: '#f97316' }}>→</span>
    </NavLink>
  )
}

function AudibleBanner() {
  const credits = 11
  const expiring = 1
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('audible_banner_dismissed') === 'true'
  })
  if (dismissed) return null
  return (
    <div className="card flex items-center gap-3 py-3"
         style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
      <span className="text-xl shrink-0">🎧</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">Audible: {credits} credits</div>
        <div className="text-xs" style={{ color: '#f97316' }}>{expiring} credit rennur út fljótlega!</div>
      </div>
      <button onClick={() => { setDismissed(true); localStorage.setItem('audible_banner_dismissed', 'true') }}
        className="text-xs px-3 py-1.5 rounded-lg font-medium shrink-0"
        style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
        Skil
      </button>
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
        <div className="text-2xl font-semibold">{getGreeting()} 👋</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Subscription renewal alert */}
      <SubRenewalBanner />

      {/* Audible reminder */}
      <AudibleBanner />

      {/* Weather */}
      <WeatherWidget />

      {/* Lendó – side hustle income */}
      <LendoWidget />

      {/* Arsenal / Sports */}
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
