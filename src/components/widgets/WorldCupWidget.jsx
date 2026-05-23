import { ExternalLink } from 'lucide-react'

const WC_START = new Date('2026-06-11T20:00:00Z')

export default function WorldCupWidget() {
  const diff = WC_START - new Date()
  const days = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
  const started = diff <= 0

  return (
    <a href="/sport"
       className="card flex items-center gap-3 no-underline transition-all active:scale-98"
       style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.07), rgba(0,212,170,0.05))', borderColor: 'rgba(255,215,0,0.18)' }}>
      <span className="text-2xl shrink-0">⚽</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold" style={{ color: '#FFD700' }}>FIFA Heimsbikarinn 2026</div>
        <div className="text-sm font-bold mt-0.5">
          {started ? 'Leikarnir eru hafnir!' : <>{days} <span className="font-normal" style={{ color: 'var(--muted)' }}>dagar eftir</span></>}
        </div>
      </div>
      <ExternalLink size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
    </a>
  )
}
