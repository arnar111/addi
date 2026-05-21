import { useHabits } from '../../hooks/useHabits'
import { Flame } from 'lucide-react'

export default function HabitsWidget() {
  const { habits, toggle, isDoneToday, streakFor, todayDone } = useHabits()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Vanur</h3>
        <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
          {todayDone}/{habits.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {habits.map(h => {
          const done = isDoneToday(h.id)
          const streak = streakFor(h.id)
          return (
            <button key={h.id} onClick={() => toggle(h.id)}
              className="flex flex-col gap-1.5 p-3 rounded-xl text-left transition-all"
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
              {done && <span className="text-xs" style={{ color: 'var(--accent)' }}>✓ Lokið</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
