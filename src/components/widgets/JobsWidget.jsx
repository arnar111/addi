import { useJobs } from '../../hooks/useJobs'
import { Link } from 'react-router-dom'
import { ChevronRight, Briefcase } from 'lucide-react'

export default function JobsWidget() {
  const { jobs, stats } = useJobs()

  const activeJobs = jobs.filter(j => ['applied', 'screening', 'interview'].includes(j.status)).slice(0, 2)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Briefcase size={14} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold text-sm">Starfsleit</h3>
        </div>
        <Link to="/jobs" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-3">
          <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Engar umsóknir ennþá</div>
          <Link to="/jobs" className="btn text-xs py-1.5"
                style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}>
            Byrja starfsleit
          </Link>
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-3">
            {[
              { label: 'Sótt', value: stats.applied, color: '#3b82f6' },
              { label: 'Í vinnslu', value: stats.active, color: '#8b5cf6' },
              { label: 'Tilboð', value: stats.offers, color: '#22c55e' },
            ].map(s => (
              <div key={s.label} className="flex-1 text-center p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontSize: 10 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {activeJobs.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {activeJobs.map(j => {
                const daysSince = Math.floor((Date.now() - new Date(j.appliedAt)) / 86400000)
                return (
                  <div key={j.id} className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-xl"
                       style={{ background: 'var(--surface2)' }}>
                    <span className="font-medium flex-1 truncate">{j.company}</span>
                    <span style={{ color: 'var(--muted)' }} className="truncate">{j.role}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>{daysSince}d</span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
