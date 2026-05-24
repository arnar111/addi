import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import IncomeWidget from '../components/widgets/IncomeWidget'
import { useJobs } from '../hooks/useJobs'
import { Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'

function JobsSnapshot() {
  const { stats } = useJobs()
  if (stats.total === 0) return null
  return (
    <Link to="/jobs" className="card flex items-center gap-3 no-underline"
          style={{ textDecoration: 'none' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: 'rgba(59,130,246,0.12)' }}>
        <Briefcase size={17} style={{ color: '#3b82f6' }} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">Störf</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {stats.active} virk · {stats.interviews} viðtöl{stats.offers > 0 ? ` · 🎉 ${stats.offers} tilboð` : ''}
        </div>
      </div>
      <div className="text-xs font-semibold px-2 py-1 rounded-lg"
           style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
        {stats.total}
      </div>
    </Link>
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
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting(name)}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* World Cup + Sports */}
      <SportsWidget />

      {/* Tasks + Habits side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Lendó income */}
      <IncomeWidget />

      {/* Jobs snapshot (only when there are jobs tracked) */}
      <JobsSnapshot />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
