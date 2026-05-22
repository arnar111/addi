import { useState, useEffect } from 'react'
import { wcCountdown, WC_START, useGolf, useFootball } from '../hooks/useSport'
import { Plus, Trash2, X, Trophy, Flag, Target } from 'lucide-react'

function pad(n) { return String(n).padStart(2, '0') }

function WCCountdown() {
  const [cd, setCd] = useState(wcCountdown())

  useEffect(() => {
    const t = setInterval(() => setCd(wcCountdown()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(200,16,46,0.12), rgba(0,40,104,0.15))',
      border: '1px solid rgba(200,16,46,0.25)',
    }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">🏆</div>
        <div>
          <div className="font-bold text-base">FIFA World Cup 2026</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            USA · Canada · México · 48 lið · 104 leikir
          </div>
        </div>
      </div>

      {cd.started ? (
        <div className="text-center py-4">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            Keppnin er hafin! 🎉
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Lokaleikur 19. júlí 2026
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-around text-center mb-4">
            {[['Dagar', cd.days], ['Klst', cd.hours], ['Mín', cd.minutes]].map(([l, v]) => (
              <div key={l}>
                <div className="text-4xl font-bold tabular-nums" style={{ color: '#c8102e' }}>
                  {pad(v)}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs" style={{ color: 'var(--muted)' }}>
            Opnunarleikur · 11. júní 2026 · Estadio Azteca, Mexico City
          </div>
        </>
      )}

      <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(200,16,46,0.2)' }}>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            ['🏟️', '16 borgir', 'Leikvellir'],
            ['🌎', '3 lönd', 'Gestgjafar'],
            ['⚽', '48 lið', '16 hópar'],
          ].map(([icon, val, lbl]) => (
            <div key={lbl} className="flex flex-col gap-0.5 py-2 rounded-xl"
                 style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-base">{icon}</span>
              <span className="font-semibold">{val}</span>
              <span style={{ color: 'var(--muted)' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FootballTab() {
  const { matches, addMatch, removeMatch } = useFootball()
  const [showForm, setShowForm] = useState(false)
  const [team1, setTeam1] = useState('Man United')
  const [team2, setTeam2] = useState('')
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  const [competition, setCompetition] = useState('Premier League')

  const competitions = ['Premier League', 'Champions League', 'FA Cup', 'World Cup 2026', 'Annað']

  const handleAdd = (e) => {
    e.preventDefault()
    if (!team1 || !team2 || score1 === '' || score2 === '') return
    addMatch({ team1, team2, score1, score2, competition })
    setTeam2('')
    setScore1('')
    setScore2('')
    setShowForm(false)
  }

  const getResult = (m) => {
    if (m.score1 > m.score2) return { label: 'W', color: 'var(--success)' }
    if (m.score1 < m.score2) return { label: 'L', color: 'var(--danger)' }
    return { label: 'D', color: '#f97316' }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Man United</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {matches.length} niðurstöður skráðar
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={15} /> Leikur
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Skrá leik</span>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={15} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {competitions.map(c => (
              <button key={c} type="button" onClick={() => setCompetition(c)}
                className="btn shrink-0 text-xs py-1.5"
                style={{
                  background: competition === c ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                  color: competition === c ? 'var(--accent)' : 'var(--muted)',
                  border: `1px solid ${competition === c ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                }}>{c}</button>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            <input className="input text-sm col-span-2" placeholder="Lið 1" value={team1}
              onChange={e => setTeam1(e.target.value)} />
            <div className="flex gap-1 justify-center">
              <input className="input text-sm text-center w-10 px-1" type="number" min={0} max={20}
                placeholder="0" value={score1} onChange={e => setScore1(e.target.value)} />
              <span className="text-sm self-center" style={{ color: 'var(--muted)' }}>–</span>
              <input className="input text-sm text-center w-10 px-1" type="number" min={0} max={20}
                placeholder="0" value={score2} onChange={e => setScore2(e.target.value)} />
            </div>
            <input className="input text-sm col-span-2" placeholder="Lið 2" value={team2}
              onChange={e => setTeam2(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Vista</button>
        </form>
      )}

      {matches.length === 0 ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          Engar niðurstöður enn — skráðu fyrsta leikinn
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.map(m => {
            const res = getResult(m)
            return (
              <div key={m.id} className="card flex items-center gap-3 py-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                     style={{ background: res.color + '22', color: res.color }}>
                  {res.label}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {m.team1} <span style={{ color: 'var(--accent)' }}>{m.score1}–{m.score2}</span> {m.team2}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {m.competition} · {new Date(m.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button onClick={() => removeMatch(m.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GolfTab() {
  const { rounds, recentRounds, addRound, removeRound, handicap, setHandicap, avgDiff, bestRound } = useGolf()
  const [showForm, setShowForm] = useState(false)
  const [course, setCourse] = useState('')
  const [score, setScore] = useState('')
  const [par, setPar] = useState('72')
  const [notes, setNotes] = useState('')

  const vrCourses = ['Wolf Creek (GOLF+)', 'Pebble Beach (GOLF+)', 'St Andrews (GOLF+)', 'Augusta (GOLF+)', 'Brautarholts GK', 'Annar völlur']

  const handleAdd = (e) => {
    e.preventDefault()
    if (!score) return
    addRound({ course: course || 'GOLF+ VR', score, par, notes })
    setCourse('')
    setScore('')
    setPar('72')
    setNotes('')
    setShowForm(false)
  }

  const diffColor = (d) => d < 0 ? 'var(--success)' : d === 0 ? 'var(--accent)' : d < 5 ? '#f97316' : 'var(--danger)'
  const diffStr = (d) => d === 0 ? 'E' : d > 0 ? `+${d}` : `${d}`

  return (
    <div className="flex flex-col gap-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Handicap</div>
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => setHandicap(h => Math.max(0, h - 1))}
              className="text-sm font-bold px-1" style={{ color: 'var(--muted)' }}>−</button>
            <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{handicap}</span>
            <button onClick={() => setHandicap(h => Math.min(54, h + 1))}
              className="text-sm font-bold px-1" style={{ color: 'var(--muted)' }}>+</button>
          </div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Meðaltal</div>
          <div className="text-2xl font-bold"
               style={{ color: avgDiff !== null ? diffColor(avgDiff) : 'var(--muted)' }}>
            {avgDiff !== null ? diffStr(avgDiff) : '—'}
          </div>
        </div>
        <div className="card-sm text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Besta lota</div>
          <div className="text-2xl font-bold"
               style={{ color: bestRound ? diffColor(bestRound.diff) : 'var(--muted)' }}>
            {bestRound ? diffStr(bestRound.diff) : '—'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">
          {recentRounds.length} lotur skráðar
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={15} /> Lota
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Skrá lotu</span>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={15} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: 'var(--muted)' }}>Völlur</label>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {vrCourses.map(c => (
                <button key={c} type="button" onClick={() => setCourse(c)}
                  className="btn shrink-0 text-xs py-1.5"
                  style={{
                    background: course === c ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    color: course === c ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${course === c ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  }}>{c}</button>
              ))}
            </div>
            <input className="input text-sm mt-1" placeholder="Eða sláðu inn völl..." value={course}
              onChange={e => setCourse(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Einkunn</label>
              <input className="input text-sm" type="number" min={50} max={200}
                placeholder="72" value={score} onChange={e => setScore(e.target.value)} autoFocus />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Par</label>
              <input className="input text-sm" type="number" min={60} max={80}
                value={par} onChange={e => setPar(e.target.value)} />
            </div>
          </div>

          {score && par && (
            <div className="text-center text-sm font-semibold"
                 style={{ color: diffColor(Number(score) - Number(par)) }}>
              {diffStr(Number(score) - Number(par))} vs par
            </div>
          )}

          <input className="input text-sm" placeholder="Athugasemdir (valkvæmt)..." value={notes}
            onChange={e => setNotes(e.target.value)} />
          <button type="submit" className="btn btn-primary w-full justify-center">Vista lotu</button>
        </form>
      )}

      {recentRounds.length === 0 ? (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          <div className="text-4xl mb-3">🏌️</div>
          <p className="text-sm">Engar lotur enn</p>
          <p className="text-xs mt-1">Byrjaðu að skrá GOLF+ lotur</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {recentRounds.map((r, i) => (
            <div key={r.id} className="card flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                   style={{ background: diffColor(r.diff) + '22', color: diffColor(r.diff) }}>
                {diffStr(r.diff)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{r.course || 'GOLF+ VR'}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {r.score} slag · Par {r.par} · {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                  {r.notes ? ` · ${r.notes}` : ''}
                </div>
              </div>
              {i === 0 && (
                <span className="badge text-xs shrink-0"
                      style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
                  Síðast
                </span>
              )}
              <button onClick={() => removeRound(r.id)} style={{ color: 'var(--muted)' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sport() {
  const [tab, setTab] = useState('football')

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Sport</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>World Cup · Man United · Golf+</p>
      </div>

      <WCCountdown />

      <div className="flex gap-2">
        {[['football', '⚽ Fótbolti'], ['golf', '🏌️ Golf+']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'football' && <FootballTab />}
      {tab === 'golf' && <GolfTab />}
    </div>
  )
}
