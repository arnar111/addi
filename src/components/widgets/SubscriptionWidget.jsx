import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const SUBS = [
  { name: 'Huel', icon: '🥤', status: 'failed', msg: 'Greiðsla hlaust – tollar', url: 'https://huel.com' },
  { name: 'Netlify', icon: '🌐', status: 'failed', msg: 'Kredit kort þarf uppfærslu', url: 'https://netlify.com' },
  { name: 'Claude', icon: '🤖', status: 'failed', msg: 'Áskrift í bið – greiðsluvandinn', url: 'https://claude.ai' },
  { name: 'Audible', icon: '📚', status: 'warning', msg: '11 einingar · 1 rennur út bráðlega!', url: 'https://audible.com' },
  { name: 'Paramount+', icon: '🎬', status: 'failed', msg: 'Áskrift í bið', url: 'https://paramountplus.com' },
  { name: 'Microsoft 365', icon: '💻', status: 'failed', msg: 'Greiðsla hlaust', url: 'https://microsoft.com' },
  { name: 'Driver Booster', icon: '🔧', status: 'expired', msg: 'Leyfið rann út 16. maí 2026', url: 'https://iobit.com' },
  { name: 'Disney+', icon: '🏰', status: 'warning', msg: 'Verður hætt við', url: 'https://disneyplus.com' },
  { name: 'Chegg', icon: '📖', status: 'failed', msg: 'Greiðsla hlaust', url: 'https://chegg.com' },
  { name: 'Spotify', icon: '🎵', status: 'ok', msg: 'Virk', url: 'https://spotify.com' },
  { name: 'Duolingo', icon: '🦜', status: 'ok', msg: '13 ára röð! 🎉', url: 'https://duolingo.com' },
]

const STATUS_STYLE = {
  failed: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', color: '#ef4444', label: 'Hlaust' },
  warning: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', color: 'var(--accent3)', label: '⚠️' },
  expired: { bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)', color: 'var(--muted)', label: 'Útrunnið' },
  ok: { bg: 'rgba(34,197,94,0.05)', border: 'rgba(34,197,94,0.1)', color: 'var(--success)', label: '✓' },
}

export default function SubscriptionWidget() {
  const [expanded, setExpanded] = useState(false)

  const alerts = SUBS.filter(s => s.status !== 'ok')
  const ok = SUBS.filter(s => s.status === 'ok')
  const shown = expanded ? SUBS : alerts.slice(0, 3)

  if (alerts.length === 0) return null

  return (
    <div className="card flex flex-col gap-2" style={{ border: '1px solid rgba(249,115,22,0.2)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: 'var(--accent3)' }} />
          <span className="text-sm font-semibold">Áskriftir</span>
          <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            {alerts.filter(s => s.status === 'failed').length} hlaust
          </span>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-xs flex items-center gap-1"
                style={{ color: 'var(--muted)' }}>
          {expanded ? <><ChevronUp size={13} /> Minna</> : <><ChevronDown size={13} /> Allt ({SUBS.length})</>}
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {(expanded ? SUBS : alerts.slice(0, 4)).map(sub => {
          const s = STATUS_STYLE[sub.status]
          return (
            <div key={sub.name} className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl"
                 style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span className="text-base shrink-0">{sub.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">{sub.name}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{sub.msg}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-medium" style={{ color: s.color }}>{s.label}</span>
                <a href={sub.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={11} style={{ color: 'var(--muted)' }} />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {!expanded && alerts.length > 4 && (
        <button onClick={() => setExpanded(true)} className="text-xs text-center py-1"
                style={{ color: 'var(--muted)' }}>
          +{alerts.length - 4} fleiri...
        </button>
      )}
    </div>
  )
}
