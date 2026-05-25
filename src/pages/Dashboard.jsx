import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useHabits } from '../hooks/useHabits'
import { useTasks } from '../hooks/useTasks'
import { useLendo } from '../hooks/useLendo'
import { useSubscriptions } from '../hooks/useSubscriptions'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import LendoWidget from '../components/widgets/LendoWidget'
import SubscriptionsWidget from '../components/widgets/SubscriptionsWidget'

function AlertBanner({ alerts }) {
  if (!alerts.length) return null
  return (
    <div className="flex flex-col gap-2">
      {alerts.map((a, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: `${a.color}12`,
            border: `1px solid ${a.color}30`,
          }}
        >
          <span>{a.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{a.title}</div>
            {a.body && <div className="text-xs mt-0.5" style={{ color: 'var(--text2)' }}>{a.body}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const { todayDone, habits } = useHabits()
  const { pending } = useTasks()
  const { upcomingBookings, unpaidRevenue } = useLendo()
  const { subs } = useSubscriptions()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  // Build smart alerts
  const alerts = []

  const unpaid = unpaidRevenue()
  if (unpaid > 0) {
    const ub = upcomingBookings()
    alerts.push({
      icon: '🏠',
      title: `Lendó: Ógreitt ${Math.round(unpaid / 1000)}þ kr`,
      body: ub.length ? `${ub[0].customerName} – ${new Date(ub[0].startDate).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}` : null,
      color: '#f97316',
    })
  }

  const netlify = subs.find(s => s.id === 'netlify' && s.active)
  if (netlify) {
    alerts.push({
      icon: '🌐',
      title: 'Netlify: Uppfærðu greiðslukort',
      body: 'Verkefni þín renna út eftir 22 daga',
      color: '#ef4444',
    })
  }

  const growit = subs.find(s => s.id === 'growit' && s.active)
  if (growit) {
    alerts.push({
      icon: '🌱',
      title: 'GrowIt: Greiðsluvandamál á Apple',
      body: 'Uppfærðu greiðsluupplýsingar',
      color: '#f59e0b',
    })
  }

  const highTasks = pending.filter(t => t.priority === 'high')
  if (highTasks.length > 0) {
    alerts.push({
      icon: '🔴',
      title: `${highTasks.length} brýnt verkefni`,
      body: highTasks[0].text,
      color: '#ef4444',
    })
  }

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-4">
        <div className="text-2xl font-semibold tracking-tight">{getGreeting()}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm" style={{ color: 'var(--text2)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
        {/* Quick stats row */}
        <div className="flex gap-2 mt-3 scroll-row">
          <div className="pill shrink-0">
            ✅ {pending.length} verkefni
          </div>
          <div className="pill shrink-0">
            🔥 {todayDone}/{habits.length} vanur
          </div>
          <div className="pill shrink-0">
            🏠 {upcomingBookings().length} pantanir
          </div>
        </div>
      </div>

      {/* Smart alerts */}
      <AlertBanner alerts={alerts} />

      {/* Weather */}
      <WeatherWidget />

      {/* Spotify */}
      <SpotifyWidget spotifyData={null} />

      {/* Tasks + Habits */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Lendó */}
      <LendoWidget />

      {/* Subscriptions */}
      <SubscriptionsWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
