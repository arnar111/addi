import { useState } from 'react'
import { useSports, FAVE_TEAMS, WORLD_CUP_START } from '../hooks/useSports'
import { Plus, Trash2, X, Trophy, Target, Flame } from 'lucide-react'

const RESULT_COLOR = { win: '#22c55e', draw: '#f97316', loss: '#ef4444' }
const RESULT_LABEL = { win: 'Sigur', draw: 'Jafnt', loss: 'Tap' }
const COMPETITIONS = ['World Cup 2026', 'Premier League', 'Champions League', 'Landsleikur', 'Annað']

function WCCountdown({ daysUntilWC, wcIsLive }) {
  if (wcIsLive) {
    return (
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(234,179,8,0.12), rgba(239,68,68,0.08))',
        border: '1px solid rgba(234,179,8,0.25)',
      }}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏆</span>
          <div>
            <div className="font-bold text-lg" style={{ color: '#eab308' }}>FIFA World Cup 2026</div>
            <div className="text-sm font-semibold" style={{ color: '#22c55e' }}>● LIVE NÚ</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>BNA · Kanada · Mexíkó</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(234,179,8,0.08))',
      border: '1px solid rgba(234,179,8,0.2)',
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>Heimsmeistaramótið hefst</div>
            <div className="font-bold text-lg">FIFA World Cup 2026</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {WORLD_CUP_START.toLocaleDateString('is-IS', { month: 'long', day: 'numeric', year: 'numeric' })} · BNA/Kanada/Mexíkó
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0">
          <div className="text-4xl font-bold" style={{ color: '#eab308' }}>{daysUntilWC}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>dagar</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 text-xs" style={{ color: 'var(--muted)' }}>
        <span>🇺🇸 USMNT</span>
        <span>·</span>
        <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</span>
        <span>·</span>
        <span>48 lið</span>
        <span>·</span>
        <span>104 leikir</span>
      </div>
    </div>
  )
}

function TeamCard({ team, record, onAddResult }) {
  const total = record.w + record.d + record.l
  return (
    <div className="card flex items-center gap-3 py-3">
      <span className="text-2xl shrink-0">{team.flag}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{team.name}</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>{team.league}</div>
        {total > 0 && (
          <div className="flex gap-2 mt-1">
            <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>{record.w}S</span>
            <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>{record.d}J</span>
            <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>{record.l}T</span>
          </div>
        )}
      </div>
      <button onClick={() => onAddResult(team.id)} className="btn btn-ghost text-xs py-1.5 px-3 shrink-0">
        <Plus size={13} /> Leikur
      </button>
    </div>
  )
}

