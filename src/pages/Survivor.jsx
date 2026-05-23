import { useState } from 'react'
import { useSurvivor, S50_CONTESTANTS, SLOTS } from '../hooks/useSurvivor'
import { Check, X, Trophy, Skull, Edit2 } from 'lucide-react'
import { formatISK } from '../utils/currency'

function SlotPicker({ slot, value, eliminated, onChange }) {
  const [open, setOpen] = useState(false)
  const available = S50_CONTESTANTS.filter(c => !eliminated.includes(c))
  const isElim = eliminated.includes(value)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all"
        style={{
          background: value ? `${slot.color}15` : 'var(--surface2)',
          border: `1px solid ${value ? slot.color + '40' : 'var(--border)'}`,
        }}>
        <span className="text-xs font-semibold shrink-0" style={{ color: slot.color, minWidth: 72 }}>
          {slot.label}
        </span>
        <span className="text-xs" style={{ color: 'var(--muted)', minWidth: 40 }}>
          ×{slot.multiplier}
        </span>
        <span className="flex-1 text-left truncate" style={{
          color: isElim ? 'var(--danger)' : value ? 'var(--text)' : 'var(--muted)',
          textDecoration: isElim ? 'line-through' : 'none',
        }}>
          {value || 'Velja þraukara...'}
          {isElim && ' 💀'}
        </span>
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)', maxHeight: 220, overflowY: 'auto' }}>
          <button
            onClick={() => { onChange(''); setOpen(false) }}
            className="w-full px-3 py-2 text-sm text-left hover:bg-[var(--surface2)]"
            style={{ color: 'var(--muted)' }}>
            — Engin val —
          </button>
          {S50_CONTESTANTS.map(c => (
            <button key={c}
              onClick={() => { onChange(c); setOpen(false) }}
              className="w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-[var(--surface2)]"
              style={{ color: eliminated.includes(c) ? 'var(--danger)' : 'var(--text)' }}>
              <span>{c} {eliminated.includes(c) ? '💀' : ''}</span>
              {value === c && <Check size={14} style={{ color: 'var(--accent)' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Survivor() {
  const { myTeam, updatePick, updateName, eliminated, toggleEliminated, myTotalPoints, activePicks } = useSurvivor()
  const [tab, setTab] = useState('team')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(myTeam.name)

  const activeCount = SLOTS.filter(s => myTeam.picks[s.key] && !eliminated.includes(myTeam.picks[s.key])).length
  const totalPicks = SLOTS.filter(s => myTeam.picks[s.key]).length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🏝️</span>
          <div className="flex-1">
            {editingName ? (
              <form onSubmit={e => { e.preventDefault(); updateName(nameInput); setEditingName(false) }}
                    className="flex gap-2">
                <input className="input text-sm py-1 flex-1" value={nameInput}
                       onChange={e => setNameInput(e.target.value)} autoFocus />
                <button type="submit" className="btn btn-primary py-1 px-3 text-xs">Vista</button>
                <button type="button" onClick={() => setEditingName(false)} className="btn btn-ghost py-1 px-2 text-xs"><X size={14} /></button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{myTeam.name}</h1>
                <button onClick={() => setEditingName(true)} style={{ color: 'var(--muted)' }}>
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Þraukarinn S50 · {activeCount}/{totalPicks} aktívir · {myTotalPoints()} stig
        </p>
      </div>

      {/* Summary card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.08))' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Heildarstig</div>
            <div className="text-3xl font-bold">{myTotalPoints()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Þraukarar</div>
            <div className="text-xl font-semibold">{activeCount} <span className="text-sm font-normal" style={{ color: 'var(--muted)' }}>af {SLOTS.length}</span></div>
          </div>
          <Trophy size={32} style={{ color: '#f97316', opacity: 0.6 }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['team', '🏆 Lið mitt'], ['cast', '👥 Keppendur'], ['how', 'ℹ️ Reglur']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-xs flex-1 justify-center py-2"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'team' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs px-1" style={{ color: 'var(--muted)' }}>
            Veldu þraukara fyrir hvert sæti. Hærri sæti gefa fleiri stig.
          </p>
          {SLOTS.map(slot => (
            <SlotPicker
              key={slot.key}
              slot={slot}
              value={myTeam.picks[slot.key]}
              eliminated={eliminated}
              onChange={val => updatePick(slot.key, val)}
            />
          ))}
        </div>
      )}

      {tab === 'cast' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs px-1" style={{ color: 'var(--muted)' }}>
            Smelltu á keppanda til að merkja sem úrskorinn.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {S50_CONTESTANTS.map(c => {
              const isOut = eliminated.includes(c)
              const myPick = SLOTS.find(s => myTeam.picks[s.key] === c)
              return (
                <button key={c} onClick={() => toggleEliminated(c)}
                  className="card py-2.5 px-3 flex items-center gap-2 text-left transition-all"
                  style={{
                    opacity: isOut ? 0.5 : 1,
                    borderColor: myPick ? `${myPick.color}55` : 'var(--border)',
                    background: isOut ? 'var(--surface2)' : myPick ? `${myPick.color}10` : 'var(--surface)',
                  }}>
                  <span className="text-base">{isOut ? '💀' : '🏝️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ textDecoration: isOut ? 'line-through' : 'none' }}>
                      {c}
                    </p>
                    {myPick && (
                      <p className="text-xs" style={{ color: myPick.color }}>
                        {myPick.label} ×{myPick.multiplier}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'how' && (
        <div className="card flex flex-col gap-3">
          <h3 className="font-semibold">Hvernig virkar Þraukarinn?</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Þraukarinn er Survivor-fantasía þar sem þátttakendur velja 5+1 keppendur úr Survivor S50.
            Þraukarar fá stig á hverri þáttaröð og þú fær margföldun á þig eftir sæti.
          </p>
          <div className="flex flex-col gap-2">
            {SLOTS.map(s => (
              <div key={s.key} className="flex items-center gap-3 py-1.5 px-3 rounded-xl"
                   style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}>
                <span className="text-sm font-bold" style={{ color: s.color, minWidth: 80 }}>{s.label}</span>
                <span className="text-sm font-semibold" style={{ color: s.color }}>×{s.multiplier}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {s.multiplier >= 1.5 ? 'Besta val — hæsti margfaldari' :
                   s.multiplier >= 1.2 ? 'Annað val' :
                   s.multiplier >= 1.1 ? 'Þriðja val' :
                   s.multiplier >= 1.0 ? 'Gott val' :
                   'Varaþraukari — lægsti margfaldari'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Stig: Þraukari 1 (150%) → Þraukari 2 (120%) → Þraukari 3 (110%) → Þraukari 4 & 5 (100%) → Varaþraukari (90%)
          </p>
        </div>
      )}
    </div>
  )
}
