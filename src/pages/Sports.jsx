import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { ExternalLink, RefreshCw, Loader2 } from 'lucide-react'

const TABS = [
  { id: 'eng.1', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { id: 'UEFA.CHAMPIONS', label: '⭐ Champions League' },
  { id: 'usa.1', label: '🇺🇸 MLS / USMNT' },
]

function ScoreCard({ event }) {
  const isTot = (name) => name?.toLowerCase().includes('tot') || name?.toLowerCase().includes('spur')
  const homeTot = isTot(event.homeTeam)
  const awayTot = isTot(event.awayTeam)
  const highlight = homeTot || awayTot
  const finished = event.status === 'STATUS_FINAL'

  return (
    <div className="card py-3 flex items-center gap-3"
         style={{ borderColor: highlight ? 'rgba(0,212,170,0.3)' : 'var(--border)' }}>
      <div className="flex-1 text-right">
        <div className="text-sm font-semibold" style={{ color: homeTot ? 'var(--accent)' : 'var(--text)' }}>
          {event.homeTeam}
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        {finished && event.homeScore != null ? (
          <div className="text-lg font-bold tabular-nums px-3 py-1 rounded-xl"
               style={{ background: 'var(--surface2)', minWidth: 72, textAlign: 'center' }}>
            {event.homeScore} – {event.awayScore}
          </div>
        ) : (
          <div className="text-sm px-3 py-1 rounded-xl"
               style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            {event.statusText || 'vs'}
          </div>
        )}
        {event.date && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(event.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold" style={{ color: awayTot ? 'var(--accent)' : 'var(--text)' }}>
          {event.awayTeam}
        </div>
      </div>
    </div>
  )
}

function NewsCard({ article }) {
  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer"
       className="card block hover:border-opacity-50 transition-all group"
       style={{ textDecoration: 'none', borderColor: 'var(--border)' }}>
      {article.image && (
        <img src={article.image} alt="" className="w-full h-32 object-cover rounded-xl mb-3"
             style={{ objectPosition: 'top' }} />
      )}
      <h4 className="text-sm font-semibold leading-snug mb-1 group-hover:underline">{article.headline}</h4>
      {article.description && (
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--muted)' }}>
          {article.description}
        </p>
      )}
      <div className="flex items-center gap-1 mt-2" style={{ color: 'var(--muted)' }}>
        <ExternalLink size={11} />
        <span className="text-xs">ESPN</span>
        {article.published && (
          <span className="text-xs ml-auto">
            {new Date(article.published).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </a>
  )
}

function LeagueContent({ leagueId }) {
  const { news, scores, loading, error } = useSports(leagueId)
  const [contentTab, setContentTab] = useState('news')

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={24} className="animate-spin" style={{ color: 'var(--muted)' }} />
    </div>
  )

  if (error || (news.length === 0 && scores.length === 0)) return (
    <div className="card text-center py-8">
      <p className="text-sm" style={{ color: 'var(--muted)' }}>Gat ekki sótt gögn</p>
      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Athugaðu nettenginguna</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {[['news', `Fréttir (${news.length})`], ['scores', `Leikir (${scores.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setContentTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: contentTab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: contentTab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${contentTab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {contentTab === 'news' && (
        <div className="flex flex-col gap-3">
          {news.length === 0
            ? <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engar fréttir</div>
            : news.map(a => <NewsCard key={a.id} article={a} />)
          }
        </div>
      )}

      {contentTab === 'scores' && (
        <div className="flex flex-col gap-2">
          {scores.length === 0
            ? <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>Engir leikir</div>
            : scores.map(s => <ScoreCard key={s.id} event={s} />)
          }
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const [league, setLeague] = useState('eng.1')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">⚽ Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Fótbolti, fréttir og úrslit</p>
      </div>

      {/* Tottenham quick badge */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
             style={{ background: 'rgba(0,212,170,0.1)' }}>⚪</div>
        <div>
          <div className="text-sm font-semibold">Tottenham Hotspur</div>
          <div className="text-xs" style={{ color: 'var(--accent)' }}>Lið mitt</div>
        </div>
      </div>

      {/* League tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setLeague(t.id)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: league === t.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: league === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${league === t.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      <LeagueContent leagueId={league} />
    </div>
  )
}
