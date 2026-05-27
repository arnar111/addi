import { useState } from 'react'
import { useFootball } from '../../hooks/useFootball'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { ChevronRight, Trophy, Calendar, Clock } from 'lucide-react'

function formatMatchDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T12:00:00')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Í dag'
  if (date.toDateString() === tomorrow.toDateString()) return 'Á morgun'

  return date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
}

function TeamBadge({ badge, name, size = 24 }) {
  if (badge) {
    return (
      <img
        src={badge}
        alt={name}
        width={size}
        height={size}
        style={{ objectFit: 'contain', borderRadius: 4 }}
        onError={e => { e.target.style.display = 'none' }}
      />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: 'var(--surface2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, flexShrink: 0
    }}>
      ⚽
    </div>
  )
}

export default function FootballWidget() {
  const { upcoming, results, loading, error } = useFootball()
  const [tab, setTab] = useState('upcoming')
  const [favTeam] = useLocalStorage('addi_fav_team', 'Arsenal')

  if (loading) {
    return (
      <div className="card animate-pulse-soft">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚽</span>
          <span className="text-sm font-semibold">Premier League</span>
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 rounded-xl" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      </div>
    )
  }

  const displayItems = tab === 'upcoming' ? upcoming : results
  const favUpcoming = upcoming.find(m => m.homeTeam === favTeam || m.awayTeam === favTeam)

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))', border: '1px solid rgba(59,130,246,0.2)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
               style={{ background: 'rgba(59,130,246,0.15)' }}>⚽</div>
          <div>
            <div className="text-sm font-semibold">Premier League</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>2025/26</div>
          </div>
        </div>
        <Trophy size={14} style={{ color: '#f59e0b' }} />
      </div>

      {/* Fav team next match */}
      {tab === 'upcoming' && favUpcoming && (
        <div className="mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="text-xs font-medium mb-1" style={{ color: '#3b82f6' }}>🎯 {favTeam} - næsti leikur</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TeamBadge badge={favUpcoming.homeBadge} name={favUpcoming.homeTeam} size={18} />
              <span className="text-xs font-medium">{favUpcoming.homeTeam}</span>
            </div>
            <div className="text-xs px-2 py-0.5 rounded-lg font-bold" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>VS</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium">{favUpcoming.awayTeam}</span>
              <TeamBadge badge={favUpcoming.awayBadge} name={favUpcoming.awayTeam} size={18} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={10} style={{ color: 'var(--muted)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {formatMatchDate(favUpcoming.date)}{favUpcoming.time ? ` · ${favUpcoming.time}` : ''}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 mb-3">
        {[['upcoming', '📅 Leikir'], ['results', '📊 Niðurstöður']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: tab === t ? 'rgba(59,130,246,0.15)' : 'var(--surface2)',
              color: tab === t ? '#3b82f6' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Match list */}
      {error || displayItems.length === 0 ? (
        <div className="text-center py-4 text-xs" style={{ color: 'var(--muted)' }}>
          {error ? 'Gat ekki sótt gögn' : 'Engir leikir tiltækir'}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {displayItems.slice(0, 4).map(match => (
            <div key={match.id} className="flex items-center gap-2 px-2 py-2 rounded-xl"
                 style={{ background: 'var(--surface2)' }}>
              {tab === 'upcoming' ? (
                <>
                  <div className="flex-1 flex items-center gap-1.5 min-w-0">
                    <TeamBadge badge={match.homeBadge} name={match.homeTeam} size={20} />
                    <span className="text-xs font-medium truncate">{match.homeTeam}</span>
                  </div>
                  <div className="flex flex-col items-center shrink-0 px-1">
                    <div className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--muted)' }}>
                      {match.time || formatMatchDate(match.date)}
                    </div>
                    {match.time && (
                      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)', fontSize: 9 }}>
                        {formatMatchDate(match.date)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
                    <span className="text-xs font-medium truncate">{match.awayTeam}</span>
                    <TeamBadge badge={match.awayBadge} name={match.awayTeam} size={20} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 flex items-center gap-1.5 min-w-0">
                    <TeamBadge badge={match.homeBadge} name={match.homeTeam} size={20} />
                    <span className="text-xs font-medium truncate">{match.homeTeam}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-sm font-bold" style={{ color: 'var(--text)', minWidth: 16, textAlign: 'center' }}>{match.homeScore ?? '-'}</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>-</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--text)', minWidth: 16, textAlign: 'center' }}>{match.awayScore ?? '-'}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
                    <span className="text-xs font-medium truncate">{match.awayTeam}</span>
                    <TeamBadge badge={match.awayBadge} name={match.awayTeam} size={20} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
