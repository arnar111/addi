import { useSports } from '../../hooks/useSports'
import { Newspaper, ChevronRight, Activity } from 'lucide-react'

function MatchRow({ match }) {
  const isLive = match.statusType === 'STATUS_IN_PROGRESS'
  const isFinal = match.statusType === 'STATUS_FINAL'
  const hasScore = isFinal || isLive

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
        <span className="text-xs truncate text-right" style={{ color: match.homeTeam?.winner ? 'var(--text)' : 'var(--muted)', fontWeight: match.homeTeam?.winner ? 600 : 400 }}>
          {match.homeTeam?.name}
        </span>
        {match.homeTeam?.logo && (
          <img src={match.homeTeam.logo} alt="" className="w-4 h-4 object-contain shrink-0" />
        )}
      </div>
      <div className="shrink-0 text-center" style={{ minWidth: 56 }}>
        {hasScore ? (
          <span className="text-sm font-bold" style={{ color: isLive ? '#ef4444' : 'var(--text)' }}>
            {match.homeTeam?.score} – {match.awayTeam?.score}
          </span>
        ) : (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(match.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        {isLive && (
          <div className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{match.status}</div>
        )}
      </div>
      <div className="flex-1 flex items-center gap-1.5 min-w-0">
        {match.awayTeam?.logo && (
          <img src={match.awayTeam.logo} alt="" className="w-4 h-4 object-contain shrink-0" />
        )}
        <span className="text-xs truncate" style={{ color: match.awayTeam?.winner ? 'var(--text)' : 'var(--muted)', fontWeight: match.awayTeam?.winner ? 600 : 400 }}>
          {match.awayTeam?.name}
        </span>
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { scores, news, loading, newsLoading } = useSports()

  const today = new Date().toDateString()
  const todayMatches = scores.filter(s => new Date(s.date).toDateString() === today).slice(0, 3)
  const recentMatches = scores.filter(s => {
    const d = new Date(s.date)
    const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays <= 3 && (s.statusType === 'STATUS_FINAL' || s.statusType === 'STATUS_IN_PROGRESS')
  }).slice(0, 3)
  const displayMatches = todayMatches.length > 0 ? todayMatches : recentMatches

  const topNews = news.slice(0, 2)

  if (loading && !scores.length && !news.length) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-24 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="space-y-2">
        {[1,2].map(i => <div key={i} className="h-3 rounded" style={{ background: 'var(--surface2)' }} />)}
      </div>
    </div>
  )

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(0,212,170,0.04))', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="text-sm font-semibold">Fótbolti</span>
        </div>
        <a href="#/sports" className="text-xs flex items-center gap-0.5" style={{ color: 'var(--accent)' }}>
          Meira <ChevronRight size={12} />
        </a>
      </div>

      {/* Matches */}
      {displayMatches.length > 0 && (
        <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
          {displayMatches.map(m => <MatchRow key={m.id} match={m} />)}
        </div>
      )}

      {/* News headlines */}
      {topNews.length > 0 ? (
        <div className="flex flex-col gap-2">
          {topNews.map(article => (
            <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer"
               className="flex gap-2 group">
              {article.image && (
                <img src={article.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                  {article.headline}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {new Date(article.published).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : !newsLoading ? (
        <p className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>Engar fréttir fundust</p>
      ) : null}
    </div>
  )
}
