import { NavLink } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'

const KEY_PROJECTS = [
  { name: 'Takkarena', url: 'https://takkmvp.netlify.app', status: 'active', color: '#00d4aa' },
  { name: 'Lendo', url: 'https://lendoapp.is', status: 'live', color: '#8b5cf6' },
  { name: 'Eign', url: null, status: 'dev', color: '#f97316' },
]

const STATUS_DOT = {
  live: { color: 'var(--success)', pulse: true },
  active: { color: 'var(--accent)', pulse: true },
  dev: { color: '#f97316', pulse: false },
}

export default function ProjectsWidget() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">Verkefni mín</span>
        <NavLink to="/projects"
          style={{ textDecoration: 'none', color: 'var(--accent)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 2 }}>
          Sjá öll <ChevronRight size={13} />
        </NavLink>
      </div>
      <div className="flex flex-col gap-2.5">
        {KEY_PROJECTS.map(p => {
          const dot = STATUS_DOT[p.status] || STATUS_DOT.dev
          return (
            <div key={p.name} className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dot.pulse ? 'animate-pulse-soft' : ''}`}
                    style={{ background: dot.color }} />
              <span className="text-sm flex-1">{p.name}</span>
              {p.url && (
                <a href={p.url} target="_blank" rel="noreferrer"
                   onClick={e => e.stopPropagation()}
                   style={{ color: 'var(--muted)', display: 'flex' }}>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
