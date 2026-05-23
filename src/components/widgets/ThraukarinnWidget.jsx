import { Link } from 'react-router-dom'
import { useThraukarinn } from '../../hooks/useThraukarinn'
import { ArrowRight } from 'lucide-react'

export default function ThraukarinnWidget() {
  const { teamName, season, totalPoints, active, votedOut, players, rank } = useThraukarinn()

  const activePlayers = active()
  const outPlayers = votedOut()
  const pts = totalPoints()

  return (
    <Link to="/thraukarinn" style={{ textDecoration: 'none' }}>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(0,212,170,0.03))' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🏝️</span>
            <span className="text-sm font-semibold">Þraukarinn S{season}</span>
          </div>
          <ArrowRight size={14} style={{ color: 'var(--muted)' }} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Liðið: <strong style={{ color: 'var(--text)' }}>{teamName}</strong></div>
            <div className="text-2xl font-bold mt-0.5" style={{ color: '#a78bfa' }}>{pts} <span className="text-sm font-normal" style={{ color: 'var(--muted)' }}>stig</span></div>
          </div>
          {rank && (
            <div className="text-right">
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Sæti</div>
              <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>#{rank}</div>
            </div>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {players.slice(0, 5).map(p => (
            <div
              key={p.id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{
                background: p.status === 'voted_out' ? 'rgba(239,68,68,0.12)' :
                  p.status === 'reserve' ? 'rgba(100,116,139,0.12)' : 'rgba(34,197,94,0.12)',
                color: p.status === 'voted_out' ? '#ef4444' :
                  p.status === 'reserve' ? 'var(--muted)' : '#22c55e',
              }}>
              {p.status === 'voted_out' ? '💀' : p.status === 'reserve' ? '🔄' : '🔥'}
              <span style={{ maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.name.split(' ')[0]}
              </span>
              {p.points > 0 && <span className="font-bold">{p.points}</span>}
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
