import { useState } from 'react'
import { useGolf } from '../hooks/useGolf'
import { Plus, Trash2, ChevronDown, ChevronUp, X, Star, TrendingDown } from 'lucide-react'

const PAR_COLORS = { 2: '#22c55e', 3: '#22c55e', 4: '#3b82f6', 5: '#f97316', 6: '#ef4444' }

function ScoreCell({ par, value, onChange }) {
  const num = Number(value)
  const diff = value !== '' ? num - par : null
  let bg = 'var(--surface2)'
  let color = 'var(--text)'
  if (diff !== null) {
    if (diff <= -2) { bg = '#FFD700'; color = '#000' }
    else if (diff === -1) { bg = '#22c55e44'; color = '#22c55e' }
    else if (diff === 0) { bg = 'var(--surface2)'; color = 'var(--text)' }
    else if (diff === 1) { bg = '#ef444422'; color = '#ef4444' }
    else if (diff >= 2) { bg = '#ef444444'; color = '#ef4444' }
  }

  return (
    <input
      type="number" min={1} max={12}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full text-center font-semibold rounded-lg text-sm py-1.5"
      style={{ background: bg, color, border: 'none', outline: 'none', MozAppearance: 'textfield' }}
    />
  )
}

function RoundCard({ round, onUpdate, onDelete, onScoreChange, totalScore, totalPar, scoreToPar }) {
  const [open, setOpen] = useState(false)
  const stp = scoreToPar(round)
  const played = round.scores.filter(s => s !== '' && s !== null).length
  const stpColor = stp === null ? 'var(--muted)' : stp < 0 ? 'var(--success)' : stp === 0 ? 'var(--text)' : 'var(--danger)'
  const stpLabel = stp === null ? '–' : stp === 0 ? 'E' : stp > 0 ? `+${stp}` : `${stp}`

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{round.course}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(round.date).toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            {played > 0 && ` · ${played}/18 hol`}
          </div>
        </div>
        <div className="text-center shrink-0">
          <div className="text-lg font-bold tabular-nums" style={{ color: stpColor }}>{stpLabel}</div>
          {played > 0 && <div className="text-xs" style={{ color: 'var(--muted)' }}>{totalScore(round)}</div>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setOpen(o => !o)} className="btn btn-ghost p-2">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={() => onDelete(round.id)} className="p-2" style={{ color: 'var(--muted)' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Front 9 */}
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>FRAMAN · Hol 1–9</div>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
              {[0,1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="text-center text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>{i+1}</div>
                  <div className="text-center text-xs font-medium" style={{ color: PAR_COLORS[round.pars[i]] || 'var(--muted)', fontSize: 9 }}>
                    P{round.pars[i]}
                  </div>
                  <ScoreCell par={round.pars[i]} value={round.scores[i] ?? ''} onChange={v => onScoreChange(round.id, i, v)} />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-1 gap-2 text-xs" style={{ color: 'var(--muted)' }}>
              <span>Par: {round.pars.slice(0,9).reduce((s,p)=>s+p,0)}</span>
              <span>Skor: {round.scores.slice(0,9).filter(s=>s!=='').reduce((s,x)=>s+Number(x),0) || '–'}</span>
            </div>
          </div>

          {/* Back 9 */}
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>AFTAN · Hol 10–18</div>
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
              {[9,10,11,12,13,14,15,16,17].map(i => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="text-center text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>{i+1}</div>
                  <div className="text-center text-xs font-medium" style={{ color: PAR_COLORS[round.pars[i]] || 'var(--muted)', fontSize: 9 }}>
                    P{round.pars[i]}
                  </div>
                  <ScoreCell par={round.pars[i]} value={round.scores[i] ?? ''} onChange={v => onScoreChange(round.id, i, v)} />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-1 gap-2 text-xs" style={{ color: 'var(--muted)' }}>
              <span>Par: {round.pars.slice(9).reduce((s,p)=>s+p,0)}</span>
              <span>Skor: {round.scores.slice(9).filter(s=>s!=='').reduce((s,x)=>s+Number(x),0) || '–'}</span>
            </div>
          </div>

          {/* Totals */}
          {played > 0 && (
            <div className="flex justify-between p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-center">
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Heildarpar</div>
                <div className="font-bold">{round.pars.reduce((s,p)=>s+p,0)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Heildarskor</div>
                <div className="font-bold">{totalScore(round)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Munur</div>
                <div className="font-bold" style={{ color: stpColor }}>{stpLabel}</div>
              </div>
            </div>
          )}

          {/* Notes */}
          <textarea
            className="input resize-none text-xs"
            rows={2}
            placeholder="Athugasemdir um hring..."
            value={round.notes || ''}
            onChange={e => onUpdate(round.id, { notes: e.target.value })}
          />

          {/* Legend */}
          <div className="flex gap-3 flex-wrap">
            {[['Eagle/Better','#FFD700','#000'],['Birdie','#22c55e44','#22c55e'],['Par','var(--surface2)','var(--text)'],['Bogey','#ef444422','#ef4444'],['Double+','#ef444444','#ef4444']].map(([l,bg,c]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
                <span className="w-4 h-4 rounded text-center font-bold flex items-center justify-center" style={{ background: bg, color: c, fontSize: 9 }}>4</span>
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Golf() {
  const { rounds, addRound, updateScore, updateRound, deleteRound, totalScore, totalPar, scoreToPar, bestRound, avgScore } = useGolf()
  const [showForm, setShowForm] = useState(false)
  const [course, setCourse] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleAdd = (e) => {
    e.preventDefault()
    addRound(course || 'Golfvöllur', date)
    setCourse('')
    setDate(new Date().toISOString().split('T')[0])
    setShowForm(false)
  }

  const avg = avgScore()
  const best = bestRound ? scoreToPar(bestRound) : null
  const bestLabel = best === null ? '–' : best === 0 ? 'E' : best > 0 ? `+${best}` : `${best}`

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">⛳</span>
            <h1 className="text-xl font-semibold">Golf</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{rounds.length} hring{rounds.length !== 1 ? 'ir' : 'ur'}</p>
        </div>
        <button onClick={() => setShowForm(f => !f)} className="btn btn-primary">
          <Plus size={16} /> Nýr hringur
        </button>
      </div>

      {/* Stats bar */}
      {rounds.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Fjöldi hring', rounds.length, '🏌️'],
            ['Meðaltal', avg !== null ? avg : '–', '📊'],
            ['Besti hringur', bestLabel, '🏆'],
          ].map(([label, val, icon]) => (
            <div key={label} className="card text-center py-3">
              <div className="text-lg">{icon}</div>
              <div className="font-bold text-lg">{val}</div>
              <div className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="card flex flex-col gap-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Nýr hringur</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} style={{ color: 'var(--muted)' }} /></button>
          </div>
          <input className="input text-sm" placeholder="Nafn golfvallar" value={course} onChange={e => setCourse(e.target.value)} autoFocus />
          <input type="date" className="input text-sm" value={date} onChange={e => setDate(e.target.value)} />
          <button type="submit" className="btn btn-primary justify-center">Hefja hring</button>
        </form>
      )}

      {rounds.length === 0 && !showForm ? (
        <div className="card text-center py-12 flex flex-col gap-3 items-center">
          <span className="text-4xl">⛳</span>
          <div>
            <div className="font-semibold">Engir hringir ennþá</div>
            <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Skráðu fyrsta golfhringinn þinn</div>
          </div>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus size={16} /> Skrá hring
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rounds.map(r => (
            <RoundCard
              key={r.id}
              round={r}
              onUpdate={updateRound}
              onDelete={deleteRound}
              onScoreChange={updateScore}
              totalScore={totalScore}
              totalPar={totalPar}
              scoreToPar={scoreToPar}
            />
          ))}
        </div>
      )}
    </div>
  )
}
