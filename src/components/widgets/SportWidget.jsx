import { useWCCountdown } from '../../hooks/useSport'
import { NavLink } from 'react-router-dom'

export default function SportWidget() {
  const { started, days, hours, minutes } = useWCCountdown()

  return (
    <NavLink to="/sport"
      className="card block"
      style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(0,212,170,0.2)', textDecoration: 'none' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌍</span>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--accent)' }}>FIFA World Cup 2026</div>
            {started ? (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Mótið er í gangi!</div>
            ) : (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Byrjar eftir <span style={{ color: 'var(--text)', fontWeight: 600 }}>{days}d {hours}h {minutes}m</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{days}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
        </div>
      </div>
    </NavLink>
  )
}
