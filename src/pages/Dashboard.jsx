import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SportWidget from '../components/widgets/SportWidget'
import SubscriptionsWidget from '../components/widgets/SubscriptionsWidget'

const QUICK_LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '⚽' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/', icon: '💼' },
  { label: 'GitHub', url: 'https://github.com/arnar111', icon: '🐙' },
  { label: 'Patreon', url: 'https://patreon.com', icon: '🎬' },
  { label: 'Huel', url: 'https://huel.com', icon: '🥤' },
  { label: 'Transfermarkt', url: 'https://transfermarkt.com', icon: '📊' },
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
        <div className="text-2xl font-semibold">{getGreeting()} 👋</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* WC 2026 Countdown — prime real estate */}
      <SportWidget />

      {/* Weather */}
      <WeatherWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance + Subscriptions */}
      <div className="grid md:grid-cols-2 gap-4">
        <FinanceSnapshotWidget />
        <SubscriptionsWidget />
      </div>

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--muted)' }}>Fljótlegar tenglar</h3>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_LINKS.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl">{l.icon}</span>
              <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{l.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
