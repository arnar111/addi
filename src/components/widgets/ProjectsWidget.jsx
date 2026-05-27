import { Link } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import { FolderKanban, ChevronRight, Calendar } from 'lucide-react'

const formatDate = (d) => {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('is-IS', { day: 'numeric', month: 'short' })
  } catch {
    return d
  }
}

export default function ProjectsWidget() {
  const { active } = useProjects()
  const top = active.slice(0, 2)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderKanban size={15} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold text-sm">Verkefni</h3>
          <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            {active.length} í gangi
          </span>
        </div>
        <Link to="/projects" className="text-xs flex items-center gap-0.5" style={{ color: 'var(--accent)' }}>
          Sjá öll <ChevronRight size={12} />
        </Link>
      </div>

      {top.length === 0 ? (
        <Link to="/projects" className="block text-center py-4 text-sm" style={{ color: 'var(--muted)' }}>
          Engin virk verkefni · smelltu hér
        </Link>
      ) : (
        <div className="flex flex-col gap-2">
          {top.map(p => {
            const total = p.milestones.length
            const done = p.milestones.filter(m => m.done).length
            const pct = total ? Math.round((done / total) * 100) : 0
            const nextMs = p.milestones.find(m => !m.done)
            return (
              <Link key={p.id} to="/projects"
                className="flex items-start gap-3 p-2.5 rounded-xl transition-all"
                style={{ background: 'var(--surface2)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                     style={{ background: `${p.color}22`, border: `1px solid ${p.color}44` }}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">{p.name}</span>
                    <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>{done}/{total}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden mt-1.5" style={{ background: 'var(--bg)' }}>
                    <div className="h-full rounded-full transition-all"
                         style={{ width: `${pct}%`, background: p.color }} />
                  </div>
                  {nextMs && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                      <span className="truncate">→ {nextMs.text}</span>
                      {nextMs.dueDate && (
                        <span className="flex items-center gap-0.5 shrink-0">
                          <Calendar size={9} /> {formatDate(nextMs.dueDate)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