export default function Sports() {
  const { matches, addMatch, removeMatch, recentMatches, daysUntilWC, wcIsLive, teamRecord, tennisNotes, setTennisNotes } = useSports()
  const [showForm, setShowForm] = useState(false)
  const [preTeam, setPreTeam] = useState('')
  const [form, setForm] = useState({ team: '', opponent: '', teamScore: '', opponentScore: '', competition: 'Premier League', date: new Date().toISOString().split('T')[0], notes: '' })
  const [tab, setTab] = useState('teams')

  const openForm = (teamId = '') => {
    setPreTeam(teamId)
    setForm(f => ({ ...f, team: teamId, date: new Date().toISOString().split('T')[0] }))
    setShowForm(true)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.team || !form.opponent || form.teamScore === '' || form.opponentScore === '') return
    addMatch(form)
    setShowForm(false)
    setForm({ team: '', opponent: '', teamScore: '', opponentScore: '', competition: 'Premier League', date: new Date().toISOString().split('T')[0], notes: '' })
  }

  const days = daysUntilWC()
  const isLive = wcIsLive()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{matches.length} leikir skráðir</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary">
          <Plus size={16} /> Leikur
        </button>
      </div>

      {/* World Cup Countdown */}
      <WCCountdown daysUntilWC={days} wcIsLive={isLive} />

      {/* Add match form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Skrá leik</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Lið</label>
            <div className="grid grid-cols-3 gap-1.5">
              {FAVE_TEAMS.map(t => (
                <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, team: t.id }))}
                  className="flex items-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: form.team === t.id ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    border: `1px solid ${form.team === t.id ? 'rgba(0,212,170,0.4)' : 'transparent'}`,
                    color: form.team === t.id ? 'var(--accent)' : 'var(--text)',
                  }}>
                  <span>{t.flag}</span> {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Mótherji</label>
              <input className="input text-sm" placeholder="Nafn liðs" value={form.opponent} onChange={e => setForm(f => ({ ...f, opponent: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input className="input text-sm" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Mörk (þitt lið)</label>
              <input className="input text-sm text-center" type="number" min="0" max="20" placeholder="0" value={form.teamScore} onChange={e => setForm(f => ({ ...f, teamScore: e.target.value }))} />
            </div>
            <span className="text-xl font-bold mt-4" style={{ color: 'var(--muted)' }}>–</span>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Mörk (mótherji)</label>
              <input className="input text-sm text-center" type="number" min="0" max="20" placeholder="0" value={form.opponentScore} onChange={e => setForm(f => ({ ...f, opponentScore: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>Keppni</label>
            <div className="flex gap-1.5 flex-wrap">
              {COMPETITIONS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, competition: c }))}
                  className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={{
                    background: form.competition === c ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                    color: form.competition === c ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${form.competition === c ? 'rgba(0,212,170,0.3)' : 'transparent'}`,
                  }}>{c}</button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center">Vista leik</button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['teams', '⚽ Lið'], ['results', '📋 Niðurstöður'], ['tennis', '🎾 Tennis']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-1.5"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {/* Teams tab */}
      {tab === 'teams' && (
        <div className="flex flex-col gap-2">
          {FAVE_TEAMS.map(team => (
            <TeamCard key={team.id} team={team} record={teamRecord(team.id)} onAddResult={openForm} />
          ))}
        </div>
      )}

      {/* Results tab */}
      {tab === 'results' && (
        <div className="flex flex-col gap-2">
          {recentMatches.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              Engar niðurstöður ennþá.<br />
              <span className="text-xs">Skráðu fyrsta leikinn þinn!</span>
            </div>
          ) : recentMatches.map(m => {
            const team = FAVE_TEAMS.find(t => t.id === m.team)
            return (
              <div key={m.id} className="card flex items-center gap-3 py-3"
                   style={{ borderLeft: `3px solid ${RESULT_COLOR[m.result]}` }}>
                <span className="text-xl shrink-0">{team?.flag || '⚽'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{team?.name || m.team}</span>
                    <span className="font-mono font-bold">{m.teamScore} – {m.opponentScore}</span>
                    <span className="font-semibold text-sm" style={{ color: 'var(--muted)' }}>{m.opponent}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-md"
                          style={{ background: `${RESULT_COLOR[m.result]}22`, color: RESULT_COLOR[m.result] }}>
                      {RESULT_LABEL[m.result]}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{m.competition}</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(m.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <button onClick={() => removeMatch(m.id)} style={{ color: 'var(--muted)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Tennis tab */}
      {tab === 'tennis' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.08), rgba(0,212,170,0.05))' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🎾</span>
              <div>
                <div className="font-bold">Jannik Sinner</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>ATP World #1 · Ítalía 🇮🇹</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['Australian Open', '🏆', '2024, 2025'], ['US Open', '🏆', '2024'], ['ATP Finals', '🏆', '2023, 2024']].map(([t, i, y]) => (
                <div key={t} className="p-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <div>{i}</div>
                  <div className="text-xs font-medium mt-0.5">{t}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{y}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: 'var(--accent)' }} />
              <h3 className="font-semibold text-sm">Tennisglósur</h3>
            </div>
            <textarea
              className="input resize-none text-sm"
              rows={4}
              placeholder="Skráðu leiki, niðurstöður, hugsanir um ATP Tour..."
              value={tennisNotes}
              onChange={e => setTennisNotes(e.target.value)}
            />
          </div>

          <div className="card">
            <h3 className="font-semibold text-sm mb-3">🗓️ Næstu Grand Slams</h3>
            <div className="flex flex-col gap-2">
              {[
                ['Roland Garros', '🇫🇷', '25. maí – 8. júní 2026', '#d4380d'],
                ['Wimbledon', '🇬🇧', '29. júní – 12. júlí 2026', '#15803d'],
                ['US Open', '🇺🇸', '25. ágúst – 7. sept. 2026', '#1d4ed8'],
              ].map(([name, flag, dates, color]) => (
                <div key={name} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <span className="text-xl shrink-0">{flag}</span>
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{dates}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
