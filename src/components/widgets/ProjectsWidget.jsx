import { useProjects } from '../../hooks/useProjects'
import { ChevronRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

function ProgressRing({ pct, color, size = 36 }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(100, pct) / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={5} stroke="var(--surface2)" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={5}
        stroke={color} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}

export default function ProjectsWidget() {
  const { active } = useProjects()
  const shown = active.slice(0, 3)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Verkefni</h3>
        <Link to="/projects" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>Engin virk verkefni</p>
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map(p => {
            const doneTasks = p.tasks.filter(t => t.done).length
            const totalTasks = p.tasks.length
            return (
              <Link key={p.id} to="/projects"
                className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                style={{ background: 'var(--surface2)', textDecoration: 'none' }}>
                <ProgressRing pct={p.progress} color={p.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base leading-none">{p.icon}</span>
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{p.name}</span>
                  </div>
                  {totalTasks > 0 && (
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {doneTasks}/{totalTasks} liðir
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold shrink-0" style={{ color: p.color }}>
                  {p.progress}%
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
