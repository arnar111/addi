import { useSports } from '../../hooks/useSports'
import { Calendar, Trophy } from 'lucide-react'

const RESULT_STYLE = {
  W: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'S' },
  D: { bg: 'rgba(249,115,22,0.15)', color: '#f97316', label: 'J' },
  L: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'T' },
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Í dag'
  if (days === 1) return 'Á morgun'
  return `${days} dagar`
}

export default function InterWidget() {
  const { schedule, loading } = useSports()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ background: 'linear-gradient(135deg, rgba(0,104,168,0.08), rgba(0,0,0,0.06))' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full" style={{ background: 'var(--surface2)' }} />
        <div className="h-4 w-24 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
      <div className="h-8 w-full rounded" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  const next = schedule?.upcoming?.[0]
  const last = schedule?.past?.[0]

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,104,168,0.08), rgba(0,0,0,0.04))', borderColor: 'rgba(0,104,168,0.25)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⚫🔵</span>
        <span className="text-sm font-semibold">Inter Milan</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(0,104,168,0.15)', color: '#5ba3d4' }}>
          Serie A
        </span>
      </div>

      <div className="flex gap-3">
        {last && (() => {
          const s = RESULT_STYLE[last.result]
          return (
            <div className="flex-1 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
              <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Síðasta leikur</div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center shrink-0"
                      style={{ background: s.bg, color: s.color }}>{s.label}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate">
                    {last.homeAway === 'home' ? `INT ${last.interScore}–${last.oppScore} ${last.oppAbbr}`
                      : `${last.oppAbbr} ${last.oppScore}–${last.interScore} INT`}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                    {last.oppName}
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {next && (
          <div className="flex-1 p-3 rounded-xl" style={{ background: 'var(--surface2)' }}>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Næsti leikur</div>
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: '#5ba3d4', flexShrink: 0 }} />
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">
                  {next.homeAway === 'home' ? `INT vs ${next.oppAbbr}` : `${next.oppAbbr} vs INT`}
                </div>
                <div className="text-xs" style={{ color: 'var(--accent)' }}>
                  {daysUntil(next.date)}
                </div>
              </div>
            </div>
          </div>
        )}

        {!next && !last && (
          <div className="flex-1 text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
            Engar leikjaupplýsingar
          </div>
        )}
      </div>

      {schedule?.past?.length > 1 && (
        <div className="flex gap-1 mt-3 items-center">
          <span className="text-xs mr-1" style={{ color: 'var(--muted)' }}>Síðast 5:</span>
          {schedule.past.slice(0, 5).map(m => {
            const s = RESULT_STYLE[m.result]
            return (
              <span key={m.id} className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center"
                    style={{ background: s.bg, color: s.color }}>{s.label}</span>
            )
          })}
        </div>
      )}
    </div>
  )
}
