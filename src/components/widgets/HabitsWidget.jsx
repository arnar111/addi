import { useHabits } from '../../hooks/useHabits'
import { Flame, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HabitsWidget() {
  const { habits, toggle, isDoneToday, streakFor, todayDone } = useHabits()
  const pct = habits.length ? Math.round((todayDone / habits.length) * 100) : 0
  const allDone = habits.length > 0 && todayDone === habits.length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Vanur</h3>
        <div className="flex items-center gap-2">
          <span
            className="badge"
            style={{
              background: allDone ? 'rgba(34,197,94,0.12)' : 'rgba(0,212,170,0.12)',
              color: allDone ? 'var(--success)' : 'var(--accent)',
            }}>
            {todayDone}/{habits.length}
          </span>
          <Link to="/habits" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      {habits.length > 0 && (
        <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: 'var(--surface2)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: allDone ? 'var(--success)' : 'var(--accent)',
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {habits.map(h => {
          const done = isDoneToday(h.id)
          const streak = streakFor(h.id)
          return (
            <button
              key={h.id}
              onClick={() => toggle(h.id)}
              className="flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all active:scale-95"
              style={{
                background: done ? `${h.color}1a` : 'var(--surface2)',
                border: `1px solid ${done ? h.color + '44' : 'transparent'}`,
              }}>
              <div className="flex items-center justify-between w-full">
                <span className="text-xl">{h.icon}</span>
                {streak > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                    <Flame size={11} />{streak}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium leading-tight">{h.name}</span>
              {done && <span className="text-xs" style={{ color: h.color }}>✓ Lokið</span>}
            </button>
          )
        })}
      </div>

      {habits.length === 0 && (
        <Link to="/habits" className="block text-center py-3 text-sm" style={{ color: 'var(--muted)' }}>
          Bæta við vana →
        </Link>
      )}
    </div>
  )
}
