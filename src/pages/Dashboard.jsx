import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import { useIncome } from '../hooks/useIncome'
import { formatShortISK } from '../utils/currency'
import { useSurvivor } from '../hooks/useSurvivor'

function LendoCard() {
  const { lendoTotal, lendoCount, goal, monthlyTotal } = useIncome()
  const total = lendoTotal()
  const count = lendoCount()
  const pct = Math.min(100, Math.round((total / goal) * 100))

  if (count === 0) return null

  return (
    <div className="card-sm flex items-center gap-3"
         style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
      <span className="text-2xl">🪑</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Lendó þennan mánuð</div>
        <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>{formatShortISK(total)}</div>
        <div className="h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{count} leiga</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{pct}% af marki</div>
      </div>
    </div>
  )
}

function SurvivorBadge() {
  const { myTeam, myTotalPoints, activePicks } = useSurvivor()
  const hasTeam = Object.values(myTeam.picks).some(Boolean)
  if (!hasTeam) return null

  return (
    <div className="card-sm flex items-center gap-3"
         style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
      <span className="text-2xl">🏝️</span>
      <div className="flex-1">
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Þraukarinn S50</div>
        <div className="text-sm font-semibold mt-0.5">{myTeam.name}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-lg font-bold" style={{ color: '#f97316' }}>{myTotalPoints()}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>stig</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-4">
        <div className="text-2xl font-semibold">{getGreeting(name)}</div>
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

      {/* Lendó income + Þraukarinn */}
      <LendoCard />
      <SurvivorBadge />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
