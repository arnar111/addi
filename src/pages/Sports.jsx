import { useState, useEffect } from 'react'
import { Trophy, Plus, X, Tv, Newspaper, Calendar, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WC_START = new Date('2026-06-11T18:00:00Z')

const TEAMS = [
  { name: 'Manchester City', emoji: '🔵', color: '#6CABDD', search: 'Man City FC 2025' },
  { name: 'Liverpool FC', emoji: '❤️', color: '#C8102E', search: 'Liverpool FC 2025' },
  { name: 'England NT', emoji: '🦁', color: '#FFFFFF', search: 'England national football team' },
  { name: 'Ísland', emoji: '🇮🇸', color: '#003897', search: 'Ísland landsliðið í knattspyrnu' },
  { name: 'USMNT', emoji: '🦅', color: '#B22234', search: 'USMNT 2025' },
]

const NEWS_LINKS = [
  { name: 'The Athletic', emoji: '📰', url: 'https://theathletic.com', desc: 'Dýpstu greiningar í heimi' },
  { name: 'BBC Sport', emoji: '⚽', url: 'https://bbc.com/sport/football', desc: 'Fréttir og niðurstöður' },
  { name: 'FIFA', emoji: '🏆', url: 'https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026', desc: 'Heimsbikarinn 2026 opinberar fréttir' },
  { name: 'UEFA', emoji: '🌍', url: 'https://www.uefa.com', desc: 'Evrópa keppnisfréttir' },
]

function useCountdown(target) {
  const [diff, setDiff] = useState(() => Math.max(0, target - Date.now()))

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, target - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const totalSecs = Math.floor(diff / 1000)
  const days = Math.floor(totalSecs / 86400)
  const hours = Math.floor((totalSecs % 86400) / 3600)
  const mins = Math.floor((totalSecs % 3600) / 60)
  const secs = totalSecs % 60

  return { days, hours, mins, secs, done: diff <= 0 }
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-4xl font-black tabular-nums" style={{
        color: '#fff',
        textShadow: '0 0 20px rgba(0,212,170,0.6)',
        minWidth: 64,
        textAlign: 'center',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </div>
    </div>
  )
}

