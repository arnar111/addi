import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SubscriptionAlertWidget from '../components/widgets/SubscriptionAlertWidget'
import FootballWidget from '../components/widgets/FootballWidget'

const QUICK_LINKS = [
  { name: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
  { name: 'Alfred.is', url: 'https://alfred.is', icon: '💼' },
  { name: 'r/ClaudeAI', url: 'https://reddit.com/r/ClaudeAI', icon: '🤖' },
  { name: 'Kringlan', url: 'https://kringlan.is', icon: '🛍️' },
  { name: 'Netlify', url: 'https://app.netlify.com', icon: '🚀' },
  { name: 'GitHub', url: 'https://github.com/arnar111', icon: '🐙' },
  { name: 'Coursera', url: 'https://coursera.org', icon: '🎓' },
  { name: 'BBC Sport', url: 'https://bbc.com/sport/football', icon: '⚽' },
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
        <div className="text-2xl font-semibold">{getGreeting()}, Arnar 👋</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Football + Subscription row */}
      <FootballWidget />
      <SubscriptionAlertWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits side by side on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Quick Links */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--muted)' }}>Flýtileiðir</h3>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_LINKS.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:scale-105 active:scale-95"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-xl">{link.icon}</span>
              <span style={{ color: 'var(--muted)', fontSize: 9, textAlign: 'center', lineHeight: 1.2 }}>{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
