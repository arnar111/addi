import { useState, useEffect } from 'react'
import { getGreeting, formatTime, formatDate } from '../utils/time'
import WeatherWidget from '../components/widgets/WeatherWidget'
import QuickTasksWidget from '../components/widgets/QuickTasksWidget'
import HabitsWidget from '../components/widgets/HabitsWidget'
import FinanceSnapshotWidget from '../components/widgets/FinanceSnapshotWidget'
import QuickNoteWidget from '../components/widgets/QuickNoteWidget'
import SpotifyWidget from '../components/widgets/SpotifyWidget'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { useFinance } from '../hooks/useFinance'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatShortISK } from '../utils/currency'
import { CheckSquare, Flame, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

function QuickStat({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to} className="flex-1 flex flex-col gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <Icon size={15} style={{ color }} />
      <div className="text-base font-bold leading-tight tabular-nums">{value}</div>
      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</div>
    </Link>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date())
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const { pending } = useTasks()
  const { todayDone, habits } = useHabits()
  const { remaining } = useFinance()
  const left = remaining()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <div className="text-2xl font-semibold">{getGreeting(name)}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-mono font-medium" style={{ color: 'var(--accent)' }}>
            {formatTime(time)}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            · {formatDate(time)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <QuickStat
          icon={CheckSquare}
          label="Verkefni"
          value={pending.length === 0 ? '✓ Allt' : `${pending.length} eftir`}
          color={pending.length === 0 ? 'var(--success)' : '#f97316'}
          to="/tasks"
        />
        <QuickStat
          icon={Flame}
          label="Vanir"
          value={`${todayDone}/${habits.length}`}
          color="#f97316"
          to="/habits"
        />
        <QuickStat
          icon={Wallet}
          label="Eftir af fjárh."
          value={formatShortISK(Math.abs(left))}
          color={left < 0 ? 'var(--danger)' : 'var(--success)'}
          to="/finance"
        />
      </div>

      <WeatherWidget />

      <SpotifyWidget />

      <div className="grid md:grid-cols-2 gap-4">
        <QuickTasksWidget />
        <HabitsWidget />
      </div>

      <FinanceSnapshotWidget />

      <QuickNoteWidget />
    </div>
  )
}
