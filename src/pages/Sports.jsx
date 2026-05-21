import { useState, useEffect } from 'react'
import { ExternalLink, ChevronRight, Trophy, Calendar, Zap } from 'lucide-react'
import { useSports, useWCCountdown } from '../hooks/useSports'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WC_KEY_DATES = [
  { label: 'Hópstig hefst', date: '11. júní', icon: '🏁' },
  { label: 'Leikir af 32', date: '29. júní', icon: '⚔️' },
  { label: 'Leikir af 16', date: '3. júlí', icon: '🔥' },
  { label: 'Fjórðungsúrslitið', date: '7. júlí', icon: '💥' },
  { label: 'Hálfleikurinn', date: '14. júlí', icon: '⭐' },
  { label: 'Úrslitaleikurinn', date: '19. júlí', icon: '🏆' },
]

const TEAMS = [
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'USA', flag: '🇺🇸' },
]

function CountBox({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="text-3xl font-bold tabular-nums w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

function ScoreCard({ event }) {
  const date = event.dateEvent ? new Date(event.dateEvent + 'T' + (event.strTime || '15:00:00')).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' }) : '—'
  const home = event.strHomeTeam || '?'
  const away = event.strAwayTeam || '?'
  const hs = event.intHomeScore
  const as = event.intAwayScore
  const hasScore = hs !== null && hs !== undefined && hs !== ''

  return (
    <div className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="text-xs w-14 shrink-0" style={{ color: 'var(--muted)' }}>{date}</div>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-sm truncate flex-1 text-right">{home}</span>
        <span className="text-sm font-bold shrink-0 px-2 py-0.5 rounded-lg tabular-nums"
              style={{ background: hasScore ? 'var(--surface2)' : 'transparent', color: 'var(--text)', minWidth: 40, textAlign: 'center' }}>
          {hasScore ? `${hs} – ${as}` : 'vs'}
        </span>
        <span className="text-sm truncate flex-1">{away}</span>
      </div>
    </div>
  )
}

export default function Sports() {
  const { timeLeft, WC_OPEN } = useWCCountdown()
  const { recentPL, upcomingUCL, loading } = useSports()
  const [favTeam, setFavTeam] = useLocalStorage('addi_fav_team', { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' })
  const [showTeamPicker, setShowTeamPicker] = useState(false)
  const [tab, setTab] = useState('scores')

  const wcProgress = Math.max(0, Math.min(100, ((Date.now() - new Date('2026-01-01').getTime()) / (WC_OPEN - new Date('2026-01-01').getTime())) * 100))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Fótbolti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {timeLeft.started ? 'HM 2026 er í gangi!' : `${timeLeft.days} dagar í HM 2026`}
          </p>
        </div>
        <a href="https://theathletic.com/football" target="_blank" rel="noreferrer"
           className="btn btn-ghost text-xs flex items-center gap-1">
          The Athletic <ExternalLink size={12} />
        </a>
      </div>

      {/* World Cup Hero */}
      <div className="card"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1) 0%, rgba(139,92,246,0.1) 100%)', border: '1px solid rgba(0,212,170,0.25)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="font-bold">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico · 48 lið</div>
          </div>
        </div>

        {!timeLeft.started ? (
          <>
            <div className="flex gap-3 justify-center mb-4">
              <CountBox value={timeLeft.days} label="dagar" />
              <div className="text-2xl font-bold self-start mt-4" style={{ color: 'var(--border)' }}>:</div>
              <CountBox value={timeLeft.hours} label="klst" />
              <div className="text-2xl font-bold self-start mt-4" style={{ color: 'var(--border)' }}>:</div>
              <CountBox value={timeLeft.minutes} label="mín" />
              <div className="text-2xl font-bold self-start mt-4" style={{ color: 'var(--border)' }}>:</div>
              <CountBox value={timeLeft.seconds} label="sek" />
            </div>

            <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full" style={{ width: `${wcProgress}%`, background: 'var(--accent)' }} />
            </div>
          </>
        ) : (
          <div className="text-center py-2 text-lg font-semibold" style={{ color: 'var(--accent)' }}>
            🎉 Heimsmeistaramótið er í gangi!
          </div>
        )}

        {/* Key dates */}
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          {WC_KEY_DATES.map(d => (
            <div key={d.label} className="flex items-center gap-2 py-1.5 px-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-base">{d.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.date}</div>
                <div style={{ fontSize: 11 }}>{d.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite team */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold flex items-center gap-2">
            <span>{favTeam.flag}</span> Mitt lið: {favTeam.name}
          </div>
          <button onClick={() => setShowTeamPicker(!showTeamPicker)}
                  className="text-xs" style={{ color: 'var(--accent)' }}>
            {showTeamPicker ? 'Loka' : 'Breyta'}
          </button>
        </div>

        {showTeamPicker ? (
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {TEAMS.map(t => (
              <button key={t.name}
                onClick={() => { setFavTeam(t); setShowTeamPicker(false) }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                style={{
                  background: favTeam.name === t.name ? 'rgba(0,212,170,0.12)' : 'var(--surface2)',
                  border: `1px solid ${favTeam.name === t.name ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  color: favTeam.name === t.name ? 'var(--accent)' : 'var(--text)',
                }}>
                <span>{t.flag}</span> {t.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="py-2 text-sm" style={{ color: 'var(--muted)' }}>
            Fylgstu með {favTeam.name} á leiðinni til fagnaðar 🏆
          </div>
        )}
      </div>

      {/* Scores / Upcoming tabs */}
      <div className="flex gap-2">
        {[['scores', '📊 Niðurstöður'], ['upcoming', '📅 Komandi']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'scores' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold">Premier League — nýlegar niðurstöður</span>
          </div>
          {loading ? (
            <div className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>Sæki gögn...</div>
          ) : recentPL.length === 0 ? (
            <div className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>Engar niðurstöður í boði</div>
          ) : (
            <div>
              {recentPL.slice(0, 8).map(e => <ScoreCard key={e.idEvent} event={e} />)}
            </div>
          )}
          <a href="https://www.premierleague.com/results" target="_blank" rel="noreferrer"
             className="flex items-center gap-1 mt-3 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allar niðurstöður <ExternalLink size={11} />
          </a>
        </div>
      )}

      {tab === 'upcoming' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold">Champions League — komandi leikir</span>
          </div>
          {loading ? (
            <div className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>Sæki gögn...</div>
          ) : upcomingUCL.length === 0 ? (
            <div className="text-sm text-center py-4" style={{ color: 'var(--muted)' }}>Engir leikir á dagskrá</div>
          ) : (
            <div>
              {upcomingUCL.map(e => <ScoreCard key={e.idEvent} event={e} />)}
            </div>
          )}
          <a href="https://www.uefa.com/uefachampionsleague/fixtures-results/" target="_blank" rel="noreferrer"
             className="flex items-center gap-1 mt-3 text-xs" style={{ color: 'var(--accent)' }}>
            Sjá allt dagskrá <ExternalLink size={11} />
          </a>
        </div>
      )}

      {/* Quick links */}
      <div className="card">
        <div className="text-sm font-semibold mb-3">Flýtileiðir</div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'The Athletic FC', url: 'https://theathletic.com/football', icon: '📰' },
            { label: 'BBC Sport Football', url: 'https://www.bbc.com/sport/football', icon: '🌐' },
            { label: 'Premier League', url: 'https://www.premierleague.com', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
            { label: 'FIFA World Cup 2026', url: 'https://www.fifa.com/worldcup', icon: '🏆' },
          ].map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer"
               className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
               style={{ background: 'var(--surface2)' }}>
              <span>{link.icon}</span>
              <span className="text-sm flex-1">{link.label}</span>
              <ExternalLink size={12} style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
