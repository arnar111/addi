import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useHabits } from '../hooks/useHabits'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import ProjectsWidget from '../components/widgets/ProjectsWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'

function ProductivityRing({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const r = 16
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: 44, height: 44 }}>
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--surface2)" strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none"
          stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
      </svg>
      <div className="absolute text-[10px] font-semibold leading-none flex flex-col items-center">
        <span>{done}/{total}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const { habits, todayDone } = useHabits()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-1 pt-2">
        <div className="min-w-0">
          <div className="text-2xl font-semibold truncate">{getGreeting()}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <ProductivityRing done={todayDone} total={habits.length} />
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Projects */}
      <ProjectsWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
