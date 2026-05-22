import { useState } from 'react'
import { useHealth } from '../hooks/useHealth'
import { Check, FileText, Mail, Plus, X } from 'lucide-react'

export default function Health() {
  const { meds, takeMed, isTaken, physioExercises, logPhysio, todayPhysio, todayMedsDone, totalMedsDose } = useHealth()
  const [tab, setTab] = useState('meds')
  const [newNote, setNewNote] = useState({})

  const allMedsDone = todayMedsDone === totalMedsDose && totalMedsDose > 0

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Heilsa 💊</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Lyf og sjúkraþjálfun</p>
      </div>

      {/* Med summary banner */}
      <div className="card" style={{
        background: allMedsDone
          ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(0,212,170,0.08))'
          : 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(239,68,68,0.05))',
        border: `1px solid ${allMedsDone ? 'rgba(34,197,94,0.25)' : 'rgba(249,115,22,0.2)'}`,
      }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">
              {allMedsDone ? '✓ Öll lyf tekin í dag' : `${todayMedsDone} af ${totalMedsDose} skömmtum tekin`}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              {allMedsDone ? 'Vel gert!' : 'Mundu að taka lyfin'}
            </div>
          </div>
          <span className="text-3xl">{allMedsDone ? '💚' : '⏰'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['meds', '💊 Lyf'], ['physio', '🏃 Þjálfun'], ['febaetur', '📋 Mál']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn flex-1 justify-center text-sm"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
              fontSize: 12,
              padding: '8px 6px',
            }}>{l}</button>
        ))}
      </div>

      {tab === 'meds' && (
        <div className="flex flex-col gap-3">
          {meds.map(med => (
            <div key={med.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-base font-semibold">{med.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{med.dose} · {med.times.length}x á dag</div>
                </div>
                <div className="badge"
                     style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)' }}>
                  {med.times.filter(t => isTaken(med.id, t)).length}/{med.times.length}
                </div>
              </div>
              <div className="flex gap-2">
                {med.times.map(time => {
                  const taken = isTaken(med.id, time)
                  return (
                    <button key={time} onClick={() => takeMed(med.id, time)}
                      className="flex-1 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1"
                      style={{
                        background: taken ? 'rgba(34,197,94,0.15)' : 'var(--surface2)',
                        border: `1px solid ${taken ? 'rgba(34,197,94,0.35)' : 'transparent'}`,
                        color: taken ? 'var(--success)' : 'var(--text)',
                      }}>
                      {taken ? <Check size={18} /> : <span className="text-lg">⬜</span>}
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="card" style={{ border: '1px solid rgba(0,212,170,0.15)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Minning</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Tradolan (Tramadol) á að taka við máltíð. Endurnýjun lyfseðils hjá Læknasetrið · setrid@setrid.is
            </p>
          </div>
        </div>
      )}

      {tab === 'physio' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}>
            <div className="text-sm font-semibold mb-1">Æfingar í dag</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              {todayPhysio.length === 0 ? 'Engar æfingar skráðar ennþá' : `${todayPhysio.length} æfingar skráðar`}
            </div>
          </div>

          {physioExercises.map(ex => {
            const doneToday = todayPhysio.some(l => l.exerciseId === ex.id)
            return (
              <div key={ex.id} className="card">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{ex.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {ex.sets} set × {ex.reps} reps
                    </div>
                    {ex.note && (
                      <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{ex.note}</div>
                    )}
                  </div>
                  <button onClick={() => logPhysio(ex.id)}
                    className="btn text-xs py-1.5 px-3 shrink-0"
                    style={{
                      background: doneToday ? 'rgba(34,197,94,0.15)' : 'rgba(0,212,170,0.12)',
                      color: doneToday ? 'var(--success)' : 'var(--accent)',
                      border: `1px solid ${doneToday ? 'rgba(34,197,94,0.3)' : 'rgba(0,212,170,0.25)'}`,
                    }}>
                    {doneToday ? <><Check size={12} /> Lokið</> : 'Skrá'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'febaetur' && (
        <div className="flex flex-col gap-3">
          <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📋</span>
              <span className="text-sm font-semibold">Fébætur mál</span>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Lögfræðingur</span>
                <span className="font-medium">Sigurður Haukur Grétarsson</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Tölvupóstur</span>
                <span className="font-medium text-xs">sigurdur@febaetur.is</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Sími</span>
                <span className="font-medium">547-4700</span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: 'var(--muted)' }}>Borgartún</span>
                <span className="font-medium">28, 105 Reykjavík</span>
              </div>
            </div>
            <a href="mailto:sigurdur@febaetur.is"
               className="btn btn-ghost text-sm w-full justify-center mt-3">
              <Mail size={14} /> Senda tölvupóst
            </a>
          </div>

          <div className="card">
            <div className="text-sm font-semibold mb-2">Gögn sem þarf að afhenda</div>
            <ul className="flex flex-col gap-1.5">
              {[
                { text: 'Skattframtöl 2023–2026', done: false },
                { text: 'Staðgreiðsluskrá 2026 (skatturinn.is)', done: false },
                { text: 'Veikindayfirlit frá vinnuveitanda', done: false },
                { text: 'Sjúkraþjálfari skýrsla', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1.5"
                     style={{ borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                       style={{ borderColor: item.done ? 'var(--success)' : 'var(--border)', background: item.done ? 'rgba(34,197,94,0.15)' : 'transparent' }}>
                    {item.done && <Check size={10} style={{ color: 'var(--success)' }} />}
                  </div>
                  <span style={{ color: item.done ? 'var(--muted)' : 'var(--text)', textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
