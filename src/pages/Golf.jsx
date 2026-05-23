import { useState } from 'react'
import { useGolf, PAR_18, PAR_9 } from '../hooks/useGolf'
import { Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'

function ScoreBox({ value, par, onChange }) {
  const diff = value ? value - par : null
  return (
    <input
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      min={1}
      max={15}
      value={value || ''}
      onChange={e => onChange(Number(e.target.value) || 0)}
      className="w-full h-9 text-center font-bold text-sm rounded-lg"
      style={{
        background: diff === null
          ? 'var(--surface2)'
          : diff < -1 ? 'rgba(139,92,246,0.25)'
          : diff < 0  ? 'rgba(0,212,170,0.22)'
          : diff === 0 ? 'var(--surface2)'
          : diff === 1 ? 'rgba(249,115,22,0.22)'
          : 'rgba(239,68,68,0.22)',
        color: diff === null ? 'var(--muted)'
          : diff < 0 ? 'var(--accent)'
          : diff > 0 ? 'var(--danger)'
          : 'var(--text)',
        border: '1px solid var(--border)',
        outline: 'none',
      }}
    />
  )
}

function RoundCard({ round, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const pars = round.holes === 9 ? PAR_9 : PAR_18

  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
             style={{ background: round.differential <= 0 ? 'rgba(0,212,170,0.15)' : 'rgba(239,68,68,0.1)' }}>
          ⛳
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{round.courseName}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(round.date).toLocaleDateString('is-IS', { day: 'numeric', month: 'long', year: 'numeric' })}
            {round.notes ? ` · ${round.notes}` : ''}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold">{round.total}</div>
          <div className="text-xs font-medium"
               style={{ color: round.differential <= 0 ? 'var(--accent)' : 'var(--danger)' }}>
            {round.differential > 0 ? '+' : ''}{round.differential}
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button onClick={() => setExpanded(v => !v)} style={{ color: 'var(--muted)', padding: 4 }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onRemove(round.id)} style={{ color: 'var(--muted)', padding: 4 }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && round.scores?.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${round.holes}, minmax(32px, 1fr))`, minWidth: round.holes * 36 }}>
              {round.scores.map((s, i) => {
                const par = pars[i] || 4
                const diff = s - par
                return (
                  <div key={i} className="flex flex-col items-center gap-0.5">
                    <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>H{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                         style={{
                           background: diff < -1 ? 'rgba(139,92,246,0.25)' : diff < 0 ? 'rgba(0,212,170,0.22)' : diff === 0 ? 'var(--surface2)' : diff === 1 ? 'rgba(249,115,22,0.22)' : 'rgba(239,68,68,0.22)',
                           color: diff < 0 ? 'var(--accent)' : diff > 0 ? 'var(--danger)' : 'var(--text)',
                         }}>
                      {s}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>P{par}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--muted)' }}>
            <span>Par {round.par}</span>
            <span className="font-semibold" style={{ color: round.differential <= 0 ? 'var(--accent)' : 'var(--danger)' }}>
              {round.total} ({round.differential > 0 ? '+' : ''}{round.differential})
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Golf() {
  const { rounds, courses, addRound, removeRound, handicap, bestRound, avgDifferential } = useGolf()
  const [showForm, setShowForm] = useState(false)
  const [courseId, setCourseId] = useState(courses[0]?.id || '')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [scores, setScores] = useState([])
  const [notes, setNotes] = useState('')

  const selectedCourse = courses.find(c => c.id === courseId)
  const holes = selectedCourse?.holes || 18
  const pars = holes === 9 ? PAR_9 : PAR_18
  const total = scores.reduce((a, b) => a + (b || 0), 0)
  const coursePar = selectedCourse?.par || 72
  const diff = total - coursePar
  const allFilled = scores.length === holes && scores.every(s => s > 0)

  const initForm = (cId) => {
    const c = courses.find(x => x.id === cId)
    setCourseId(cId)
    setScores(new Array(c?.holes || 18).fill(0))
  }

  const openForm = () => {
    if (!showForm) initForm(courses[0]?.id || courseId)
    setShowForm(v => !v)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!allFilled) return
    addRound(courseId, date, scores, notes)
    setScores([])
    setNotes('')
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Golf</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {rounds.length} {rounds.length === 1 ? 'umferð' : 'umferðir'} skráðar
          </p>
        </div>
        <button onClick={openForm} className="btn btn-primary">
          <Plus size={16} /> Umferð
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          ['Handicap', handicap !== null ? handicap : '–', '#8b5cf6'],
          ['Besta', bestRound ? `${bestRound.differential > 0 ? '+' : ''}${bestRound.differential}` : '–', '#22c55e'],
          ['Meðaltal', avgDifferential !== null ? `${avgDifferential > 0 ? '+' : ''}${avgDifferential}` : '–', '#00d4aa'],
        ].map(([label, value, color]) => (
          <div key={label} className="card text-center py-3">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{label}</div>
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Add round form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ný umferð</h3>
            <button type="button" onClick={() => setShowForm(false)}>
              <X size={16} style={{ color: 'var(--muted)' }} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Völlur</label>
              <select
                className="input text-sm"
                value={courseId}
                onChange={e => initForm(e.target.value)}
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>Dagsetning</label>
              <input type="date" className="input text-sm" value={date}
                onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          {/* Score grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs" style={{ color: 'var(--muted)' }}>
                Stig per holu (slipptu P = par)
              </label>
              {total > 0 && (
                <span className="text-sm font-bold"
                      style={{ color: diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--accent)' : 'var(--text)' }}>
                  {total} ({diff > 0 ? '+' : ''}{diff})
                </span>
              )}
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(holes, 9)}, 1fr)` }}>
              {pars.slice(0, Math.min(holes, 9)).map((par, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>H{i + 1}</span>
                  <ScoreBox value={scores[i]} par={par}
                    onChange={v => setScores(prev => { const n = [...prev]; n[i] = v; return n })} />
                  <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>P{par}</span>
                </div>
              ))}
            </div>
            {holes === 18 && (
              <>
                <div className="my-2 text-xs text-center" style={{ color: 'var(--muted)' }}>
                  — Bakhlið —
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
                  {pars.slice(9).map((par, i) => (
                    <div key={i + 9} className="flex flex-col items-center gap-0.5">
                      <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>H{i + 10}</span>
                      <ScoreBox value={scores[i + 9]} par={par}
                        onChange={v => setScores(prev => { const n = [...prev]; n[i + 9] = v; return n })} />
                      <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>P{par}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <textarea className="input resize-none text-sm" rows={2}
            placeholder="Minnismiði um umferðina..." value={notes}
            onChange={e => setNotes(e.target.value)} />

          <button type="submit" className="btn btn-primary w-full justify-center"
                  style={{ opacity: allFilled ? 1 : 0.45 }}>
            Vista umferð
          </button>
        </form>
      )}

      {/* History */}
      {rounds.length === 0 ? (
        <div className="card text-center py-12" style={{ color: 'var(--muted)' }}>
          <div className="text-5xl mb-3">⛳</div>
          <div className="font-medium text-sm">Engar umferðir ennþá</div>
          <div className="text-xs mt-1">Skráðu fyrstu umferðina með + hnappur að ofan</div>
          <div className="text-xs mt-2" style={{ color: 'var(--accent)' }}>
            Grafarholt · Keilir · Korpa · Hlíðarendi · Nes
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {rounds.map(r => (
            <RoundCard key={r.id} round={r} onRemove={removeRound} />
          ))}
        </div>
      )}
    </div>
  )
}
