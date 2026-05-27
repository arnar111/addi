import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'
import LendoWidget from '../components/widgets/LendoWidget'
import SubscriptionWidget from '../components/widgets/SubscriptionWidget'
import { useLocalStorage } from '../hooks/useLocalStorage'

const QUICK_LINKS = [
  { icon: '🛵', label: 'Wolt', url: 'https://wolt.com/is' },
  { icon: '🎵', label: 'Spotify', url: 'https://open.spotify.com' },
  { icon: '🦜', label: 'Duo', url: 'https://duolingo.com' },
  { icon: '📦', label: 'Dropp', url: 'https://dropp.is', alert: true },
  { icon: '📚', label: 'Audible', url: 'https://audible.com', alert: true },
  { icon: '📰', label: 'Athletic', url: 'https://theathletic.com' },
  { icon: '🏦', label: 'Banki', url: 'https://islandsbanki.is' },
]

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Addi')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">
          {getGreeting()}, {name}! {getEmoji(time)}
        </div>
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

      {/* Quick links bar */}
      <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {QUICK_LINKS.map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center gap-1 shrink-0 py-2.5 px-3 rounded-xl relative"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)', WebkitTapHighlightColor: 'transparent' }}>
            {l.alert && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ background: 'var(--accent3)' }} />
            )}
            <span className="text-xl">{l.icon}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{l.label}</span>
          </a>
        ))}
      </div>

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Lendó business tracker */}
      <LendoWidget />

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Subscription alerts */}
      <SubscriptionWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}

function getEmoji(time) {
  const h = time.getHours()
  if (h >= 6 && h < 12) return '☀️'
  if (h >= 12 && h < 17) return '🌤️'
  if (h >= 17 && h < 21) return '🌆'
  return '🌙'
}
