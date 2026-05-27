import { useState, useEffect } from 'react'
import { formatTime, formatDate } from '../utils/time'
import { useLocalStorage } from '../hooks/useLocalStorage'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import FootballWidget from '../components/widgets/FootballWidget'
import SubscriptionsWidget from '../components/widgets/SubscriptionsWidget'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const hour = time.getHours()
  const greeting = hour < 6 ? 'Góða nótt' : hour < 12 ? 'Góðan dag' : hour < 18 ? 'Gott kvöld' : 'Gott kvöld'

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-3">
        <div className="text-2xl font-semibold">{greeting}, {name} 👋</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Football - Premier League */}
      <FootballWidget />

      {/* Tasks + Habits side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      {/* Subscriptions snapshot */}
      <SubscriptionsWidget />

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
