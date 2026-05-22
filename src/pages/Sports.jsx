import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, Trash2, X, Trophy, Star, Calendar } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00')

function useCountdown(target) {
  const [diff, setDiff] = useState(target - Date.now())
  useEffect(() => {
    const t = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(t)
  }, [target])
  const total = Math.max(0, diff)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((total % (1000 * 60)) / 1000)
  return { days, hours, mins, secs, started: diff <= 0 }
}

const TEAMS = [
  { id: 'iceland', name: 'Ísland', flag: '🇮🇸' },
  { id: 'england', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'usa', name: 'Bandaríkin', flag: '🇺🇸' },
  { id: 'argentina', name: 'Argentína', flag: '🇦🇷' },
  { id: 'brazil', name: 'Brasilía', flag: '🇧🇷' },
  { id: 'germany', name: 'Þýskaland', flag: '🇩🇪' },
  { id: 'france', name: 'Frakkland', flag: '🇫🇷' },
  { id: 'spain', name: 'Spánn', flag: '🇪🇸' },
  { id: 'portugal', name: 'Portúgal', flag: '🇵🇹' },
  { id: 'netherlands', name: 'Holland', flag: '🇳🇱' },
  { id: 'italy', name: 'Ítalía', flag: '🇮🇹' },
  { id: 'morocco', name: 'Marokkó', flag: '🇲🇦' },
]

