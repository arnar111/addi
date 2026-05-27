import { useHabits } from '../../hooks/useHabits'
import { Flame } from 'lucide-react'

export default function HabitsWidget() {
  const { habits, toggle, isDoneToday, streakFor, todayDone } = useHabits()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Venjur í dag</div>
        <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
          {todayDone}/{habits.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {habits.map(h => {
          const done = isDoneToday(h.id)
          const streak = streakFor(h.id)
          return (
            <button key={h.id} onClick={() => toggle(h.id)}
              className="flex items-center gap-3 w-full text-left rounded-xl px-3 py-2.5 transition-all"
              style={{
                background: done ? `${h.color}18` : 'var(--surface2)',
                border: `1px solid ${done ? h.color + '44' : 'transparent'}`,
              }}>
              <span className="text-xl">{h.icon}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: done ? 'var(--text)' : 'var(--muted)' }}>
                {h.name}
              </span>
              {streak > 1 && (
                <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#f97316' }}>
                  <Flame size={11} />{streak}
                </span>
              )}
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                   style={{
                     background: done ? h.color : 'transparent',
                     border: `2px solid ${done ? h.color : 'var(--border)'}`,
                   }}>
                {done && <span style={{ fontSize: 10, color: '#000' }}>✓</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
