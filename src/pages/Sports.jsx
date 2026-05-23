import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { Trophy, Plus, Trash2, X, ExternalLink, Flag } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00')

const QUICK_LINKS = [
  { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰', color: '#1a73e8' },
  { label: 'BBC Sport', url: 'https://bbc.com/sport', icon: '⚽', color: '#c00' },
  { label: 'GOLF+', url: 'https://golfplus.com', icon: '⛳', color: '#16a34a' },
  { label: 'FIFA HM 2026', url: 'https://www.fifa.com/worldcup', icon: '🏆', color: '#f97316' },
  { label: 'Liverpool FC', url: 'https://liverpoolfc.com', icon: '🔴', color: '#c8102e' },
  { label: 'USMNT', url: 'https://ussoccer.com', icon: '🇺🇸', color: '#002868' },
]

const WC_GROUPS = {
  A: { teams: ['Canada 🇨🇦', 'Marókkó 🇲🇦', 'Króatía 🇭🇷', 'Belgía 🇧🇪'] },
  B: { teams: ['England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Serbía 🇷🇸', 'Íran 🇮🇷', 'Skotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿'] },
  C: { teams: ['BNA 🇺🇸', 'Panamá 🇵🇦', 'Jamaíka 🇯🇲', 'Úkraína 🇺🇦'] },
  D: { teams: ['Frakkland 🇫🇷', 'Mexíkó 🇲🇽', 'Argentína 🇦🇷', 'Breska Gvæjana 🇬🇾'] },
}

export default function Sports() {
  const { handicap, setHandicap, rounds, addRound, removeRound, avgScore, bestRound } = useSports()
  const [tab, setTab] = useState('worldcup')
  const [showRoundForm, setShowRoundForm] = useState(false)
  const [rScore, setRScore] = useState('')
  const [rCourse, setRCourse] = useState('')
  const [rPar, setRPar] = useState('72')
  const [rDate, setRDate] = useState('')
  const [rNotes, setRNotes] = useState('')

  const now = new Date()
  const msLeft = WC_START - now
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
  const started = msLeft <= 0

  const handleAddRound = (e) => {
    e.preventDefault()
    if (!rScore) return
    addRound({ score: rScore, course: rCourse, par: rPar, date: rDate, notes: rNotes })
    setRScore('')
    setRCourse('')
    setRPar('72')
    setRDate('')
    setRNotes('')
    setShowRoundForm(false)
  }

  const avg = avgScore()
  const best = bestRound()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {started ? 'HM 2026 er í gangi! ⚽' : `${daysLeft} dagar í HM 2026`}
        </p>
      </div>

      {/* WC Countdown */}
      {!started && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(139,92,246,0.07))',
          border: '1px solid rgba(249,115,22,0.3)'
        }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} style={{ color: '#f97316' }} />
            <span className="font-semibold">FIFA Heimsmeistararakeppnin 2026</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            {[
              { val: daysLeft, label: 'Dagar' },
              { val: Math.floor(daysLeft / 7), label: 'Vikur' },
              { val: new Date('2026-07-19').toLocaleDateString('is-IS', { month: 'short', day: 'numeric' }), label: 'Lokað' },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <div className="text-3xl font-bold" style={{ color: '#f97316' }}>{val}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            11. júní – 19. júlí 2026 · USA, Canada, Mexico
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-2">
        {QUICK_LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            className="card-sm flex flex-col items-center gap-1.5 text-center transition-all"
            style={{ textDecoration: 'none', color: 'inherit' }}
            onMouseOver={e => e.currentTarget.style.borderColor = link.color + '44'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <span className="text-2xl">{link.icon}</span>
            <span className="text-xs font-medium leading-tight">{link.label}</span>
          </a>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[['worldcup', '⚽ HM 2026'], ['golf', '⛳ Golf']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm shrink-0 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'worldcup' && (
        <div className="flex flex-col gap-3">
          {/* Followed teams */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-3">Mín lið</h3>
            <div className="flex flex-col gap-2">
              {[
                { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', group: 'B', note: 'Thomas Tuchel', highlight: true },
                { flag: '🇺🇸', name: 'BNA (USMNT)', group: 'C', note: 'Reyna, Pulisic', highlight: true },
                { flag: '🔴', name: 'Liverpool lið', group: null, note: 'Mörg Liverpool lið á HM', highlight: false },
              ].map(team => (
                <div key={team.name} className="flex items-center gap-3 py-2 px-3 rounded-xl"
                  style={{ background: team.highlight ? 'rgba(0,212,170,0.06)' : 'var(--surface2)' }}>
                  <span className="text-xl">{team.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{team.name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{team.note}</div>
                  </div>
                  {team.group && (
                    <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                      Hópur {team.group}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Groups */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-3">Hópar (velja dæmi)</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(WC_GROUPS).map(([group, { teams }]) => (
                <div key={group} className="p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <div className="text-xs font-bold mb-2" style={{ color: group === 'B' || group === 'C' ? '#f97316' : 'var(--muted)' }}>
                    Hópur {group} {group === 'B' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : group === 'C' ? '🇺🇸' : ''}
                  </div>
                  {teams.map(t => (
                    <div key={t} className="text-xs py-0.5" style={{ color: 'var(--text)' }}>{t}</div>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
              * Hópaflokkun er dæmigerð – uppfærið eftir opinberri dráttarniðurstöðu
            </p>
          </div>
        </div>
      )}

      {tab === 'golf' && (
        <div className="flex flex-col gap-3">
          {/* Handicap + stats */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Golf</h3>
              <button onClick={() => setShowRoundForm(!showRoundForm)} className="btn btn-primary text-xs">
                <Plus size={14} /> Kringla
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Handicap', val: handicap || '—', editable: true },
                { label: 'Meðalskor', val: avg !== null ? avg : '—' },
                { label: 'Besta kringla', val: best ? best.score : '—' },
              ].map(({ label, val, editable }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl"
                  style={{ background: 'var(--surface2)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {editable ? (
                      <input
                        type="number"
                        value={handicap}
                        onChange={e => setHandicap(e.target.value)}
                        className="w-16 text-center bg-transparent font-bold text-xl outline-none"
                        style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}
                        placeholder="—"
                      />
                    ) : val}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {showRoundForm && (
            <form onSubmit={handleAddRound} className="card flex flex-col gap-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Skrá kringlu</h3>
                <button type="button" onClick={() => setShowRoundForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Skor</label>
                  <input className="input text-sm" type="number" placeholder="72" value={rScore} onChange={e => setRScore(e.target.value)} required autoFocus />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Par</label>
                  <input className="input text-sm" type="number" placeholder="72" value={rPar} onChange={e => setRPar(e.target.value)} />
                </div>
              </div>
              <input className="input text-sm" placeholder="Golfvöllur" value={rCourse} onChange={e => setRCourse(e.target.value)} />
              <input className="input text-sm" type="date" value={rDate} onChange={e => setRDate(e.target.value)} />
              <input className="input text-sm" placeholder="Athugasemdir (valkvæmt)" value={rNotes} onChange={e => setRNotes(e.target.value)} />
              <button type="submit" className="btn btn-primary w-full justify-center">Vista kringlu</button>
            </form>
          )}

          {rounds.length > 0 ? (
            <div className="flex flex-col gap-2">
              {rounds.map(r => {
                const diff = r.score - r.par
                return (
                  <div key={r.id} className="card flex items-center gap-3 py-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: diff < 0 ? 'rgba(34,197,94,0.15)' : diff === 0 ? 'rgba(0,212,170,0.15)' : 'rgba(249,115,22,0.15)',
                               color: diff < 0 ? 'var(--success)' : diff === 0 ? 'var(--accent)' : '#f97316' }}>
                      {diff > 0 ? '+' : ''}{diff}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{r.score} stig · Par {r.par}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>
                        {r.course} · {new Date(r.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      {r.notes && <div className="text-xs italic" style={{ color: 'var(--muted)' }}>{r.notes}</div>}
                    </div>
                    <button onClick={() => removeRound(r.id)} style={{ color: 'var(--muted)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar kringlur skráðar ennþá ⛳
            </div>
          )}
        </div>
      )}
    </div>
  )
}
