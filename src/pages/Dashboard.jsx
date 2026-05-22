import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'
import JobsWidget from '../components/widgets/JobsWidget'

const NEWS_LINKS = [
  { label: 'Heimildin', url: 'https://heimildin.is', flag: '🇮🇸' },
  { label: 'The Athletic', url: 'https://theathletic.com', flag: '⚽' },
  { label: 'Vísir', url: 'https://visir.is', flag: '📰' },
]

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
        <div className="text-2xl font-semibold">{getGreeting()}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* World Cup countdown */}
      <WorldCupWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Jobs snapshot */}
      <JobsWidget />

      {/* Quick links to news */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Fréttir</h3>
        <div className="flex gap-2 flex-wrap">
          {NEWS_LINKS.map(n => (
            <a key={n.label} href={n.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
               style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none' }}>
              <span>{n.flag}</span>
              <span>{n.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
