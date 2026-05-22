import { useJobs, JOB_STATUSES } from '../../hooks/useJobs'
import { Link } from 'react-router-dom'
import { ChevronRight, Briefcase } from 'lucide-react'

export default function JobWidget() {
  const { active, byStatus } = useJobs()
  const interview = byStatus('interview')
  const sent = byStatus('sent')
  const offered = byStatus('offered')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Briefcase size={15} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold text-sm">Starfsleit</h3>
        </div>
        <Link to="/jobs" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Engar virkar umsóknir</p>
          <a href="https://alfred.is" target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost text-xs py-1.5">
            Skoða störf á Alfred.is →
          </a>
        </div>
      ) : (
        <div className="flex gap-3">
          {[
            { label: 'Sent', count: sent.length, color: '#3b82f6' },
            { label: 'Viðtal', count: interview.length, color: '#f97316' },
            { label: 'Boð', count: offered.length, color: '#22c55e' },
          ].map(s => (
            <div key={s.label} className="flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl"
                 style={{ background: `${s.color}12`, border: `1px solid ${s.color}22` }}>
              <span className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {interview.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Viðtöl í bíð</div>
          {interview.slice(0, 2).map(j => (
            <div key={j.id} className="flex items-center gap-2 px-2 py-1.5 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)' }}>
              <span className="text-xs">💼</span>
              <span className="text-xs flex-1 truncate font-medium">{j.company} – {j.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
