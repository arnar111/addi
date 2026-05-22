import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import { useSidebar } from '../context/SidebarContext'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import CurrencyWidget from '../components/widgets/CurrencyWidget'
import SubscriptionWidget from '../components/widgets/SubscriptionWidget'
import { Menu } from 'lucide-react'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const { open } = useSidebar()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between px-1 pt-2">
        <div>
          <div className="text-2xl font-semibold">{getGreeting()}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {formatTime(time)} · {formatDate(time)}
            </span>
          </div>
        </div>
        <button onClick={open} className="md:hidden p-2 rounded-xl" style={{ color: 'var(--muted)', background: 'var(--surface)' }}>
          <Menu size={20} />
        </button>
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

      {/* Subscriptions */}
      <SubscriptionWidget />

      {/* Currency */}
      <CurrencyWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
