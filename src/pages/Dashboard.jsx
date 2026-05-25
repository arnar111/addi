import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SportsWidget from '../components/widgets/SportsWidget'

function WoltPassTracker() {
  const today = new Date().toISOString().split('T')[0]
  const [usedDays, setUsedDays] = useLocalStorage('addi_wolt_used', [])
  const usedToday = usedDays.includes(today)

  const toggle = () => {
    if (usedToday) {
      setUsedDays(prev => prev.filter(d => d !== today))
    } else {
      setUsedDays(prev => [...prev, today])
    }
  }

  const thisMonth = usedDays.filter(d => d.startsWith(today.slice(0, 7))).length

  return (
    <button onClick={toggle} className="card flex items-center gap-3 w-full text-left transition-all"
      style={{
        border: `1px solid ${usedToday ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
        background: usedToday ? 'rgba(0,212,170,0.05)' : 'var(--surface)',
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
           style={{ background: 'rgba(0,212,170,0.1)' }}>
        🛵
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">Wolt Dagspassinn</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {usedToday
            ? `✓ Notaður í dag · ${thisMonth}× þennan mánuð`
            : `Ekki notaður ennþá · ${thisMonth}× þennan mánuð`}
        </div>
      </div>
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all"
           style={{ background: usedToday ? 'var(--accent)' : 'var(--surface2)', color: usedToday ? '#000' : 'var(--muted)' }}>
        {usedToday ? '✓' : ''}
      </div>
    </button>
  )
}

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

      {/* Wolt daily pass */}
      <WoltPassTracker />

      {/* Sports */}
      <SportsWidget />

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
