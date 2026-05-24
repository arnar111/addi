import { Link } from 'react-router-dom'
import { useProjects, STATUS_CONFIG } from '../../hooks/useProjects'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function ProjectsWidget() {
  const { projects, activeCount } = useProjects()
  const visible = projects.filter(p => p.status === 'active' || p.status === 'building').slice(0, 3)

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🚀</span>
          <span className="font-semibold text-sm">Verkefni</span>
          <span className="badge text-xs"
            style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            {activeCount} virk
          </span>
        </div>
        <Link to="/projects" className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
          Öll <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map(p => {
          const sc = STATUS_CONFIG[p.status]
          return (
            <div key={p.id} className="flex items-center gap-2.5">
              <span className="text-lg">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{p.name}</div>
                <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{p.description}</div>
              </div>
              <span className="badge shrink-0" style={{ background: sc.bg, color: sc.color, fontSize: 10 }}>
                {sc.label}
              </span>
              {p.netlify && (
                <a href={p.netlify} target="_blank" rel="noopener noreferrer"
                   className="shrink-0 p-1" style={{ color: 'var(--muted)' }}>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
