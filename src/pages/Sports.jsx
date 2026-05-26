import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { RefreshCw, Trophy, Circle, ExternalLink } from 'lucide-react'

const KNICKS_NAMES = ['Knicks', 'New York Knicks']
const ARSENAL_NAMES = ['Arsenal']

function isKnicks(team) {
  return KNICKS_NAMES.some(n => team?.toLowerCase().includes(n.toLowerCase()))
}
function isArsenal(team) {
  return ARSENAL_NAMES.some(n => team?.toLowerCase().includes(n.toLowerCase()))
}

function MatchCard({ event, highlightFn }) {
  const home = event.strHomeTeam || ''
  const away = event.strAwayTeam || ''
  const hasScore = event.intHomeScore !== null && event.intHomeScore !== '' && event.intHomeScore !== undefined
  const hs = Number(event.intHomeScore)
  const as_ = Number(event.intAwayScore)
  const homeWin = hasScore && hs > as_
  const awayWin = hasScore && as_ > hs
  const highlight = highlightFn && (highlightFn(home) || highlightFn(away))
  const dateStr = event.dateEvent
    ? new Date(event.dateEvent + 'T12:00:00').toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
    : ''

  return (
    <div className="p-3 rounded-xl flex items-center gap-2 text-sm"
         style={{
           background: highlight ? 'rgba(0,212,170,0.06)' : 'var(--surface2)',
           border: `1px solid ${highlight ? 'rgba(0,212,170,0.25)' : 'transparent'}`,
         }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 justify-between">
          <span className="truncate font-medium" style={{ color: hasScore ? (homeWin ? 'var(--text)' : 'var(--muted)') : 'var(--text)', maxWidth: '38%' }}>{home}</span>
          {hasScore ? (
            <span className="font-bold px-2 py-0.5 rounded-lg shrink-0"
                  style={{ background: 'var(--surface)', minWidth: 48, textAlign: 'center' }}>
              {event.intHomeScore}–{event.intAwayScore}
            </span>
          ) : (
            <span className="text-xs px-2 shrink-0" style={{ color: 'var(--accent)' }}>vs</span>
          )}
          <span className="truncate font-medium text-right" style={{ color: hasScore ? (awayWin ? 'var(--text)' : 'var(--muted)') : 'var(--text)', maxWidth: '38%' }}>{away}</span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {dateStr}{!hasScore && event.strTime ? ` · ${event.strTime.slice(0, 5)}` : ''}
          {highlight && <span style={{ color: 'var(--accent)' }}> ★</span>}
        </div>
      </div>
    </div>
  )
}

function Section({ title, events, highlightFn, emptyMsg }) {
  if (!events || events.length === 0) return (
    <div className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>{emptyMsg}</div>
  )
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold uppercase tracking-wide px-1" style={{ color: 'var(--muted)' }}>{title}</div>
      {events.map(e => <MatchCard key={e.idEvent} event={e} highlightFn={highlightFn} />)}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )
}

export default function Sports() {
  const [tab, setTab] = useState('pl')
  const { pl, nba, loading, error, refresh } = useSports()

  const tabs = [
    { id: 'pl', label: '⚽ Premier League' },
    { id: 'nba', label: '🏀 NBA' },
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Live scores & fixtures</p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px 10px' }}>
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Knicks NBA Finals banner */}
      <div className="card flex items-center gap-3"
           style={{ background: 'linear-gradient(135deg, rgba(0,119,190,0.15), rgba(0,212,170,0.08))', border: '1px solid rgba(0,119,190,0.3)' }}>
        <div className="text-2xl">🏆</div>
        <div>
          <div className="font-semibold text-sm">NY Knicks – NBA Finals 2026</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Knicks eru á NBA úrslitum! Fylgstu með hér.</div>
        </div>
        <Trophy size={16} className="ml-auto shrink-0" style={{ color: '#00d4aa' }} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t.id ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>{t.label}</button>
        ))}
      </div>

      {error && (
        <div className="card text-sm text-center py-3" style={{ color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
          Gat ekki sótt leikjagögn. Athugaðu nettengingu.
        </div>
      )}

      {loading ? <LoadingSkeleton /> : (
        <div className="flex flex-col gap-4">
          {tab === 'pl' && (
            <>
              <Section
                title="Nýlegar niðurstöður"
                events={pl?.past?.slice(0, 8)}
                highlightFn={isArsenal}
                emptyMsg="Engar niðurstöður fundust"
              />
              <Section
                title="Næstu leikir"
                events={pl?.next?.slice(0, 6)}
                highlightFn={isArsenal}
                emptyMsg="Engar komandi leikir"
              />
            </>
          )}

          {tab === 'nba' && (
            <>
              <Section
                title="Nýlegar niðurstöður"
                events={nba?.past?.slice(0, 8)}
                highlightFn={isKnicks}
                emptyMsg="Engar niðurstöður fundust"
              />
              <Section
                title="Næstu leikir"
                events={nba?.next?.slice(0, 6)}
                highlightFn={isKnicks}
                emptyMsg="Engar komandi leikir"
              />
            </>
          )}
        </div>
      )}

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Fljótlegar hlekkir</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
            { label: 'BBC Sport', url: 'https://bbc.com/sport', icon: '⚽' },
            { label: 'NBA.com', url: 'https://nba.com', icon: '🏀' },
            { label: 'Premier League', url: 'https://premierleague.com', icon: '🏆' },
          ].map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
               className="btn btn-ghost flex items-center gap-2 justify-center text-sm">
              <span>{link.icon}</span>
              <span className="truncate">{link.label}</span>
              <ExternalLink size={11} className="shrink-0" style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
