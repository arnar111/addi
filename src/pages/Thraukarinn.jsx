import { useState } from 'react'
import { useThraukarinn, MY_TEAM } from '../hooks/useThraukarinn'
import { Users, Skull, Star, Trophy, ChevronRight } from 'lucide-react'

const TRIBE_COLORS = {
  gold: '#f59e0b',
  blue: '#3b82f6',
  red: '#ef4444',
}

const TRIBE_NAMES = {
  gold: 'Gull',
  blue: 'Blátt',
  red: 'Rautt',
}

const MULTIPLIERS = [1.5, 1.2, 1.1, 1.0, 1.0]

export default function Thraukarinn() {
  const {
    contestants, currentEpisode, active, eliminated,
    myTeamContestants, activePicks,
    eliminateContestant, reviveContestant, nextEpisode,
  } = useThraukarinn()

  const [tab, setTab] = useState('mitt')
  const [showEliminate, setShowEliminate] = useState(false)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">🌴</span> Þraukarinn S50
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Þáttur {currentEpisode} · {active.length} þraukarar eftir
          </p>
        </div>
        <button onClick={nextEpisode} className="btn btn-primary text-sm">
          Þáttur {currentEpisode + 1} →
        </button>
      </div>

      {/* My team card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))', border: '1px solid rgba(245,158,11,0.25)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Lið mitt</div>
            <div className="text-xl font-bold flex items-center gap-2">
              <Trophy size={18} style={{ color: '#f59e0b' }} />
              {MY_TEAM.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{activePicks}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>enn inni</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {myTeamContestants.map((pick, i) => {
            const alive = pick.contestant?.status === 'active'
            return (
              <div key={pick.contestantId}
                   className="flex items-center gap-3 p-2.5 rounded-xl"
                   style={{ background: alive ? 'rgba(245,158,11,0.06)' : 'rgba(0,0,0,0.2)', opacity: alive ? 1 : 0.5 }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                     style={{ background: alive ? 'rgba(245,158,11,0.2)' : 'var(--surface2)', color: alive ? '#f59e0b' : 'var(--muted)' }}>
                  {i === 5 ? 'V' : i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ textDecoration: alive ? 'none' : 'line-through' }}>
                    {pick.contestant?.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{pick.role}</div>
                </div>
                {alive ? (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>
                    Inni
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
                    <Skull size={10} /> Úti
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['mitt', 'Lið mitt'], ['active', 'Þraukarar'], ['eliminated', 'Úr leik']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(245,158,11,0.12)' : 'var(--surface)',
              color: tab === t ? '#f59e0b' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(245,158,11,0.25)' : 'var(--border)'}`,
            }}>{l} {t === 'active' ? `(${active.length})` : t === 'eliminated' ? `(${eliminated.length})` : ''}</button>
        ))}
      </div>

      {/* My picks detail tab */}
      {tab === 'mitt' && (
        <div className="card flex flex-col gap-1">
          <h3 className="text-sm font-semibold mb-2">Þraukarinn — Reglur</h3>
          <div className="text-xs" style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
            Veldu 5 þraukaraog 1 vara. Multipliers: 1. = 150%, 2. = 120%, 3. = 110%, 4–5. = 100%, Vara = 90%
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xl font-bold" style={{ color: 'var(--success)' }}>{activePicks}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Inni</div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xl font-bold" style={{ color: 'var(--danger)' }}>{MY_TEAM.picks.length - activePicks}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Úti</div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xl font-bold" style={{ color: '#f59e0b' }}>{active.length}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Eft. total</div>
            </div>
          </div>
        </div>
      )}

      {/* Active contestants */}
      {tab === 'active' && (
        <div className="flex flex-col gap-2">
          {['gold', 'blue', 'red'].map(tribe => {
            const tribeActive = active.filter(c => c.tribe === tribe)
            if (tribeActive.length === 0) return null
            return (
              <div key={tribe}>
                <div className="text-xs font-semibold px-1 mb-1.5 flex items-center gap-2"
                     style={{ color: TRIBE_COLORS[tribe] }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: TRIBE_COLORS[tribe] }} />
                  {TRIBE_NAMES[tribe]} hópur
                </div>
                {tribeActive.map(c => {
                  const isMyPick = MY_TEAM.picks.some(p => p.contestantId === c.id)
                  return (
                    <div key={c.id}
                         className="flex items-center gap-3 p-3 mb-1 rounded-xl"
                         style={{ background: 'var(--surface)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                           style={{ background: `${TRIBE_COLORS[tribe]}22`, color: TRIBE_COLORS[tribe] }}>
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm flex-1 font-medium">{c.name}</span>
                      {isMyPick && (
                        <Star size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                      )}
                      <button onClick={() => eliminateContestant(c.id)}
                              className="text-xs px-2 py-1 rounded-lg transition-all"
                              style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }}>
                        Úr leik
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {/* Eliminated */}
      {tab === 'eliminated' && (
        <div className="flex flex-col gap-2">
          {eliminated.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">🏝️</div>
              <div>Enginn hefur verið sendur heim</div>
            </div>
          ) : eliminated.map(c => (
            <div key={c.id} className="card flex items-center gap-3 py-3 opacity-60">
              <Skull size={16} style={{ color: 'var(--muted)' }} />
              <span className="text-sm flex-1" style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>
                {c.name}
              </span>
              <button onClick={() => reviveContestant(c.id)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)' }}>
                Til baka
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