export default function Sports() {
  const { days, hours, mins, secs, started } = useCountdown(WC_START.getTime())

  const [matches, setMatches] = useLocalStorage('addi_matches', [])
  const [favorites, setFavorites] = useLocalStorage('addi_fav_teams', ['iceland', 'england'])
  const [tab, setTab] = useState('countdown')
  const [showForm, setShowForm] = useState(false)
  const [showTeamPicker, setShowTeamPicker] = useState(false)

  // Match form
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0])
  const [matchNote, setMatchNote] = useState('')

  const addMatch = (e) => {
    e.preventDefault()
    if (!homeTeam || !awayTeam) return
    setMatches(prev => [{
      id: Date.now().toString(),
      homeTeam, awayTeam,
      homeScore: homeScore !== '' ? Number(homeScore) : null,
      awayScore: awayScore !== '' ? Number(awayScore) : null,
      date: new Date(matchDate).toISOString(),
      note: matchNote,
    }, ...prev])
    setHomeTeam('')
    setAwayTeam('')
    setHomeScore('')
    setAwayScore('')
    setMatchNote('')
    setShowForm(false)
  }

  const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id))

  const toggleFav = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const favTeams = TEAMS.filter(t => favorites.includes(t.id))

  const pad2 = n => String(n).padStart(2, '0')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Knattspyrna</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {started ? 'HM 2026 er hafið!' : 'FIFA HM 2026'}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Leikur
        </button>
      </div>

      {/* World Cup Countdown */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(239,68,68,0.08))',
        border: '1px solid rgba(249,115,22,0.25)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} style={{ color: '#f97316' }} />
          <span className="font-semibold text-sm">FIFA Heimsmeistaramót 2026</span>
        </div>
        <div className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
          Bandaríkin · Kanada · Mexíkó | 11. júní – 19. júlí 2026
        </div>

        {started ? (
          <div className="text-center py-2">
            <div className="text-3xl font-bold" style={{ color: '#f97316' }}>⚽ HM er hafið!</div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {[['Dagar', days], ['Klst', hours], ['Mín', mins], ['Sek', secs]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center p-2.5 rounded-xl"
                style={{ background: 'rgba(249,115,22,0.1)' }}>
                <span className="text-2xl font-bold tabular-nums" style={{ color: '#f97316' }}>
                  {pad2(val)}
                </span>
                <span className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['countdown', '⚽ Leikar'], ['teams', '⭐ Lið']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
              color: tab === t ? '#f97316' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Add match form */}
      {showForm && (
        <form onSubmit={addMatch} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leik</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Heimalið</label>
              <input className="input text-sm" placeholder="Ísland" value={homeTeam}
                onChange={e => setHomeTeam(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Útilið</label>
              <input className="input text-sm" placeholder="England" value={awayTeam}
                onChange={e => setAwayTeam(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Mörk (heim)</label>
              <input className="input text-sm" type="number" min="0" placeholder="–" value={homeScore}
                onChange={e => setHomeScore(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Mörk (úti)</label>
              <input className="input text-sm" type="number" min="0" placeholder="–" value={awayScore}
                onChange={e => setAwayScore(e.target.value)} />
            </div>
          </div>
          <input className="input text-sm" type="date" value={matchDate}
            onChange={e => setMatchDate(e.target.value)} />
          <input className="input text-sm" placeholder="Athugasemd (valkvæmt)" value={matchNote}
            onChange={e => setMatchNote(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">
            Bæta við leik
          </button>
        </form>
      )}

      {tab === 'countdown' && (
        <div className="flex flex-col gap-2">
          {matches.length === 0 ? (
            <div className="card text-center py-10 flex flex-col items-center gap-3">
              <span className="text-3xl">⚽</span>
              <div style={{ color: 'var(--muted)' }} className="text-sm">
                Engir leikir skráðir ennþá
              </div>
              <button onClick={() => setShowForm(true)} className="btn btn-primary text-sm">
                <Plus size={14} /> Skrá leik
              </button>
            </div>
          ) : matches.map(m => {
            const hasScore = m.homeScore !== null && m.awayScore !== null
            const homeWin = hasScore && m.homeScore > m.awayScore
            const awayWin = hasScore && m.awayScore > m.homeScore
            return (
              <div key={m.id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    {new Date(m.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  {m.note && <span className="text-xs" style={{ color: 'var(--muted)' }}>· {m.note}</span>}
                  <button onClick={() => removeMatch(m.id)} className="ml-auto" style={{ color: 'var(--muted)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: homeWin ? 'var(--success)' : 'var(--text)' }}>
                    {m.homeTeam}
                  </span>
                  {hasScore ? (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-lg text-lg font-bold tabular-nums"
                      style={{ background: 'var(--surface2)' }}>
                      <span style={{ color: homeWin ? 'var(--success)' : 'var(--text)' }}>{m.homeScore}</span>
                      <span style={{ color: 'var(--muted)' }}> – </span>
                      <span style={{ color: awayWin ? 'var(--success)' : 'var(--text)' }}>{m.awayScore}</span>
                    </div>
                  ) : (
                    <div className="text-sm font-bold px-3" style={{ color: 'var(--muted)' }}>vs</div>
                  )}
                  <span className="text-sm font-semibold text-right"
                    style={{ color: awayWin ? 'var(--success)' : 'var(--text)' }}>
                    {m.awayTeam}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'teams' && (
        <div className="flex flex-col gap-3">
          {/* Favorites */}
          {favTeams.length > 0 && (
            <div className="card flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Uppáhaldslið mín</h3>
              <div className="grid grid-cols-2 gap-2">
                {favTeams.map(t => (
                  <div key={t.id} className="flex items-center gap-2 p-2.5 rounded-xl"
                    style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
                    <span className="text-xl">{t.flag}</span>
                    <span className="text-sm font-medium">{t.name}</span>
                    <button onClick={() => toggleFav(t.id)} className="ml-auto" style={{ color: 'var(--muted)' }}>
                      <Star size={14} fill="var(--accent)" style={{ color: 'var(--accent)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All teams */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Öll lið</h3>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Veldu uppáhald</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {TEAMS.map(t => (
                <button key={t.id} onClick={() => toggleFav(t.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-all text-left"
                  style={{
                    background: favorites.includes(t.id) ? 'rgba(0,212,170,0.08)' : 'var(--surface2)',
                    border: `1px solid ${favorites.includes(t.id) ? 'rgba(0,212,170,0.2)' : 'transparent'}`,
                  }}>
                  <span className="text-xl">{t.flag}</span>
                  <span className="text-sm flex-1">{t.name}</span>
                  <Star size={14}
                    fill={favorites.includes(t.id) ? 'var(--accent)' : 'none'}
                    style={{ color: favorites.includes(t.id) ? 'var(--accent)' : 'var(--muted)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
