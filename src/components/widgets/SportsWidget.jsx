import { useSports } from '../../hooks/useSports'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ResultBadge({ result }) {
  if (!result) return null
  const colors = { W: '#22c55e', L: '#ef4444', D: '#f97316' }
  return (
    <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: `${colors[result]}22`, color: colors[result] }}>
      {result}
    </span>
  )
}

function ScoreLine({ e, compact }) {
  if (!e) return null
  const date = new Date(e.date)
  const isToday = date.toDateString() === new Date().toDateString()
  const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString()

  if (e.inProgress) {
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft shrink-0" style={{ background: '#22c55e' }} />
          <span className="text-xs font-medium truncate">{e.isHome ? 'Heima' : e.opponent}</span>
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: '#22c55e' }}>
          {e.myScore} – {e.oppScore}
        </span>
      </div>
    )
  }

  if (e.completed) {
    return (
      <div className="flex items-center justify-between gap-2">
        <ResultBadge result={e.result} />
        <span className="text-xs flex-1 truncate" style={{ color: 'var(--muted)' }}>
          {e.isHome ? 'Heima' : e.opponent}
        </span>
        <span className="text-xs font-semibold tabular-nums">
          {e.myScore} – {e.oppScore}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs truncate" style={{ color: 'var(--muted)' }}>
        {e.isHome ? `vs ${e.opponentAbbr}` : `@ ${e.opponentAbbr}`}
      </span>
      <span className="text-xs font-medium shrink-0" style={{ color: isToday ? 'var(--accent)' : 'var(--muted)' }}>
        {isToday ? 'Í dag' : isTomorrow ? 'Á morgun' : date.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
      </span>
    </div>
  )
}

function TeamRow({ icon, label, color, data, sport }) {
  const nav = useNavigate()
  const last = data.past?.[data.past.length - 1]
  const next = data.upcoming?.[0]
  const show = last?.inProgress ? last : (last?.completed ? last : next)
  const form = data.past?.slice(-5).map(e => e.result).filter(Boolean)

  return (
    <button onClick={() => nav('/sport')}
      className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0"
           style={{ background: `${color}18` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-semibold">{label}</span>
          {form.length > 0 && (
            <div className="flex gap-0.5">
              {form.slice(-3).map((r, i) => {
                const c = { W: '#22c55e', L: '#ef4444', D: '#f97316' }[r]
                return <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
              })}
            </div>
          )}
        </div>
        {show ? <ScoreLine e={show} /> : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Engin leikur</span>
        )}
      </div>
      <ChevronRight size={14} style={{ color: 'var(--muted)' }} className="shrink-0" />
    </button>
  )
}

export default function SportsWidget() {
  const { inter, cavs } = useSports()

  const loading = inter.loading && cavs.loading

  if (loading) {
    return (
      <div className="card animate-pulse-soft">
        <div className="h-4 w-20 rounded mb-3" style={{ background: 'var(--surface2)' }} />
        <div className="h-8 rounded mb-2" style={{ background: 'var(--surface2)' }} />
        <div className="h-8 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    )
  }

  const nextCavsGame = cavs.upcoming?.[0]
  const isECF = nextCavsGame?.opponent?.toLowerCase().includes('knick')

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
          Íþróttir
        </span>
        {isECF && (
          <span className="badge text-xs font-bold animate-pulse-soft"
                style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}>
            🏆 ECF
          </span>
        )}
      </div>

      <TeamRow
        icon="⚫🔵"
        label="Inter Milan"
        color="#0068A8"
        data={inter}
        sport="soccer"
      />

      <div style={{ height: 1, background: 'var(--border)' }} />

      <TeamRow
        icon="🏀"
        label="Cleveland Cavaliers"
        color="#860038"
        data={cavs}
        sport="basketball"
      />
    </div>
  )
}
