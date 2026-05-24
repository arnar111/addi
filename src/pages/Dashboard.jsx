import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings, ChevronRight } from 'lucide-react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import AuroraWidget from '../components/widgets/AuroraWidget'
import WaterWidget from '../components/widgets/WaterWidget'
import LinksWidget from '../components/widgets/LinksWidget'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-3 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between px-1 pt-3">
        <div>
          <div className="text-2xl font-semibold">{getGreeting(name)}</div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </div>
        </div>
        <Link to="/settings"
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <Settings size={15} style={{ color: 'var(--muted)' }} />
        </Link>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Aurora + Water side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <AuroraWidget />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <WaterWidget />
        </div>
      </div>

      {/* Quick links */}
      <LinksWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits side by side */}
      <div className="grid md:grid-cols-2 gap-3">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Quick note */}
      <QuickNoteWidget />

      {/* Footer nav hint */}
      <div className="flex justify-center gap-4 pt-1 pb-2">
        {[
          { to: '/notes', label: 'Minnisblöð' },
          { to: '/timer', label: 'Tímari' },
        ].map(({ to, label }) => (
          <Link key={to} to={to}
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--muted)' }}>
            {label} <ChevronRight size={11} />
          </Link>
        ))}
      </div>
    </div>
  )
}
