import { Link } from 'react-router-dom'
import { useJobs, STATUS_LABEL, STATUS_COLOR } from '../../hooks/useJobs'
import { Briefcase, ChevronRight } from 'lucide-react'

export default function JobsSnapshotWidget() {
  const { jobs, active, byStatus } = useJobs()

  if (jobs.length === 0) return null

  const interviews = byStatus('interview').length
  const offers = byStatus('offer').length
  const applied = byStatus('applied').length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Briefcase size={15} style={{ color: '#3b82f6' }} />
          <h3 className="font-semibold text-sm">Starfsleit</h3>
        </div>
        <Link to="/jobs" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          ['applied', 'Sótt um', applied],
          ['interview', 'Viðtal', interviews],
          ['offer', 'Boð', offers],
        ].map(([key, label, count]) => (
          <div key={key} className="flex flex-col items-center py-2 rounded-xl"
               style={{ background: 'var(--surface2)', border: `1px solid ${STATUS_COLOR[key]}22` }}>
            <span className="text-xl font-bold" style={{ color: STATUS_COLOR[key] }}>{count}</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {active.slice(0, 3).map(job => (
          <Link key={job.id} to="/jobs" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLOR[job.status] }} />
              <span className="text-sm font-medium flex-1 truncate">{job.company}</span>
              <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>{job.role}</span>
              <span className="text-xs shrink-0 badge"
                    style={{ background: `${STATUS_COLOR[job.status]}18`, color: STATUS_COLOR[job.status] }}>
                {STATUS_LABEL[job.status]}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
