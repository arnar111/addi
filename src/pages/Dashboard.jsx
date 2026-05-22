import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import FootballWidget from '../components/widgets/FootballWidget'
import LendoWidget from '../components/widgets/LendoWidget'

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
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="text-2xl font-semibold">{getGreeting(name)}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <Link to="/settings" className="p-2 rounded-xl" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
          <Settings size={18} />
        </Link>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Football / World Cup */}
      <FootballWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance + Lendó side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <FinanceSnapshotWidget />
        <LendoWidget />
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
