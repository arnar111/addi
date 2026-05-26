import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import QuickLinksWidget from '../components/widgets/QuickLinksWidget'
import { useLendo } from '../hooks/useLendo'
import { formatShortISK } from '../utils/currency'
import { Link } from 'react-router-dom'
import { Armchair } from 'lucide-react'

function LendoSnapshotWidget() {
  const { upcoming, monthlyRevenue, monthlyPending } = useLendo()
  const next = upcoming()[0]
  const rev = monthlyRevenue()
  const pending = monthlyPending()

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Armchair size={15} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold text-sm">Lendó</h3>
        </div>
        <Link to="/lendo" className="text-xs" style={{ color: 'var(--accent)' }}>Opna →</Link>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Tekjur (mánuður)</div>
          <div className="text-base font-bold" style={{ color: 'var(--accent)' }}>{formatShortISK(rev)}</div>
        </div>
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
          <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Ógreitt</div>
          <div className="text-base font-bold" style={{ color: pending > 0 ? '#f97316' : 'var(--muted)' }}>
            {formatShortISK(pending)}
          </div>
        </div>
      </div>

      {next ? (
        <div className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs"
             style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
          <span>📅</span>
          <span className="font-medium">{next.customer}</span>
          <span style={{ color: 'var(--muted)' }}>—</span>
          <span style={{ color: 'var(--muted)' }}>
            {new Date(next.startDate).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      ) : (
        <div className="text-xs text-center py-1" style={{ color: 'var(--muted)' }}>
          Engar væntanlegar bókanir
        </div>
      )}
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
        <div className="text-2xl font-semibold">{getGreeting('Addi')}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Quick links */}
      <QuickLinksWidget />

      {/* Weather */}
      <WeatherWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Lendó snapshot */}
      <LendoSnapshotWidget />

      {/* PL standings */}
      <SportsWidget />

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
