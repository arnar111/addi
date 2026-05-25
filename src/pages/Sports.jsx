import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { RefreshCw, MapPin, Calendar } from 'lucide-react'

const RESULT_COLOR = { W: '#22c55e', L: '#ef4444', D: '#f97316' }
const RESULT_BG = { W: 'rgba(34,197,94,0.12)', L: 'rgba(239,68,68,0.12)', D: 'rgba(249,115,22,0.12)' }
const RESULT_IS = { W: 'Sigur', L: 'Tap', D: 'Jafntefli' }

function ResultBadge({ result, big }) {
  if (!result) return null
  return (
    <div className={`${big ? 'w-9 h-9 text-sm' : 'w-6 h-6 text-xs'} rounded-xl flex items-center justify-center font-bold shrink-0`}
         style={{ background: RESULT_BG[result], color: RESULT_COLOR[result] }}>
      {result}
    </div>
  )
}

function MatchCard({ e, teamName }) {
  const date = new Date(e.date)
  const isToday = date.toDateString() === new Date().toDateString()
  const isSoon = !e.completed && date.getTime() - Date.now() < 7 * 24 * 3600 * 1000

  return (
    <div className="card py-3 flex items-center gap-3"
         style={{ borderColor: isToday && e.inProgress ? 'rgba(34,197,94,0.4)' : isSoon ? 'rgba(0,212,170,0.2)' : 'var(--border)' }}>
      {e.completed || e.inProgress ? (
        <>
          <ResultBadge result={e.result} big />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">
              {e.isHome ? `${teamName} vs ${e.opponent}` : `${e.opponent} vs ${teamName}`}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {e.venue && (
                <span className="text-xs flex items-center gap-0.5" style={{ color: 'var(--muted)' }}>
                  <MapPin size={9} /> {e.venue}
                </span>
              )}
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {date.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-bold tabular-nums"
                 style={{ color: e.inProgress ? '#22c55e' : 'var(--text)' }}>
              {e.myScore} – {e.oppScore}
            </div>
            {e.inProgress && (
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: '#22c55e' }} />
                <span className="text-xs" style={{ color: '#22c55e' }}>{e.statusDetail}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: isSoon ? 'rgba(0,212,170,0.1)' : 'var(--surface2)' }}>
            <Calendar size={16} style={{ color: isSoon ? 'var(--accent)' : 'var(--muted)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">
              {e.isHome ? `${teamName} vs ${e.opponent}` : `${e.opponent} vs ${teamName}`}
            </div>
            {e.venue && (
              <span className="text-xs flex items-center gap-0.5 mt-0.5" style={{ color: 'var(--muted)' }}>
                <MapPin size={9} /> {e.venue}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold" style={{ color: isToday ? 'var(--accent)' : 'var(--text)' }}>
              {isToday ? 'Í dag' :
               date.toDateString() === new Date(Date.now() + 86400000).toDateString() ? 'Á morgun' :
               date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function FormStrip({ results }) {
  if (!results?.length) return null
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs" style={{ color: 'var(--muted)' }}>Form:</span>
      {results.map((r, i) => (
        <div key={i} className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
             style={{ background: RESULT_BG[r], color: RESULT_COLOR[r] }}>
          {r}
        </div>
      ))}
    </div>
  )
}

function TeamSection({ data, teamName, teamEmoji, color, sport }) {
  const form = (data.past || []).map(e => e.result).filter(Boolean)
  const wins = form.filter(r => r === 'W').length
  const all = [...(data.past || [])].reverse().concat(data.upcoming || [])

  if (data.loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse-soft h-16" />
        ))}
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
        <p className="text-sm">Gat ekki sótt gögn</p>
        <p className="text-xs mt-1">{data.error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
               style={{ background: `${color}18` }}>
            {teamEmoji}
          </div>
          <div>
            <div className="font-semibold">{teamName}</div>
            {data.season && <div className="text-xs" style={{ color: 'var(--muted)' }}>{data.season}</div>}
          </div>
        </div>
        {form.length > 0 && (
          <div className="text-right">
            <div className="text-sm font-bold">{wins}/{form.length}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>sigrar</div>
          </div>
        )}
      </div>

      <FormStrip results={form.slice(-5)} />

      {all.length === 0 ? (
        <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
          Engir leikir fundust
        </div>
      ) : (
        all.map(e => <MatchCard key={e.id} e={e} teamName={sport === 'soccer' ? 'INT' : 'CLE'} />)
      )}
    </div>
  )
}

export default function Sports() {
  const { inter, cavs } = useSports()
  const [tab, setTab] = useState('soccer')

  const nextCavsGame = cavs.upcoming?.[0]
  const isECF = nextCavsGame?.opponent?.toLowerCase().includes('knick') ||
                nextCavsGame?.opponent?.toLowerCase().includes('york')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Leikjanir og niðurstöður
        </p>
      </div>

      {isECF && (
        <div className="card flex items-center gap-3"
             style={{ background: 'linear-gradient(135deg, rgba(134,0,56,0.15), rgba(253,187,48,0.1))', borderColor: 'rgba(253,187,48,0.3)' }}>
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <div className="font-semibold text-sm">Eastern Conference Finals</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Cavaliers vs Knicks ·{' '}
              {nextCavsGame && new Date(nextCavsGame.date).toLocaleDateString('is-IS', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-sm" style={{ color: '#FDB930' }}>
              {nextCavsGame ? new Date(nextCavsGame.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }) : ''}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['soccer', '⚽ Knattspyrna'], ['basketball', '🏀 Körfubolti']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'soccer' && (
        <TeamSection
          data={inter}
          teamName="Inter Milan"
          teamEmoji="⚫🔵"
          color="#0068A8"
          sport="soccer"
        />
      )}

      {tab === 'basketball' && (
        <TeamSection
          data={cavs}
          teamName="Cleveland Cavaliers"
          teamEmoji="🏀"
          color="#860038"
          sport="basketball"
        />
      )}
    </div>
  )
}
