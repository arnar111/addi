import { useHabits } from '../../hooks/useHabits'

export default function HabitsWidget() {
  const { habits, toggle, isDoneToday, streakFor, todayDone } = useHabits()

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Vanur</h3>
        <span className="badge"
              style={{
                background: todayDone === habits.length ? 'rgba(0,212,170,0.15)' : 'rgba(100,116,139,0.15)',
                color: todayDone === habits.length ? 'var(--accent)' : 'var(--muted)',
              }}>
          {todayDone}/{habits.length}
        </span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
        <div className="h-full rounded-full transition-all duration-500"
             style={{
               width: habits.length ? `${(todayDone / habits.length) * 100}%` : '0%',
               background: 'var(--accent)',
             }} />
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
                    🔥{streak}
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
