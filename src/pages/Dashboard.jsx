import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import LendoWidget from '../components/widgets/LendoWidget'
import WorldCupWidget from '../components/widgets/WorldCupWidget'

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
        <div className="text-2xl font-semibold">{getGreeting()}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {formatTime(time)} · {formatDate(time)}
          </span>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Lendó + World Cup side by side */}
      <div className="grid grid-cols-2 gap-3">
        <LendoWidget />
        <WorldCupWidget />
      </div>

      {/* Quick tasks */}
      <QuickTasksWidget />

      {/* Finance snapshot */}
      <FinanceSnapshotWidget />
    </div>
  )
}
