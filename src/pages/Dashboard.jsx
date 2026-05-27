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
import CryptoWidget from '../components/widgets/CryptoWidget'
import NBAWidget from '../components/widgets/NBAWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useShopping } from '../hooks/useShopping'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const QUICK_LINKS = [
  { name: 'Wolt', url: 'https://wolt.com/is/isl/reykjavik', icon: '🛵' },
  { name: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
  { name: 'Arsenal', url: 'https://theathletic.com/team/arsenal/', icon: '🔴' },
  { name: 'Dropp', url: 'https://dropp.is', icon: '📦' },
  { name: 'Duolingo', url: 'https://duolingo.com', icon: '🦜' },
  { name: 'Audible', url: 'https://audible.com', icon: '📚' },
  { name: 'GitHub', url: 'https://github.com/arnar111', icon: '🐙' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
]

function ShoppingSnapshotWidget() {
  const { pending } = useShopping()
  if (pending.length === 0) return null
  return (
    <NavLink
      to="/shopping"
      className="card flex items-center gap-3"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: 'rgba(234,179,8,0.15)' }}>
        <ShoppingCart size={18} style={{ color: '#eab308' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">Innkaupalisti</div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {pending.length} {pending.length === 1 ? 'hlutur' : 'hlutir'} á listanum
        </div>
      </div>
      <ArrowRight size={16} style={{ color: 'var(--muted)' }} />
    </NavLink>
  )
}

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
        <div className="text-2xl font-semibold">{getGreeting(name)} 👋</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* World Cup 2026 countdown */}
      <WorldCupWidget />

      {/* Football + Subscription alerts */}
      <FootballWidget />
      <NBAWidget />
      <SubscriptionAlertWidget />

      {/* Spotify */}
      <SpotifyWidget />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Shopping reminder */}
      <ShoppingSnapshotWidget />

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Crypto */}
      <CryptoWidget />

      {/* Quick Links */}
      <div className="card flex flex-col gap-3">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--muted)' }}>FLÝTILEIÐIR</h3>
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
