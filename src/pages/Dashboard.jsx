import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import LendoWidget from '../components/widgets/LendoWidget'
import { Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

const NAMES = ['Arnar', 'Addi']

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const hour = time.getHours()
  const greeting = hour < 5 ? 'Góða nótt' : hour < 12 ? 'Góðan daginn' : hour < 18 ? 'Góðan dag' : 'Gott kvöld'

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between px-1 pt-3">
        <div>
          <div className="text-2xl font-bold">{greeting}, Arnar 👋</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <Link to="/settings" className="p-2 rounded-xl" style={{ color: 'var(--muted)', background: 'var(--surface)' }}>
          <Settings size={18} />
        </Link>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Sports — Knicks in Finals highlight! */}
      <SportsWidget />

      {/* Lendo business */}
      <LendoWidget />

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
