import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { Calendar, BarChart2, Trophy, RefreshCw } from 'lucide-react'

const RESULT_STYLE = {
  W: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'Sigur' },
  D: { bg: 'rgba(249,115,22,0.15)', color: '#f97316', label: 'Jafntefli' },
  L: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Tap' },
}

function matchDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
}

function matchTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return 'Í dag'
  if (days === 1) return 'Á morgun'
  return `${days} dagar`
}

function FormPip({ result }) {
  const s = RESULT_STYLE[result]
  return (
    <span className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center shrink-0"
          style={{ background: s.bg, color: s.color }}>
      {result}
    </span>
  )
}

export default function Sports() {
  const { schedule, standings, loading, error } = useSports()
  const [tab, setTab] = useState('results')

  const tabs = [
    { id: 'results', label: 'Leikir', icon: <Trophy size={14} /> },
    { id: 'upcoming', label: 'Dagskrá', icon: <Calendar size={14} /> },
    { id: 'standings', label: 'Tafla', icon: <BarChart2 size={14} /> },
  ]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚫🔵</span>
            <h1 className="text-xl font-semibold">Inter Milan</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Serie A · UEFA Champions League</p>
        </div>
        {loading && <RefreshCw size={16} className="animate-spin" style={{ color: 'var(--muted)' }} />}
      </div>

      {/* Form strip */}
      {schedule?.past?.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,104,168,0.08), rgba(0,0,0,0.04))', borderColor: 'rgba(0,104,168,0.2)' }}>
          <div className="text-xs mb-2 font-medium" style={{ color: 'var(--muted)' }}>Síðustu 5 leikir</div>
          <div className="flex gap-2 items-center">
            {schedule.past.slice(0, 5).map(m => (
              <div key={m.id} className="flex flex-col items-center gap-1">
                <FormPip result={m.result} />
                <span className="text-xs" style={{ color: 'var(--muted)', fontSize: 10 }}>{m.oppAbbr}</span>
              </div>
            ))}
            <div className="ml-auto text-right">
              <div className="text-sm font-semibold">
                {schedule.past.filter(m => m.result === 'W').length}S ·{' '}
                {schedule.past.filter(m => m.result === 'D').length}J ·{' '}
                {schedule.past.filter(m => m.result === 'L').length}T
              </div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>W–D–L</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 btn flex-1 justify-center text-xs"
            style={{
              background: tab === t.id ? 'rgba(0,104,168,0.15)' : 'var(--surface)',
              color: tab === t.id ? '#5ba3d4' : 'var(--muted)',
              border: `1px solid ${tab === t.id ? 'rgba(0,104,168,0.35)' : 'var(--border)'}`,
            }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {tab === 'results' && (
        <div className="flex flex-col gap-2">
          {!schedule?.past?.length ? (
            <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
              {loading ? 'Hleður...' : 'Engar niðurstöður'}
            </div>
          ) : schedule.past.map(m => {
            const s = RESULT_STYLE[m.result]
            const scoreStr = m.homeAway === 'home'
              ? `INT ${m.interScore} – ${m.oppScore} ${m.oppAbbr}`
              : `${m.oppAbbr} ${m.oppScore} – ${m.interScore} INT`
            return (
              <div key={m.id} className="card flex items-center gap-3 py-3">
                <span className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center shrink-0"
                      style={{ background: s.bg, color: s.color }}>
                  {m.result}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{scoreStr}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {m.homeAway === 'home' ? '🏠 Heima' : '✈️ Í burtu'} · {matchDate(m.date)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium" style={{ color: s.color }}>{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming */}
      {tab === 'upcoming' && (
        <div className="flex flex-col gap-2">
          {!schedule?.upcoming?.length ? (
            <div className="card text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
              {loading ? 'Hleður...' : 'Engin komandi leikir'}
            </div>
          ) : schedule.upcoming.map(m => (
            <div key={m.id} className="card flex items-center gap-3 py-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                   style={{ background: 'rgba(0,104,168,0.12)' }}>
                ⚽
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">
                  {m.homeAway === 'home' ? `INT vs ${m.oppName}` : `${m.oppName} vs INT`}
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {m.homeAway === 'home' ? '🏠 Heima' : '✈️ Í burtu'} · {matchDate(m.date)} · {matchTime(m.date)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                  {daysUntil(m.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Standings */}
      {tab === 'standings' && (
        <div className="card overflow-hidden p-0">
          <div className="px-4 py-3 flex items-center gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <Trophy size={14} style={{ color: '#f97316' }} />
            <span className="text-sm font-semibold">Serie A Stigatafla</span>
          </div>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)' }}>
                  {['#', 'Lið', 'L', 'S', 'J', 'T', 'MD', 'Stig'].map((h, i) => (
                    <th key={i} className="text-xs py-2 font-medium"
                        style={{ color: 'var(--muted)', padding: '8px 6px', textAlign: i <= 1 ? 'left' : 'center' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!standings?.length ? (
                  <tr><td colSpan={8} className="text-center py-6 text-sm" style={{ color: 'var(--muted)' }}>
                    {loading ? 'Hleður...' : 'Engar töflugögn'}
                  </td></tr>
                ) : standings.map((row, i) => (
                  <tr key={i}
                      style={{
                        background: row.isInter ? 'rgba(0,104,168,0.08)' : 'transparent',
                        borderBottom: '1px solid var(--border)',
                      }}>
                    <td className="text-sm pl-4 py-2.5 font-medium"
                        style={{ color: i < 4 ? '#22c55e' : i === 4 ? '#f97316' : 'var(--muted)', minWidth: 24 }}>
                      {i + 1}
                    </td>
                    <td className="text-sm py-2.5 font-medium" style={{ minWidth: 100, paddingRight: 8 }}>
                      <span style={{ color: row.isInter ? '#5ba3d4' : 'var(--text)' }}>
                        {row.isInter ? '⚫🔵 ' : ''}{row.abbr || row.team?.substring(0, 12)}
                      </span>
                    </td>
                    {[row.gp, row.w, row.d, row.l, row.gd, row.points].map((v, j) => (
                      <td key={j} className="text-xs text-center py-2.5"
                          style={{
                            color: j === 5 ? (row.isInter ? '#5ba3d4' : 'var(--text)') : 'var(--muted)',
                            fontWeight: j === 5 ? 700 : 400,
                            minWidth: 28,
                          }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 flex gap-4 text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
            <span style={{ color: '#22c55e' }}>● UCL</span>
            <span style={{ color: '#f97316' }}>● UEL</span>
          </div>
        </div>
      )}
    </div>
  )
}
