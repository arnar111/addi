import { useState, useEffect } from 'react'
import { useSport, RESULT_TYPES } from '../hooks/useSport'
import { Plus, X, Trash2, Trophy, ExternalLink, Star } from 'lucide-react'

const WC_START = new Date('2026-06-11T18:00:00Z')

const QUICK_LINKS = [
  { label: 'The Athletic FC', url: 'https://theathletic.com/soccer/', color: '#000', bg: '#fff' },
  { label: 'BBC Sport', url: 'https://www.bbc.com/sport/football', color: '#fff', bg: '#cc0000' },
  { label: 'ESPN FC', url: 'https://www.espn.com/soccer/', color: '#fff', bg: '#e30614' },
  { label: 'Serie A', url: 'https://www.legaseriea.it/en', color: '#fff', bg: '#024494' },
]

function useCountdown(target) {
  const [diff, setDiff] = useState(target - Date.now())
  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(t)
  }, [target])
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, started: false }
}

function CountdownBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <div className="text-2xl font-mono font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

export default function Sport() {
  const { matches, addMatch, removeMatch, myTeams, addTeam, removeTeam } = useSport()
  const countdown = useCountdown(WC_START.getTime())
  const [showMatchForm, setShowMatchForm] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [matchForm, setMatchForm] = useState({ home: '', away: '', homeScore: '', awayScore: '', competition: 'World Cup 2026', notes: '' })
  const [teamForm, setTeamForm] = useState({ name: '', flag: '⚽', league: '' })

  const handleAddMatch = (e) => {
    e.preventDefault()
    if (!matchForm.home || !matchForm.away) return
    addMatch(matchForm.home, matchForm.away, matchForm.homeScore || 0, matchForm.awayScore || 0, matchForm.competition, matchForm.notes)
    setMatchForm({ home: '', away: '', homeScore: '', awayScore: '', competition: 'World Cup 2026', notes: '' })
    setShowMatchForm(false)
  }

  const handleAddTeam = (e) => {
    e.preventDefault()
    if (!teamForm.name) return
    addTeam(teamForm.name, teamForm.flag, teamForm.league)
    setTeamForm({ name: '', flag: '⚽', league: '' })
    setShowTeamForm(false)
  }

  const getResult = (m) => {
    if (m.homeScore > m.awayScore) return 'win-home'
    if (m.homeScore < m.awayScore) return 'win-away'
    return 'draw'
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Heimsmót + Inter Milan + Stöður</p>
      </div>

      {/* World Cup 2026 Countdown */}
      <div className="card relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(0,212,170,0.25)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🏆</span>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--accent)' }}>FIFA HEIMSMÓT 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>USA · CANADA · MEXICO · 11. júní 2026</div>
          </div>
        </div>

        {countdown.started ? (
          <div className="text-center py-2 font-bold" style={{ color: 'var(--accent)' }}>
            🎉 Heimsmótið er í gangi!
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-4 py-3">
              <CountdownBlock value={countdown.days} label="dagar" />
              <span className="text-2xl font-bold" style={{ color: 'var(--muted)' }}>:</span>
              <CountdownBlock value={countdown.hours} label="klst" />
              <span className="text-2xl font-bold" style={{ color: 'var(--muted)' }}>:</span>
              <CountdownBlock value={countdown.minutes} label="mín" />
              <span className="text-2xl font-bold" style={{ color: 'var(--muted)' }}>:</span>
              <CountdownBlock value={countdown.seconds} label="sek" />
            </div>
            <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>
              þar til fyrsti leikurinn byrjar
            </div>
          </>
        )}
      </div>

      {/* Inter Milan — Double Winners */}
      <div className="card"
           style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,68,148,0.3))', border: '1px solid rgba(0,68,148,0.4)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚫🔵</span>
            <div>
              <div className="font-bold">Inter Milan</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Serie A · San Siro</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.2)', color: 'var(--accent)' }}>
              TVÍFALDAR 🏆🏆
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(0,212,170,0.08)' }}>
            <Trophy size={14} style={{ color: '#fbbf24' }} />
            <div>
              <div className="text-xs font-semibold">Serie A</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Meistarar 2025/26</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(0,212,170,0.08)' }}>
            <Trophy size={14} style={{ color: '#fbbf24' }} />
            <div>
              <div className="text-xs font-semibold">Coppa Italia</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Vinnarar 2025/26</div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center text-xs font-medium" style={{ color: '#3b82f6' }}>
          Forza Inter! 🎉 Eitt af sterkustu liðunum í sögu ítalskrar knattspyrnu
        </div>
      </div>

      {/* My Teams */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Lið mín</h3>
          <button onClick={() => setShowTeamForm(!showTeamForm)}
                  className="btn text-xs py-1" style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}>
            <Plus size={12} /> Bæta við
          </button>
        </div>

        {showTeamForm && (
          <form onSubmit={handleAddTeam} className="flex flex-col gap-2 mb-3 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="flex gap-2">
              <input className="input text-sm" style={{ width: 52 }} placeholder="🏳️" maxLength={4}
                     value={teamForm.flag} onChange={e => setTeamForm(p => ({ ...p, flag: e.target.value }))} />
              <input className="input text-sm flex-1" placeholder="Nafn liðs" required
                     value={teamForm.name} onChange={e => setTeamForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <input className="input text-sm" placeholder="Mót / Deild (valkvæmt)"
                   value={teamForm.league} onChange={e => setTeamForm(p => ({ ...p, league: e.target.value }))} />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary text-xs py-1.5 flex-1 justify-center">Vista</button>
              <button type="button" onClick={() => setShowTeamForm(false)} className="btn btn-ghost text-xs py-1.5"><X size={12} /></button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {myTeams.map(t => (
            <div key={t.id} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm group"
                 style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <span>{t.flag}</span>
              <span className="font-medium">{t.name}</span>
              {t.league && <span className="text-xs" style={{ color: 'var(--muted)' }}>· {t.league}</span>}
              <button onClick={() => removeTeam(t.id)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--muted)' }}>
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Match Log */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-sm">Leikjakladdinn</h3>
        <button onClick={() => setShowMatchForm(!showMatchForm)}
                className="btn text-xs py-1" style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}>
          <Plus size={12} /> Bæta við leik
        </button>
      </div>

      {showMatchForm && (
        <form onSubmit={handleAddMatch} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr leikur</h3>
            <button type="button" onClick={() => setShowMatchForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input text-sm" placeholder="Mót (t.d. World Cup 2026)"
                 value={matchForm.competition} onChange={e => setMatchForm(p => ({ ...p, competition: e.target.value }))} />
          <div className="grid grid-cols-5 gap-2 items-center">
            <input className="input text-sm col-span-2" placeholder="Heimalið" required
                   value={matchForm.home} onChange={e => setMatchForm(p => ({ ...p, home: e.target.value }))} />
            <div className="flex gap-1 items-center justify-center">
              <input className="input text-sm text-center px-1" style={{ width: 44 }} type="number" min="0" placeholder="0"
                     value={matchForm.homeScore} onChange={e => setMatchForm(p => ({ ...p, homeScore: e.target.value }))} />
              <span style={{ color: 'var(--muted)' }}>–</span>
              <input className="input text-sm text-center px-1" style={{ width: 44 }} type="number" min="0" placeholder="0"
                     value={matchForm.awayScore} onChange={e => setMatchForm(p => ({ ...p, awayScore: e.target.value }))} />
            </div>
            <input className="input text-sm col-span-2" placeholder="Gestalið" required
                   value={matchForm.away} onChange={e => setMatchForm(p => ({ ...p, away: e.target.value }))} />
          </div>
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)"
                 value={matchForm.notes} onChange={e => setMatchForm(p => ({ ...p, notes: e.target.value }))} />
          <button type="submit" className="btn btn-primary w-full justify-center">Vista leik</button>
        </form>
      )}

      {matches.length === 0 ? (
        <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
          <div className="text-2xl mb-2">⚽</div>
          <div className="text-sm">Engir leikir skráðir ennþá</div>
          <div className="text-xs mt-1">Bættu við leikjum til að fylgjast með niðurstöðum</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.map(m => {
            const result = getResult(m)
            return (
              <div key={m.id} className="card py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                    {m.competition}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(m.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                    </span>
                    <button onClick={() => removeMatch(m.id)} style={{ color: 'var(--muted)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm flex-1 text-right" style={{ color: result === 'win-home' ? 'var(--success)' : 'var(--text)' }}>
                    {m.homeTeam}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xl font-mono font-bold tabular-nums">{m.homeScore}</span>
                    <span style={{ color: 'var(--muted)' }}>–</span>
                    <span className="text-xl font-mono font-bold tabular-nums">{m.awayScore}</span>
                  </div>
                  <span className="font-semibold text-sm flex-1" style={{ color: result === 'win-away' ? 'var(--success)' : 'var(--text)' }}>
                    {m.awayTeam}
                  </span>
                </div>
                {m.notes && <div className="text-xs" style={{ color: 'var(--muted)' }}>{m.notes}</div>}
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Links */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3">Fréttir &amp; Tenglar</h3>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
               style={{ background: link.bg, color: link.color, border: '1px solid var(--border)' }}>
              {link.label}
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
