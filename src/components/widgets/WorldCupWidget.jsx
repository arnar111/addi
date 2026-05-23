import { Trophy } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00')

const TRACKED_TEAMS = [
  { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England', group: 'B', manager: 'Tuchel' },
  { flag: '🇺🇸', name: 'USMNT', group: 'C', manager: 'Berhalter' },
  { flag: '🔴', name: 'Liverpool', note: 'Mörg lið á HM', group: null },
]

export default function WorldCupWidget() {
  const now = new Date()
  const msLeft = WC_START - now
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
  const started = msLeft <= 0

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(249,115,22,0.09), rgba(139,92,246,0.06))',
      border: '1px solid rgba(249,115,22,0.25)'
    }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={15} style={{ color: '#f97316' }} />
          <span className="text-sm font-semibold">FIFA HM 2026</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>USA · Canada · Mexico</span>
      </div>

      {started ? (
        <div className="text-base font-bold" style={{ color: 'var(--accent)' }}>HM 2026 er í gangi! ⚽🎉</div>
      ) : (
        <div className="flex items-center gap-4 mb-3">
          <div>
            <div className="text-5xl font-bold leading-none" style={{ color: '#f97316' }}>{daysLeft}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>dagar eftir</div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            {TRACKED_TEAMS.filter(t => t.group).map(team => (
              <div key={team.name} className="flex items-center gap-2 text-xs">
                <span>{team.flag}</span>
                <span className="font-medium">{team.name}</span>
                <span style={{ color: 'var(--muted)' }}>{team.manager}</span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="badge" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', fontSize: 10 }}>
                    Hópur {team.group}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs" style={{ color: 'var(--muted)' }}>
        Hefst 11. júní 2026 · Estadio Azteca, Mexico City
      </div>
    </div>
  )
}