function AddMatchForm({ onAdd, onClose }) {
  const today = new Date().toISOString().slice(0, 16)
  const [form, setForm] = useState({
    home: '',
    away: '',
    date: today,
    competition: '',
    channel: '',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.home.trim() || !form.away.trim()) return
    onAdd({ ...form, id: Date.now().toString() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-md animate-slide-up" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Trophy size={18} style={{ color: 'var(--accent)' }} /> Bæta við leik
          </h2>
          <button onClick={onClose} className="btn btn-ghost p-2 rounded-xl">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Heimalið</label>
              <input className="input" placeholder="t.d. Ísland" value={form.home}
                onChange={e => set('home', e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Útilið</label>
              <input className="input" placeholder="t.d. Þýskaland" value={form.away}
                onChange={e => set('away', e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning & tími</label>
            <input type="datetime-local" className="input" value={form.date}
              onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Keppni</label>
            <input className="input" placeholder="t.d. Heimsbikarinn 2026" value={form.competition}
              onChange={e => set('competition', e.target.value)} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Rás</label>
            <input className="input" placeholder="t.d. RÚV, Sky Sports..." value={form.channel}
              onChange={e => set('channel', e.target.value)} />
          </div>
          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1">Hætta við</button>
            <button type="submit" className="btn btn-primary flex-1">
              <Plus size={16} /> Vista
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Sports() {
  const { days, hours, mins, secs, done } = useCountdown(WC_START.getTime())
  const [matches, setMatches] = useLocalStorage('addi_sports_matches', [])
  const [showForm, setShowForm] = useState(false)

  const addMatch = (m) => setMatches(prev => [m, ...prev])
  const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id))

  const sortedMatches = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background: 'rgba(249,115,22,0.15)' }}>
          <Trophy size={20} style={{ color: 'var(--accent3)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Íþróttir</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Fréttir, leikir og uppáhalds lið</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden relative" style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #1a0a3a 40%, #0d2818 100%)',
        border: '1px solid rgba(0,212,170,0.3)',
        boxShadow: '0 0 40px rgba(0,212,170,0.12), 0 0 80px rgba(139,92,246,0.08)',
      }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,170,0.15) 0%, transparent 60%)',
        }} />

        <div className="relative p-5">
          <div className="text-center mb-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-1"
                 style={{ color: 'rgba(0,212,170,0.8)', letterSpacing: '0.2em' }}>
              ⚽ HEIMSBIKARINN 2026 ⚽
            </div>
            <div className="text-lg font-black" style={{ color: '#fff' }}>
              FIFA World Cup
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Hefst 11. júní 2026 · Kanada, Mexíkó & BNA
            </div>
          </div>

          {done ? (
            <div className="text-center text-2xl font-black py-4" style={{ color: 'var(--accent)' }}>
              🎉 Keppnin er hafin! 🎉
            </div>
          ) : (
            <div className="flex justify-center gap-4 py-2">
              <CountdownUnit value={days} label="Dagar" />
              <div className="text-3xl font-black self-center pb-4" style={{ color: 'rgba(0,212,170,0.5)' }}>:</div>
              <CountdownUnit value={hours} label="Klukkur" />
              <div className="text-3xl font-black self-center pb-4" style={{ color: 'rgba(0,212,170,0.5)' }}>:</div>
              <CountdownUnit value={mins} label="Mínútur" />
              <div className="text-3xl font-black self-center pb-4" style={{ color: 'rgba(0,212,170,0.5)' }}>:</div>
              <CountdownUnit value={secs} label="Sekúndur" />
            </div>
          )}

          <div className="text-center mt-3">
            <span className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{ background: 'rgba(0,212,170,0.2)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.3)' }}>
              🔥 {days} {days === 1 ? 'dagur' : 'dagar'} eftir
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-sm mb-3 px-1" style={{ color: 'var(--muted)' }}>
          UPPÁHALDSLIÐIN
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {TEAMS.map(team => (
            <a key={team.name}
               href={`https://www.google.com/search?q=${encodeURIComponent(team.search)}`}
               target="_blank" rel="noopener noreferrer"
               className="card-sm flex items-center gap-3 no-underline transition-all"
               style={{ textDecoration: 'none' }}
               onMouseEnter={e => e.currentTarget.style.borderColor = team.color + '66'}
               onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div className="text-2xl">{team.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{team.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Leita að nýjustu fréttum →</div>
              </div>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: team.color }} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-sm mb-3 px-1" style={{ color: 'var(--muted)' }}>
          FRÉTTIR
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {NEWS_LINKS.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
               className="card-sm flex flex-col gap-1 no-underline transition-all"
               style={{ textDecoration: 'none' }}
               onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,170,0.3)'}
               onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div className="text-2xl">{link.emoji}</div>
              <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{link.name}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{link.desc}</div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-bold text-sm" style={{ color: 'var(--muted)' }}>KOMANDI LEIKIR</h2>
          <button onClick={() => setShowForm(true)} className="btn btn-primary py-1.5 px-3 text-xs gap-1">
            <Plus size={14} /> Bæta við
          </button>
        </div>

        {sortedMatches.length === 0 ? (
          <div className="card text-center py-8">
            <Trophy size={32} className="mx-auto mb-3" style={{ color: 'var(--muted)' }} />
            <div className="font-semibold text-sm mb-1">Engir leikir skráðir</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              Bættu við komandi leikjum til að missa ekki af neinu
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedMatches.map(match => {
              const d = new Date(match.date)
              const isPast = d < new Date()
              const dateStr = d.toLocaleDateString('is-IS', { weekday: 'short', day: 'numeric', month: 'short' })
              const timeStr = d.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={match.id} className="card-sm animate-slide-up" style={{
                  opacity: isPast ? 0.6 : 1,
                  borderColor: isPast ? 'var(--border)' : 'rgba(0,212,170,0.15)',
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="font-bold text-sm">
                        {match.home} <span style={{ color: 'var(--muted)' }}>vs</span> {match.away}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {dateStr} · {timeStr}
                        </span>
                        {match.competition && (
                          <span className="badge" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent2)', fontSize: 10 }}>
                            {match.competition}
                          </span>
                        )}
                        {match.channel && (
                          <span className="flex items-center gap-1">
                            <Tv size={10} /> {match.channel}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => removeMatch(match.id)} className="btn btn-danger p-1.5 rounded-lg ml-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && <AddMatchForm onAdd={addMatch} onClose={() => setShowForm(false)} />}
    </div>
  )
}
