import { useState, useEffect } from 'react'
import { formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import SubscriptionsWidget from '../components/widgets/SubscriptionsWidget'
import ProjectsWidget from '../components/widgets/ProjectsWidget'

const GREETINGS_BY_HOUR = [
  [21, 'Góða nótt, Arnar'],
  [17, 'Gott kvöld, Arnar'],
  [12, 'Gott síðdegi, Arnar'],
  [5, 'Góðan daginn, Arnar'],
  [0, 'Góða nótt, Arnar'],
]

function personalGreeting() {
  const h = new Date().getHours()
  return (GREETINGS_BY_HOUR.find(([from]) => h >= from) ?? GREETINGS_BY_HOUR[0])[1]
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const dayName = time.toLocaleDateString('is-IS', { weekday: 'long' })
  const dateStr = time.toLocaleDateString('is-IS', { day: 'numeric', month: 'long' })

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{personalGreeting()}</div>
        <div className="text-sm mt-0.5 capitalize" style={{ color: 'var(--muted)' }}>
          {dayName}, {dateStr} · {formatTime(time)}
        </div>
      </div>

      <WeatherWidget />

      <SpotifyWidget />

      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FinanceSnapshotWidget />
        <SubscriptionsWidget />
      </div>

      <ProjectsWidget />

      <QuickNoteWidget />
    </div>
  )
}
