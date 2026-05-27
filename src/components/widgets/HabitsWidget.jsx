import { useHabits } from '../../hooks/useHabits'
import { Flame } from 'lucide-react'

export default function HabitsWidget() {
  const { habits, toggle, isDoneToday, streakFor, todayDone } = useHabits()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Vanur</h3>
        <span className="badge" style={{
          background: todayDone === habits.length ? 'rgba(34,197,94,0.15)' : 'rgba(0,212,170,0.12)',
          color: todayDone === habits.length ? 'var(--success)' : 'var(--accent)'
        }}>
          {todayDone}/{habits.length} {todayDone === habits.length ? '🎯' : ''}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {habits.map(h => {
          const done = isDoneToday(h.id)
          const streak = streakFor(h.id)
          return (
            <button key={h.id} onClick={() => toggle(h.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all w-full"
              style={{
                background: done ? `${h.color}18` : 'var(--surface2)',
                border: `1px solid ${done ? h.color + '40' : 'transparent'}`,
              }}>
              <span className="text-lg shrink-0">{h.icon}</span>
              <span className="flex-1 text-sm font-medium">{h.name}</span>
              {streak > 0 && (
                <span className="flex items-center gap-0.5 text-xs font-bold shrink-0" style={{ color: '#f97316' }}>
                  <Flame size={12} />{streak}
                </span>
              )}
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                   style={{ borderColor: done ? h.color : 'var(--border)', background: done ? h.color : 'transparent' }}>
                {done && <span style={{ fontSize: 10, color: '#000', fontWeight: 700 }}>✓</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
