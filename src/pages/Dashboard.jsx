import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import { useWCCountdown } from '../hooks/useSports'
import { useLendo } from '../hooks/useLendo'
import { useJobs } from '../hooks/useJobs'
import { formatShortISK } from '../utils/currency'

function WCBanner() {
  const wc = useWCCountdown()

  if (wc.started) {
    return (
      <Link to="/sports" style={{ textDecoration: 'none' }}>
        <div className="card flex items-center gap-3 py-3" style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(239,68,68,0.08))',
          border: '1px solid rgba(249,115,22,0.3)'
        }}>
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <div className="text-sm font-semibold">World Cup 2026 er hafið!</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Smelltu til að sjá stöðu leikja</div>
          </div>
          <ArrowRight size={16} style={{ color: 'var(--muted)' }} />
        </div>
      </Link>
    )
  }

  return (
    <Link to="/sports" style={{ textDecoration: 'none' }}>
      <div className="card flex items-center gap-3 py-3" style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(0,212,170,0.15)'
      }}>
        <span className="text-2xl">🏆</span>
        <div className="flex-1">
          <div className="text-sm font-semibold">WC 2026 · {wc.days} dagar eftir</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {wc.hours}:{String(wc.minutes).padStart(2, '0')}:{String(wc.seconds).padStart(2, '0')} · 11. júní · Mexico City
          </div>
        </div>
        <ArrowRight size={16} style={{ color: 'var(--muted)' }} />
      </div>
    </Link>
  )
}

function LendoSnapshot() {
  const { thisMonthIncome, upcomingBookings, monthlyGoal } = useLendo()
  const income = thisMonthIncome()
  const upcoming = upcomingBookings()
  const pct = Math.min(100, Math.round((income / monthlyGoal) * 100))

  return (
    <Link to="/lendo" style={{ textDecoration: 'none' }}>
      <div className="card py-3" style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🏠</span>
            <span className="text-sm font-semibold">Lendó</span>
          </div>
          <ArrowRight size={14} style={{ color: 'var(--muted)' }} />
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatShortISK(income)}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>þessa mánuð · markmið {formatShortISK(monthlyGoal)}</div>
          </div>
          {upcoming.length > 0 && (
            <div className="text-right">
              <div className="text-sm font-semibold">{upcoming.length}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>næstu bókanir</div>
            </div>
          )}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 100 ? '#22c55e' : 'var(--accent)' }} />
        </div>
      </div>
    </Link>
  )
}

function JobsSnapshot() {
  const { active, interviews, offers } = useJobs()
  if (active.length === 0 && interviews.length === 0) return null

  return (
    <Link to="/jobs" style={{ textDecoration: 'none' }}>
      <div className="card py-3 flex items-center gap-4" style={{ border: '1px solid var(--border)' }}>
        <span className="text-base">💼</span>
        <div className="flex-1">
          <div className="text-sm font-semibold">Starf</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {active.length} virk umsókn{active.length !== 1 ? 'ir' : ''}
            {interviews.length > 0 ? ` · ${interviews.length} viðtöl 🔥` : ''}
            {offers.length > 0 ? ` · ${offers.length} tilboð! 🎉` : ''}
          </div>
        </div>
        <ArrowRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
    </Link>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting()}, Addi 👋</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* World Cup Countdown */}
      <WCBanner />

      {/* Lendó + Jobs side by side */}
      <div className="grid grid-cols-1 gap-3">
        <LendoSnapshot />
        <JobsSnapshot />
      </div>

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
