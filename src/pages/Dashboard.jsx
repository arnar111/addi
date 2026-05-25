import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { formatShortISK } from '../utils/currency'
import { useSubscriptions } from '../hooks/useSubscriptions'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import { NavLink } from 'react-router-dom'
import { ExternalLink, AlertCircle, Trophy, Mic } from 'lucide-react'

const SPORTS_QUICK = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
  { label: 'FlashScore', url: 'https://www.flashscore.com', icon: '⚡' },
  { label: 'ISL', url: 'https://www.ksi.is', icon: '🇮🇸' },
  { label: 'ATP/WTA', url: 'https://www.atptour.com', icon: '🎾' },
]

function SubscriptionAlert({ monthly, paused }) {
  if (paused.length === 0) return null
  return (
    <div className="card flex items-center gap-3 py-3"
         style={{ borderColor: 'rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.06)' }}>
      <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
          {paused.length} áskrift{paused.length > 1 ? 'ir' : ''} í greiðsluvandræðum
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
          {paused.map(s => s.name).join(', ')}
        </div>
      </div>
      <NavLink to="/finance" className="text-xs font-medium shrink-0" style={{ color: 'var(--danger)' }}>
        Skoða →
      </NavLink>
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const { monthlyTotal, pausedSubs } = useSubscriptions()

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

      {/* Subscription alert */}
      <SubscriptionAlert monthly={monthlyTotal()} paused={pausedSubs} />

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

      {/* Sports mini hub */}
      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={15} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold">Íþróttir</span>
          </div>
          <NavLink to="/sports" className="text-xs" style={{ color: 'var(--accent)' }}>Sjá leiki →</NavLink>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {SPORTS_QUICK.map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-center transition-all"
               style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
              <span className="text-lg">{l.icon}</span>
              <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{l.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Takk debate quick-start */}
      <NavLink to="/timer"
        className="card flex items-center gap-3 py-3"
        style={{ textDecoration: 'none', borderColor: 'rgba(236,72,153,0.2)', background: 'rgba(236,72,153,0.04)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(236,72,153,0.15)' }}>
          <Mic size={18} style={{ color: '#ec4899' }} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Ræðukeppni – Takk</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Smelltu til að ræsa ræðutímara</div>
        </div>
        <span className="text-xs font-medium" style={{ color: '#ec4899' }}>Hefja →</span>
      </NavLink>

      {/* Subscription cost reminder */}
      <div className="card flex items-center justify-between py-3">
        <div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Áskriftir þennan mánuð</div>
          <div className="text-lg font-semibold" style={{ color: 'var(--accent2)' }}>{formatShortISK(monthlyTotal())}</div>
        </div>
        <NavLink to="/finance" className="btn text-xs py-1.5 px-3" style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--surface2)', textDecoration: 'none' }}>
          Skoða áskriftir
        </NavLink>
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
