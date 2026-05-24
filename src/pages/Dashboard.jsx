import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import AuroraWidget from '../components/widgets/AuroraWidget'
import SportsWidget from '../components/widgets/SportsWidget'
import LendoWidget from '../components/widgets/LendoWidget'

export default function Dashboard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-3">
        <div className="text-2xl font-semibold">{getGreeting('Addi')}</div>
        <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          {formatTime(time)} · {formatDate(time)}
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Aurora */}
      <AuroraWidget />

      {/* Lendó + Sports side by side */}
      <div className="grid grid-cols-2 gap-3">
        <LendoWidget />
        <SportsWidget />
      </div>

      {/* Habits + Tasks */}
      <div className="grid md:grid-cols-2 gap-4">
        <HabitsWidget />
        <QuickTasksWidget />
      </div>

      {/* Quick note */}
      <QuickNoteWidget />
    </div>
  )
}
