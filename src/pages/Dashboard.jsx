import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import ProjectsWidget from '../components/widgets/ProjectsWidget'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2 flex items-start justify-between">
        <div>
          <div className="text-2xl font-semibold">{getGreeting()}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <Link to="/settings" className="p-2 rounded-xl mt-0.5 transition-all"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <Settings size={20} />
        </Link>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Projects */}
      <ProjectsWidget />

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
