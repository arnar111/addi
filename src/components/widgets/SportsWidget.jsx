import { useSports, getResultForTeam } from '../../hooks/useSports'
import { Link } from 'react-router-dom'
import { ChevronRight, Trophy, Loader2 } from 'lucide-react'

const RESULT_COLOR = { W: '#22c55e', D: '#f97316', L: '#ef4444' }
const RESULT_BG = { W: 'rgba(34,197,94,0.15)', D: 'rgba(249,115,22,0.15)', L: 'rgba(239,68,68,0.15)' }

function FormDot({ result }) {
  if (!result) return <span className="w-2 h-2 rounded-full" style={{ background: 'var(--border)' }} />
  return (
    <span className="w-5 h-5 rounded-full flex items-center justify-center"
      style={{ background: RESULT_BG[result], fontSize: 9, fontWeight: 700, color: RESULT_COLOR[result] }}>
      {result}
    </span>
  )
}

function TeamRow({ team, ev }) {
  const last = ev?.last || []
  const next = ev?.next?.[0]
  const form = last.slice(-5).map(e => getResultForTeam(e, team.name))
  const lastResult = last[last.length - 1]

  return (
    <div className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      {team.badge ? (
        <img src={team.badge} alt={team.name} className="w-7 h-7 object-contain shrink-0" />
      ) : (
        <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
             style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>
          {(team.shortName || team.name.slice(0, 3)).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{team.name}</div>
        {next ? (
          <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
            vs {next.strHomeTeam === team.name ? next.strAwayTeam : next.strHomeTeam}
          </div>
        ) : lastResult ? (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {lastResult.strHomeTeam === team.name ? lastResult.strAwayTeam : lastResult.strHomeTeam} {lastResult.intHomeScore}–{lastResult.intAwayScore}
          </div>
        ) : null}
      </div>
      <div className="flex gap-0.5 shrink-0">
        {form.map((r, i) => <FormDot key={i} result={r} />)}
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { teams, events, loading } = useSports()

  if (!teams.length) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Trophy size={14} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold text-sm">Fótbolti</h3>
        </div>
        <Link to="/sport" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá meira <ChevronRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-3">
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--muted)' }} />
        </div>
      ) : (
        <div>
          {teams.map(team => (
            <TeamRow key={team.id} team={team} ev={events[team.id]} />
          ))}
        </div>
      )}
    </div>
  )
}
