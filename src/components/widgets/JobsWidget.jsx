import { Link } from 'react-router-dom'
import { useJobs, JOB_STATUSES } from '../../hooks/useJobs'
import { ChevronRight, Plus } from 'lucide-react'

export default function JobsWidget() {
  const { jobs, activeCount, byStatus } = useJobs()
  const statusMap = byStatus()
  const active = jobs.filter(j => j.status !== 'rejected').slice(0, 3)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">💼 Atvinnuleit</h3>
        <Link to="/jobs" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {/* Mini pipeline */}
      <div className="flex gap-1.5 mb-3">
        {JOB_STATUSES.map(s => (
          <div key={s.id} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl"
               style={{ background: 'var(--surface2)' }}>
            <span style={{ fontSize: 14 }}>{s.icon}</span>
            <span className="font-bold text-sm" style={{ color: s.color }}>{(statusMap[s.id] || []).length}</span>
          </div>
        ))}
      </div>

      {active.length === 0 ? (
        <Link to="/jobs" className="flex items-center gap-2 py-2 text-sm justify-center" style={{ color: 'var(--muted)' }}>
          <Plus size={14} /> Bæta við fyrstu umsókn
        </Link>
      ) : (
        <div className="flex flex-col gap-1.5">
          {active.map(job => {
            const s = JOB_STATUSES.find(s => s.id === job.status) || JOB_STATUSES[0]
            return (
              <div key={job.id} className="flex items-center gap-2.5 py-2 px-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{job.company}</div>
                  <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>{job.title}</div>
                </div>
                <span className="text-xs shrink-0" style={{ color: s.color }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
