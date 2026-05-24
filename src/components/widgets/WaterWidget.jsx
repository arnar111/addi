import { useWater } from '../../hooks/useWater'
import { Minus, Plus } from 'lucide-react'

export default function WaterWidget() {
  const { todayCount, goal, add, subtract } = useWater()
  const pct = Math.min(100, Math.round((todayCount / goal) * 100))
  const done = todayCount >= goal

  return (
    <div className="card flex items-center gap-3"
         style={{ background: done ? 'rgba(59,130,246,0.08)' : undefined, borderColor: done ? 'rgba(59,130,246,0.3)' : undefined }}>
      <div className="relative w-10 h-10 shrink-0">
        <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" strokeWidth="3" stroke="var(--surface2)" />
          <circle cx="20" cy="20" r="16" fill="none" strokeWidth="3"
            stroke={done ? '#3b82f6' : '#60a5fa'}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${2 * Math.PI * 16 * (1 - pct / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-base">💧</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Vatn í dag</span>
          {done && <span className="text-xs font-bold" style={{ color: '#3b82f6' }}>✓ Markmið náð!</span>}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="font-bold text-sm tabular-nums">{todayCount}</span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>/ {goal} glös</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={subtract} disabled={todayCount === 0}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'var(--surface2)', opacity: todayCount === 0 ? 0.4 : 1 }}>
          <Minus size={12} />
        </button>
        <button onClick={add}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}>
          <Plus size={12} />
        </button>
      </div>
    </div>
  )
}
