import { useState } from 'react'
import { useSports, LEAGUES } from '../hooks/useSports'
import { RefreshCw, ExternalLink } from 'lucide-react'

function MatchCard({ match }) {
  const isLive = match.statusType === 'STATUS_IN_PROGRESS'
  const isFinal = match.statusType === 'STATUS_FINAL'
  const hasScore = isFinal || isLive
  const matchDate = new Date(match.date)
  const isToday = matchDate.toDateString() === new Date().toDateString()

  return (
    <div className="card py-3" style={{ borderLeft: isLive ? '3px solid #ef4444' : '3px solid transparent' }}>
      <div className="flex items-center gap-3">
        {/* Home team */}
        <div className="flex-1 flex items-center gap-2 justify-end">
          <p className="text-sm font-medium text-right leading-tight" style={{ color: match.homeTeam?.winner ? 'var(--text)' : hasScore ? 'var(--muted)' : 'var(--text)' }}>
            {match.homeTeam?.name}
          </p>
          {match.homeTeam?.logo ? (
            <img src={match.homeTeam.logo} alt="" className="w-7 h-7 object-contain shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
          )}
        </div>

        {/* Score / time */}
        <div className="shrink-0 text-center" style={{ minWidth: 64 }}>
          {hasScore ? (
            <>
              <p className="text-lg font-bold" style={{ color: isLive ? '#ef4444' : 'var(--text)' }}>
                {match.homeTeam?.score} – {match.awayTeam?.score}
              </p>
              <p className="text-xs" style={{ color: isLive ? '#ef4444' : 'var(--muted)' }}>
                {isLive ? match.status : 'Lokið'}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                {matchDate.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {isToday ? 'Í dag' : matchDate.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex items-center gap-2">
          {match.awayTeam?.logo ? (
            <img src={match.awayTeam.logo} alt="" className="w-7 h-7 object-contain shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full shrink-0" style={{ background: 'var(--surface2)' }} />
          )}
          <p className="text-sm font-medium leading-tight" style={{ color: match.awayTeam?.winner ? 'var(--text)' : hasScore ? 'var(--muted)' : 'var(--text)' }}>
            {match.awayTeam?.name}
          </p>
        </div>
      </div>
    </div>
  )
}

function NewsCard({ article }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
       className="card flex gap-3 group hover:border-[rgba(0,212,170,0.3)] transition-colors">
      {article.image && (
        <img src={article.image} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <p className="text-sm font-medium leading-snug line-clamp-3 group-hover:text-[var(--accent)] transition-colors">
          {article.headline}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {article.category} · {new Date(article.published).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </p>
          <ExternalLink size={11} style={{ color: 'var(--muted)' }} />
        </div>
      </div>
    </a>
  )
}

export default function Sports() {
  const { scores, news, loading, newsLoading, activeLeague, setActiveLeague } = useSports()
  const [tab, setTab] = useState('matches')

  const live = scores.filter(s => s.statusType === 'STATUS_IN_PROGRESS')
  const today = scores.filter(s => new Date(s.date).toDateString() === new Date().toDateString())
  const upcoming = scores.filter(s => {
    const d = new Date(s.date)
    return d > new Date() && s.statusType !== 'STATUS_FINAL'
  }).slice(0, 10)
  const results = scores.filter(s => s.statusType === 'STATUS_FINAL').slice(0, 10)

  const displayMatches = live.length > 0 ? live
    : today.length > 0 ? today
    : upcoming.length > 0 ? upcoming
    : results

  const sectionLabel = live.length > 0 ? `🔴 LIVE · ${live.length} leikur`
    : today.length > 0 ? 'Leikir í dag'
    : upcoming.length > 0 ? 'Væntanlegir leikir'
    : 'Nýlegar niðurstöður'

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">⚽ Fótbolti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Niðurstöður & fréttir</p>
        </div>
      </div>

      {/* League selector */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {LEAGUES.map(l => (
          <button key={l.id} onClick={() => setActiveLeague(l.id)}
            className="btn shrink-0 text-xs py-1.5 px-3"
            style={{
              background: activeLeague === l.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: activeLeague === l.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${activeLeague === l.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            {l.emoji} {l.short}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['matches', 'Leikir'], ['news', 'Fréttir']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'matches' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{sectionLabel}</span>
            {loading && <RefreshCw size={12} className="animate-spin" style={{ color: 'var(--muted)' }} />}
          </div>
          {loading && scores.length === 0 ? (
            <div className="flex flex-col gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="card animate-pulse-soft h-16" />
              ))}
            </div>
          ) : displayMatches.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              Engir leikir fundust
            </div>
          ) : displayMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}

      {tab === 'news' && (
        <div className="flex flex-col gap-3">
          {newsLoading && news.length === 0 ? (
            <div className="flex flex-col gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="card animate-pulse-soft h-20" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              Engar fréttir
            </div>
          ) : news.map(article => <NewsCard key={article.id} article={article} />)}
        </div>
      )}
    </div>
  )
}
