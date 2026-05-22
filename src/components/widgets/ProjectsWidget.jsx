import { useProjects, STATUS } from '../../hooks/useProjects'
import { useNavigate } from 'react-router-dom'
import { FolderGit2 } from 'lucide-react'

export default function ProjectsWidget() {
  const { projects } = useProjects()
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate('/projects')} className="card w-full text-left">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderGit2 size={14} style={{ color: 'var(--accent2)' }} />
          <span className="font-semibold text-sm">Verkefni</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {projects.filter(p => p.status === 'active').length} virk →
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {projects.map(p => {
          const st = STATUS[p.status] || STATUS.paused
          return (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                   style={{ background: p.color + '18', border: `1.5px solid ${p.color}30` }}>
                {p.icon}
              </div>
              <span className="text-xs font-medium truncate w-full text-center"
                    style={{ fontSize: 10 }}>{p.name}</span>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
            </div>
          )
        })}
      </div>
    </button>
  )
}
