import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'
import CurrencyWidget from '../components/widgets/CurrencyWidget'

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
      <div className="flex items-start justify-between px-1 pt-2">
        <div>
          <div className="text-2xl font-semibold">{getGreeting(name)}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <Link to="/settings"
              className="p-2 rounded-xl transition-all"
              style={{ color: 'var(--muted)', background: 'var(--surface)' }}>
          <Settings size={18} />
        </Link>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* World Cup countdown */}
      <WorldCupWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Currency rates */}
      <CurrencyWidget />

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
